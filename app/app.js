angular
.module("ondegastei", ["ngRoute"])
.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/dashboard.html",
            controller: "dashboard"
        });
});
