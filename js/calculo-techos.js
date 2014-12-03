function eventosTechos(){
    initNuevoCalculoT();

    $('#m1-ct-1 .paso1 .siguiente-paso').click(function(){
        roof_save_step();
    });

    $('#m1-ct-1 .pie .p1').click(function(){
        setEstadoPie(1,true);
    });

    $('.paso1').show();
    $('.paso2').hide();

    eventosCalculosGenerales();

    $('.chapaTipo .op1, .chapaTipo .op2').click(function() {
        if($(this).hasClass('op2')){
            $('#m1-ct-1 .paso1 .chapaModeloAcanalada').hide();
            $('#m1-ct-1 .paso1 .chapaModeloTrapezoidal').show().find('.modelo:first-child').addClass('selected');
        }else{
            $('#m1-ct-1 .paso1 .chapaModeloTrapezoidal').hide().find('.selected').removeClass('selected');
            $('#m1-ct-1 .paso1 .chapaModeloAcanalada').show().find('.modelo:first-child').addClass('selected');
        }
    });

    $('.modelo').click(function(){
        if(estadoST!=1){
            $('.modelo').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('.modelo .mas').on('click', function(){
        var model = $(this).prev().html();
        switch(model){
            case 'A-1086':
                openInfo(1);
                break;
            case 'T-101':
                openInfo(2);
                break;
            case 'T-98':
                openInfo(3);
                break;
            case 'T-90':
                openInfo(4);
                break;
        }
    });

    $('#infoBlock .infoClose').on('click', function(){
        closeInfo();
    });


    $('.color div').click(function(){
        if(estadoST!=1){
            $('.color div').removeClass('selected');
            $(this).addClass('selected');
        }
    });


    setEstadoPie(1,true);

    setTimeout(function(){
        $('#back-t').unbind('click').click(function(){
            if(pasoSTactual>1){
                setEstadoPie(pasoSTactual-1);
            }else{
                window.history.back();
            }
        })
    },500);

}

function roof_save_step(){
    var t_name = '';
    var t_largo = '';
    var t_ancho = '';
    var t_tipo = '';
    var t_modelo = '';
    var t_color = '';

    if( $.trim( $('#m1-ct-1 .paso1 .i1').val() ).length === 0 || isNaN($.trim($('#m1-ct-1 .paso1 .i1').val() ) ) ){
        alert('Debe ingresar el largo del techo (numérico con punto decimal).');
        $(this).val('');
        return;
    }else if( $.trim( $('#m1-ct-1 .paso1 .i2').val() ).length === 0 || isNaN($.trim($('#m1-ct-1 .paso1 .i2').val() ) ) ){
        alert('Debe ingresar el ancho del techo (numérico con punto decimal).');
        $(this).val('');
        return;
    }else{
        t_name = sessionStorage.getItem("projectName");
        t_largo = parseInt( $.trim( $('#m1-ct-1 .paso1 .i1').val() ) );
        t_ancho = parseInt( $.trim( $('#m1-ct-1 .paso1 .i2').val() ) );
        t_tipo = $.trim( $('#m1-ct-1 .paso1 .chapaTipo .selected').html() );
        t_modelo = $.trim( $('#m1-ct-1 .paso1 .modelo.selected .texto').html() );
        t_color = $.trim( $('#m1-ct-1 .paso1 .color .selected').html() );

        var values = {name: t_name, largo: t_largo, ancho: t_ancho, tipo: t_tipo, modelo: t_modelo, color: t_color};
        setEstadoPie(2,false);

        calculateResult(values);
    }
}

function calculateResult(values){
    var aCubrir = values.largo * values.ancho;
    var anchoUtil = 0;
    switch (values.modelo){
        case 'A-1086':
            anchoUtil = 1.026;
            break;
        case 'T-101':
            anchoUtil = 1.01;
            break;
        case 'T-98':
            anchoUtil = 0.98;
            break;
        case 'T-90':
            anchoUtil = 0.9;
            break;
    }
    var cantChapas = Math.ceil( values.ancho / anchoUtil  );
    var aislacion = values.largo * values.ancho * 1;
    var cantTornillos = aCubrir * 6;

    $('#m1-ct-1 .paso2 .resultado-techo').html(aCubrir);
    $('#m1-ct-1 .paso2 .resultado-chapas').html(cantChapas + ' U.');
    $('#m1-ct-1 .paso2 .resultado-aislacion').html(aislacion + ' m2.');
    $('#m1-ct-1 .paso2 .resultado-tornillos').html(cantTornillos + ' U.');

    saveNewCalcTechos(values);
}

function saveNewCalcTechos(values){
    var calculos;

    if (localStorage.calculos){ // Existe calculos
        calculos = $.parseJSON(localStorage.calculos);
        if(! calculos.tipo.techos){ // Crear tipo techos
            calculos.tipo['techos'] = {};
        }
    }else{
        // Crear variables calculos y tipo techos
        localStorage.setItem('calculos', JSON.stringify( {"tipo": { "techos": {}  } } ) );
        calculos = $.parseJSON(localStorage.calculos);
    }

    var $_name = sessionStorage.getItem('projectName');
    var $_largo = values.largo;
    var $_ancho = values.ancho;
    var $_tipo = values.tipo;
    var $_modelo = values.modelo;
    var $_color = values.color;

    //Si hay datos en CALCULOS, concatenamos el nuevo proyecto
    calculos.tipo.techos[$_name] =
    {
        "vars": {
            "largo": $_largo,
            "ancho": $_ancho,
            "tipo": $_tipo,
            "modelo": $_modelo,
            "color": $_color
        }
    }

    localStorage.setItem('calculos', JSON.stringify(calculos));
    sessionStorage.clear();
}

function initNuevoCalculoT(){
    tipoC='t';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;
}

function initEditarCalculoT(id){}

function openInfo(block){
    $('#infoBlock').fadeIn();
    $('#infoBlock > div').hide();
    switch (block){
        case 1:
            $('#infoBlock .modelData1').show();
            break;
        case 2:
            $('#infoBlock .modelData2').show();
            break;
        case 3:
            $('#infoBlock .modelData3').show();
            break;
        case 4:
            $('#infoBlock .modelData4').show();
            break;
    }
}
function closeInfo(){
    $('#infoBlock').fadeOut();
}