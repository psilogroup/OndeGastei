var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var jwt  = require('jwt-simple');
var mongoDB = require("./Database");
function novaConta(router)
{
    router.route("/conta").post(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);

        var db = new mongoDB.conta();
        var response = {};

        if (!validarData(req.body.data_vencimento))
        {
            return res.json({"erro" : true, "msg" : "Data de vencimento inválida"});
        }

        var str_array = req.body.data_vencimento.split("/");
        //Queria saber quem teve a idéia de fazer o mês começar do 0
        var data = new Date(str_array[2],str_array[1]-1,str_array[0]);

        db.descricao = req.body.descricao;
        db.valor = req.body.valor;
        db.data_vencimento = data;

        db.pago = req.body.pago;
        db.codigo_barra = req.body.codigo_barra;
        db.comentario = req.body.comentario;
        db.mensal = req.body.mensal;
        db.user_id = req.userToken._id;

        db.save(function(err){
            if (err)
            {
                response = {"erro" : true, "msg" : "Erro ao salvar dados"}
            }
            else
            {
                response = {"erro" : false, "msg" : "Dados salvos com sucesso"}
            }
            res.json(response);
        });


    });
}


function UpdateConta(router)
{

    router.route("/conta").put(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);
        var response = {};
        mongoDB.conta.findOne({_id : req.body.id,user_id : req.userToken._id},function(err, conta)
        {
            //verifica se encontrou a conta
            if (conta == null)
            {
                response = {"erro" : true,"mensagem" : "Erro ao atualizar dados dados, id não encontrado"};
                res.json(response);
                return;
            }

            if (req.body.descricao != null)
                conta.descricao = req.body.descricao;

            if (req.body.valor != null)
                conta.valor = req.body.valor;

            if (req.body.data_vencimento)
            {
                if (!validarData(req.body.data_vencimento))
                {
                    return res.json({"erro" : true, "msg" : "Data de vencimento inválida"});
                }
                var str_array = req.body.data_vencimento.split("/");
                //Queria saber quem teve aidéia de fazer o mês começar do 0
                var data = new Date(str_array[2],str_array[1]-1,str_array[0]);
                conta.data_vencimento = data;
            }


            if (req.body.pago != undefined)
                conta.pago = req.body.pago;

            if (req.body.codigo_barra != undefined)
                conta.codigo_barra = req.body.codigo_barra;

            if (req.body.comentario != undefined)
                conta.comentario = req.body.comentario;

            if (req.body.URL != undefined)
                conta.URL = req.body.URL;

            if (req.body.mensal != undefined)
              conta.mensal = req.body.mensal;

            conta.user_id = req.userToken._id;

            conta.save();
            response = {"erro" : false, "msg" : "Dados salvos com sucesso"};
            return res.json(response);
        });


    });
}

function novoGasto(router)
{
    router.route("/transacao").post(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);

        var db = new mongoDB.transacao();
        var response = {};

        db.descricao = req.body.descricao;
        db.valor = req.body.valor;
        if (!validarData(req.body.data))
        {
            return res.json({"erro" : true, "msg" : "Data inválida"});
        }
        var str_data = req.body.data.split("/");
        var data_movimento = new Date(str_data[2],str_data[1]-1,str_data[0]);
        db.data_movimento = data_movimento;

        db.data = req.body.data;
        db.user_id = req.userToken._id;

        procurarCategoria(req.body.descricao,function(cate){
          db.categoria = cate;
          db.save(function(err){
              if (err)
              {
                  response = {"erro" : true, "msg" : "Erro ao salvar dados"}
              }
              else
              {
                  response = {"erro" : false, "msg" : "Dados salvos com sucesso"}
              }
              res.json(response);
          });
        });
    });
}

function listarGastos(router)
{

    router.route("/transacao").get(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);



        if (!validarData(req.query.data_inicio))
        {
            return res.json({"erro" : true, "msg" : "Data inicial inválida: "+req.query.data_inicio});
        }

        var str_data_inicio = req.query.data_inicio.split("/");
        var data_inicio = new Date(str_data_inicio[2],str_data_inicio[1]-1,str_data_inicio[0]);

        if (!validarData(req.query.data_fim))
        {
            return res.json({"erro" : true, "msg" : "Data final inválida"});
        }
        var str_data_fim = req.query.data_fim.split("/");
        var data_fim = new Date(str_data_fim[2],str_data_fim[1]-1,str_data_fim[0]);
        var filters = {data_movimento: {"$gte": data_inicio,$lte: data_fim},user_id: req.userToken._id};

        mongoDB.transacao.find(filters).sort({data_movimento: 'desc'}).exec(function(err,data){
            if (err)
            {
                response = {"erro" : true, "msg" : "Erro ao buscar dados"}
            }
            else
            {
                response = {"erro" : false, "msg" : "busca efetuada com sucesso", "data":data}
            }
            return res.json(response);
        });
    });
}

function listarContas(router)
{

    router.route("/conta").get(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);


        var filters = {user_id : req.userToken._id};
        if (!validarData(req.query.data_inicio))
        {
            return res.json({"erro" : true, "msg" : "Data inicial inválida"});
        }
        var str_data_inicio = req.query.data_inicio.split("/");
        var data_inicio = new Date(str_data_inicio[2],str_data_inicio[1]-1,str_data_inicio[0]);

        if (!validarData(req.query.data_fim))
        {
            return res.json({"erro" : true, "msg" : "Data final inválida"});
        }

        var str_data_fim = req.query.data_fim.split("/");
        var data_fim = new Date(str_data_fim[2],str_data_fim[1]-1,str_data_fim[0]);
        var filters = {data_vencimento: {"$gte": data_inicio,$lte: data_fim},user_id: req.userToken._id};


        mongoDB.conta.find(filters).sort({data_vencimento: 'asc',pago:'desc'}).exec(function(err,data){
            if (err)
            {
                response = {"erro" : true, "msg" : "Erro ao buscar dados"}
            }
            else
            {
                response = {"erro" : false, "msg" : "busca efetuada com sucesso", "data":data}
            }
            return res.json(response);
        });
    });
}


function deleteGasto(router)
{
    router.route("/transacao").delete(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);

        mongoDB.transacao.findOne({_id : req.query.id,user_id : req.userToken._id},function(err, tran)
        {
            //verifica se encontrou a transacao
            if (tran == null)
            {
                response = {"erro" : true,"mensagem" : "Erro ao remover dados, id não encontrado"};
                res.json(response);
                return;
            }
            //remove a transacao efetivamente
            tran.remove(function(err){
                if (err)
                {
                    response = {"erro" : true,"mensagem" : "Erro ao remover dados, throw err"};
                }
                else {
                    response = {"erro" : false,"mensagem" : "Dados removidos"};
                }
                res.json(response);
            });
        });
    });
}

function deleteConta(router)
{
    router.route("/conta").delete(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);

        mongoDB.conta.findOne({_id : req.query.id,user_id : req.userToken._id},function(err, conta)
        {
            //verifica se encontrou a conta
            if (conta == null)
            {
                response = {"erro" : true,"mensagem" : "Erro ao remover dados, id não encontrado"};
                res.json(response);
                return;
            }
            //remove a conta efetivamente
            conta.remove(function(err){
                if (err)
                {
                    response = {"erro" : true,"mensagem" : "Erro ao remover dados, throw err"};
                }
                else {
                    response = {"erro" : false,"mensagem" : "Dados removidos"};
                }
                res.json(response);
            });
        });
    });
}

function MudarCategoria(router)
{

    router.route("/transacao").put(function(req,res){
        if (!usuarioAutenticado(req))
            return res.sendStatus(401);
        var response = {};
        mongoDB.transacao.findOne({_id : req.body.id,user_id : req.userToken._id},function(err, tran)
        {
            //verifica se encontrou a transacao
            if (tran == null)
            {
                response = {"erro" : true,"mensagem" : "Erro ao atualizar dados dados, id não encontrado"};
                res.json(response);
                return;
            }

            tran.categoria = req.body.categoria;
            tran.save();
            response = {"erro" : false, "msg" : "Dados salvos com sucesso"};
            return res.json(response);
        });


    });
}

function ListarCategoria(router)
{
    router.route("/categoria").get(function(req,res){
        var agg = [
            {$group: {
                _id: "$categoria"
            }}
        ];
        var response = {};
        mongoDB.transacao.aggregate(agg, function(err, data){
            if (err)
            {
                response = {"erro" : true, "msg" : "Erro ao buscar dados"}
            }
            else
            {
                response = {"erro" : false, "msg" : "busca efetuada com sucesso", "data":data}
            }
            return res.json(response);
        });

    });
}

function criarUsuario(router)
{
    router.route("/usuario").post(function(req,res){
        var response = {};
        mongoDB.usuario.findOne({email : req.body.email},function(err,user){
            if (err)
            {
                response = {"erro" : true};

                return res.json(response);
            }

            if (user)
            {
                response = {"erro" : true,"msg" : "usuário já existe"}

                return res.json(response);
            }
            else
            {
                var db = new mongoDB.usuario();
                db.nome = req.body.nome;
                db.email = req.body.email;
                db.senha = req.body.senha; //TODO encriptar senha ou não!
                db.save(function(err){
                    response = {"erro" : false,"msg" : "usuário cadastrado com sucesso"};

                    return res.json(response);
                });
            }

        });

    });
}

function procurarCategoria(desc,callback){
  var categoria = ""
  //console.log("procurando categoria de: "+desc+"len: "+desc.length);
  var l = desc.length;
  var stop = false;
  var hasBlock = false;
  while(stop == false)
  {
    l--;
    if (l <= 0)
     stop = true;

    if (desc[l] == ' ' || desc[l] == '-'){
      stop = true;
      hasBlock = true;
    }

  }

  if (hasBlock)
  {
    desc = desc.substring(0,l);
    //console.log("desc: "+desc.substring(0,l));
  }
  mongoDB.transacao.findOne({descricao : { $regex: desc + '.*' }}, {},{sort: { 'created_at' : -1 }},function(err,tran){
    if (tran)
    {
      categoria = tran.categoria;
      //console.log("encontrado "+tran.categoria);
    }
    if (err)
    {
      console.log(err);
    }

    callback(categoria);
  });

}
function autenticarUsuario(router)
{
    router.route("/usuario/login").post(function(req,res){
        var response = {};
        mongoDB.usuario.findOne({email: req.body.email, senha:req.body.senha},function(err,user){
            if (err)
            {
                response = {"erro" : true,"msg" : ":("};
            }
            if (!user)
            {
                response = {"erro" : true,"msg" : "usuário ou senha inválidos"};
                return res.json(response);
            }
            else
            {
                var token = jwt.encode(user, "4d11fdfe461e4fbaa70770736eba166f");
                response = {"erro" : false,"msg" : "Logado com sucesso","token" : token};
                return res.json(response);
            }
        });
    });
}

function usuarioAutenticado(req)
{
    if (req.userToken === undefined)
        return false;
    if (req.userToken._id === undefined)
        return false;

    return true;
}

function validarData(_data) {

    if (!/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/\-]\d{4}$/.test(_data))
    {
        return false;
    }

    return true;
}
module.exports = {
    registerAll : function(router){
        listarGastos(router);
        novoGasto(router);
        deleteGasto(router);
        MudarCategoria(router);
        criarUsuario(router);
        autenticarUsuario(router);
        ListarCategoria(router);
        listarContas(router);
        novaConta(router);
        UpdateConta(router);
        deleteConta(router);
    }
}
