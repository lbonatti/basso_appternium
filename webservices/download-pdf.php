<?php

if (!isset($_POST['content'])){
	echo 'Ha ocurrido un error.';exit;
}else{
	$content = $_POST['content'];
	include('pdf-generate.php');
	$filename = doPDF('ejemplo',$content,true,$style='css/pdf.css');

	echo $filename;
}

