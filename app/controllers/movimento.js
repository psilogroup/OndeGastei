angular
    .module("ondegastei")
    .controller("movimento", function($scope, $route, $routeParams,$http, $location){
        $scope.valorTotal = 0;
        $scope.categorias = [];
        $scope.data_inicio = "";
        $scope.data_fim = "";
        var date = new Date();
        var lastDay = (new Date(date.getYear(), date.getMonth()+1, 0)).getDate();
        $scope.data_fim = lastDay+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        $scope.data_inicio = "1"+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        $scope.addGasto = function(){
            if ($scope.formTransaction.$valid == false)
            {
                $.toaster({ message : 'Preencha todos os dados',priority : 'danger',title : 'Erro' });
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


                    $.toaster({ message : data.msg,priority : 'success',title : 'Sucesso' });
                    $scope.loadGasto();
                    $scope.loadCategoria();

                })
                .error(function (data, status, header, config) {
                    $.toaster({ message : 'Erro ao gravar dados',priority : 'danger',title : 'Erro' });
                });



        };


        $scope.loadGasto = function(){
            var params = "data_inicio="+$scope.data_inicio+"&data_fim="+$scope.data_fim;
            $http.get(baseURL+"/transacao?"+params).then(function(response){
                $scope.valorTotal = 0;
                for (var i = 0; i < response.data.data.length;i++)
                {

                    if (response.data.data[i].categoria === undefined || response.data.data[i].categoria == "" )
                        response.data.data[i].categoria = "S. Categoria";

                    response.data.data[i].data_movimento = formatarData(response.data.data[i].data_movimento);
                    $scope.valorTotal += response.data.data[i].valor;
                }
                $scope.valorTotal = parseFloat(Math.round($scope.valorTotal * 100) / 100).toFixed(2);
                $scope.transacoes = response.data.data;
            });
        };

        $scope.loadCategoria = function(){
            $http.get(baseURL+"/categoria").then(function(response){
                console.log(response.data.data);
                $scope.categorias = response.data.data;
            });
        };

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

        $scope.updateCategoria = function(_cat)
        {
            if (_cat != undefined)
                $scope.categoria = _cat;

            var data = {
                id : $scope.codigoItemAtual,
                categoria :  $scope.categoria
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
        $scope.loadCategoria();

    });
