var estadoST = 0; // 0=Nuevo   1=SoloLectura   2=Editando
var pasoSTactual = 1;
var pasoSTmaximo = 1;
var tipoC="t"; // sf dw t

function eventosSteelFrame(){
    initNuevoCalculoSF();

    $('#m1-csf-1 .paso1 .siguiente-paso').click(function(){
        st_save_step1();
        snapper.enable();
        setEstadoPie(2,false);
    });
    $('#m1-csf-1 .paso2 .siguiente-paso').click(function(){
        st_save_step2(1);
    });
    $('#m1-csf-1 .paso3 .siguiente-paso').click(function(){
        st_save_step3(1);
    });
    $('#m1-csf-1 .paso4 .siguiente-paso').click(function(){
        st_save_step4();
        setEstadoPie(5,false);
        calculateSF();
    });


    $('#m1-csf-1 .pie .p1').click(function(){
        snapper.disable();
        setEstadoPie(1,true);
    });
    $('#m1-csf-1 .pie .p2').click(function(){
        $('#m1-csf-1 .paso1 .siguiente-paso')[0].click();
        setEstadoPie(2,true);
    });
    $('#m1-csf-1 .pie .p3').click(function(){
        $('#m1-csf-1 .paso2 .siguiente-paso')[0].click();
        snapper.enable();
        setEstadoPie(3,true);
    });
    $('#m1-csf-1 .pie .p4').click(function(){
        $('#m1-csf-1 .paso3 .siguiente-paso')[0].click();
        snapper.enable();
        setEstadoPie(4,true);
    });
    $('#m1-csf-1 .pie .p5').click(function(){
        $('#m1-csf-1 .paso4 .siguiente-paso')[0].click();
        snapper.enable();
        setEstadoPie(5,true);
    });


    $('.paso1').show();
    $('.paso2, .paso3, .paso4, .paso5').hide();

    eventosCalculosGenerales();

    $('.techo').click(function(){
        if(estadoST!=1){
            $('.techo').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    setEstadoPie(1,true);

    setTimeout(function(){
        $('#back-sf').unbind('click').click(function(){
            if(pasoSTactual>1){
                setEstadoPie(pasoSTactual-1);
            }else{
                window.history.back();
            }
        })
    },500);


    $('.plantaAltaBlock .copyTo').on('click', function(){
        $('#m1-csf-1 .paso2 .i5').val($('#m1-csf-1 .paso2 .i1').val());
        $('#m1-csf-1 .paso2 .i6').val($('#m1-csf-1 .paso2 .i2').val());
        $('#m1-csf-1 .paso2 .i7').val($('#m1-csf-1 .paso2 .i3').val());
        $('#m1-csf-1 .paso2 .i8').val($('#m1-csf-1 .paso2 .i4').val());
    });


}


function eventosCalculosGenerales(){
    $('.grupo .op1,.grupo .op2').click(function(){
        if(estadoST!=1){
            $('div',$(this).parent()).removeClass('selected');
            $(this).addClass('selected');
        }
    });


    $('.dot-menu').click(function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            $('.menu-options').hide();
        }else{
            $(this).addClass('selected');
            $('.menu-options').show();

        }
    });

    $('.menu-options .editar').click(function(){
        estadoST = 2;
        setEstadoPie(1,false);
        esconderDotMenu();
    });

    $('.menu-options .duplicar').click(function(){

    });

    $('.menu-options .eliminar').click(function(){
        blockScreen();
        $('#dlg-del-calculo').show();
    });

    $('.menu-options').hide();


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

        if (tipoC == 'sf' && paso == 5) modoLectura();
    } else if (estadoST == 1) { //SoloLectura
        todasPestanas.removeClass('disabled').removeClass('selected');
        pestana.addClass('selected');
        modoLectura();
    } else if (estadoST == 2) { //Editando
        todasPestanas.removeClass('disabled').removeClass('selected');
        pestana.addClass('selected');

        $('#back-' + tipoC).show();
        $('.dot-menu').hide();

        if (tipoC == 'sf' && paso == 5) modoLectura();
        $('.pie .p5').addClass('disabled');

    }
    if (paso == 5){
        //saveNewCalc();
        $('.pie .p5').removeClass('disabled');
    }
}
function modoLectura(){
    estadoST=1;
    $('#back-'+tipoC).hide();
    $('.dot-menu').show()
}
function esconderDotMenu(){
    $('.menu-options').hide();
    $('.dot-menu').removeClass('selected');
    $('.btn-settings').removeClass('selected');
}




function initNuevoCalculoSF(){
    tipoC='sf';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;

    $('#m1-csf-1 .projectName').html(sessionStorage.getItem("projectName"));
    snapper.disable();

}


function initEditarCalculoSF(){
    tipoC='sf';
    estadoST=1;
    pasoSTactual = 1;
    pasoSTmaximo = 4;
}

function st_save_step1(){
    var plantas = $('#m1-csf-1 .paso1 .cantPlantas').find('.selected').data('value');

    if (plantas > 1) {
        var entrepiso = $('#m1-csf-1 .paso1 .tipoEntrepiso').find('.selected').data('value');
    }else{
        entrepiso = '';
    }

    var luz = $('#m1-csf-1 .swiper-slide-active p').html();


    sessionStorage.setItem("st-s1-plantas", plantas);
    sessionStorage.setItem("st-s1-entrepiso", entrepiso);
    sessionStorage.setItem("st-s1-luz", luz);

    if(plantas === 1){
        $('.plantaAltaBlock').hide();
    }else{
        $('.plantaAltaBlock').show();
    }

}
function st_save_step2(redirect){

    var p1Ancho = p1Largo = p1Alto = p1Paredes = 0;
    var p2Ancho = p2Largo = p2Alto = p2Paredes = 0;

    itsOk = 0;

    if( $.trim( $('#m1-csf-1 .paso2 .i1').val() ).length === 0 ){
        alert('Completa el ancho de la planta 1');
    }else if( $.trim( $('#m1-csf-1 .paso2 .i2').val() ).length === 0 ){
        alert('Completa el largo de la planta 1');
    }else if( $.trim( $('#m1-csf-1 .paso2 .i3').val() ).length === 0 ){
        alert('Completa el alto de la planta 1');
    }else if( $.trim( $('#m1-csf-1 .paso2 .i4').val() ).length === 0 ){
        alert('Completa la cantidad de paredes de la planta 1');
    }else {
        p1Ancho = $.trim($('#m1-csf-1 .paso2 .i1').val());
        p1Largo = $.trim($('#m1-csf-1 .paso2 .i2').val());
        p1Alto = $.trim($('#m1-csf-1 .paso2 .i3').val());
        p1Paredes = $.trim($('#m1-csf-1 .paso2 .i4').val());
        itsOk = 1;
    }

    if(sessionStorage.getItem("st-s1-plantas") === '2') {
        if ($.trim($('#m1-csf-1 .paso2 .i5').val()).length === 0) {
            alert('Completa el ancho de la planta 2');
        } else if ($.trim($('#m1-csf-1 .paso2 .i6').val()).length === 0) {
            alert('Completa el largo de la planta 2');
        } else if ($.trim($('#m1-csf-1 .paso2 .i7').val()).length === 0) {
            alert('Completa el alto de la planta 2');
        } else if ($.trim($('#m1-csf-1 .paso2 .i8').val()).length === 0) {
            alert('Completa la cantidad de paredes de la planta 2');
        } else {
            p2Ancho = $.trim($('#m1-csf-1 .paso2 .i1').val());
            p2Largo = $.trim($('#m1-csf-1 .paso2 .i2').val());
            p2Alto = $.trim($('#m1-csf-1 .paso2 .i3').val());
            p2Paredes = $.trim($('#m1-csf-1 .paso2 .i4').val());
            itsOk = 2;
        }
    }else if(itsOk === 1){
        itsOk = 2;
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
            setEstadoPie(3,false);
        }
    }
}
function st_save_step3(){
    var mts = $.trim( $('#m1-csf-1 .paso3 .i9').val() );
    if(mts.length === 0){
        alert('Debe ingresar un valor para continuar.');
    }else{
        sessionStorage.setItem("st-s3-mts", mts);
        setEstadoPie(4,false);
    }
}
function st_save_step4(){ //Almacenar tipo de techo
    var $_tipoTecho = $('.texto.techo.selected').attr('data-value');
    sessionStorage.setItem('st-s4-tipotecho',parseFloat($_tipoTecho));
}

function saveNewCalc(){
    var calculos;

    if (localStorage.calculos){ // Existe calculos
        calculos = $.parseJSON(localStorage.calculos);
        if(! calculos.tipo.steel_frame){ // Crear tipo steel_frame
            calculos.tipo['steel_frame'] = {};
        }
    }else{
        // Crear variables calculos y tipo steel_frame
        localStorage.setItem('calculos', JSON.stringify( {"tipo": { "steel_frame": {}  } } ) );
        calculos = $.parseJSON(localStorage.calculos);
    }

    var $_1 = sessionStorage.getItem('projectName');
    var $_2 = sessionStorage.getItem('st-s1-entrepiso');
    var $_3 = parseFloat(sessionStorage.getItem('st-s1-plantas'));
    var $_4 = parseFloat(sessionStorage.getItem('st-s2-p1-alto'));
    var $_5 = parseFloat(sessionStorage.getItem('st-s2-p1-ancho'));
    var $_6 = parseFloat(sessionStorage.getItem('st-s2-p1-largo'));
    var $_7 = parseFloat(sessionStorage.getItem('st-s2-p1-paredes'));
    var $_8 = parseFloat(sessionStorage.getItem('st-s2-p2-alto'));
    var $_9 = parseFloat(sessionStorage.getItem('st-s2-p2-ancho'));
    var $_10 = parseFloat(sessionStorage.getItem('st-s2-p2-largo'));
    var $_11 = parseFloat(sessionStorage.getItem('st-s2-p2-paredes'));
    var $_12 = parseFloat(sessionStorage.getItem('st-s3-mts'));
    var $_13 = parseFloat(sessionStorage.getItem('st-s4-tipotecho'));
    var $_14 = parseFloat(sessionStorage.getItem('st-s1-luz'));

    //Si hay datos en CALCULOS, concatenamos el nuevo proyecto
    calculos.tipo.steel_frame[$_1] =
    {
        "vars": {
            "tipo_techo": $_13,
            "aberturas": $_12,
            "entrepiso": $_2,
            "luzmax":$_14,
            "plantas": {
                "cuantas": $_3,
                "1": {"alto": $_4, "ancho": $_5, "largo": $_6, "paredes": $_7},
                "2": {"alto": $_8, "ancho": $_9, "largo": $_10, "paredes": $_11}
            }
        }
    }

    localStorage.setItem('calculos', JSON.stringify(calculos));
    sessionStorage.clear();
}

function calculateSF(){
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
                perfilPGC = 'Perfiles PGC 200 x 1,25';
                break;
            case 4.5:
                perfilPGC = 'Perfiles PGC 200 x 2,00';
                break;
            case 5:
                perfilPGC = 'Perfiles PGC 250 x 1,60';
                break;
            case 5.5:
                perfilPGC = 'Perfiles PGC 250 x 2,00';
                break;
            case 6:
                perfilPGC = 'Perfiles PGC 250 x 2,50';
                break;
        }
    }else{
        switch(luzmax){
            case 4:
                perfilPGC = 'Perfiles PGC 200 x 1,25';
                break;
            case 4.5:
                perfilPGC = 'Perfiles PGC 200 x 1,25';
                break;
            case 5:
                perfilPGC = 'Perfiles PGC 200 x 2,00';
                break;
            case 5.5:
                perfilPGC = 'Perfiles PGC 250 x 1,60';
                break;
            case 6:
                perfilPGC = 'Perfiles PGC 250 x 2,00';
                break;
        }
    }

    //Perfil PGU
    var perfilPGU = '';
    if(entrepiso === 'humedo'){
        switch(luzmax){
            case 4:
                perfilPGU = 'Perfiles PGU 200 x 1,25';
                break;
            case 4.5:
                perfilPGU = 'Perfiles PGU 200 x 2,00';
                break;
            case 5:
                perfilPGU = 'Perfiles PGU 250 x 1,6';
                break;
            case 5.5:
                perfilPGU = 'Perfiles PGU 250 x 2,00';
                break;
            case 6:
                perfilPGU = 'Perfiles PGU 250 x 2,50';
                break;
        }
    }else{
        switch(luzmax){
            case 4:
                perfilPGU = 'Perfiles PGU 200 x 1,25';
                break;
            case 4.5:
                perfilPGU = 'Perfiles PGU 200 x 1,25';
                break;
            case 5:
                perfilPGU = 'Perfiles PGU 200 x 1,25';
                break;
            case 5.5:
                perfilPGU = 'Perfiles PGU 250 x 1,6';
                break;
            case 6:
                perfilPGU = 'Perfiles PGU 250 x 2,50';
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


    //TOTALES EN DIVS
    $('.paso5 span[data-result=pgc100]').text($pgc100_total + ' ml.');
    $('.paso5 span[data-result=pgu100]').text($pgu100_total + ' ml.');
    $('.paso5 span[data-result=anclajes]').text($anclajes_total + ' U.');
    //Diagrafagmas de rigidización
    $('.paso5 span[data-result=diafragma1]').text($exteriores_techos_timpanos + ' ml.');
    $('.paso5 span[data-result=diafragma2]').text($entrepisos_escaleras + ' ml.');
    //AISLACIONES
    $('.paso5 span[data-result=aislaciones1]').html($aislaciones1 + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones2]').html($aislaciones2 + ' m<sup>2</sup>.');

    var $aislacionesTitulo1 = $aislaciones3 + $aislaciones4;
    $('.paso5 span[data-result=aislaciones3]').html($aislacionesTitulo1 + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones4]').html($aislaciones3 + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones5]').html($aislaciones4 + ' m<sup>2</sup>.');

    $('.paso5 span[data-result=aislaciones6]').html($aislaciones5 + ' m<sup>2</sup>.');

    var $aislacionesTitulo2 = $aislaciones6 + $aislaciones7;
    $('.paso5 span[data-result=aislaciones7]').html($aislacionesTitulo2 + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones8]').html($aislaciones6 + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=aislaciones9]').html($aislaciones7 + ' m<sup>2</sup>.');
    //PLACAS YESO
    $('.paso5 span[data-result=placasYeso1]').html($placasYeso1 + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=placasYeso2]').html($placasYeso2 + ' m<sup>2</sup>.');
    //TERMINACION EXTERIOR
    $('.paso5 span[data-result=terminacionExteriorRevestimiento]').html($terminacionExteriorRevestimiento + ' m<sup>2</sup>.');
    $('.paso5 span[data-result=terminacionExteriorCubierta]').html($terminacionExteriorCubierta + ' m<sup>2</sup>.');
    //TORNILLOS
    $('.paso5 span[data-result=tornillosT1]').html($tornillosT1 + ' U.');
    $('.paso5 span[data-result=tornillosHexagonales]').html($tornillosHexagonales + ' U.');
    $('.paso5 span[data-result=tornillosT2]').html($tornillosT2 + ' U.');
    $('.paso5 span[data-result=tornillosT2Yeso]').html($tornillosT2Yeso + ' U.');
    //PERFILES DINAMICOS
    $('.paso5 span[data-result=perfilPGC200]').html(perfilPGC);
    $('.paso5 span[data-result=pgc200]').html($pgc200 + ' ml.');

    $('.paso5 span[data-result=perfilPGU200]').html(perfilPGU);
    $('.paso5 span[data-result=pgu200]').html($pgu200 + ' ml.');

    saveNewCalc();
}

function generateDivRender(){
    var $html = $('.paso5 #myRenderSave').clone();
    $html.find('span.showMore').remove()
    $html = $html.html();
    var request;

    request = $.ajax({
        type: 'POST',
        url: url_webservices+'/download-pdf.php',
        data: {content:$html},
        dataType: 'html'
    });

    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log("Comenzando descarga de PDF");
        //console.log(response);
        window.open( response, '_blank' );
        //window.location.assign( response )
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "Ha ocurrido un error: "+
            textStatus, errorThrown
        );
    });

}
