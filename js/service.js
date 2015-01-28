var paisesDropDown, paisesJson;

function precargarPaises() {
    paisesDropDown = "";
    paisesJson = JSON.parse(localStorage.getItem('paises'));
    $.each(paisesJson, function(key, val) {
        var sel = "";
        if (val.Paise.id == 18) {
            sel = 'selected';
        }
        paisesDropDown += '<option value="'+val.Paise.id+'" '+sel+'>'+val.Paise.nombre+'</option>';
    });
}

function cargarProveedores() {
    var idProv = $('#m5-pl .dd-provincia').val();
    var r = "";
    var proveedores = JSON.parse(localStorage.getItem('proveedores'));

    $('#m5-pl .proveedor').remove();

    $.each(proveedores, function(key, val) {
        if (val.Proveedore.provincia_id == idProv) {
            r += '<div class="proveedor" data-id="'+val.Proveedore.id+'">';
            r += '<div class="nombre">'+val.Proveedore.nombres+'</div>';
            r += '<div class="detalle">'+val.Proveedore.direccion+'</div>';
            r += '<div class="detalle">'+val.Proveedore.telefono+'</div>';
            r += '</div>';
        }
    });
    $('#m5-pl .page-content').append(r);

    $('#m5-pl .proveedor').click(function() {
        sessionStorage.idProveedor = $(this).attr('data-id');
        $.mobile.changePage('m-proveedores.html');
    });
}

function cargarPaises(ddPais,ddProvincia){
    $(ddPais).html(paisesDropDown);
    $(ddPais).change(function(){
        var idPais=$(this).val();
        $(ddProvincia+' option').remove();

        $.each( paisesJson , function( key, val ) {
            if(val.Paise.id==idPais){
                var prov="";
                $.each( val.Provincia , function( keyP, valP ) {
                    prov+='<option value="'+valP.id+'">'+valP.nombre+'</option>';
                });
                $(ddProvincia).html(prov);
            }
        });

        cargarProveedores();
    });

    $(ddProvincia).change(function(){
        cargarProveedores();
    });

    $(ddPais).change();

}

function cargarProveedor() {
    var idProveedor = sessionStorage.idProveedor;
    var proveedores = JSON.parse(localStorage.getItem('proveedores'));

    $.each(proveedores, function(key, val) {
        if (val.Proveedore.id == idProveedor) {
            $('#m5-p .titulo').html(val.Proveedore.nombres);
            $('#m5-p .subtitulo').html(val.Proveedore.direccion);
            $('#m5-p .descripcion').html(val.Proveedore.descripcion);
            $('#m5-p .info1 span').html(val.Proveedore.telefono);
            $('#m5-p .info2 span').html(val.Proveedore.email);
        }
    });
}