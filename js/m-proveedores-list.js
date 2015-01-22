function eventosProveedoresList() {
    contSync = $('#syncOverlay');
    contSyncMessage = $('#syncOverlay ul');
    contSyncMessage.html('<li class="first"><p>Cargando &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span></p></li>');
    contSync.fadeIn(0);

    cargarPaises('#m5-pl .dd-pais','#m5-pl .dd-provincia');

    contSync.fadeOut(0);
}


function eventosProveedores() {
    $('#m5-p .ultimo-elemento').on('click', function() {
        $(this).css('margin-bottom', '40px !important');

        sendTheMail();
    });
}

function sendTheMail() {
    var to = $('#m5-p .info2 span').html();

    document.location.href = "mailto:"+to;
}

function showError(msg) {
    if (msg == 'vaciar') {
        $('.errors').hide();
        $('.errors p').text('Usuario o contraseña incorrectos');
    } else {
        $('.errors').fadeIn();
        $('.errors p').text(msg);
    }
}