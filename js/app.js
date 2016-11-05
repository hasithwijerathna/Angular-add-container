/**
 * Created by hasith on 10/29/2016.
 */
var app = angular.module('sampleApp', ['ui.bootstrap']);

app.controller('myController', function ($scope, $uibModal, $log) {
    $scope.title = 'Sample app';

    $scope.items = [
        {
            'fname': 'Shashika',
            'lname': 'Beach boy',
            'configurations': [
                {'configName': 'Beach 1'},
                {'configName': 'Beach 2'}
            ]
        },
        {
            'fname': 'Lasith',
            'lname': 'Buriya',
            'configurations': []
        }
    ];

    $scope.open = function (size, parentSelector) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$scope',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.addMainElement(selectedItem.firstName, selectedItem.lastName);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.addMainElement = function (fname, lname) {
        $scope.items.push({'fname': fname, 'lname': lname, 'configurations': []});
    };

    $scope.onConfiguration = function (name, configName, operation) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'onConfigurationOperationModel.html',
            controller: 'OnConfigurationCtrl',
            controllerAs: '$scope',
            size: 'lg',
            resolve: {
                items: function () {
                    return {
                        name: name,
                        configName: configName,
                        operation: operation,
                        array: $scope.items
                    }
                }
            }
        });

        modalInstance.result.then(function (configItem) {
            $scope.onItemOperate(configItem.name, configItem.configName, configItem.newConfigName, configItem.operation);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.onItemOperate = function (title, confName, newConfigName, operation) {
        var mainObject = _.findWhere($scope.items, {fname: title});

        if (operation == 'add') {
            mainObject.configurations.push({'configName': newConfigName});
        }

        if (operation == 'edit') {
            var configObject = _.findWhere(mainObject.configurations, {configName: confName});
            configObject.configName = newConfigName;
        }

        if (operation == 'delete') {
            var index = _.findIndex(mainObject.configurations, {configName: confName});
            mainObject.configurations.splice(index, 1);
        }
    };

    $scope.deleteItem = function (firstname, lastname) {
        var index = _.findIndex($scope.items, {fname: firstname, lname: lastname});
        $scope.items.splice(index, 1);
    };
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {
    $scope.items = items;
    $scope.showFNameError = false;
    $scope.showLNameError = false;

    $scope.ok = function () {
        if ($scope.firstName && $scope.lastName) {
            $uibModalInstance.close({
                firstName: $scope.firstName,
                lastName: $scope.lastName
            });
        } else {
            $scope.showFNameError = !$scope.firstName;
            $scope.showLNameError = !$scope.lastName;
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('OnConfigurationCtrl', function ($scope, $uibModalInstance, items) {

    var opts = {
        add: 'add',
        edit: 'edit',
        delete: 'delete'
    };

    $scope.configurationName = items.operation == opts.edit ? items.configName : '';
    $scope.isShow = (items.operation == opts.add || items.operation == opts.edit) ? true : false;
    $scope.okText = items.operation == opts.add ? 'Add' : (items.operation == opts.delete ? 'Delete' : 'Edit');
    $scope.cancelText = 'Cancel';

    $scope.showConfigError = false;
    $scope.showDuplicateError = false;

    $scope.ok = function () {
        findDuplicate( items.name, $scope.configurationName);
        if (($scope.configurationName || items.operation == opts.delete) && !$scope.showDuplicateError) {
            $uibModalInstance.close({
                name: items.name,
                configName: items.configName,
                newConfigName: $scope.configurationName,
                operation: items.operation
            });
        } else {
            $scope.showConfigError = !$scope.configurationName
        }
    };

    var findDuplicate = function(title, newConfigName){
        var mainObject = _.findWhere(items.array, {fname: title});
        if(_.findWhere(mainObject.configurations, {'configName': newConfigName})){
            $scope.showDuplicateError = true;
        }else{
            $scope.showDuplicateError = false;
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});