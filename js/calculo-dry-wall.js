var stepComplete = 0;

function eventosDryWall(){
    initNuevoCalculoDW();

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
            alert('Debe completar los pasos anteriores.');
        }
    });
    $('#m1-cdw-1 .pie .p3').click(function(){
        if(stepCompleted == 99) {
            $('#m1-cdw-1 .paso2 .siguiente-paso')[0].click();
            setEstadoPie(3, true);
        }else{
            alert('Debe completar los pasos anteriores.');
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
        alert('Debe ingresar el largo de las paredes interiores (numérico con punto decimal).');
        $(this).val('');
        return;
    }else if( altoParedes.length === 0 || isNaN( altoParedes ) ){
        alert('Debe ingresar el ancho las paredes interiores (numérico con punto decimal).');
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
        alert('Debe ingresar el largo del cielo raso (numérico con punto decimal).');
        $(this).val('');
        return;
    }else if( anchoCieloRaso.length === 0 || isNaN( anchoCieloRaso ) ){
        alert('Debe ingresar el ancho del cielo raso (numérico con punto decimal).');
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

function saveNewCalcDryWall(){
    var calculos;

    if (localStorage.calculos){ // Existe calculos
        calculos = $.parseJSON(localStorage.calculos);
        if(! calculos.tipo.dry_wall){ // Crear tipo dry_wall
            calculos.tipo['dry_wall'] = {};
        }
    }else{
        // Crear variables calculos y tipo dry_wall
        localStorage.setItem('calculos', JSON.stringify( {"tipo": { "dry_wall": {}  } } ) );
        calculos = $.parseJSON(localStorage.calculos);
    }

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

    localStorage.setItem('calculos', JSON.stringify(calculos));
}

function initNuevoCalculoDW(){
    tipoC='dw';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;
    $('#m1-cdw-1 .projectName').html(sessionStorage.getItem("projectName"));
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
    var $html = $('#myRenderSaveDW').clone();
    var $this = $('.paso3 .boton.savePDFDW');
    $html.find('.boton.savePDFDW').remove();
    $html = $html.html();

    //GUARDAMOS EL CALCULO EN LA VARIABLE LOCAL DE LA APP.
    saveNewCalcDryWall();

    //Animamos el boton
    var dots = 0;
    var _op = 0.6;
    $this.animate({opacity:0.6})
    $this.html('Generando PDF<span id="dots"></span>')
    var animateLoading = setInterval(function(){
        if(_op == 0 || _op == 0.6){
            _op = 1;
        }else{
            _op = 0.6;
        }
        $this.animate({opacity:_op})
        if(dots < 3) {
            $('#dots').append('.');
            dots++;
        } else {
            $('#dots').html('');
            dots = 0;
        }
    },600)

    var request;
    var the_link;
    if(!the_link){
        request = $.ajax({
            type: 'POST',
            url: url_webservices+'/download-pdf.php',
            data: {content:$html, fileName: localStorage.getItem('session_code')},
            dataType: 'text'
        });

        request.done(function (response, textStatus, jqXHR){
            the_link = response;

            clearInterval(animateLoading);
            $this.animate({opacity:1})
            $this.html('Ver PDF');
            console.log("Comenzando descarga de PDF");
            //var fileTransfer = new FileTransfer();
            //var uri = encodeURI(the_link);
            //var filePath = "/mnt/sdcard/AppTernium/Calculos/Dry Wall/"+sessionStorage.getItem('projectName')+'.pdf';
            //fileTransfer.download(
            //    uri,
            //    filePath,
            //    function(entry) {
            //        document.getElementById("id11").innerHTML="download complete: " + entry.fullPath;
            //    },
            //    function(error) {
            //        document.getElementById("id11").innerHTML="download error source " + error.source;
            //        document.getElementById("id11").innerHTML="download error target " + error.target;
            //        document.getElementById("id11").innerHTML="upload error code" + error.code;
            //        alert('Se ha producido un error al guardar.')
            //    },
            //    true,
            //    {
            //    }
            //);
            //alert('El archivo se ha almacenado en sdcard/AppTernium/Calculos/Dry Wall/'+projectName+'.pdf');
            sessionStorage.clear();
            window.open( the_link, '_system', 'location=yes,toolbar=yes' );
        });

        request.fail(function (jqXHR, textStatus, errorThrown){
            console.error(
                "Ha ocurrido un error: "+
                textStatus, errorThrown
            );
        });
    }
}