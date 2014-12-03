var estadoST = 0; // 0=Nuevo   1=SoloLectura   2=Editando
var pasoSTactual = 1;
var pasoSTmaximo = 1;
var tipoC="t"; // sf dw t


function eventosSteelFrame(){
    initNuevoCalculoSF();

    $('#m1-csf-1 .paso1 .siguiente-paso').click(function(){
        st_save_step1();
        setEstadoPie(2,false);
    });
    $('#m1-csf-1 .paso2 .siguiente-paso').click(function(){
        st_save_step2(1);
    });
    $('#m1-csf-1 .paso3 .siguiente-paso').click(function(){
        st_save_step3(1);
    });
    $('#m1-csf-1 .paso4 .siguiente-paso').click(function(){
        setEstadoPie(5,false);
    });


    $('#m1-csf-1 .pie .p1').click(function(){
        setEstadoPie(1,true);
    });
    $('#m1-csf-1 .pie .p2').click(function(){
        setEstadoPie(2,true);
    });
    $('#m1-csf-1 .pie .p3').click(function(){
        setEstadoPie(3,true);
    });
    $('#m1-csf-1 .pie .p4').click(function(){
        setEstadoPie(4,true);
    });
    $('#m1-csf-1 .pie .p5').click(function(){
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

function setEstadoPie(paso, tab){
    var pestana = $('.pie .p'+paso);
    var todasPestanas = $('.pie div');


    if(paso>1){
        if(tab)
            if(pestana.hasClass('disabled'))return;
    }
    if(paso > pasoSTmaximo) pasoSTmaximo=paso;
    pasoSTactual = paso;
    var pestanasAnteriores = $('.pie div:lt('+(pasoSTmaximo)+')');

    $('.paso').hide();
    $('.paso'+paso).show();

    if(estadoST == 0){ //Nuevo
        todasPestanas.addClass('disabled').removeClass('selected');
        pestanasAnteriores.removeClass('disabled');
        pestana.removeClass('disabled').addClass('selected');
        $('#back-'+tipoC).show();
        $('.dot-menu').hide();

        if(tipoC=='sf' && paso==5) modoLectura();
        if(tipoC=='dw' && paso==3) modoLectura();
        if(tipoC=='t'  && paso==2) modoLectura();

    }else if(estadoST == 1){ //SoloLectura
        todasPestanas.removeClass('disabled').removeClass('selected');
        pestana.addClass('selected');
        modoLectura();
    }else if(estadoST == 2){ //Editando
        todasPestanas.removeClass('disabled').removeClass('selected');
        pestana.addClass('selected');

        $('#back-'+tipoC).show();
        $('.dot-menu').hide();

        if(tipoC=='sf' && paso==5) modoLectura();
        if(tipoC=='dw' && paso==3) modoLectura();
        if(tipoC=='t'  && paso==2) modoLectura();

        if(tipoC=='sf'){
            if(paso==5)
                $('.pie .p5').removeClass('disabled');
            else
                $('.pie .p5').addClass('disabled');
        }
        if(tipoC=='dw'){
            if(paso==3)
                $('.pie .p3').removeClass('disabled');
            else
                $('.pie .p3').addClass('disabled');
        }
        if(tipoC=='t'){
            if(paso==2)
                $('.pie .p2').removeClass('disabled');
            else
                $('.pie .p2').addClass('disabled');
        }

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

    $('#m1-csf-1 .projectName').html(localStorage.getItem("projectName"));

}


function initEditarCalculoSF(){
    tipoC='sf';
    estadoST=1;
    pasoSTactual = 1;
    pasoSTmaximo = 4;
}

function st_save_step1(){
    var plantas = $('#m1-csf-1 .paso1 .cantPlantas').find('.selected').data('value');
    var entrepiso = $('#m1-csf-1 .paso1 .tipoEntrepiso').find('.selected').data('value');

    localStorage.setItem("st-s1-plantas", plantas);
    localStorage.setItem("st-s1-entrepiso", entrepiso);

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

    if(localStorage.getItem("st-s1-plantas") === '2') {
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
        localStorage.setItem("st-s2-p1-ancho", p1Ancho);
        localStorage.setItem("st-s2-p1-largo", p1Largo);
        localStorage.setItem("st-s2-p1-alto", p1Alto);
        localStorage.setItem("st-s2-p1-paredes", p1Paredes);

        localStorage.setItem("st-s2-p2-ancho", p2Ancho);
        localStorage.setItem("st-s2-p2-largo", p2Largo);
        localStorage.setItem("st-s2-p2-alto", p2Alto);
        localStorage.setItem("st-s2-p2-paredes", p2Paredes);
        if(redirect){
            setEstadoPie(3,false);
        }
    }
}
function st_save_step3(){
    var mts = $.trim( $('#m1-csf-1 .paso2 .i1').val() );

    if(mts.length === 0){
        alert('El campo es requerido.');
    }else{
        localStorage.setItem("st-s3-mts", mts);
        if(redirect){
            setEstadoPie(4,false);
        }
    }

}