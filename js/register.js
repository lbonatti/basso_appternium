function getProfesionales() {
    var profesionales = JSON.parse(localStorage.getItem('profesionales'));

    $('#register .profesion').empty();

    $.each(profesionales, function(key, value) {
        $('#register .profesion').append($('<option>', { value : value.Profesione.id }).text(value.Profesione.nombre));
    });
}

function getPaises() {
    var paises = JSON.parse(localStorage.getItem('paises'));

    $('#register .pais').empty();

    $.each(paises, function(key, value) {
        $('#register .pais').append($('<option>', { value : value.Paise.id }).text(value.Paise.nombre));
    });
}

function getProvincia(id) {
    $.ajax({
        url: backend_url + '/provincias/lists',
        data:{
            id: id
        },
        success:function(result) {
            $('#register .provincia').empty();
            $.each(result.Default, function(key, value) {
                $('#register .provincia').append($('<option>', { value : value.Provincia.id }).text(value.Provincia.nombre));

            });
        },
        error:function(error) {
            //alert(JSON.stringify(error));
        }
    });
}

function getDataRegister() {
    return {
        //nombre: $('').val(),
        //apellido: $('').val(),
        nombre: 'default',
        apellido: 'default',

        email: $('#register .username').val(),
        //telefono: $('').val(),
        fecha_nacimiento: $('#register .anio').val() +'-'+ $('.mes').val() +'-'+ $('.dia').val(),
        username: $('#register .username').val(),
        password: $('#register .password').val(),
        pais_id: $('#register .pais').val(),
        provincia_id: $('#register .provincia').val(),
        profesion_id: $('#register .profesion').val(),
        role: 2
    };
}

function getDataFbRegister() {
    var userEmail = localStorage.getItem("username");
    var userID = localStorage.getItem("userId");
    var lastName = localStorage.getItem("last_name");
    var firstName = localStorage.getItem("first_name");
    var birthDate = localStorage.getItem("birthday");
    var $pais_id;

    $.ajax({
        async: false,
        url: backend_url+"/paises/get_default",
        success: function(result) {
            $pais_id = JSON.stringify(parseInt(result.result));
        },
        error: function(result) {
            alert(JSON.stringify(result));
        }
    });

    if (!$pais_id) {
        return;
    }

    var data = {
        uid: userID,
        nombre: firstName,
        apellido: lastName,
        email: userEmail,
        username: userEmail,
        fecha_nacimiento: birthDate,
        password: 'default',
        pais_id: $pais_id,
        role: 2
    };

    $.ajax({
        url: backend_url+"/users/registro",
        data: data,
        success: function(result) {
            localStorage.setItem("fbLogged", 1);
            switchFbId(userID);
            
            sessionStorage.setItem('newSave', 1);
            window.location.href="sync.html";
        },
        error: function(error) {
            mensaje('El registro no se pudo realizar.');
            JSON.stringify(error);
        }
    });
}