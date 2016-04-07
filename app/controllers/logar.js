angular
.module("ondegastei")
.controller("logar", function($scope, $route, $routeParams,$http, $location){
    
    $scope.criarconta = function () {
        $location.path('/novousuario');
    };
    $scope.logarUsuario = function()
    {
        var data = {
            email: $scope.email,
            senha: $scope.senha
        };
        
        $http.post(baseURL+"/usuario/login",data).then(function(response){
            if (response.data.erro == false)
            {
                window.localStorage['token'] = response.data.token;
                $location.path('/');
            }
        });
    }
});