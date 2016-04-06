periodo = dataAtualFormatada();
angular
.module("ondegastei", ["ngRoute","googlechart"])
.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/dashboard.html",
            controller: "dashboard"
        }).when("/graficos",
        {
            templateUrl: "templates/graficos.html",
            controller: "graficos"
        });
}).directive("pageheader", function(){
	return {
		templateUrl: "templates/pageheader.html",
		controller: "pageheader"
	}
});

