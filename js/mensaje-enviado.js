function eventosMensajeEnviado(){
    $('#mensaje-enviado .boton').click(function(){
        $.mobile.changePage('m-inicio.html');
    })
}