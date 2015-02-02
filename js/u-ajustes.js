function eventosEditarPerfil(){

    $('.alertMsg.editField .boton').unbind();
    $('.alertMsg.editField .boton').unbind('click');

    loadFields();

    $('#u-ajustes .firstName .icono').on('click', function(){
        editFirstName();
    });

    $('#u-ajustes .lastName .icono').on('click', function(){
        editLastName();
    });

    $('#u-ajustes .email .icono').on('click', function(){
        editEmail();
    });

    $('#u-ajustes .pwd .icono').on('click', function(){
        editPwd();
    });

}

function loadFields(){

    var fbLogged = localStorage.getItem('fbLogged');
    var firstName = $('#u-ajustes .firstName .subtitulo');
    var lastName = $('#u-ajustes .lastName .subtitulo');
    var email = $('#u-ajustes .email .subtitulo');

    if(fbLogged == 0){
        $('#u-ajustes .email, #u-ajustes .pwd').show();
        firstName.text($.parseJSON(localStorage.userInfo).nombre);
        lastName.text($.parseJSON(localStorage.userInfo).apellido);
        email.text($.parseJSON(localStorage.userInfo).email);
    }else{
        if(localStorage.userInfo){
            firstName.text($.parseJSON(localStorage.userInfo).nombre);
            lastName.text($.parseJSON(localStorage.userInfo).apellido);
        }else{
            mensaje('No se pudieron recuperar los datos de Facebook');
        }

    }

}


function editFirstName(){
    showEditField('nombre');
}
function editLastName(){
    showEditField('apellido');
}
function editEmail(){
    showEditField('email');
}
function editPwd(){
    showEditField('password');
}

function showEditField(field){
    switch (field){
        case 'nombre':
            var title = 'Editar Nombre';
            var text = 'Nombre';
            var $saveField = $('#u-ajustes .firstName .subtitulo');
            break;
        case 'apellido':
            var title = 'Editar Apellido';
            var text = 'Apellido';
            var $saveField = $('#u-ajustes .lastName .subtitulo');
            break;
        case 'email':
            var title = 'Editar Email';
            var text = 'Email';
            var $saveField = $('#u-ajustes .email .subtitulo');
            break;
        case 'password':
            var title = 'Editar Password';
            var text = 'Password';
            var $saveField = $('#u-ajustes .pwd .subtitulo');
            break;
    }

    var $html = '';

    $html += '<div class="dialogo alertMsg editField">';

    $html += '<div class="titulo">'+title+'</div>';
    $html += '<div class="mensaje">'+text+'</div>';

    if(field == 'password'){
        $html += '<input type="password" />';
    }else{
        $html += '<input type="text" />';
    }

    $html += '<p class="error">Debe Completar el campo</p>';
    $html += '<div class="boton editOk">Aceptar</div>';
    $html += '<div class="boton closeDialog">Cancelar</div>';

    $html += '</div>'; //Cierra dlg

    $('.shadow').css('height','100%').show();
    $('.snap-content').after($html);

    var $errorMsg = $('.dialogo.editField p.error');

    $('.alertMsg.editField .boton').unbind('click');

    $('.editField').show('fast', function(){

        $('.dialogo.editField .boton.editOk').on('click', function(){
            var theInput = $('.dialogo.editField input').val();
            $errorMsg.hide();

            if($.trim(theInput).length == 0 ){
                $errorMsg.show();
            }else{
                if(field == 'password'){
                    $saveField.text('************');
                }else{
                    $saveField.text( theInput );
                }

                $(this).parent().remove();
                $('.shadow').css('height','0');

                $.ajax({
                    url: backend_url + '/users/editar_usuario?id=' + localStorage.getItem('userId')+'&'+field+'='+theInput,
                    success:function(result){
                        alertMsg('Campo guardado con exito', '', '', 'Editar Perfil', 1);

                        if(field != 'password'){
                            updateFieldInSession(field, theInput);
                        }

                    }
                });
            }

        });

        $('.dialogo.editField .boton.closeDialog').on('click', function(){
            $(this).parent().remove();
            $('.shadow').css('height','0');
        });

    });
}

function updateFieldInSession(field, value){
    var sessionInfo = $.parseJSON(localStorage.userInfo);

    switch (field){
        case 'nombre':
            sessionInfo.nombre = value;
            break;
        case 'apellido':
            sessionInfo.apellido = value;
            break;
        case 'email':
            sessionInfo.email = value;
            break;
    }
    localStorage.setItem('userInfo', JSON.stringify(sessionInfo) );
}




