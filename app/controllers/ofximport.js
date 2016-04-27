angular
.module("ondegastei")
.controller("ofximport", function($scope, $route, $routeParams,$http, $location){
    
    
        $('#fileupload').fileupload({
            dataType: 'json',
            url:ofxImportSVCURL,
            formData: {token: window.localStorage['token']},
            progressall: function(){
             
            },
            done: function (e, data) {
                console.log(data.result);
              $("#Transcoes").text(data.result.Transcoes);
              $("#Sucesso").text(data.result.Sucesso);
              $("#Falhas").text(data.result.Falhas);
              
            }
        });
    
    
});
    