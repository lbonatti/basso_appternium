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

        /*
        $.ajax({
            url:"http://html5cooks.com/ternium/ternium/users/registro",
            data: getDataRegister(),
            success:function(result){
                alert(JSON.stringify(result));
            },
            error:function(error){
                alert(JSON.stringify(error));
            }
        });*/
        mensaje('El registro fue correcto. Puede iniciar sesión.');
        window.history.back();

    });

    $('.ingreso-fb').click(function(ev){
        ev.preventDefault();




        var data = getDataRegister();

        facebook.FBLoginStatus(function(response){
            if(response){
                data['uid'] = response.userID;
                $.ajax({
                    url:"http://html5cooks.com/ternium/ternium/users/registro",
                    data: data,
                    success:function(result){
                        alert(JSON.stringify(result));
                    },
                    error:function(error){
                        alert(JSON.stringify(error));
                    }
                });
            }else{
                facebook.FBLogin(function(response){
                    data['uid'] = response.userID;
                    $.ajax({
                        url:"http://html5cooks.com/ternium/ternium/users/registro",
                        data: data,
                        success:function(result){
                            alert(JSON.stringify(result));
                        },
                        error:function(error){
                            alert(JSON.stringify(error));
                        }
                    });
                });
            }
        });
    });

    $('.pais').change(function(){
        getProvincia($(this).val());
    });

    getProfesionales();
    getPaises();


}