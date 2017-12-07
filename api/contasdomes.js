
var express = require("express");
var app = express();
var mongoDB = require("./Database");

console.log("Pesquisando todas as contas\n");
mongoDB.conta.find({mensal:true,data_vencimento:
{
  $gte: new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))
}},function (err, ctn) {
  console.log(ctn.length);
  if (err)
  {
    console.log(err);
  }
  for(i = 0;i < ctn.length;i++)
  {
    gravarConta(ctn[i]);
  }
  console.log("Contas processadas")
  //process.exit(0);
});


function gravarConta(conta)
{
  var db = new mongoDB.conta();
  db.user_id = conta.user_id;
  db.descricao = conta.descricao;
  db.valor = conta.valor;
  db.pago = false;
  db.comentario = "";
  db.codigo_barra = "";
  db.URL = "";
  db.data_vencimento = conta.data_vencimento;
  db.data_vencimento.setMonth(conta.data_vencimento.getMonth()+1);
  db.mensal = true;
  db.save(function(err){
    console.log("Conta gravada user_id: "+db.user_id+" data_vencimento: "+db.data_vencimento)
  });
}
