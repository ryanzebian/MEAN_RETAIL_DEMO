var app = angular.module('myApp', ['ng', 'ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.
        when('/',{
            templateUrl: './home.html',
            controller: function($scope){
                $scope.linkText = 'about';
            }
        }).
        when('/about', {
            templateUrl: './about.html'
        });
});