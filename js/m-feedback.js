function eventosFeedback(){
    $('#m6-f .boton').click(function() {
        var ok = false;
        $.ajax({
            async: false,
            url: backend_url + "/feedbacks/add",
            data: getFeedbackData(),
            success: function(result) {
                if (result.Default) {
                    ok = true;
                }
            }
        });

        if (ok) {
            $.mobile.changePage('mensaje-enviado.html');
        }
    })
}

function getFeedbackData()
{
    return {
        user_id: sessionStorage.getItem('userId'),
        comentario_id: $('.comentarios').val(),
        mensaje: $('textarea').val(),
        leido: 2
    };
}


