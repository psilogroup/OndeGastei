var mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:41118/expense');
var Schema = mongoose.Schema;

var transacaoSchema = new Schema({
  "user_id" : String,
  "descricao" : String,
  "valor" : Number,
  "data" : String,
  "categoria" : "String",
    "data_movimento" : {type: Date},
 "created_at" : { type: Date, default: Date.now }
});

var usuarioSchema = new Schema({
 "nome" : "String",
 "email" : "String",
 "senha" : "String",
 "created_at" : { type: Date, default: Date.now }
});

var contaSchema = new Schema({
  "user_id" : String,
  "descricao" : String,
  "data_vencimento" : {type: Date},
  "valor" : Number,
  "pago" : Boolean,
  "codigo_barra" : String,
  "comentario" : String,
  "URL" : String,
  "created_at" : { type: Date, default: Date.now }
});

module.exports = {
	transacao : mongoose.model('transacao',transacaoSchema),
  usuario : mongoose.model('usuario',usuarioSchema),
  conta : mongoose.model('conta',contaSchema)
};
