<?php
namespace OfxParser;
require_once __DIR__ . '/vendor/autoload.php';

 

$tempFile = $_FILES['files']['tmp_name'];

$token = $_POST["token"];
 
$OfxParser = new \OfxParser\Parser;
$Ofx = $OfxParser->loadFromFile($tempFile);

// Get the statements for the current bank account
$transactions = $Ofx->BankAccount->Statement->transactions;

 $ch = curl_init();
 
 $transacoesOK = 0;
 $transacoesNOK = 0;
 $result_data = array();
foreach ($transactions as &$value)
{
    //O Expense ainda não trata de receitas.
    if ($value->amount > 0)
        continue;
        
    $data = $value->date->format("d/m/Y");
    $valor = sprintf("%.2f", abs($value->amount));
    
    
    
    $request = array(
        'descricao' => $value->memo,
        'valor' =>  $valor,
        'data' => $data);
        
     $data_string = json_encode($request,JSON_UNESCAPED_SLASHES);
     
    curl_setopt($ch, CURLOPT_URL, "http://52.67.239.233:8087/transacao");
       
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch,   CURLOPT_RETURNTRANSFER,true);
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data_string),
        'authorization: ' . $token,
        )
        );                                       
     $result = curl_exec($ch);
     $json = json_decode($result);
     
     $status_code = curl_getinfo ( $ch,CURLINFO_HTTP_CODE );
     if ($json->erro == true || $status_code != 200)
     {
         $transacoesNOK = $transacoesNOK + 1;
     }
     else {
         $transacoesOK = $transacoesOK + 1;
     }   
}

echo json_encode(array(
         'Transcoes' => $transacoesOK+$transacoesNOK,
         'Sucesso' => $transacoesOK,
         'Falhas' => $transacoesNOK
         ));
?>