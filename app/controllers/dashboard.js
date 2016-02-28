angular
.module("ondegastei")
.controller("dashboard", function($scope, $route, $routeParams,$http, $location){

  $scope.addGasto = function(){
    var data = {
      descricao : $scope.descricao,
      valor : $scope.valor,
      data : $scope.data
    };

    $http.post("http://127.0.0.1:8087/transacao",data)
            .success(function (data, status, headers, config) {
              $scope.descricao = "";
              $scope.valor = "";

              alert(data.msg);
              $scope.loadGasto();

            })
            .error(function (data, status, header, config) {
              alert("Erro ao gravar")
            });

  }

  $scope.loadGasto = function(){
    $http.get("http://127.0.0.1:8087/transacao").then(function(response){
      $scope.transacoes = response.data.data;
    });
  }

  $scope.deleteGasto = function(id){
    $http.delete("http://127.0.0.1:8087/transacao?id="+id).then(function() {
      $scope.loadGasto();
    });

  }

  $scope.loadGasto();

});
