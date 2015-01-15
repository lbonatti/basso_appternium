function eventosFeedback(){

    $('#m6-f .boton').click(function() {

        var theMsj = $('textarea').val();

        if($.trim(theMsj).length == 0 ){
            alertMsg('Debe ingresar un mensaje.', '', '', '', '', '');
        }else{
            var ok = false;
            $.ajax({
                async: false,
                url: backend_url + "/feedbacks/add",
                data: getFeedbackData(theMsj),
                success: function(result) {
                    if (result.Default) {
                        ok = true;
                    }
                }
            });
            if (ok) {
                $.mobile.changePage('mensaje-enviado.html');
            }else{
                alertMsg('Ocurrió un error al enviar, reintente.', '', '', '', '', '');
            }
        }

    })
}

function getFeedbackData(msj){
    return {
        user_id: sessionStorage.getItem('userId'),
        comentario_id: $('.comentarios').val(),
        mensaje: msj,
        leido: 2
    };
}


