periodo = dataAtualFormatada();
baseURL = "http://localhost:8087";
ofxImportSVCURL = "http://localhost/Services/OFXImport.php" ;
uploadContaSVCURL = "http://localhost/Services/uploadConta.php" ;
angular
.module("ondegastei", ["ngRoute","googlechart"])
.config(function($routeProvider, $locationProvider,$httpProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/dashboard.html",
            controller: "dashboard"
        }).when("/graficos",
        {
            templateUrl: "templates/graficos.html",
            controller: "graficos"
        }).when("/logar",{
            templateUrl: "templates/logar.html",
            controller: "logar"
        }).when("/novousuario",{
            templateUrl: "templates/novousuario.html",
            controller: "novousuario"
        }).when("/ofximport",{
            templateUrl: "templates/ofximport.html",
            controller: "ofximport"
        }).when("/contas",{
          templateUrl: "templates/contas.html",
          controller: "contas"
        }).when("/movimento",{
           templateUrl: "templates/movimento.html",
           controller: "movimento"
    });

$httpProvider.interceptors.push(['$q', '$location', function ($q, $location ) {
   return {
       'request': function (config) {

           config.headers = config.headers || {};
           if (window.localStorage['token']) {
               config.headers.Authorization = window.localStorage['token'];
           }

           return config;
       },
       'responseError': function (response) {
           if (response.status === 401 || response.status === 403) {
               $location.path('/logar');
           }
           return $q.reject(response);
       }
   };
}]);

}).directive("pageheader", function(){
	return {
		templateUrl: "templates/pageheader.html",
		controller: "pageheader"
	}
}).run(['$templateCache', function ( $templateCache ) {
    $templateCache.removeAll(); }]);
