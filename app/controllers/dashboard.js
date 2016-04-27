angular
.module("ondegastei")
.controller("dashboard", function($scope, $route, $routeParams,$http, $location){


  $scope.addGasto = function(){
    if ($scope.formTransaction.$valid == false)
    {
        alert("Preencher todos os dados");
        return;
    }

    var data = {
      descricao : $scope.descricao,
      valor : $scope.valor,
      data : $scope.data
    };
    
    data.valor = String($scope.valor).replace(",",".");

    $http.post(baseURL+"/transacao",data)
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
      var params = "";
      if (periodo !== undefined && periodo != "")
      {
          params = "?periodo="+periodo;
      }
    $http.get(baseURL+"/transacao"+params).then(function(response){
        
        for (var i = 0; i < response.data.data.length;i++)
        {
            
            if (response.data.data[i].categoria === undefined || response.data.data[i].categoria == "" )
                response.data.data[i].categoria = "S. Categoria";
                
            
        }
      $scope.transacoes = response.data.data;
    });
  }

  $scope.deleteGasto = function(id){
    $http.delete(baseURL+"/transacao?id="+id).then(function() {
      $scope.loadGasto();
    });

  }
  
  $scope.mostrarDialogCategoria = function (id_) {
      $scope.codigoItemAtual = id_;
      $scope.categoria = "";
     $("#modalCategoria").modal("show"); 
     $("#txtCategoria").focus();
  }
  
  $scope.updateCategoria = function()
  {
      
      var data = {
          id : $scope.codigoItemAtual,
          categoria : $scope.categoria
      };
      
      $("#modalCategoria").modal("hide");   
    $http.put(baseURL+"/transacao",data).then(function(){
        $("#"+$scope.codigoItemAtual).text($scope.categoria); 
    }); 
  };


$(function(){
    $(document).ready(function(){
        
    });
});

$scope.data = getDate();
  $scope.loadGasto();

});
