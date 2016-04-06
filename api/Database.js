var mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/ondegastei');
var Schema = mongoose.Schema;

var transacaoSchema = new Schema ({
  "descricao" : String,
  "valor" : Number,
  "data" : String,
  "categoria" : "String",
	"created_at" : { type: Date, default: Date.now }
});

module.exports = {
	transacao : mongoose.model('transacao',transacaoSchema),
};
