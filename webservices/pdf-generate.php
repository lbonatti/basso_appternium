<?php

function doPDF( $path = '', $content = '', $body = false, $style = '', $mode = false, $paper_1 = 'P', $paper_2 = 'A4' ) {

	$decoratedContent = '<page><!doctype html>
        <html>
        <head>
            <link rel="stylesheet" href="' . $style . '" type="text/css" />
        </head>
        <body>'
	                    . $content .
	                    '</body>
        </html></page>';

	//Añadimos la extensión del archivo. Si está vacío el nombre lo creamos
	$fileName = '../www/tmp/' . crearNombre( 10 );
	$path     = __DIR__ . '/' . $fileName;

	require_once( 'libs/html2pdf/html2pdf.class.php' );

	//Orientación / formato del pdf y el idioma.
	$pdf = new HTML2PDF( $paper_1, $paper_2, 'es', array(
			10,
			10,
			10,
			10
		) /*márgenes*/ ); //los márgenes también pueden definirse en <page> ver documentación
	$pdf->WriteHTML( $decoratedContent );
	$pdf->Output( $path, 'F');
	return $fileName;
	//El pdf es creado "al vuelo", el nombre del archivo aparecerá predeterminado cuando le demos a guardar
	// mostrar
	//$pdf->Output('ejemplo.pdf', 'D');  //forzar descarga
}

function crearNombre( $length ) {
	if ( ! isset( $length ) or ! is_numeric( $length ) ) {
		$length = 6;
	}

	$str = "0123456789abcdefghijklmnopqrstuvwxyz";
	$path = '';

	for ( $i = 1; $i < $length; $i ++ ) {
		$path .= $str{rand( 0, strlen( $str ) - 1 )};
	}

	return $path . '_' . date( "d-m-Y_H-i-s" ) . '.pdf';
}
