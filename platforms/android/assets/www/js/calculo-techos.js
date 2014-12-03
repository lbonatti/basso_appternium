function eventosTechos(){
    initNuevoCalculoT();

    $('#m1-ct-1 .paso1 .siguiente-paso').click(function(){
        setEstadoPie(2,false);
    });

    $('#m1-ct-1 .pie .p1').click(function(){
        setEstadoPie(1,true);
    });

$('.paso1').show();
    $('.paso2').hide();

    eventosCalculosGenerales();

    $('.modelo').click(function(){
        if(estadoST!=1){
            $('.modelo').removeClass('selected');
            $(this).addClass('selected');
        }

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

function initNuevoCalculoT(){
    tipoC='t';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;
}

function initEditarCalculoT(id){

}