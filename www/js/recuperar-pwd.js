function eventosRecuperarPwd(){
    $('#recuperar-pwd .page-back').click(function(){
        window.history.back();
    })

    $('#recuperar-pwd .boton').click(function(){

        var email = $.trim( $('#recuperar-pwd .page-content input').val() );

        if(email.length === 0){
            alert('El email es requerido.');
        }else{
            $.mobile.changePage('password-enviada.html')
        }

    })
}

function eventosPasswordEnviada(){
    $('#password-enviada .boton').click(function(){
        $.mobile.changePage('login.html')
    })
    $('#password-enviada .page-back').click(function(){
        window.history.back();
    })
}