angular
.module("ondegastei")
.controller("pageheader", function($scope, $route, $routeParams,$http, $location){
   
  
      $scope.periodo = periodo;
     
  
   $scope.filtrar = function()
   {
       periodo = $scope.periodo;
       if (typeof $scope.loadGraficos == 'function')
        {
            $scope.loadGraficos();
        }
       
       if (typeof $scope.loadGasto == 'function')
        {
            $scope.loadGasto()
        }
        
       
       
   } 
   
    
   
});

