function eventosRegister(){
    $('#register .page-back').unbind('click').click(function(){
        window.history.back();
    });

    var facebook  = new FacebookPlugin();

    $('#register .confirmar').unbind('click').click(function(ev){
        ev.preventDefault();

        var ok=true;
        if($('#register .username').val()==''){
            ok=false;
            mensaje('El email es requerido.');
            return;
        }
        if( ! validateEmail( $('#register .username').val() ) ){
            ok=false;
            mensaje('El email es incorrecto.');
            return;
        }

        if($('#register .pass1').val()==''){
            ok=false;
            mensaje('La contraseña no puede ser vacía.');
            return;
        }
        if($('#register .pass2').val()==''){
            ok=false;
            mensaje('La confirmación de la contraseña es requerida.');
            return;
        }
        if($('#register .pass1').val() != $('#register .pass2').val()){
            ok=false;
            mensaje('Las contraseñas no coinciden.');
            return;
        }

        if(!ok)return;

        $.ajax({
            async: false,
            url: backend_url + "/users/registro",
            data: getDataRegister(),
            success: function(result) {
                if (result.error) {
                    mensaje(JSON.stringify(result.error));
                    ok = false;
                }else{
                    localStorage.setItem('userInfo', JSON.stringify(result.Default.User) );
                    localStorage.setItem("userId", result.Default.User.id);
                    localStorage.setItem("username", result.Default.User.email);
                    localStorage.setItem("fbLogged", 0);
                    window.location.href="m-inicio.html";
                }
            },
            error:function(error){
                mensaje('Parece haber problemas de conexión.');
                //alert(JSON.stringify(error));
                ok = false;
            }
        });

        if (!ok) {
            return;
        }

        //mensaje('El registro fue correcto. Puede iniciar sesión.');
        //window.history.back();
    });

    $('.fbRegister').unbind('click').click(function(ev){
        ev.preventDefault();

        registerFb();
    });
    
    getProfesionales();
    getPaises();

    /* Cargamos los años en el combo */
    for(i = 1920; i <= 2015; i++) {
        $('#register .anio').prepend($('<option>', { value : i }).text(i));
    }

    
}