$(document).ready(function(){
    var facebook = new FacebookPlugin();

    $('#page-1 .ingreso-fb').click(function(ev){
        ev.preventDefault();

        facebook.FBLogin(function(response){
            alert(JSON.stringify(response));

            facebook.FBProfile(function(profile){

                $.ajax({
                    url:"http://html5cooks.com/ternium/ternium/users/login_facebook",
                    type:'GET',
                    data:{email: profile.email, uid: profile.id},
                    success:function(result){
                        if(result.Default && result.Default != null){
                            alert('User OK');
                        }else{
                            alert('User Fail');
                        }
                        alert(JSON.stringify(result));
                    },
                    error:function(error){
                        alert(JSON.stringify(error));
                    }
                });
            });
        });
    });

    $('#page-1 .btn-footer.sin-cuenta').on('click', function(e) { //LOGIN
        e.preventDefault();
        localStorage.setItem("username", 'anonimo');
        window.location.href="m-inicio.html";
    });

    $('#page-1 .ingreso').on('click', function(e){ //LOGIN

        e.preventDefault();

        var username = $('.campo.username').val();
        var pass = $('.campo.password').val();

        var sendOk = 0;

        if($.trim(username).length === 0 ){
            mensaje('El email es requerido.');
            return;
            sendOk = 0;
        }else{
            sendOk = 1;
        }

        if($.trim(pass).length === 0){
            mensaje('La contraseña no puede ser vacía.');
            return;
            sendOk = 0;
        }else{
            sendOk = 1;
        }

        /*
         * test@gmail.com
         * master
         *
         * TODO: Cambiar url
         */
        if(sendOk){
            $.ajax({
                url:"http://localhost/app-ternium/backend-admin/users/login",
                type:'POST',
                data:{username: username, password: pass},
                success:function(result){
                    if(result.Default && result.Default != null){
                        localStorage.setItem("userId", result.Default.User.id);
                        localStorage.setItem("username", username);
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
