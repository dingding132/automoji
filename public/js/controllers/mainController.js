/**
 * Created by JohnWu on 2016-11-12.
 */
// angular.module('controller', []).controller('mainController', function($scope, $http) {
//     $scope.message = 'ffff';
//     $http.get('/api/kairos').then(function(response) {
//         $scope.analysis = response.data;
//     });
// });

angular.module('controller', [])
    .controller('mainController', function($scope, $http) {
        $scope.greeting = "Hello World";
        $http.post('/api/kairos').then(function(response) {
            $scope.analysis = response.data;
        });
    });