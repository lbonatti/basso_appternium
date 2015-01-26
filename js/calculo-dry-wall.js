var stepCompleted = 0;

function eventosDryWall(){

    if(sessionStorage.getItem('aEditar')){

        var pID = sessionStorage.getItem('aEditar'); //  Tomar id de proy a editar.
        sessionStorage.removeItem('aEditar');  //  Eliminar bandera de edicion.
        var $getEditable = 'SELECT * FROM calculos WHERE _id='+ pID ;
        db_customQuery($getEditable, function(result) {
            if(result.length > 0) {
                var editablePName = result[0].project_name;
                var editablePVars = $.parseJSON(result[0].data).vars;

                // Cargar campos con data.

                // Titulo
                $('#m1-cdw-1 .projectName').text(editablePName);

                // Alto paredes
                $('#m1-cdw-1 .paso1 .i1').val(editablePVars.largoParedes);

                // largo paredes
                $('#m1-cdw-1 .paso1 .i2').val(editablePVars.altoParedes);

                // espesor perfil
                if(editablePVars.espesorPerfil == '1'){
                    $('#m1-cdw-1 .paso1 .espesor .op1').trigger('click');
                }else{
                    $('#m1-cdw-1 .paso1 .espesor .op2').trigger('click');
                }

                // tipo placa
                if(editablePVars.tipoPlaca == '1'){
                    $('#m1-cdw-1 .paso1 .placa .op1').trigger('click');
                }else{
                    $('#m1-cdw-1 .paso1 .placa .op2').trigger('click');
                }

                // ancho cielo raso
                $('#m1-cdw-1 .paso2 .i1').val(editablePVars.largoCieloRaso);

                // largo cielo raso
                $('#m1-cdw-1 .paso2 .i2').val(editablePVars.anchoCieloRaso);


                stepCompleted = 1; // Habilita 2da pestaña

            }else{
                alertMsg('Error al cargar el proyecto', '', 'none', 'Editar Proyecto', 1, function(){
                    $.mobile.changePage("m-mis-calculos.html");
                });
            }
        });


    }else{
        initNuevoCalculoDW();
    }

    $('#m1-cdw-1 .paso1 .siguiente-paso').click(function(){
        dry_wall_save_step1();
    });

    $('#m1-cdw-1 .paso2 .siguiente-paso').click(function(){
        dry_wall_save_step2();
    });

    $('#m1-cdw-1 .pie .p1').click(function(){
        setEstadoPie(1,true);
    });
    $('#m1-cdw-1 .pie .p2').click(function(){
        if(stepCompleted >= 1) {
            $('#m1-cdw-1 .paso1 .siguiente-paso')[0].click();
            setEstadoPie(2, true);
        }else{
            alertMsg('Debe completar los pasos anteriores.','dlg-dw')
            //alert('Debe completar los pasos anteriores.');
        }
    });
    $('#m1-cdw-1 .pie .p3').click(function(){
        if(stepCompleted == 99) {
            $('#m1-cdw-1 .paso2 .siguiente-paso')[0].click();
            setEstadoPie(3, true);
        }else{
            alertMsg('Debe completar los pasos anteriores.','dlg-dw')
        }
    });

    $('.paso1').show();
    $('.paso2, .paso3').hide();

    eventosCalculosGenerales();

    setEstadoPie(1,true);

    $('#back-dw').on('click',function(e){
        e.preventDefault();
        if(pasoSTactual>1){
            setEstadoPie(pasoSTactual-1);
        }else{
            window.history.back();
        }
    });



}

function dry_wall_save_step1(){
    var largoParedes = $.trim( $('#m1-cdw-1 .paso1 .i1').val() );
    var altoParedes = $.trim( $('#m1-cdw-1 .paso1 .i2').val() );
    var espesorPerfil = $('#m1-cdw-1 .paso1 .espesor .selected').data('value');
    var tipoPlaca = $('#m1-cdw-1 .paso1 .placa .selected').data('value');

    if( largoParedes.length === 0 || isNaN( largoParedes ) ){
        alertMsg('Debe ingresar el largo de las paredes interiores (numérico con punto decimal).','dlg-dw');
        $(this).val('');
        return;
    }else if( altoParedes.length === 0 || isNaN( altoParedes ) ){
        alertMsg('Debe ingresar el ancho las paredes interiores (numérico con punto decimal).','dlg-dw');
        $(this).val('');
        return;
    }else{
        sessionStorage.setItem("dw-s1-lp", largoParedes);
        sessionStorage.setItem("dw-s1-ap", altoParedes);
        sessionStorage.setItem("dw-s1-ep", espesorPerfil);
        sessionStorage.setItem("dw-s1-tp", tipoPlaca);
        if(stepCompleted < 1){
            stepCompleted = 1;
        }
        setEstadoPie(2,false);
    }
}
function dry_wall_save_step2(){
    var largoCieloRaso = $.trim( $('#m1-cdw-1 .paso2 .i1').val() );
    var anchoCieloRaso = $.trim( $('#m1-cdw-1 .paso2 .i2').val() );

    if( largoCieloRaso.length === 0 || isNaN( largoCieloRaso ) ){
        alertMsg('Debe ingresar el largo del cielo raso (numérico con punto decimal).','dlg-dw');
        $(this).val('');
        return;
    }else if( anchoCieloRaso.length === 0 || isNaN( anchoCieloRaso ) ){
        alertMsg('Debe ingresar el ancho del cielo raso (numérico con punto decimal).','dlg-dw');
        $(this).val('');
        return;
    }else{
        sessionStorage.setItem("dw-s2-lcr", largoCieloRaso);
        sessionStorage.setItem("dw-s2-acr", anchoCieloRaso);
        if(stepCompleted < 2){
            stepCompleted = 2;
        }
        setEstadoPie(3,false);
        dw_calculateResult();
    }
}


function dw_calculateResult(){
    stepCompleted = 99;
    var largoParedes = parseFloat(sessionStorage.getItem('dw-s1-lp'));
    var altoParedes = parseFloat(sessionStorage.getItem('dw-s1-ap'));
    var espesorPerfil = parseFloat(sessionStorage.getItem('dw-s1-ep'));
    var tipoPlaca = parseFloat(sessionStorage.getItem('dw-s1-tp'));
    var largoCieloRaso = parseFloat(sessionStorage.getItem('dw-s2-lcr'));
    var anchoCieloRaso = parseFloat(sessionStorage.getItem('dw-s2-acr'));

    var espesorPerfilValor = 70;
    if(espesorPerfil == 1){
        espesorPerfilValor = 35;
    }

    var montantePaneles = dw_montante_paneles_interiores(largoParedes, altoParedes);
    var soleraPaneles = dw_solera_paneles_interiores(altoParedes);
    var aislacion = dw_aislacion(largoParedes, altoParedes);
    var yesoParedes = dw_yeso_paredes(largoParedes, altoParedes);
    var yesoCieloRaso = dw_yeso_cielo_raso(largoCieloRaso, anchoCieloRaso);
    var tornillosT1 = dw_tornillosT1(largoParedes, altoParedes);
    var tornillosT2 = dw_tornillosT2(largoParedes, altoParedes);

    $('#m1-cdw-1 .montante b').html(espesorPerfilValor + ' cm.');
    $('#m1-cdw-1 .montantePaneles').html(montantePaneles + ' ml.');

    $('#m1-cdw-1 .solera b').html(espesorPerfilValor + ' cm.');
    $('#m1-cdw-1 .soleraPaneles').html(soleraPaneles + ' ml.');

    $('#m1-cdw-1 .soleraAislacion').html(aislacion + ' m<sup>2</sup>.');

    $('#m1-cdw-1 .soleraYesoParedes').html(yesoParedes + ' m<sup>2</sup>.');
    $('#m1-cdw-1 .soleraYesoCielorrasos').html(yesoCieloRaso + ' m<sup>2</sup>.');

    $('#m1-cdw-1 .tornillosT1').html(tornillosT1 + ' U.');
    $('#m1-cdw-1 .tornillosT2').html(tornillosT2 + ' U.');
}

function saveNewCalcDryWall(showMessage) {
    var calculos;
    var currentTime = getCurrentTime();
    sessionStorage.setItem('calculos', JSON.stringify( {"tipo": { "dry_wall": {}  } } ) );
    calculos = $.parseJSON(sessionStorage.calculos);

    var $_name = sessionStorage.getItem('projectName');
    var $_largoParedes = sessionStorage.getItem('dw-s1-lp');
    var $_altoParedes = sessionStorage.getItem('dw-s1-ap');
    var $_espesorPerfil = sessionStorage.getItem('dw-s1-ep');
    var $_tipoPlaca = sessionStorage.getItem('dw-s1-tp');
    var $_largoCieloRaso = sessionStorage.getItem('dw-s2-lcr');
    var $_anchoCieloRaso = sessionStorage.getItem('dw-s2-acr');

    //Si hay datos en CALCULOS, concatenamos el nuevo proyecto
    calculos.tipo.dry_wall[$_name] =
    {
        "vars": {
            "largoParedes": $_largoParedes,
            "altoParedes": $_altoParedes,
            "espesorPerfil": $_espesorPerfil,
            "tipoPlaca": $_tipoPlaca,
            "largoCieloRaso": $_largoCieloRaso,
            "anchoCieloRaso": $_anchoCieloRaso
        }
    }

    sessionStorage.setItem('calculos', JSON.stringify(calculos));

    //Aquí procesaremos el web services que guardará el calculo en la BD
    //Mandamos el string de JSON a la BD -> ¡¡¡ SOLO EL STRING DEL CALCULO  !!!
    // ID calculo, ID usuario, tipo de calculo (1=SF, 2=DW, 3=T), json con los datos del calculo
    // con el success del ajax (guardado en la BD remota) cambiamos el valor sinc = 1 del calculo en sessionStorage
    var $user = sessionStorage.getItem('username');
    var $dataSaveBD = JSON.stringify(calculos.tipo.dry_wall[$_name]);
    var $calcType = 2;
    if (estadoST == 0) { //Si el calculo es nuevo
        //Guardamos en bd local el calculo
        var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id']
        if (logged == true) {
            var values = [localStorage.getItem('userId'),$_name,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        alertMsg('Nuevo calculo '+$_name+' guardado', '', 'none', 'Guardar Calculo', 1);
                        $('.boton.saveCalc').fadeOut(600);
                    }
                    newSave = 1;
                } else {
                    if (showMessage !== 0) {
                        alertMsg('No se ha podido guardar','dlg-dw');
                    }
                }
            })
        } else {
            var values = [0,$_name,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        alertMsg('Nuevo calculo '+$_name+' guardado', '', 'none', 'Guardar Calculo', 1);
                        $('.boton.saveCalc').fadeOut(600);
                    }
                    newSave = 1;
                } else {
                    if (showMessage !== 0) {
                        alertMsg('No se ha podido guardar','dlg-dw');
                    }
                }
            })
        }
    } else if(estadoST == 2) { //Si el calculo ya existe y fue editado
        var pName = sessionStorage.getItem('projectName');
        var $query = 'UPDATE calculos SET data=\''+$dataSaveBD+'\', modified=\''+currentTime+'\', sync=0 WHERE project_name=\''+pName+'\' AND user_id='+localStorage.getItem('userId')+' AND calc_type='+$calcType;
        db_updateQueryEdit($query, function(result,updatedID) {
            if(result == 'ok'){
                if (showMessage !== 0) {
                    alertMsg('El calculo '+$_name+' ha sido editado', '', 'none', 'Editar Calculo', 1);
                    $('.boton.saveCalc').fadeOut(600);
                }
                modoLectura();
                newSave = 1;
            }
        })
    }
    // Si el usuario es anonimo, solo tendremos acceso a la variable local, asi que no haremos nada.
    // por que los datos ya se encuentran en sessionStorage. (y le dejamos el sync en 0 para cuando loguee mandar
    // los calculos a la BD remota)
    estadoST = 1;
    $('#back-sf').hide();

    animateBtnEnd( 'saveCalc' , 'Guardar calculo ');
}

function initNuevoCalculoDW(){
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
    pasoSTmaximo = 2;
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
function dw_yeso_paredes(largoPI, altoPI){
    var result = 0;
    result = Math.ceil( ( ( largoPI * altoPI ) * 2 ) * 1 );
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
function dw_tornillosT2(largoPI, altoPI){
    var result = 0;
    result = Math.ceil( ( largoPI * altoPI ) * 30 );
    return result;
}

function generateDivRenderDW(){

    var filename = sessionStorage.getItem('username') + '_dry-wall_' + sessionStorage.getItem('projectName');
    viewPDF(filename, 'dry-wall');

}