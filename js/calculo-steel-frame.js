var estadoST = 0; // 0=Nuevo   1=SoloLectura   2=Editando
var pasoSTactual = 1;
var pasoSTmaximo = 1;
var tipoC="sf"; // sf dw t
var theSlide = 2;
var stepCompleted = 0;
var aEditar;
var aEditarStepError = 0;
var editablePVars = null;

function eventosSteelFrame()
{
    aEditar = sessionStorage.getItem('aEditar');
    if (aEditar) {
        var pID = aEditar; //  Tomar id de proy a editar.
        sessionStorage.setItem('editardesderesumen', pID);
        sessionStorage.removeItem('aEditar');  //  Eliminar bandera de edicion.

        var $getEditable = 'SELECT * FROM calculos WHERE _id='+ pID ;
        db_customQuery($getEditable, function(result) {
            if (result.length > 0) {
                var editablePName = result[0].project_name;
                editablePVars = $.parseJSON(result[0].data).vars;

                var _version = result[0].version;
                sessionStorage.setItem('editar_version', (_version != '' ? _version : 1));

                // Cargar campos con data.

                // Titulo
                $('#m1-csf-1 .projectName').text(editablePName);

                // Cantidad de plantas
                if (editablePVars.plantas.cuantas == '1') {
                    $('#m1-csf-1 .paso1 .cantPlantas .op1').trigger('click');
                } else {
                    $('#m1-csf-1 .paso1 .cantPlantas .op2').trigger('click');
                }

                // Tipo de entrepiso
                if (editablePVars.entrepiso == 'seco') {
                    $('#m1-csf-1 .paso1 .tipoEntrepiso .op1').trigger('click');
                } else {
                    $('#m1-csf-1 .paso1 .tipoEntrepiso .op2').trigger('click');
                }

                //Luz maxima, reinicializar slider
                theSlide = 0;
                switch (editablePVars.luzmax){
                    case 4:
                        theSlide = 0;
                        break;
                    case 4.5:
                        theSlide = 1;
                        break;
                    case 5:
                        theSlide = 2;
                        break;
                    case 5.5:
                        theSlide = 3;
                        break;
                    case 6:
                        theSlide = 4;
                        break;
                }

                snapper.disable(); // Deshabilitar Menu lateral en primer paso.

                // Plantas
                $('#m1-csf-1 .paso2 .i1').val(editablePVars.plantas[1].ancho);
                $('#m1-csf-1 .paso2 .i2').val(editablePVars.plantas[1].largo);
                $('#m1-csf-1 .paso2 .i3').val(editablePVars.plantas[1].alto);
                $('#m1-csf-1 .paso2 .i4').val(editablePVars.plantas[1].paredes);

                if(editablePVars.plantas.cuantas == '2') {
                    $('#m1-csf-1 .paso2 .i5').val(editablePVars.plantas[2].ancho);
                    $('#m1-csf-1 .paso2 .i6').val(editablePVars.plantas[2].largo);
                    $('#m1-csf-1 .paso2 .i7').val(editablePVars.plantas[2].alto);
                    $('#m1-csf-1 .paso2 .i8').val(editablePVars.plantas[2].paredes);
                }else{
                    // No tiene datos, ponerlos a 0 y ocultar.
                    $('#m1-csf-1 .paso2 .i5').val(0);
                    $('#m1-csf-1 .paso2 .i6').val(0);
                    $('#m1-csf-1 .paso2 .i7').val(0);
                    $('#m1-csf-1 .paso2 .i8').val(0);
                    $('#m1-csf-1 .paso2 .plantaAltaBlock').hide();
                }

                // Metros Lineales
                $('#m1-csf-1 .paso3 .i9').val(editablePVars.aberturas);

                // Tipo de techo
                switch (editablePVars.tipo_techo) {
                    case 1:
                        $('#m1-csf-1 .paso4 .techo.op1').trigger('click');
                        break;
                    case 2:
                        $('#m1-csf-1 .paso4 .techo.op2').trigger('click');
                        break;
                    case 3:
                        $('#m1-csf-1 .paso4 .techo.op3').trigger('click');
                        break;
                }

                stepCompleted = 3; // Habilita hasta la 4ta pestaña

                var pasoActual = sessionStorage.getItem('pasoSTactual');
                if (pasoActual) {
                    setEstadoPie(pasoActual, true);
                }
            } else {
                alertMsg('Error al cargar el proyecto', '', 'none', 'Editar Proyecto', 1, function(){
                    $.mobile.changePage("m-mis-calculos.html");
                });
            }
        });
        estadoST = 2;
    } else {
        initNuevoCalculoSF();
        $('.paso1').show();
        $('.paso2, .paso3, .paso4, .paso5').hide();
    }

    $('#m1-csf-1 .paso1 .siguiente-paso').unbind('click').click(function(){
        st_save_step1();
        snapper.enable();
        setEstadoPie(2, false);
        sessionStorage.setItem('pasoSTactual', 2);
    });
    $('#m1-csf-1 .paso2 .siguiente-paso').unbind('click').click(function(){
        st_save_step2(1);
        sessionStorage.setItem('pasoSTactual', 3);
    });
    $('#m1-csf-1 .paso3 .siguiente-paso').unbind('click').click(function(){
        st_save_step3(1);
        sessionStorage.setItem('pasoSTactual', 4);
    });
    $('#m1-csf-1 .paso4 .siguiente-paso').unbind('click').click(function(){
        st_save_step4();
        setEstadoPie(5, false);
        calculateSF();
    });

    var $pie;
    $('#m1-csf-1 .pie .p1').unbind('click').click(function(){
        $pie = 1;

        if (!$(this).hasClass('disabled')) { //Si el boton está habilitado
            snapper.disable();
            setEstadoPie($pie, true);
        } else {
            if(stepCompleted == 99){ //Si es nuevo y ya mostró el resumen, cualquier tab edita.
                sessionStorage.setItem('desdePie', 1);
                $('.menu-options div.editar').trigger('click');
            }
        }

        sessionStorage.setItem('pasoSTactual', $pie);
    });
    $('#m1-csf-1 .pie .p2').unbind('click').click(function(){
        $pie = 2;

        if (!$(this).hasClass('disabled')) { //Si el boton está habilitado
            $('#m1-csf-1 .paso1 .siguiente-paso')[0].click();
            setEstadoPie($pie, true);
        } else {
            if(stepCompleted == 99){ //Si es nuevo y ya mostró el resumen, cualquier tab edita.
                sessionStorage.setItem('desdePie', 1);
                $('.menu-options div.editar').trigger('click');
            }
        }

        sessionStorage.setItem('pasoSTactual', $pie);
    });
    $('#m1-csf-1 .pie .p3').unbind('click').click(function(){
        $pie = 3;

        if (!$(this).hasClass('disabled')) { //Si el boton está habilitado
            if (stepCompleted >= 2) {
                $('#m1-csf-1 .paso2 .siguiente-paso')[0].click();

                if (aEditarStepError != 0) return;

                snapper.enable();
                setEstadoPie($pie, true);
            } else {
                alertMsg('Debe completar los pasos anteriores', '', 'none', '', 1);
            }
        } else {
            if(stepCompleted == 99){ //Si es nuevo y ya mostró el resumen, cualquier tab edita.
                sessionStorage.setItem('desdePie', 1);
                $('.menu-options div.editar').trigger('click');
            }
        }

        sessionStorage.setItem('pasoSTactual', $pie);
    });
    $('#m1-csf-1 .pie .p4').unbind('click').click(function(){
        $pie = 4;

        if (!$(this).hasClass('disabled')) { //Si el boton está habilitado

            if (stepCompleted >= 3) {

                $('#m1-csf-1 .paso2 .siguiente-paso')[0].click();
                if (aEditarStepError != 0) return;

                $('#m1-csf-1 .paso3 .siguiente-paso')[0].click();


                $('#m1-csf-1 .pie .p5').unbind('click'); // Evitar que se clickee la solapa

                setTimeout(function (){
                    if (aEditarStepError != 0) {
                        return;
                    }
                    snapper.enable();
                    $('#m1-csf-1 .pie .p5').click(function(){   // Habilitar click de nuevo.
                        p5Click();
                    });
                    setEstadoPie($pie);
                }, 500)

            } else {
                alertMsg('Debe completar los pasos anteriores', '', 'none', '', 1);
            }
        } else {
            if(stepCompleted == 99){ //Si es nuevo y ya mostró el resumen, cualquier tab edita.
                sessionStorage.setItem('desdePie', 1);
                $('.menu-options div.editar').trigger('click');
            }
        }

        sessionStorage.setItem('pasoSTactual', $pie);
    });

    $('#m1-csf-1 .pie .p5').unbind('click').click(function(){
        p5Click();
    });

    function p5Click(){
        $pie = 5;
        if (stepCompleted == 99) {
            //alertMsg('Debe completar los pasos anteriores', '', 'none', '', 1);
            $('#m1-csf-1 .paso4 .siguiente-paso')[0].click();
            snapper.enable();
            setEstadoPie($pie, true);
        }

        sessionStorage.setItem('pasoSTactual', $pie);
    }

    eventosCalculosGenerales();

    $('.techo').unbind('click').click(function() {
        $('.techo').removeClass('selected');
        $(this).addClass('selected');
    });

    if (!aEditar || sessionStorage.getItem('pasoSTactual') == 1) {
        setEstadoPie(1, true);
    }

    $('.plantaAltaBlock .copyTo').unbind('click').on('click', function(){
        $('#m1-csf-1 .paso2 .i5').val($('#m1-csf-1 .paso2 .i1').val());
        $('#m1-csf-1 .paso2 .i6').val($('#m1-csf-1 .paso2 .i2').val());
        $('#m1-csf-1 .paso2 .i7').val($('#m1-csf-1 .paso2 .i3').val());
        $('#m1-csf-1 .paso2 .i8').val($('#m1-csf-1 .paso2 .i4').val());
    });

    if (sessionStorage.getItem('aResumen') && sessionStorage.getItem('aResumen') == 1) {
        setTimeout(function () {
            $pie = 5;
            $('.paso.paso1, .paso.paso2, .paso.paso3, .paso.paso4').hide();
            $('.paso.paso5').show();
            st_save_step1();
            st_save_step2();
            st_save_step3();
            st_save_step4();
            setEstadoPie($pie, false);
            calculateSF();
            modoLectura($pie);
            sessionStorage.removeItem('aResumen');
        }, 600);
    }
}

function eventosCalculosGenerales(){
    $('.grupo .op1,.grupo .op2,.grupo .op3,.grupo .op4').unbind('click').click(function() {
        var $class;
        if ($(this).hasClass('op1')) {
            $class = '.op2';
        }
        if ($(this).hasClass('op2')) {
            $class = '.op1';
        }
        if ($(this).hasClass('op3')) {
            $class = '.op4';
        }
        if ($(this).hasClass('op4')) {
            $class = '.op3';
        }
        $($class, $(this).parent()).removeClass('selected');
        $(this).addClass('selected');
    });

    activarDotMenu();
    $('.dot-menu').unbind('click').click(function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            $('.menu-options').hide();
        }else{
            $(this).addClass('selected');
            $('.menu-options').show();

        }
    });
}

function setEstadoPie(paso, tab) {

    var pestana = $('.pie .p' + paso);
    var todasPestanas = $('.pie div');

    if (paso > pasoSTmaximo) pasoSTmaximo = paso;
    pasoSTactual = paso;
    var pestanasAnteriores = $('.pie div:lt(' + (pasoSTmaximo) + ')');

    $('.paso').hide();
    $('.paso' + paso).show();

    if (estadoST == 0) { //Nuevo
        todasPestanas.addClass('disabled').removeClass('selected');
        pestanasAnteriores.removeClass('disabled');
        pestana.removeClass('disabled').addClass('selected');
        $('#back-' + tipoC).show();
        $('.dot-menu').hide();

    } else if (estadoST == 1) { //SoloLectura
        todasPestanas.removeClass('disabled').removeClass('selected');
        pestana.addClass('selected');
        modoLectura();
    } else if (estadoST == 2) { //Editando
        todasPestanas.removeClass('disabled').removeClass('selected');
        pestana.addClass('selected');

        $('#back-' + tipoC).show();
        $('.dot-menu').hide();

        $('.pie .p5').addClass('disabled');
    }

    if (paso == 5){
        $('.pie .p5').removeClass('disabled').addClass('selected');
    }
}

function modoLectura(paso)
{
    estadoST=1;
    $('#back-'+tipoC).hide();
    $('.dot-menu').show();
    $('.pie div').addClass('disabled').removeClass('selected');

    if (paso != null) {
        $('.pie .p'+paso).removeClass('disabled').addClass('selected');
    }
}

function esconderDotMenu(){
    $('.menu-options').hide();
    $('.dot-menu').removeClass('selected');
    $('.btn-settings').removeClass('selected');
}

function initNuevoCalculoSF(){
    stepCompleted = 0;
    tipoC='sf';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;

    $('#m1-csf-1 .projectName').html(sessionStorage.getItem("projectName"));
    snapper.disable();

}

function initEditarCalculoSF(){
    tipoC='sf';
    estadoST=2;
    pasoSTactual = 1;
    pasoSTmaximo = 4;
    $('#m1-csf-1 .paso input[type=number]').removeAttr('disabled');
}

function st_save_step1(){
    var plantas = $('#m1-csf-1 .paso1 .cantPlantas').find('.selected').data('value');

    if (plantas > 1) {
        var entrepiso = $('#m1-csf-1 .paso1 .tipoEntrepiso').find('.selected').data('value');
    }else{
        entrepiso = 'Húmedo';
        //var entrepiso = $('#m1-csf-1 .paso1 .tipoEntrepiso').find('.selected').data('value');
    }
    var luz = $('#m1-csf-1 .swiper-slide-active p').html();
    if (!luz) luz = editablePVars.luzmax;

    sessionStorage.setItem("st-s1-plantas", plantas);
    sessionStorage.setItem("st-s1-entrepiso", entrepiso);
    sessionStorage.setItem("st-s1-luz", luz);

    if(plantas === 1){
        $('.plantaAltaBlock').hide();
    }else{
        $('.plantaAltaBlock').show();
    }

    if(stepCompleted < 1){
        stepCompleted = 1; // Completó el paso 1
    }

}
function st_save_step2(redirect){

    var p1Ancho = p1Largo = p1Alto = p1Paredes = 0;
    var p2Ancho = p2Largo = p2Alto = p2Paredes = 0;

    itsOk = 0;

    if( $.trim( $('#m1-csf-1 .paso2 .i1').val() ).length === 0 ){
        alertMsg('Completa el ancho de la planta 1', '', 'none', '', 1);
    }else if( $.trim( $('#m1-csf-1 .paso2 .i2').val() ).length === 0 ){
        alertMsg('Completa el largo de la planta 1', '', 'none', '', 1);
    }else if( $.trim( $('#m1-csf-1 .paso2 .i3').val() ).length === 0 ){
        alertMsg('Completa el alto de la planta 1', '', 'none', '', 1);
    }else if( $.trim( $('#m1-csf-1 .paso2 .i4').val() ).length === 0 ){
        alertMsg('Completa la cantidad de paredes de la planta 1', '', 'none', '', 1);
    }else {
        p1Ancho = $.trim($('#m1-csf-1 .paso2 .i1').val());
        p1Largo = $.trim($('#m1-csf-1 .paso2 .i2').val());
        p1Alto = $.trim($('#m1-csf-1 .paso2 .i3').val());
        p1Paredes = $.trim($('#m1-csf-1 .paso2 .i4').val());
        itsOk = 1;
    }

    if (itsOk == 1)
    {
        if(sessionStorage.getItem("st-s1-plantas") === '2') {
            if ($.trim($('#m1-csf-1 .paso2 .i5').val()).length === 0) {
                alertMsg('Completa el ancho de la planta 2', '', 'none', '', 1);
            } else if ($.trim($('#m1-csf-1 .paso2 .i6').val()).length === 0) {
                alertMsg('Completa el largo de la planta 2', '', 'none', '', 1);
            } else if ($.trim($('#m1-csf-1 .paso2 .i7').val()).length === 0) {
                alertMsg('Completa el alto de la planta 2', '', 'none', '', 1);
            } else if ($.trim($('#m1-csf-1 .paso2 .i8').val()).length === 0) {
                alertMsg('Completa la cantidad de paredes de la planta 2', '', 'none', '', 1);
            } else {
                p2Ancho = $.trim($('#m1-csf-1 .paso2 .i5').val());
                p2Largo = $.trim($('#m1-csf-1 .paso2 .i6').val());
                p2Alto = $.trim($('#m1-csf-1 .paso2 .i7').val());
                p2Paredes = $.trim($('#m1-csf-1 .paso2 .i8').val());

                itsOk = 2;
            }
        }else {
            itsOk = 2;
        }
    }

    if(itsOk === 2){
        sessionStorage.setItem("st-s2-p1-ancho", p1Ancho);
        sessionStorage.setItem("st-s2-p1-largo", p1Largo);
        sessionStorage.setItem("st-s2-p1-alto", p1Alto);
        sessionStorage.setItem("st-s2-p1-paredes", p1Paredes);

        sessionStorage.setItem("st-s2-p2-ancho", p2Ancho);
        sessionStorage.setItem("st-s2-p2-largo", p2Largo);
        sessionStorage.setItem("st-s2-p2-alto", p2Alto);
        sessionStorage.setItem("st-s2-p2-paredes", p2Paredes);
        if(redirect){
            if(stepCompleted < 2){
                stepCompleted = 2; // Completó el paso 2
            }
            setEstadoPie(3,false);
        }
        aEditarStepError = 0;
    } else{
        aEditarStepError = 2;
    }
}
function st_save_step3(){

    var mts = $.trim( $('#m1-csf-1 .paso3 .i9').val() );
    if(mts.length === 0){
        alertMsg('Debe ingresar un valor para continuar.', '', 'none', '', 1);
        aEditarStepError = 3;
    }else{
        aEditarStepError = 0;
        sessionStorage.setItem("st-s3-mts", mts);
        if(stepCompleted < 3){
            stepCompleted = 3; // Completó el paso 3
        }
        setEstadoPie(4,false);
    }
}
function st_save_step4(){ //Almacenar tipo de techo

    var $_tipoTecho = $('.texto.techo.selected').attr('data-value');
    sessionStorage.setItem('st-s4-tipotecho',parseFloat($_tipoTecho));

    if (sessionStorage.getItem('aResumen') != 1 ) {
        saveNewCalc(1);
    }
}

function saveNewCalc(showMessage) {
    var calculos;
    var currentTime = getCurrentTime();

    sessionStorage.setItem('calculos', JSON.stringify( {"tipo": { "steel_frame": {}  } } ) );
    calculos = $.parseJSON(sessionStorage.calculos);

    var projectName = sessionStorage.getItem('projectName');
    var entrepiso = sessionStorage.getItem('st-s1-entrepiso');
    var plantas = parseFloat(sessionStorage.getItem('st-s1-plantas'));
    var altoPB = parseFloat(sessionStorage.getItem('st-s2-p1-alto'));
    var anchoPB = parseFloat(sessionStorage.getItem('st-s2-p1-ancho'));
    var largoPB = parseFloat(sessionStorage.getItem('st-s2-p1-largo'));
    var paredesInternasPB = parseFloat(sessionStorage.getItem('st-s2-p1-paredes'));
    var altoPA = parseFloat(sessionStorage.getItem('st-s2-p2-alto'));
    var anchoPA = parseFloat(sessionStorage.getItem('st-s2-p2-ancho'));
    var largoPA = parseFloat(sessionStorage.getItem('st-s2-p2-largo'));
    var paredesInternasPA = parseFloat(sessionStorage.getItem('st-s2-p2-paredes'));
    var aberturas = parseFloat(sessionStorage.getItem('st-s3-mts'));
    var tipoTecho = parseFloat(sessionStorage.getItem('st-s4-tipotecho'));
    var luzmax = parseFloat(sessionStorage.getItem('st-s1-luz'));

    //Si hay datos en CALCULOS, concatenamos el nuevo proyecto
    calculos.tipo.steel_frame[projectName] =
    {
        "vars": {
            "tipo_techo": tipoTecho,
            "aberturas": aberturas,
            "entrepiso": entrepiso,
            "luzmax":luzmax,
            "plantas": {
                "cuantas": plantas,
                "1": {"alto": altoPB, "ancho": anchoPB, "largo": largoPB, "paredes": paredesInternasPB},
                "2": {"alto": altoPA, "ancho": anchoPA, "largo": largoPA, "paredes": paredesInternasPA}
            }
        }
    }

    sessionStorage.setItem('calculos', JSON.stringify(calculos));
    //Aquí procesaremos el web services que guardará el calculo en la BD
    //Mandamos el string de JSON a la BD -> ¡¡¡ SOLO EL STRING DEL CALCULO  !!!
    // ID calculo, ID usuario, tipo de calculo (1=SF, 2=DW, 3=T), json con los datos del calculo
    // con el success del ajax (guardado en la BD remota) cambiamos el valor sinc = 1 del calculo en sessionStorage
    var $user = localStorage.getItem('username');
    var $dataSaveBD = JSON.stringify(calculos.tipo.steel_frame[projectName]);
    var $calcType = 1;
    if (estadoST == 0) { //Si el calculo es nuevo
        //Guardamos en bd local el calculo
        var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id','version']
        if (logged == true) {
            var values = [localStorage.getItem('userId'),projectName,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0,1]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(5); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        //alertMsg('Nuevo calculo '+projectName+' guardado', '', 'none', '', 1);
                        alertMsg('Nuevo calculo guardado', '', 'none', 'Felicitaciones', 1);
                    }
                    sessionStorage.setItem('newSave', 1);
                    //sessionStorage.setItem('aEditar', pId);
                } else {
                    if (showMessage !== 0) {
                        alertMsg('No se ha podido guardar', '', 'none', '', 1);
                    }
                }
            });

        } else {
            var values = [0,projectName,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0,1]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(5); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        //alertMsg('Nuevo calculo '+projectName+' guardado', '', 'none', '', 1);
                        alertMsg('Nuevo calculo guardado', '', 'none', 'Felicitaciones', 1);
                    }
                    sessionStorage.setItem('newSave', 1);
                } else {
                    if (showMessage !== 0) {
                        alertMsg('No se ha podido guardar', '', 'none', '', 1);
                    }
                }
            })
        }
    } else if(estadoST == 2) { //Si el calculo ya existe y fue editado
        var pName = sessionStorage.getItem('projectName');

        var _version = (parseInt(sessionStorage.getItem('editar_version')) + 1);
        sessionStorage.setItem('editar_version', _version);

        /* Le cambiamos el nombre al proyceto nuevo generado */
        $_newName = projectName + ' v' + _version;
        sessionStorage.setItem('projectName', $_newName);

        var $query = 'UPDATE calculos SET version=' + _version + ', modified=\''+currentTime+'\', sync=0 WHERE _id=\''+sessionStorage.getItem('editardesderesumen')+'\' AND user_id='+localStorage.getItem('userId')+' AND calc_type='+$calcType;

        db_updateQueryEdit($query, function(result,updatedID) {
            if (result == 'ok') {
                modoLectura(5);
                if (showMessage !== 0) {
                    alertMsg('Felicitaciones el cálculo "'+$_newName+'" ha sido editado.', '', 'none', 'Cálculo editado', 1);
                    $('#m1-csf-1 .projectName').text($_newName);
                    $('.boton.saveCalc').fadeOut(600);
                }
                sessionStorage.setItem('newSave', 1);
            }
        })

        var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id','version']
        var values = [localStorage.getItem('userId'),$_newName,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0,1];
        db_insert('calculos',fields, values,'',function(result){
            // No hacemos nada
        })

    }
    // Si el usuario es anonimo, solo tendremos acceso a la variable local, asi que no haremos nada.
    // por que los datos ya se encuentran en sessionStorage. (y le dejamos el sync en 0 para cuando loguee mandar
    // los calculos a la BD remota)
    estadoST = 1;
}

function calculateSF(){
    stepCompleted = 99;
    var projectName = sessionStorage.getItem('projectName');
    var entrepiso = sessionStorage.getItem('st-s1-entrepiso');
    var plantas = parseFloat(sessionStorage.getItem('st-s1-plantas'));
    var altoPB = parseFloat(sessionStorage.getItem('st-s2-p1-alto'));
    var anchoPB = parseFloat(sessionStorage.getItem('st-s2-p1-ancho'));
    var largoPB = parseFloat(sessionStorage.getItem('st-s2-p1-largo'));
    var paredesInternasPB = parseFloat(sessionStorage.getItem('st-s2-p1-paredes'));
    var altoPA = parseFloat(sessionStorage.getItem('st-s2-p2-alto'));
    var anchoPA = parseFloat(sessionStorage.getItem('st-s2-p2-ancho'));
    var largoPA = parseFloat(sessionStorage.getItem('st-s2-p2-largo'));
    var paredesInternasPA = parseFloat(sessionStorage.getItem('st-s2-p2-paredes'));
    var aberturas = parseFloat(sessionStorage.getItem('st-s3-mts'));
    var tipoTecho = parseFloat(sessionStorage.getItem('st-s4-tipotecho'));
    var luzmax = parseFloat(sessionStorage.getItem('st-s1-luz'));

    //Perfil GPC
    var perfilPGC = '';
    if(entrepiso === 'humedo'){
        switch(luzmax){
            case 4:
                perfilPGC = 'PGC 200 x 1,25';
                break;
            case 4.5:
                perfilPGC = 'PGC 200 x 2,00';
                break;
            case 5:
                perfilPGC = 'PGC 250 x 1,60';
                break;
            case 5.5:
                perfilPGC = 'PGC 250 x 2,00';
                break;
            case 6:
                perfilPGC = 'PGC 250 x 2,50';
                break;
        }
    }else{
        switch(luzmax){
            case 4:
                perfilPGC = 'PGC 200 x 1,25';
                break;
            case 4.5:
                perfilPGC = 'PGC 200 x 1,25';
                break;
            case 5:
                perfilPGC = 'PGC 200 x 2,00';
                break;
            case 5.5:
                perfilPGC = 'PGC 250 x 1,60';
                break;
            case 6:
                perfilPGC = 'PGC 250 x 2,00';
                break;
        }
    }

    //Perfil PGU
    var perfilPGU = '';
    if(entrepiso === 'humedo'){
        switch(luzmax){
            case 4:
                perfilPGU = 'PGU 200 x 1,25';
                break;
            case 4.5:
                perfilPGU = 'PGU 200 x 2,00';
                break;
            case 5:
                perfilPGU = 'PGU 250 x 1,6';
                break;
            case 5.5:
                perfilPGU = 'PGU 250 x 2,00';
                break;
            case 6:
                perfilPGU = 'PGU 250 x 2,50';
                break;
        }
    }else{
        switch(luzmax){
            case 4:
                perfilPGU = 'PGU 200 x 1,25';
                break;
            case 4.5:
                perfilPGU = 'PGU 200 x 1,25';
                break;
            case 5:
                perfilPGU = 'PGU 200 x 1,25';
                break;
            case 5.5:
                perfilPGU = 'PGU 250 x 1,6';
                break;
            case 6:
                perfilPGU = 'PGU 250 x 2,50';
                break;
        }
    }

    // TOTALES
    var $pgc100_total = PGC100(altoPB, anchoPB, largoPB, paredesInternasPB, altoPA, anchoPA, largoPA, paredesInternasPA, plantas, tipoTecho);
    var $pgu100_total = PGU100(largoPB,anchoPB, altoPB, paredesInternasPB, largoPA ,anchoPA, altoPA, paredesInternasPA, aberturas, plantas, tipoTecho)
    var $anclajes_total = adicional_anclajes(anchoPB, largoPB);
    //Diagrafagmas de rigidización
    var $exteriores_techos_timpanos = adicional_diafragmas_paneles(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA, tipoTecho)
    var $entrepisos_escaleras = adicional_diafragmas_entrepisos_escaleras(anchoPB, largoPB, altoPB, anchoPA, largoPA, tipoTecho, entrepiso)
    //Aislaciones
    var $aislaciones1 = adicional_barreras_paredes_externas(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA);
    var $aislaciones2 = adicional_barrera_cubierta_inclinada(anchoPB, largoPB, tipoTecho);
    var $aislaciones3 = adicional_aislacion_termica_paredes_externas(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA);
    var $aislaciones4 = adicional_aislacion_termica_cielorraso(anchoPB, largoPB);
    var $aislaciones5 = adicional_aislacion_acustica(paredesInternasPB, altoPB, paredesInternasPA, altoPA);
    var $aislaciones6 = adicional_barrera_vapor_paredes_externas(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA);
    var $aislaciones7 = adicional_barrera_vapor_techo(anchoPB, largoPB);
    // Placas Yeso
    var $placasYeso1 = adicional_placas_yeso_paredes(anchoPB, largoPB, altoPB, paredesInternasPB, anchoPA, largoPA, altoPA, paredesInternasPA);
    var $placasYeso2 = adicional_placas_yeso_cielorraso(anchoPB, largoPB, anchoPA, largoPA);
    // Terminacion Exterior
    var $terminacionExteriorRevestimiento = adicional_revestimiento_exterior(largoPB, anchoPB, altoPB, largoPA, anchoPA, altoPA, tipoTecho);
    var $terminacionExteriorCubierta = adicional_terminacion_exterior_cubierta(anchoPB, largoPB, tipoTecho);
    // Tornillos
    var resultadoTornillos = adicional_tornillos(anchoPB, largoPB, paredesInternasPB, altoPB , anchoPA, largoPA, paredesInternasPA, altoPA, tipoTecho, plantas, entrepiso);
    var $tornillosT1 = resultadoTornillos.t1;
    var $tornillosHexagonales = resultadoTornillos.th;
    var $tornillosT2 = resultadoTornillos.t2;
    var $tornillosT2Yeso = resultadoTornillos.t22;
    // Perfiles dinamicos
    var $pgc200 = PGC200(largoPB, anchoPB, largoPA, anchoPA, aberturas, tipoTecho, plantas);
    var $pgu200 = PGU200(largoPB, anchoPB, largoPA, anchoPA, aberturas, tipoTecho, plantas);


    //Cargar resumen de datos ingresados.
    $('.paso5 .item10 .medida').text(luzmax + ' m.');
    if(plantas == 1){
        $('.paso5 .item11').hide();
    }
    $('.paso5 .item11 .ultimo .texto').text(entrepiso);
    $('.paso5 .item12 .ancho .medida').text(anchoPB + ' m.');
    $('.paso5 .item12 .largo .medida').text(largoPB + ' m.');
    $('.paso5 .item12 .altura .medida').text(altoPB + ' m.');
    $('.paso5 .item12 .ultimo .medida').text(paredesInternasPB + ' m.');

    if(plantas == 1){
        $('.paso5 .item13').hide();
    }
    $('.paso5 .item13 .ancho .medida').text(anchoPA + ' m.');
    $('.paso5 .item13 .largo .medida').text(largoPA + ' m.');
    $('.paso5 .item13 .altura .medida').text(altoPA + ' m.');
    $('.paso5 .item13 .ultimo .medida').text(paredesInternasPA + ' m.');
    $('.paso5 .item14 .ultimo .medida').text(aberturas + ' m.');

    if(tipoTecho == 1){
        $('.paso5 .item15 .ultimo .texto').text('Cubierta inclinada/cabriadas');
    }else if(tipoTecho == 2){
        $('.paso5 .item15 .ultimo .texto').text('Cubierta inclinada/vigas a 10°');
    }else{
        $('.paso5 .item15 .ultimo .texto').text('Cubierta plana/vigas');
    }


    //TOTALES EN DIVS
    $('.paso5 span[data-result=pgc100]').text( Math.round($pgc100_total) + ' ml.');
    $('.paso5 span[data-result=pgu100]').text( Math.round($pgu100_total) + ' ml.');
    $('.paso5 span[data-result=anclajes]').text( Math.round($anclajes_total) + ' U.');
    //Diagrafagmas de rigidización
    $('.paso5 span[data-result=diafragma1]').html( Math.round($exteriores_techos_timpanos) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=diafragma2]').html( Math.round($entrepisos_escaleras) + ' m<sup>2</sup>.');
    //AISLACIONES
    $('.paso5 span[data-result=aislaciones1]').html( Math.round($aislaciones1) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones2]').html( Math.round($aislaciones2) + ' m<sup>2</sup>.');

    var $aislacionesTitulo1 = $aislaciones3 + $aislaciones4;
    $('.paso5 span[data-result=aislaciones3]').html( Math.round($aislacionesTitulo1) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones4]').html( Math.round($aislaciones3) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones5]').html( Math.round($aislaciones4) + ' m<sup>2</sup>.');

    $('.paso5 span[data-result=aislaciones6]').html( Math.round($aislaciones5) + ' m<sup>2</sup>.');

    var $aislacionesTitulo2 = $aislaciones6 + $aislaciones7;
    $('.paso5 span[data-result=aislaciones7]').html( Math.round($aislacionesTitulo2) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones8]').html( Math.round($aislaciones6) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones9]').html( Math.round($aislaciones7) + ' m<sup>2</sup>.');
    //PLACAS YESO
    $('.paso5 span[data-result=placasYeso1]').html( Math.round($placasYeso1) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=placasYeso2]').html( Math.round($placasYeso2) + ' m<sup>2</sup>.');
    //TERMINACION EXTERIOR
    $('.paso5 span[data-result=terminacionExteriorRevestimiento]').html( Math.round($terminacionExteriorRevestimiento) + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=terminacionExteriorCubierta]').html( Math.round($terminacionExteriorCubierta) + ' m<sup>2</sup>.');
    //TORNILLOS
    $('.paso5 span[data-result=tornillosT1]').html($tornillosT1 + ' U.');
    $('.paso5 span[data-result=tornillosHexagonales]').html( Math.round($tornillosHexagonales) + ' U.');
    $('.paso5 span[data-result=tornillosT2]').html($tornillosT2 + ' U.');
    $('.paso5 span[data-result=tornillosT2Yeso]').html($tornillosT2Yeso + ' U.');
    //PERFILES DINAMICOS
    $('.paso5 span[data-result=perfilPGC200]').html(perfilPGC);
    $('.paso5 span[data-result=pgc200]').html( Math.round($pgc200) + ' ml.');

    $('.paso5 span[data-result=perfilPGU200]').html(perfilPGU);
    $('.paso5 span[data-result=pgu200]').html( Math.round($pgu200) + ' ml.');
}

function generateDivRenderSF(){

    var filename = localStorage.getItem('username') + '_steel-frame_' + sessionStorage.getItem('projectName');
    viewPDF(filename, 'steel-frame');

}
