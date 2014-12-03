

function eventosDryWall(){
    initNuevoCalculoDW();

    $('#m1-cdw-1 .paso1 .siguiente-paso').click(function(){
        setEstadoPie(2,false);
    });

    $('#m1-cdw-1 .paso2 .siguiente-paso').click(function(){
        setEstadoPie(3,false);
    });

    $('#m1-cdw-1 .pie .p1').click(function(){
        setEstadoPie(1,true);
    });
    $('#m1-cdw-1 .pie .p2').click(function(){
        setEstadoPie(2,true);
    });
    $('#m1-cdw-1 .pie .p3').click(function(){
        setEstadoPie(3,true);
    });

    $('.paso1').show();
    $('.paso2, .paso3').hide();

    eventosCalculosGenerales();

    setEstadoPie(1,true);

    setTimeout(function(){
        $('#back-dw').unbind('click').click(function(){
            if(pasoSTactual>1){
                setEstadoPie(pasoSTactual-1);
            }else{
                window.history.back();
            }
        })
    },500);


}


/*
 * TODO: Completar guardado
 */

function saveNewCalcDryWall(values){

    if (localStorage.getItem('calculos')){
        var calculos = $.parseJSON(localStorage.getItem('calculos'));
    }else{
        calculos = {"tipo": { "dry_wall": {}  } };
    }
    var $_name = sessionStorage.getItem('projectName');
    var $_largo = values.largo;


    //Si hay datos en CALCULOS, concatenamos el nuevo proyecto
    calculos.tipo.techos[$_name] =
    {
        "vars": {
            "largo": $_largo
        }
    }

    localStorage.setItem('calculos', JSON.stringify(calculos));
    sessionStorage.clear();
}

function initNuevoCalculoDW(){
    tipoC='dw';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;

}