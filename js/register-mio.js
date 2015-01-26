function eventosRegister(){
    $('#register .page-back').click(function(){
        window.history.back();
    });

    var facebook  = new FacebookPlugin();

    $('#register .confirmar').click(function(ev){
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
                }
                localStorage.setItem('userInfo', JSON.stringify(result.Default.User) );
                localStorage.setItem("userId", result.Default.User.id);
                localStorage.setItem("username", result.Default.User.email);
                localStorage.setItem("fbLogged", 0);
                window.location.href="m-inicio.html";
            },
            error:function(error){
                alert(JSON.stringify(error));
            }
        });

        if (!ok) {
            return;
        }

        //mensaje('El registro fue correcto. Puede iniciar sesión.');
        //window.history.back();
    });

    $('.fbRegister').click(function(ev){
        ev.preventDefault();

        registerFb();
    });

    $('.pais').change(function(){
        getProvincia($(this).val());
    });

    getProfesionales();
    getPaises();


}