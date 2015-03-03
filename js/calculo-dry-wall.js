var stepCompleted = 0;

function eventosDryWall()
{
    if (sessionStorage.getItem('aEditar')) {

        var pID = sessionStorage.getItem('aEditar'); //  Tomar id de proy a editar.
        sessionStorage.setItem('editardesderesumen', pID);
        sessionStorage.removeItem('aEditar');  //  Eliminar bandera de edicion.

        var $getEditable = 'SELECT * FROM calculos WHERE _id='+ pID ;
        db_customQuery($getEditable, function(result) {
            if(result.length > 0) {
                var editablePName = result[0].project_name;
                var editablePVars = $.parseJSON(result[0].data).vars;
                
                var _version = result[0].version;
                sessionStorage.setItem('editar_version', (_version != '' ? _version : 1));

                // Cargar campos con data.
                // Titulo
                $('#m1-cdw-1 .projectName').text(editablePName);

                // Alto paredes
                $('#m1-cdw-1 .paso1 .i1').val(editablePVars.largoParedes);

                // largo paredes
                $('#m1-cdw-1 .paso1 .i2').val(editablePVars.altoParedes);

                // espesor perfil
                if (editablePVars.espesorPerfil == '1') {
                    $('#m1-cdw-1 .paso1 .espesor .op1').trigger('click');
                } else {
                    $('#m1-cdw-1 .paso1 .espesor .op2').trigger('click');
                }

                // tipo placa
                if (editablePVars.caraPlaca == '1') {
                    $('#m1-cdw-1 .paso1 .placa .op3').trigger('click');
                } else {
                    $('#m1-cdw-1 .paso1 .placa .op4').trigger('click');
                }

                if (editablePVars.tipoPlaca == '1') {
                    $('#m1-cdw-1 .paso1 .placa .op1').trigger('click');
                } else {
                    $('#m1-cdw-1 .paso1 .placa .op2').trigger('click');
                }
                stepCompleted = 1; // Habilita 2da pestaña

            } else {
                alertMsg('Error al cargar el proyecto', '', 'none', 'Editar Proyecto', 1, function(){
                    $.mobile.changePage("m-mis-calculos.html");
                });
            }
        });
        estadoST = 2;
    } else {
        initNuevoCalculoDW();
        $('.paso.paso1').show();
        $('.paso.paso2').hide();
    }

    $('#m1-cdw-1 .paso1 .siguiente-paso').unbind('click').click(function() {
        dry_wall_save_step1();
    });

    $('#m1-cdw-1 .pie .p1').unbind('click').click(function() {
        if( ! $(this).hasClass('disabled') ) {
            setEstadoPie(1, true);
        } else {
            $('.menu-options div.editar').trigger('click');
        }
    });

    /*
    $('#m1-cdw-1 .pie .p2').unbind('click').click(function() {
        if (stepCompleted == 99) {
            setEstadoPie(2, true);
        } else {
            alertMsg('Debe completar los pasos anteriores.','dlg-dw')
        }
    });
    */

    eventosCalculosGenerales();

    setEstadoPie(1, true);

    if (sessionStorage.getItem('aResumen') && sessionStorage.getItem('aResumen') == 1) {
        setTimeout(function () {
            $('.paso.paso1').hide();
            $('.paso.paso2').show();
            dry_wall_save_step1();
            modoLectura(2);
            sessionStorage.removeItem('aResumen');
        }, 600);
    }
}

function dry_wall_save_step1()
{
    var largoParedes = $.trim( $('#m1-cdw-1 .paso1 .i1').val() );
    var altoParedes = $.trim( $('#m1-cdw-1 .paso1 .i2').val() );
    var espesorPerfil = $('#m1-cdw-1 .paso1 .espesor .selected').data('value');
    var carasPlaca;
    if( $('#m1-cdw-1 .paso1 .placa .op3').hasClass('selected') ){
        carasPlaca = $('#m1-cdw-1 .paso1 .placa .op3').data('value');
    }else{
        carasPlaca = $('#m1-cdw-1 .paso1 .placa .op4').data('value');
    }

    var tipoPlaca;
    if( $('#m1-cdw-1 .paso1 .placa .op1').hasClass('selected') ){
        tipoPlaca = $('#m1-cdw-1 .paso1 .placa .op1').data('value');
    }else{
        tipoPlaca = $('#m1-cdw-1 .paso1 .placa .op2').data('value');
    }


    if (largoParedes.length === 0 || isNaN(largoParedes)) {
        alertMsg('Debe ingresar el largo de las paredes interiores (numérico con punto decimal).','dlg-dw');
        $(this).val('');

        return;
    } else if(altoParedes.length === 0 || isNaN(altoParedes)) {
        alertMsg('Debe ingresar el ancho las paredes interiores (numérico con punto decimal).','dlg-dw');
        $(this).val('');

        return;
    } else {
        sessionStorage.setItem("dw-s1-lp", largoParedes);
        sessionStorage.setItem("dw-s1-ap", altoParedes);
        sessionStorage.setItem("dw-s1-ep", espesorPerfil);
        sessionStorage.setItem("dw-s1-tp", tipoPlaca);
        sessionStorage.setItem("dw-s1-cp", carasPlaca);
        if (stepCompleted < 1) {
            stepCompleted = 1;
        }
        setEstadoPie(2, true);

        dw_calculateResult();
    }
}

function dw_calculateResult()
{
    stepCompleted = 99;
    var largoParedes = parseFloat(sessionStorage.getItem('dw-s1-lp'));
    var altoParedes = parseFloat(sessionStorage.getItem('dw-s1-ap'));
    var espesorPerfil = parseFloat(sessionStorage.getItem('dw-s1-ep'));
    var tipoPlaca = parseFloat(sessionStorage.getItem('dw-s1-tp'));
    var carasPlaca = parseFloat(sessionStorage.getItem('dw-s1-cp'));

    var espesorPerfilValor = 70;
    if (espesorPerfil == 1) {
        espesorPerfilValor = 35;
    }

    var montantePaneles = dw_montante_paneles_interiores(largoParedes, altoParedes);
    var soleraPaneles = dw_solera_paneles_interiores(altoParedes);
    var aislacion = dw_aislacion(largoParedes, altoParedes);
    var yesoParedes = dw_yeso_paredes(largoParedes, altoParedes, carasPlaca, tipoPlaca);
    var tornillosT1 = dw_tornillosT1(largoParedes, altoParedes);
    var tornillosT2 = dw_tornillosT2(yesoParedes);

    // Fin de calculo, para mostrar redondeo
    yesoParedes = Math.ceil(yesoParedes);

    //Cargar resumen de datos ingresados.
    $('#m1-cdw-1 .paso2 .item10 .altura .medida').html(altoParedes + ' m.');
    $('#m1-cdw-1 .paso2 .item10 .largo .medida').html(largoParedes + ' m.');
    $('#m1-cdw-1 .paso2 .item11 .medida').html(espesorPerfilValor);

    if( carasPlaca == '1' ){
        $('#m1-cdw-1 .paso2 .item12 .cara .texto').html('1 Cara');
    }else{
        $('#m1-cdw-1 .paso2 .item12 .cara .texto').html('2 Caras');
    }

    if( tipoPlaca == '1' ){
        $('#m1-cdw-1 .paso2 .item12 .ultimo .texto').html('Placa Simple');
    }else{
        $('#m1-cdw-1 .paso2 .item12 .ultimo .texto').html('Placa Doble');
    }



    $('#m1-cdw-1 .montante b').html(espesorPerfilValor + ' cm.');
    $('#m1-cdw-1 .montantePaneles').html(montantePaneles + ' ml.');

    $('#m1-cdw-1 .solera b').html(espesorPerfilValor + ' cm.');
    $('#m1-cdw-1 .soleraPaneles').html(soleraPaneles + ' ml.');

    $('#m1-cdw-1 .soleraAislacion').html(aislacion + ' m<sup>2</sup>.');

    $('#m1-cdw-1 .soleraYesoParedes').html(yesoParedes + ' m<sup>2</sup>.');

    $('#m1-cdw-1 .tornillosT1').html(tornillosT1 + ' U.');
    $('#m1-cdw-1 .tornillosT2').html(tornillosT2 + ' U.');

    // cambio el valor de label de montante y solera
    var $espesorPerfil = sessionStorage.getItem("dw-s1-ep");
    var $cm = 35;
    //console.log(sessionStorage.getItem("dw-s1-ep"));
    if ($espesorPerfil) {
        switch ($espesorPerfil) {
            case '1':
                $cm = 35;
                break;
            case '2':
                $cm = 70;
                break;
        }
        $('.resultado.montante .texto').html('1. Montante '+$cm+'cm');
        $('.resultado.solera .texto').html('2. Solera '+$cm+'cm');
    }

    if (sessionStorage.getItem('aResumen') != 1 ){
        saveNewCalcDryWall(1);
    }
}

function saveNewCalcDryWall(showMessage)
{
    var calculos;
    var currentTime = getCurrentTime();
    sessionStorage.setItem('calculos', JSON.stringify({"tipo": {"dry_wall": {}}}));
    calculos = $.parseJSON(sessionStorage.calculos);

    var $_name = sessionStorage.getItem('projectName');
    var $_largoParedes = sessionStorage.getItem('dw-s1-lp');
    var $_altoParedes = sessionStorage.getItem('dw-s1-ap');
    var $_espesorPerfil = sessionStorage.getItem('dw-s1-ep');
    var $_tipoPlaca = sessionStorage.getItem('dw-s1-tp');
    var $_caraPlaca = sessionStorage.getItem('dw-s1-cp');

    //Si hay datos en CALCULOS, concatenamos el nuevo proyecto
    calculos.tipo.dry_wall[$_name] =
    {
        "vars": {
            "largoParedes": $_largoParedes,
            "altoParedes": $_altoParedes,
            "espesorPerfil": $_espesorPerfil,
            "tipoPlaca": $_tipoPlaca,
            "caraPlaca": $_caraPlaca
        }
    };

    sessionStorage.setItem('calculos', JSON.stringify(calculos));

    //Aquí procesaremos el web services que guardará el calculo en la BD
    //Mandamos el string de JSON a la BD -> ¡¡¡ SOLO EL STRING DEL CALCULO  !!!
    // ID calculo, ID usuario, tipo de calculo (1=SF, 2=DW, 3=T), json con los datos del calculo
    // con el success del ajax (guardado en la BD remota) cambiamos el valor sinc = 1 del calculo en sessionStorage
    var $user = localStorage.getItem('username');
    var $dataSaveBD = JSON.stringify(calculos.tipo.dry_wall[$_name]);
    var $calcType = 2;
    if (estadoST == 0) { //Si el calculo es nuevo
        //Guardamos en bd local el calculo
        var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id','version']
        if (logged == true) {
            var values = [localStorage.getItem('userId'),$_name,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0,1]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(2); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        //alertMsg('Nuevo calculo '+$_name+' guardado', '', 'none', 'Guardar Calculo', 1);
                        alertMsg('Nuevo calculo guardado', '', 'none', 'Felicitaciones', 1);
                    }
                    sessionStorage.setItem('newSave', 1);
                } else {
                    if (showMessage !== 0) {
                        alertMsg('No se ha podido guardar','dlg-dw');
                    }
                }
            })
        } else {
            var values = [0,$_name,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0,1]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(2); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        //alertMsg('Nuevo calculo '+$_name+' guardado', '', 'none', 'Guardar Calculo', 1);
                        alertMsg('Nuevo calculo guardado', '', 'none', 'Felicitaciones', 1);
                        $('.boton.saveCalc').fadeOut(600);
                    }
                    sessionStorage.setItem('newSave', 1);
                } else {
                    if (showMessage !== 0) {
                        alertMsg('No se ha podido guardar','dlg-dw');
                    }
                }
            })
        }
    } else if(estadoST == 2) { //Si el calculo ya existe y fue editado
        var pName = sessionStorage.getItem('projectName');

        //var $query = 'UPDATE calculos SET data=\''+$dataSaveBD+'\', modified=\''+currentTime+'\', sync=0 WHERE project_name=\''+pName+'\' AND user_id='+localStorage.getItem('userId')+' AND calc_type='+$calcType;
        var _version = (parseInt(sessionStorage.getItem('editar_version')) + 1);
        var $query = 'UPDATE calculos SET version=' + _version + ', modified=\''+currentTime+'\', sync=0 WHERE _id=\''+sessionStorage.getItem('editardesderesumen')+'\' AND user_id='+localStorage.getItem('userId')+' AND calc_type='+$calcType;

        db_updateQueryEdit($query, function(result,updatedID) {
            if(result == 'ok'){
                if (showMessage !== 0) {
                    alertMsg('Felicitaciones el cálculo "'+$_name+'" ha sido editado.', '', 'none', 'Cálculo editado', 1);
                }
                modoLectura(2);
                sessionStorage.setItem('newSave', 1);
            }
        })

        var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id','version']
        var values = [localStorage.getItem('userId'),$_name + ' v' + _version,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0,1];
        db_insert('calculos',fields, values,'',function(result){
            // No hacemos nada
        })


    }
    // Si el usuario es anonimo, solo tendremos acceso a la variable local, asi que no haremos nada.
    // por que los datos ya se encuentran en sessionStorage. (y le dejamos el sync en 0 para cuando loguee mandar
    // los calculos a la BD remota)
    estadoST = 1;

    animateBtnEnd('saveCalc' , 'Guardar calculo ');
}

function initNuevoCalculoDW(){
    stepCompleted = 0;
    tipoC='dw';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;
    $('#m1-cdw-1 .projectName').html(sessionStorage.getItem("projectName"));
}
function initEditarCalculoDW(){
    tipoC='dw';
    estadoST=2;
    pasoSTactual = 1;
    pasoSTmaximo = 1;
    $('#m1-cdw-1 .paso input[type=number]').removeAttr('disabled');
}

function dw_montante_paneles_interiores(largoPI, alturaPI){
    var result = 0;
    result = Math.ceil( (largoPI / 0.4) * alturaPI * 1 );
    return result;
}
function dw_solera_paneles_interiores(largoPI){
    var result = 0;
    result = Math.ceil( largoPI * 2 );
    return result;
}
function dw_aislacion(largoPI, altoPI){
    var result = 0;
    result = Math.ceil( largoPI * altoPI * 1 );
    return result;
}
function dw_yeso_paredes(largoPI, altoPI, caras, tipo){
    var dig2 = 0;
    var dig3 = 0;
    var dig4 = 0;
    var sumaDig = 0;
    var result = 0;

    if (caras == '2'){
        dig2 = 1;
        dig4 = 1;
    }
    if (tipo == '1'){
        dig3 = 1;
    }
    if (tipo == '2'){
        dig4 += 2;
    }
    sumaDig = dig2 + dig3 + dig4;

    result = ( ( largoPI * altoPI ) * sumaDig ) * 1.15;

    return result;
}
function dw_yeso_cielo_raso(largoCR, anchoCR){
    var result = 0;
    result = Math.ceil( ( largoCR * anchoCR ) * 1 );
    return result;
}
function dw_tornillosT1(largoPI, altoPI){
    var result = 0;
    result = Math.ceil( ( largoPI * altoPI ) * 10 );
    return result;
}
function dw_tornillosT2(placaYeso){
    var result = 0;
    result = Math.ceil( placaYeso * 30 );
    return result;
}

function generateDivRenderDW(){

    var filename = localStorage.getItem('username') + '_dry-wall_' + sessionStorage.getItem('projectName');
    viewPDF(filename, 'dry-wall');

}