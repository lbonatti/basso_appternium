function eventosProveedoresList() {
    cargarSectores('#m5-pl .dd-sector');
    cargarPaises('#m5-pl .dd-pais','#m5-pl .dd-provincia');
}


function eventosProveedores() {
    $('#m5-p .ultimo-elemento').unbind('click').on('click', function() {
        $(this).css('margin-bottom', '40px !important');

        sendTheMail();
    });
}

function sendTheMail() {
    var to = $('#m5-p .info2 span').html();

    window.plugin.email.isServiceAvailable(
        function (isAvailable) {
            if (isAvailable) {
                window.plugin.email.open({
                    to: [to]
                });
            } else {
                document.location.href = "mailto:"+to;
            }
        }
    );

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