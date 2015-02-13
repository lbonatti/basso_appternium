var paisesDropDown, paisesJson;
var sectoresDropDown, sectoresJson;
var paisesProveedores = new Array();
var provinciasProveedores = new Array();
var sectoresProvincias = new Array();

function precargarPaises() {
    paisesDropDown = "";
    paisesJson = JSON.parse(localStorage.getItem('paises'));
    
    $.each(paisesJson, function(key, val) {
        var sel = "";
        if (val.Paise.id == 18) {
            sel = 'selected';
        }

        if (paisesProveedores.indexOf(parseInt(val.Paise.id)) != -1)
        {
            paisesDropDown += '<option value="'+val.Paise.id+'" '+sel+'>'+val.Paise.nombre+'</option>';
        }
        
    });
}

function precargarSectores() {
    sectoresDropDown = "";
    sectoresJson = new Array();

    var proveedores = JSON.parse(localStorage.getItem('proveedores'));
    
    sectoresDropDown += '<option value="" >- Seleccione sector -</option>';
    $.each(proveedores, function(key, val) {
        /* Lleno relación entre proveedores y paises */
        _idPais = parseInt(val.Proveedore.pais_id);
        if (paisesProveedores.indexOf(_idPais) < 0) {
            paisesProveedores.push(_idPais);
            provinciasProveedores[_idPais] = [];
        }
        
        /* Lleno relación entre provincias y paises */
        _idProv = parseInt(val.Proveedore.provincia_id);
        if (provinciasProveedores[_idPais].indexOf(_idProv) == -1) {
            _retemp = provinciasProveedores[_idPais];
            _retemp.push(_idProv);
            provinciasProveedores[_idPais] = _retemp;
            
            sectoresProvincias[_idProv] = [];
        }
        
        /* Lleno relación entre sectores y provincias */
        _idSect = val.Proveedore.sector;
        if (sectoresProvincias[_idProv].indexOf(_idSect) == -1) {
            _retemp = sectoresProvincias[_idProv];
            _retemp.push(_idSect);
            sectoresProvincias[_idProv] = _retemp;
        }

        if (sectoresJson.indexOf(val.Proveedore.sector) < 0) {
            sectoresJson.push(val.Proveedore.sector);
        }
    });

}

function cargarSectores(ddSector){
    $(ddSector).html(sectoresDropDown);
    $(ddSector).change(function(){
        cargarProveedores();
    });
}

function cargarProveedores() {
    var idProv = $('#m5-pl .dd-provincia').val();
    var idSector = $('#m5-pl .dd-sector').val();
    if (idSector == null) idSector = '';

    tempSectoresJson = sectoresProvincias[parseInt(idProv)];
    tempSectoresJson.sort();
    sectoresDropDown = '<option value="" >- Seleccione sector -</option>';
    selectorrr = false;
    $.each(tempSectoresJson, function(key, val) {
        var sel = "";
        if (val == idSector) {
            sel = 'selected';
            selectorrr = true;
        }
        sectoresDropDown += '<option value="'+val+'" '+ sel +' >'+ucfirst(val.toLowerCase())+'</option>';
    });
    if (!selectorrr) idSector = '';
    $('#m5-pl .dd-sector').html(sectoresDropDown);

    var r = "";
    var proveedores = JSON.parse(localStorage.getItem('proveedores'));

    $('#m5-pl .proveedor').remove();

    $.each(proveedores, function(key, val) {
        if (val.Proveedore.provincia_id == idProv) {
            if (idSector != '') {
                if (idSector == val.Proveedore.sector) {
                    r += '<div class="proveedor" data-id="'+val.Proveedore.id+'">';
                    r += '<div class="nombre">'+val.Proveedore.nombres+'</div>';
                    r += '<div class="detalle">'+val.Proveedore.direccion+'</div>';
                    r += '<div class="detalle">'+val.Proveedore.telefono+'</div>';
                    r += '</div>';
                }
            } else {
                r += '<div class="proveedor" data-id="'+val.Proveedore.id+'">';
                r += '<div class="nombre">'+val.Proveedore.nombres+'</div>';
                r += '<div class="detalle">'+val.Proveedore.direccion+'</div>';
                r += '<div class="detalle">'+val.Proveedore.telefono+'</div>';
                r += '</div>';
            }
        }
    });
    $('#m5-pl .page-content').append(r);

    $('#m5-pl .proveedor').unbind('click').click(function() {
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
                    if (provinciasProveedores[idPais].indexOf(parseInt(valP.id)) != -1) {
                        prov+='<option value="'+valP.id+'">'+valP.nombre+'</option>';
                    }
                });
                $(ddProvincia).html(prov);
            }
        });
        
        //$('#m5-pl .dd-sector').val('');
        cargarProveedores();
    });

    $(ddProvincia).change(function(){
        //$('#m5-pl .dd-sector').val('');
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