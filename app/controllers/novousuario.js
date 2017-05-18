angular
.module("ondegastei")
.controller("novousuario", function($scope, $route, $routeParams,$http, $location){
    
    
    $scope.cadastrarUsuario = function()
    {
        if ($scope.formcadastro.$valid == false)
            return;
        
        var data =  {
            nome : $scope.nome,
            email: $scope.email,
            senha : $scope.senha
        };
        
        $http.post(baseURL+"/usuario",data).then(function(response){
            if (response.data.erro == true)
            {
                alert(response.data.msg);
            }
            else
            {
                alert(response.data.msg);
                $location.path('/logar');
            }
        });
        
    }
});