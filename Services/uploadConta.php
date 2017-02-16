<?php

function getGUID(){
if (function_exists('com_create_guid')){
    return com_create_guid();
}else{
    mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
    $charid = strtoupper(md5(uniqid(rand(), true)));
    $uuid = substr($charid, 0, 8)
        .substr($charid, 8, 4)
        .substr($charid,12, 4)
        .substr($charid,16, 4)
        .substr($charid,20,12);

    return $uuid;
}
}


$idconta = $_POST["id"];
$token = $_POST["token"];
$name = array_reverse(explode(".", $_FILES['files']['name']));
$name = $name[0];
$tempFile = $_FILES['files']['tmp_name'];
$ui = getGUID();
$aux = "/web/expense.psilogroup.com/assets/files/" . $ui . "." . $name;
$URL = "expense.psilogroup.com/assets/files/" . $ui . "." . $name;
$targetFile = $aux;

move_uploaded_file($tempFile, $targetFile);

echo json_encode(array(
         'URL' => $URL
         ));
 ?>
