angular
.module("ondegastei")
.controller("contas", function($scope, $route, $routeParams,$http, $location){
  $scope.valorPendente = 0;

  $scope.addConta = function(){
    if ($scope.formTransaction.$valid == false)
    {
        alert("Preencher todos os dados");
        return;
    }

    var data = {
      descricao : $scope.descricao,
      valor : $scope.valor,
      data_vencimento : $scope.data_vencimento,
      codigo_barra : $scope.codigo_barra,
      comentario : $scope.comentario
    };

    data.valor = String($scope.valor).replace(",",".");

    $http.post(baseURL+"/conta",data)
            .success(function (data, status, headers, config) {
              $scope.descricao = "";
              $scope.valor = "";
              alert(data.msg);
              $scope.loadContas();

            })
            .error(function (data, status, header, config) {
              alert("Erro ao gravar")
            });
  }

  $scope.loadContas = function(){
      var params = "";
      if (periodo !== undefined && periodo != "")
      {
          params = "?periodo="+periodo;
      }
    $http.get(baseURL+"/conta"+params).then(function(response){
      $scope.valorPendente = 0;
      for(var i =0; i < response.data.data.length;i++ )
      {
        if (!response.data.data[i].pago)
        {
            $scope.valorPendente += response.data.data[i].valor;
        }
      }
      $scope.valorPendente = parseFloat(Math.round($scope.valorPendente * 100) / 100).toFixed(2),
      $scope.contas = response.data.data;
    });
  }



  $scope.deleteConta = function(id){
    $http.delete(baseURL+"/conta?id="+id).then(function() {
      $scope.loadContas();
    });

  }

$scope.pagarConta = function(_id)
{
  var data = {
    id : _id,
    pago : $("input[id='"+_id+"']").is(":checked")
  };
  $http.put(baseURL+"/conta",data).then(function(response){

});

}



$(function(){
    $(document).ready(function(){

    });
});

$scope.loadContas();
$scope.data_vencimento = getDate();

});
