function eventosMensajeEnviado(){
    $('#mensaje-enviado .boton').unbind('click').click(function(){
        $.mobile.changePage('m-inicio.html');
    })
}