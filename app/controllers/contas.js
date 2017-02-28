angular
    .module("ondegastei")
    .controller("contas", function($scope, $route, $routeParams,$http, $location){
        $scope.valorPendente = 0;
        $scope.id_conta = "";
        $scope.valorVencido = 0;
        $scope.valorTotal = 0;
        $scope.URLComprovante = "";
        $scope.data_inicio = "";
        $scope.data_fim = "";
        var date = new Date();
        var lastDay = (new Date(date.getYear(), date.getMonth()+1, 0)).getDate();
        $scope.data_fim = lastDay+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        $scope.data_inicio = "1"+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        $scope.selecionaConta = function(_id)
        {


            $("#urlComprovante").attr("href","");
            $("#urlComprovante").hide();
            for (i = 0; i < $scope.contas.length;i++)
            {
                if ($scope.contas[i]._id == _id)
                {
                    $scope.descricao = $scope.contas[i].descricao;
                    $scope.valor = $scope.contas[i].valor;
                    $scope.data_vencimento = $scope.contas[i].data_vencimento
                    $scope.codigo_barra = $scope.contas[i].codigo_barra;
                    $scope.descricao = $scope.contas[i].descricao;
                    $scope.id_conta = _id;
                    if ($scope.URL != undefined)
                        $("#urlComprovante").show();
                    break;
                }
            }
        };

        $scope.addConta = function(){
            if ($scope.formTransaction.$valid == false)
            {
                $.toaster({ message : 'Por favor preencha todos os dados',priority : 'danger',title:'Erro' });
                return;
            }
            $("#urlComprovante").hide();
            var data = {
                descricao : $scope.descricao,
                valor : $scope.valor,
                data_vencimento : $scope.data_vencimento,
                codigo_barra : $scope.codigo_barra,
                comentario : $scope.comentario
            };

            data.valor = String($scope.valor).replace(",",".");
            if ($scope.id_conta != "")
            {
                data.id = $scope.id_conta;

                $http.put(baseURL+"/conta",data).success(function (data, status, headers, config) {
                    $scope.id_conta = "";
                    $scope.descricao = "";
                    $scope.valor = "";
                    $scope.data_vencimento = dataAtualFormatada();
                    $scope.codigo_barra = "";
                    $scope.comentario = "";
                });
            }
            else{
                $http.post(baseURL+"/conta",data)
                    .success(function (data, status, headers, config) {
                        $scope.descricao = "";
                        $scope.valor = "";
                        $.toaster({ message : data.msg });
                        $scope.loadContas();

                    })
                    .error(function (data, status, header, config) {
                        $.toaster({ message : 'Erro ao gravar dados',priority : 'danger',title : 'Erro' });
                    });
            }
        }
        $scope.loadContas = function(){
            var params = "data_inicio="+$scope.data_inicio+"&data_fim="+$scope.data_fim;

            $http.get(baseURL+"/conta?"+params).then(function(response){
                $scope.valorPendente = 0;
                $scope.valorVencido = 0;
                $scope.valorTotal = 0;
                var dataAtual = new Date();
                for(var i =0; i < response.data.data.length;i++ )
                {
                    var estilo = "color:green";
                    dataVencimento = new Date(response.data.data[i].data_vencimento);

                    if (response.data.data[i].pago == false && dataAtual > dataVencimento)
                    {
                        estilo = "color:red";
                        $scope.valorVencido += response.data.data[i].valor;
                    }
                    response.data.data[i].data_vencimento = formatarData(response.data.data[i].data_vencimento);
                    response.data.data[i].estilo = estilo;
                    if (!response.data.data[i].pago)
                    {
                        $scope.valorPendente += response.data.data[i].valor;
                    }
                    $scope.valorTotal += response.data.data[i].valor;
                }
                $scope.valorPendente = parseFloat(Math.round($scope.valorPendente * 100) / 100).toFixed(2);
                $scope.valorVencido = parseFloat(Math.round($scope.valorVencido * 100) / 100).toFixed(2);
                $scope.valorTotal = parseFloat(Math.round($scope.valorTotal * 100) / 100).toFixed(2);
                $scope.contas = response.data.data;
            });
        }



        $scope.deleteConta = function(id){
            $http.delete(baseURL+"/conta?id="+id).then(function() {
                $scope.loadContas();
            });

        }

        function atualizarURL(_id,_URL)
        {
            var data = {
                id : _id,
                URL : _URL
            };
            $http.put(baseURL+"/conta",data).then(function(response){
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

        $('#fileupload').fileupload({
            dataType: 'json',
            url:uploadContaSVCURL,
            formData: {id: $scope.id_conta,token: window.localStorage['token']},
            progressall: function(){

            },
            done: function (e, data) {
                atualizarURL($scope.id_conta,"http://"+data.result.URL);
                $("#urlComprovante").attr("href","http://"+data.result.URL)
                $("#urlComprovante").show();
                return false;
            }
        });

        $scope.loadContas();
        $scope.data_vencimento = getDate();
        $("#urlComprovante").hide();

    });
