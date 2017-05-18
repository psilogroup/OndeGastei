/**
 * Created by arrib on 27/02/2017.
 */

var express = require("express");
var app = express();
var mongoDB = require("./Database");

console.log("Pesquisando todas as transações\n");



mongoDB.transacao.find({},function (err, tran) {
    console.log(tran.length);

    for(i = 0;i < tran.length;i++)
    {
        try
        {
            var str_data = tran[i].data.split("/");
            var data_movimento = new Date(str_data[2],str_data[1]-1,str_data[0]);
            tran[i].data_movimento = data_movimento;
            console.log(i +" : "+ tran[i].descricao + ": "+tran[i].data_movimento+"\n");
            tran[i].save();
        }
        catch(ex)
        {

        }

    }
});

        //console.log(doc.descricao + ": "+doc.data+"\n");
