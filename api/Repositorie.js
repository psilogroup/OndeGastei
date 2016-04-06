var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var mongoDB = require("./Database");


function novoGasto(router)
{
  router.route("/transacao").post(function(req,res){
    var db = new mongoDB.transacao();
    var response = {};
    db.descricao = req.body.descricao;
    db.valor = req.body.valor;
    db.data = req.body.data;

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

function listarGastos(router)
{
   
  router.route("/transacao").get(function(req,res){
    var filters = {};
    //name: new RegExp('^'+name+'$', "i")
    if (req.query.periodo !== undefined)
       filters = {data: new RegExp(req.query.periodo.replace("/","\/"))};
      
     console.log(filters); 
    mongoDB.transacao.find(filters).sort({created_at: 'desc'}).exec(function(err,data){
      if (err)
      {
        response = {"erro" : true, "msg" : "Erro ao buscar dados"}
      }
      else
      {
        response = {"erro" : false, "msg" : "busca efetuada com sucesso", "data":data}
      }
      res.json(response);
    });
  });
}


function deleteGasto(router)
{
  router.route("/transacao").delete(function(req,res){
    mongoDB.transacao.findOne({_id : req.query.id},function(err, tran)
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

function MudarCategoria(router)
{
    router.route("/transacao").put(function(req,res){
         var response = {};
        mongoDB.transacao.findOne({_id : req.body.id},function(err, tran)
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

module.exports = {
    registerAll : function(router){
        listarGastos(router);
        novoGasto(router);
        deleteGasto(router);
        MudarCategoria(router);
    }
}
