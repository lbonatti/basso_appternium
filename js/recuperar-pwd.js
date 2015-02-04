function eventosRecuperarPwd(){
    $('#recuperar-pwd .page-back').unbind('click').click(function(){
        window.history.back();
    })

    $('#recuperar-pwd .boton').unbind('click').click(function(){

        var email = $.trim( $('#recuperar-pwd .page-content input').val() );

        if(email.length === 0){
            alert('El email es requerido.');
        }else{
            $.ajax({
                url:backend_url+"/users/lost_password",
                type:'POST',
                data:{email: email},
                success:function(result){
                    if(result.Default && result.Default != null){
                        $.mobile.changePage('password-enviada.html');
                    } else {
                        mensaje(JSON.stringify(result.Message));
                    }
                },
                error:function(error){
                    alert(JSON.stringify(error));
                }
            });
        }

    })
}

function eventosPasswordEnviada(){
    $('#password-enviada .boton').unbind('click').click(function(){
        $.mobile.changePage('login.html')
    })
    $('#password-enviada .page-back').unbind('click').click(function(){
        window.history.back();
    })
}