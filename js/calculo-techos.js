var values;
function eventosTechos(){

    if(sessionStorage.getItem('aEditar')){

        var pID = sessionStorage.getItem('aEditar'); //  Tomar id de proy a editar.
        sessionStorage.setItem('editardesderesumen', pID);
        sessionStorage.removeItem('aEditar');  //  Eliminar bandera de edicion.
        var $getEditable = 'SELECT * FROM calculos WHERE _id='+ pID ;
        db_customQuery($getEditable, function(result) {
            if(result.length > 0) {
                var editablePName = result[0].project_name;
                var editablePVars = $.parseJSON(result[0].data).vars;

                // Cargar campos con data.

                // Titulo
                $('#m1-ct-1 .projectName').text(editablePName);

                // p1 largo
                $('#m1-ct-1 .paso1 .i1').val(editablePVars.largo);

                // p1 ancho
                $('#m1-ct-1 .paso1 .i2').val(editablePVars.ancho);

                // p1 tipo
                if(editablePVars.tipo == 'Acanalada'){
                    $('#m1-ct-1 .paso1 .chapaTipo .op1').trigger('click');
                }else{
                    $('#m1-ct-1 .paso1 .chapaTipo .op2').trigger('click');
                }

                // p1 modelo
                $('#m1-ct-1 .paso1 .modelo .texto').each(function(index){
                    var $this = $(this);
                    if ($this.text() == editablePVars.modelo){
                        $this.trigger('click');
                    }
                });

                // p1 color
                $('#m1-ct-1 .paso1 .color .texto').each(function(index){
                    var $this = $(this);
                    if ($this.text() == editablePVars.color){
                        $this.trigger('click');
                    }
                });

            }else{
                alertMsg('Error al cargar el proyecto', '', 'none', 'Editar Proyecto', 1, function(){
                    $.mobile.changePage("m-mis-calculos.html");
                });
            }

        });

        estadoST=2;

    }else{
        initNuevoCalculoT();
        $('.paso.paso1').show();
        $('.paso.paso2').hide();
    }

    $('#m1-ct-1 .paso1 .siguiente-paso').click(function(){
        roof_save_step();
    });

    $('#m1-ct-1 .pie .p1').click(function(){
        if( ! $(this).hasClass('disabled') ) {
            setEstadoPie(1, true);
        }
    });


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
        //if(estadoST!=1){
            $('.modelo').removeClass('selected');
            $(this).addClass('selected');
        //}
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
        //if(estadoST!=1){
            $('.color div').removeClass('selected');
            $(this).addClass('selected');
        //}
    });


    setEstadoPie(1,true);

    $('#back-t').on('click',function(e){
        e.preventDefault();
        if(pasoSTactual>1){
            setEstadoPie(pasoSTactual-1);
        }else{
            window.history.back();
        }
    });

    if(sessionStorage.getItem('aResumen') && sessionStorage.getItem('aResumen') == 1){
        setTimeout(function (){
            $('.paso1').hide();
            $('.paso2').show();
            roof_save_step();
            modoLectura();
            sessionStorage.removeItem('aResumen');
        }, 100);
    }

}

function roof_save_step(){
    var t_name = '';
    var t_largo = '';
    var t_ancho = '';
    var t_tipo = '';
    var t_modelo = '';
    var t_color = '';

    if( $.trim( $('#m1-ct-1 .paso1 .i1').val() ).length === 0 || isNaN($.trim($('#m1-ct-1 .paso1 .i1').val() ) ) ){
        alertMsg('Debe ingresar el largo del techo (numérico con punto decimal).', '', 'none', '', 1);
        $(this).val('');
        return;
    }else if( $.trim( $('#m1-ct-1 .paso1 .i2').val() ).length === 0 || isNaN($.trim($('#m1-ct-1 .paso1 .i2').val() ) ) ){
        alertMsg('Debe ingresar el largo del techo (numérico con punto decimal).', '', 'none', '', 1);
        $(this).val('');
        return;
    }else{
        t_name = sessionStorage.getItem("projectName");
        t_largo = parseInt( $.trim( $('#m1-ct-1 .paso1 .i1').val() ) );
        t_ancho = parseInt( $.trim( $('#m1-ct-1 .paso1 .i2').val() ) );
        t_tipo = $.trim( $('#m1-ct-1 .paso1 .chapaTipo .selected').html() );
        t_modelo = $.trim( $('#m1-ct-1 .paso1 .modelo.selected .texto').html() );
        t_color = $.trim( $('#m1-ct-1 .paso1 .color .selected').html() );

        values = {name: t_name, largo: t_largo, ancho: t_ancho, tipo: t_tipo, modelo: t_modelo, color: t_color};
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

    if (sessionStorage.getItem('aResumen') != 1 ) {
        //GUARDAMOS EL CALCULO EN LA VARIABLE LOCAL DE LA APP.
        saveNewCalcTechos(values, 1);
    }

}

function saveNewCalcTechos(values, showMessage) {
    var calculos;
    var currentTime = getCurrentTime();

    sessionStorage.setItem('calculos', JSON.stringify( {"tipo": { "techos": {}  } } ) );
    calculos = $.parseJSON(sessionStorage.calculos);

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

    sessionStorage.setItem('calculos', JSON.stringify(calculos));
    //Aquí procesaremos el web services que guardará el calculo en la BD
    //Mandamos el string de JSON a la BD -> ¡¡¡ SOLO EL STRING DEL CALCULO  !!!
    // ID calculo, ID usuario, tipo de calculo (1=SF, 2=DW, 3=T), json con los datos del calculo
    // con el success del ajax (guardado en la BD remota) cambiamos el valor sinc = 1 del calculo en sessionStorage
    var $user = sessionStorage.getItem('username');
    var $dataSaveBD = JSON.stringify(calculos.tipo.techos[$_name]);
    var $calcType = 3;

    if (estadoST == 0) { //Si el calculo es nuevo
        //Guardamos en bd local el calculo
        var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id']
        if (logged == true) {
            var values = [localStorage.getItem('userId'),$_name,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        alertMsg('Nuevo calculo '+$_name+' guardado', '', 'none', '', 1);
                    }
                    sessionStorage.setItem('newSave', 1);
                } else {
                    if (showMessage !== 0) {
                        alertMsg('No se ha podido guardar', '', 'none', '', 1);
                    }
                }
            })
        } else {
            var values = [0,$_name,$calcType,$dataSaveBD,currentTime,currentTime,0,0,0]
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    modoLectura(); //si no hay error, pasamos el estado a solo lectura.
                    if (showMessage !== 0) {
                        alertMsg('Nuevo calculo '+$_name+' guardado', '', 'none', '', 1);
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
        var $query = 'UPDATE calculos SET data=\''+$dataSaveBD+'\', modified=\''+currentTime+'\', sync=0 WHERE project_name=\''+pName+'\' AND user_id='+localStorage.getItem('userId')+' AND calc_type='+$calcType;
        db_updateQueryEdit($query, function(result,updatedID) {
            if (result == 'ok') {
                if (showMessage !== 0) {
                    alertMsg('El calculo '+$_name+' ha sido editado', '', 'none', '', 1);
                }
                else
                {
                    alertMsg('NONO', '', 'none', '', 1);
                }
                modoLectura();
                sessionStorage.setItem('newSave', 1);
            }
        });
    }
    // Si el usuario es anonimo, solo tendremos acceso a la variable local, asi que no haremos nada.
    // por que los datos ya se encuentran en sessionStorage. (y le dejamos el sync en 0 para cuando loguee mandar
    // los calculos a la BD remota)
    estadoST = 1;
}

function initNuevoCalculoT(){
    stepCompleted = 0;
    tipoC='t';
    estadoST=0;
    pasoSTactual = 1;
    pasoSTmaximo = 1;
    $('#m1-ct-1 .projectName').html(sessionStorage.getItem("projectName"));
}

function initEditarCalculoT(){
    tipoC='t';
    estadoST=2;
    pasoSTactual = 1;
    pasoSTmaximo = 1;
    $('#m1-ct-1 .paso input[type=number]').removeAttr('disabled');
}

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

function generateDivRenderT()
{
    var filename = sessionStorage.getItem('username') + '_techos_' + sessionStorage.getItem('projectName');
    viewPDF(filename, 'techo');
}
