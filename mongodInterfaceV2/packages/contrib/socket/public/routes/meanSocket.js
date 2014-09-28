'use strict';

angular.module('mean.socket').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('Interface mongo', {
            url: '/mongo3D',
            templateUrl: 'socket/views/index.html'
        });

        $stateProvider.state('Visualisation 3D', {
            url: '/visualisation3D',
            templateUrl: 'socket/views/visualisation3D.html'
        });
    }
]);
