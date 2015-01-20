function eventosProveedoresList()
{
    contSync = $('#syncOverlay');
    contSyncMessage = $('#syncOverlay ul');
    contSyncMessage.html('<li class="first"><p>Cargando &nbsp;&nbsp;&nbsp;&nbsp;<img src="img/ajax-loader.gif" /> </p></li>');
    contSync.fadeIn(1000);

    cargarPaises('#m5-pl .dd-pais','#m5-pl .dd-provincia');

    //cargarProveedores();
    contSync.fadeOut();
}


function eventosProveedores(){
    $('#m5-p .ultimo-elemento').on('click', function() {

        $(this).css('margin-bottom', '40px !important');

        $('#m5-p #provForm').fadeIn();

        if( ! jQuery.isEmptyObject( sessionStorage.getItem('username') ) ){
            if( sessionStorage.getItem('username') != 'anonimo'){
                $('.campo.email').val(sessionStorage.getItem('username'));
            }
        }

    });

    $('#m5-p #provForm #theForm').on('submit', function(e){
        $('#m5-p #provForm .sendMail').trigger('click');
        e.preventDefault();
        return false;
    });


    $('#m5-p #provForm .sendMail').on('click', function(e){ //LOGIN

        e.preventDefault();
        showError('vacio');

        var myName = $('.campo.name').val();
        var myEmail = $('.campo.email').val();
        var subject = $('.campo.subject').val();
        var textMsg = $('.campo.textMsg').val();

        var sendOk = 0;

        if($.trim(myName).length === 0 ){
            showError('El nombre es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(myEmail).length === 0 ){
            showError('El correo es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(subject).length === 0){
            showError('El asunto es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(textMsg).length === 0){
            showError('El Mensaje es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if(sendOk){
            showError('Enviando...');

            sendTheMail(myName, myEmail, subject, textMsg);
            //
            //window.plugin.email.isAvailable(
            //    function (isAvailable) {
            //        if (isAvailable) {
            //            /* Puede enviar */
            //            sendTheMail(myName, myEmail, subject, textMsg);
            //        } else {
            //            /* No puede enviar */
            //            alertMsg('No hay ningun correo configurado', '', '', '', '', '');
            //        }
            //    }
            //);
        }

        return;
    });

}

function sendTheMail(name, mail, sub, msg) {
    var to = $('#m5-p .info2 span').html();
    var text = '<p>Contacto desde App Ternium</p><p>Usuario: '+name+' ( '+mail+' )</p><p>Asunto: '+sub+'</p><p>Mensaje: '+msg+'</p>';

    document.location.href = "mailto:"+to+'?subject='+sub+'&body='+text;

    //window.plugin.email.open({
    //    to:      [to],
    //    subject: sub,
    //    body:    text,
    //    isHtml:  true
    //});
}

function showError(msg){
    if(msg == 'vaciar'){
        $('.errors').hide();
        $('.errors p').text('Usuario o contraseña incorrectos');
    }else{
        $('.errors').fadeIn();
        $('.errors p').text(msg);
    }
}