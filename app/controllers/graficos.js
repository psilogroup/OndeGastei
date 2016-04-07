angular
.module("ondegastei")
.controller("graficos", function($scope, $route, $routeParams,$http, $location){
    
   $scope.loadGraficos = function () {
       var params = "";
      if (periodo !== undefined && periodo != "")
      {
          params = "?periodo="+periodo;
      }
       $http.get(baseURL+"/transacao"+params).then(function(response){
        
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
    
    $scope.chartObject.type = "PieChart";
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
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Slices", type: "number"}
    ], "rows": dataPie};

    $scope.chartObject.options = {
        'title': 'Gastos por Categoria ' + periodo
    };
     
  });
   }
    
     $scope.loadGraficos();
  
});
