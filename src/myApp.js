var app = angular.module('myApp', ['ng']);

app.directive('userMenu', function () {
    return {
        controller: 'MyHttpController',
        template: '<div class="user" ng-show="user">' +
        '<img src= "{{user.profile.picture}}"></img>'+
        '</br>'+ 
        ' Current User: <b>{{user.profile.username}}</b>' +
        '</div>' +

        '<div ng-show="!user">' +
        '<a href="/auth/facebook">' +
        'Log In' +
        '</a>' +
        '</div>'
    }
});
app.controller('MyHttpController', function ($scope, $http) {
    $http.get('/api/v1/me').success(function (data) {
        $scope.user = data.user;
    });
});