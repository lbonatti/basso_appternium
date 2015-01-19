/*
 * Created by Riter on 28/10/14.
 */

function getProfesionales(){
    $.ajax({
        url:"http://html5cooks.com/ternium/ternium/profesiones/lists",
        data:{},
        success:function(result){
            $('#register .profesion').empty();
            $.each(result.Default, function(key, value) {

                $('#register .profesion').append($('<option>', { value : value.Profesione.id }).text(value.Profesione.nombre));

            });
        },
        error:function(error){
            //alert(JSON.stringify(error));
        }
    });
}
function getPaises(){
    $.ajax({
        url:"http://html5cooks.com/ternium/ternium/paises/lists",
        data:{},
        success:function(result){
            $('#register .pais').empty();
            $.each(result.Default, function(key, value) {

                $('#register .pais').append($('<option>', { value : value.Paise.id }).text(value.Paise.nombre));

            });
        },
        error:function(error){
            //alert(JSON.stringify(error));
        }
    });
}

function getProvincia(id){
    $.ajax({
        url:"http://html5cooks.com/ternium/ternium/provincias/lists",
        data:{id: id},
        success:function(result){
            $('#register .provincia').empty();
            $.each(result.Default, function(key, value) {
                $('#register .provincia').append($('<option>', { value : value.Provincia.id }).text(value.Provincia.nombre));

            });
        },
        error:function(error){
            //alert(JSON.stringify(error));
        }
    });
}

function getDataRegister(){
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
    var userEmail = sessionStorage.getItem("username");
    var userID = sessionStorage.getItem("userId");
    var lastName = sessionStorage.getItem("last_name");
    var firstName = sessionStorage.getItem("first_name");
    var birthDate = sessionStorage.getItem("birthday");
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
            sessionStorage.setItem("fbLogged", 1);
            switchFbId();
            window.location.href = "m-inicio.html";
        },
        error: function(error) {
            mensaje('El registro no se pudo realizar.');
            JSON.stringify(error);
        }
    });
}

