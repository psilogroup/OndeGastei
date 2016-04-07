
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var jwt  = require('jwt-simple');
var mongoDB = require("./Database");


function novoGasto(router)
{
  router.route("/transacao").post(function(req,res){
      if (!usuarioAutenticado(req))
        return res.sendStatus(401);
        
    var db = new mongoDB.transacao();
    var response = {};
    db.descricao = req.body.descricao;
    db.valor = req.body.valor;
    db.data = req.body.data;
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

function listarGastos(router)
{
   
  router.route("/transacao").get(function(req,res){
    if (!usuarioAutenticado(req))
        return res.sendStatus(401);
    console.log(req.userToken);
    
    var filters = {user_id : req.userToken._id};
    //name: new RegExp('^'+name+'$', "i")
    if (req.query.periodo !== undefined)
       filters = {data: new RegExp(req.query.periodo.replace("/","\/")),user_id : req.userToken._id};
      
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

function criarUsuario(router)
{
    router.route("/usuario").post(function(req,res){
        var response = {};
        mongoDB.usuario.findOne({email : req.body.email},function(err,user){
            if (err)
            {
                response = {"erro" : true};
                console.log(response);
                return res.json(response);
            }
            
            if (user)
            {
                response = {"erro" : true,"msg" : "usuário já existe"}
                console.log(response);
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
                   console.log(response);
                   return res.json(response);
               });
            }
            
        });
        
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
module.exports = {
    registerAll : function(router){
        listarGastos(router);
        novoGasto(router);
        deleteGasto(router);
        MudarCategoria(router);
        criarUsuario(router);
        autenticarUsuario(router)
    }
}
