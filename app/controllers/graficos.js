angular
    .module("ondegastei")
    .controller("graficos", function($scope, $route, $routeParams,$http, $location){
        $scope.data_inicio = "";
        $scope.data_fim = "";
        var date = new Date();
        var lastDay = (new Date(date.getYear(), date.getMonth()+1, 0)).getDate();
        $scope.data_fim = lastDay+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        $scope.data_inicio = "1"+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

        $scope.loadGraficos = function () {
            var params = "data_inicio="+$scope.data_inicio+"&data_fim="+$scope.data_fim;
            $http.get(baseURL+"/transacao?"+params).then(function(response){

                var categories = new Array();
                for (var i = 0; i < response.data.data.length;i++)
                {
                    var encontrou = false;
                    if (response.data.data[i].categoria === undefined || response.data.data[i].categoria == "" )
                        response.data.data[i].categoria = "S. Categoria";

                    for (var j = 0; j< categories.length;j++)
                    {
                        if (categories[j].categoria == response.data.data[i].categoria)
                        {
                            encontrou = true;
                            categories[j].valor += response.data.data[i].valor;
                        }
                    }
                    if (!encontrou)
                    {
                        categories.push({
                            categoria : response.data.data[i].categoria,
                            valor :  response.data.data[i].valor
                        });
                    }
                }

                $scope.chartObject = {};

                $scope.chartObject.type = "BarChart";
                function compare(a,b) {
                    if (a.valor < b.valor)
                        return 1;
                    if (a.valor > b.valor)
                        return -1;
                    return 0;
                }

                categories.sort(compare);
                $scope.onions = [

                ];
                var dataPie = [];
                for (var i = 0; i < categories.length;i++)
                {
                    dataPie.push( {c: [
                        {v: categories[i].categoria + " R$ "+ parseFloat(Math.round(categories[i].valor * 100) / 100).toFixed(2)},
                        {v: categories[i].valor},
                    ]})
                }



                $scope.chartObject.data = {"cols": [
                    {id: "t", label: "Categoria", type: "string"},
                    {id: "s", label: "Valor", type: "number"}
                ], "rows": dataPie};

                $scope.chartObject.options = {
                    'title': 'Gastos de '+$scope.data_inicio + " até "+$scope.data_fim
                };

            });
        }

        $scope.loadGraficos();

    });
