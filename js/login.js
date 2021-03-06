$(document).ready(function(){
    var _sessionCode = randomString();
    sessionStorage.setItem('session_code', _sessionCode);
    sessionStorage.setItem('newSave', 0);

    var facebook = new FacebookPlugin();

    $('#page-1 .ingreso-fb').unbind('click').click(function(ev){
        ev.preventDefault();
        login();
    });

    $('#page-1 .btn-footer.sin-cuenta').unbind('click').on('click', function(e) { //LOGIN
        e.preventDefault();
        localStorage.setItem("username", 'anonimo');
        localStorage.setItem("fbLogged", 0);
        window.location.href="m-inicio.html";
    });

    $('#page-1 #loginForm').unbind('click').on('submit', function(e){
        $('#page-1 .ingreso').trigger('click');
        e.preventDefault();
        return false;
    });

    $('#page-1 .ingreso').unbind('click').on('click', function(e){ //LOGIN

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
                        localStorage.setItem('userInfo', JSON.stringify(result.Default.User) );
                        localStorage.setItem("userId", result.Default.User.id);
                        localStorage.setItem("username", username);
                        localStorage.setItem("fbLogged", 0);

                        sessionStorage.setItem('newSave', 1);
                        window.location.href="sync.html";
                    }else{
                        mensaje(result.Message);
                    }
                },
                error:function(error){
                    mensaje('Parece haber problemas de conexión');
                    //alert(JSON.stringify(error));
                }
            });
        }
         return;
    });


    $('#dlg-generico .boton').unbind('click').click(function(){
        unblockScreen();
    })

});

function mensaje(msg){
    if( !msg || $.trim(msg).length === 0 || msg == '' ){
        msg = 'Error desconocido';
    }
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