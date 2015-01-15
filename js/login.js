$(document).ready(function(){
    var _sessionCode = randomString();
    sessionStorage.setItem('session_code', _sessionCode);

    var facebook = new FacebookPlugin();

    $('#page-1 .ingreso-fb').click(function(ev){
        ev.preventDefault();
        login();
    });

    $('#page-1 .btn-footer.sin-cuenta').on('click', function(e) { //LOGIN
        e.preventDefault();
        sessionStorage.setItem("username", 'anonimo');
        sessionStorage.setItem("fbLogged", 0);
        window.location.href="m-inicio.html";
    });

    $('#page-1 #loginForm').on('submit', function(e){
        $('#page-1 .ingreso').trigger('click');
        e.preventDefault();
        return false;
    });

    $('#page-1 .ingreso').on('click', function(e){ //LOGIN

        e.preventDefault();

        var username = $('.campo.username').val();
        var pass = $('.campo.password').val();

        var sendOk = 0;

        if($.trim(username).length === 0 ){
            mensaje('El email es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(pass).length === 0){
            mensaje('La contraseña no puede ser vacía.');
            return;
        }else{
            sendOk = 1;
        }

        /*
         * test@gmail.com
         * master
         *
         */
        if(sendOk){
            $.ajax({
                url:backend_url+"/users/login",
                type:'POST',
                data:{username: username, password: pass},
                success:function(result){
                    if(result.Default && result.Default != null){
                        sessionStorage.setItem('userInfo', JSON.stringify(result.Default.User) );
                        sessionStorage.setItem("userId", result.Default.User.id);
                        sessionStorage.setItem("username", username);
                        sessionStorage.setItem("fbLogged", 0);

                        window.location.href="m-inicio.html";
                    }else{
                        mensaje(result.Message);
                    }
                },
                error:function(error){
                    alert(JSON.stringify(error));
                }
            });
        }
         return;
    });


    $('#dlg-generico .boton').click(function(){
        unblockScreen();
    })

});

function mensaje(msg){
    $('.shadow').height( $.mobile.activePage.height()).show();
    $('#dlg-generico').css('top',($.mobile.activePage.height()/2)-150 ).show();
    $('#dlg-generico .mensaje').html(msg);

}


function unblockScreen(){
    $('.shadow').hide();
    $('.dialogo').hide();
}

function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}