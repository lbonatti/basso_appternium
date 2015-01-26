
function abrirProyecto(p){
    cerrarTodos();
    $(p).addClass('open').animate({marginLeft:'-240px',right:'0px'});
}

function cerrarProyecto(p){
    $(p).removeClass('open').animate({marginLeft:'0px',right:'-240px'});
}

function toogleProyecto(p){
    if($(p).hasClass('open')){
        cerrarProyecto(p);
    }else{
        abrirProyecto(p);
    }
}

function cerrarTodos(){
    try{
    cerrarProyecto($('.proyecto .panel.open'));
    }catch(ex){}
}

function eventosMisCalculos(){
    $('.proyecto .panel').on('swipeleft', function(event){
        if(event.handled !== true) {
            abrirProyecto(this);
            event.handled = true;
        }
        return false;
    });
    $('.proyecto .panel').on('swiperight', function(event){
        if(event.handled !== true) {
            cerrarProyecto(this);
            event.handled = true;
        }
        return false;
    });
    $('.proyecto .panel').on('click',function(event){
        toogleProyecto(this);
    });

    $('.eliminar').on('click', function () {
        var pName = $(this).parent('.panel').children().children('.titulo').text();
        var project_id = $(this).parent().parent().attr('data-project-id');
        alertMsg('Está seguro que desea eliminar este cálculo?','dlg-delete-calc','delete',null,2);
        deleteCalc(project_id);
    });

    $('.editar').on('click', function () {
        var pName = $(this).parent('.panel').children().children('.titulo').text();
        var pId = $(this).closest('.proyecto').attr('data-project-id');
        var pType = $(this).parent('.panel').find('.icono').attr('class').replace('icono ', '');

        sessionStorage.setItem("projectName", pName);
        sessionStorage.setItem('aEditar', pId); // Generar bandera de edicion
        // Redireccionar con estado de edicion segun tipo.
        switch (pType) {
            case 'sf':
                initEditarCalculoSF();
                page = "calculo-steel-frame.html";
                $calc_type = 'Steelframe';

                break;
            case 'dw':
                initEditarCalculoDW();
                page = "calculo-dry-wall.html";
                $calc_type = 'Drywall';

                break;
            case 't':
                initEditarCalculoT();
                page = "calculo-techos.html";
                $calc_type = 'Techos';

                break;
        }
        sessionStorage.setItem('calc_type', $calc_type);

        $.mobile.changePage(page);
    });

    $('.duplicar').on('click', function () {
        var pName = $(this).parent('.panel').find('.titulo').text();
        var project_id = $(this).closest('.proyecto').attr('data-project-id');
        var $query = 'SELECT * FROM calculos WHERE project_name="'+pName+'" AND _id='+ project_id ;
        db_customQuery($query, function(pleaseWork) {
            if (pleaseWork.length > 0) {
                var proj = pleaseWork[0];
                var _projType = proj.calc_type;
                var _projData = proj.data;

                //Tomar nombre nuevo
                var newName = 'Copia - ' + pName;

                // guardarNuevo
                var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id'];
                var values;
                var currentTime = getCurrentTime();

                if (logged == true){
                    values = [localStorage.getItem('userId'),newName,_projType,_projData,currentTime,currentTime,0,0,0];
                }else{
                    values = [0,newName,_projType,_projData,currentTime,currentTime,0,0,0];
                }
                db_insert('calculos',fields, values,'',function(result){
                    if (result == 'ok') {
                        sessionStorage.setItem('newSave', 1);
                        alertMsg('Se ha guardado el proyecto: '+newName, '', 'none', 'Duplicar Calculo', 1);
                        showMisCalculos();
                    } else {
                        alertMsg('No se ha podido guardar el proyecto', '', 'none', 'Duplicar Calculo', 1);
                    }
                });

            }else{
                alertMsg('No se encontró el proyecto', '', 'none', '', 1);
            }
        });
    })

}

function deleteCalc(project_id){
    project_id = project_id || 0;
    var $query = 'UPDATE calculos SET remove=1, sync=0 WHERE _id='+project_id;

    $('#dlg-delete-calc .boton').on('click',function(){
        if (project_id != 0){
            db_customQuery($query,function(result){
                refreshList();
            })
        }
    })
}
function refreshList(){
    sessionStorage.setItem('newSave', 1);
    console.log('Borrado Correcto, actualizando lista...');
    $('#m2-mc .paso.paso1').hide();
    showMisCalculos();
}
function showMisCalculos(){
    var $query =  'SELECT * FROM calculos WHERE user_id='+localStorage.getItem('userId')+' AND remove=0 ORDER BY project_name ASC';
    var abcd = {0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{},9:{},A:{}, B:{}, C:{}, D:{}, E:{}, F:{}, G:{}, H:{}, I:{}, J:{}, K:{}, L:{}, M:{}, N:{}, Ñ:{}, O:{}, P:{}, Q:{}, R:{}, S:{}, T:{}, U:{}, V:{}, W:{}, X:{}, Y:{}, Z:{}}
    var $html = '';
    var $icono = [];
    var $date = [];
    var $ultimo;
    var $first_letter;

    db_customQuery($query,function(result){
        
        $html += '<div class="content">'
        if (result.length == 0)
        {
            $html += '<p align="center">No hay cálculos guardados.</div>';
        }
        else
        {
        
            $.each(result,function(i,v){

                $first_letter = (v.project_name.slice(0,1)).toUpperCase();
                abcd[$first_letter][i] = result[i];

            })


            $.each(abcd,function(index,value){
                if (!$.isEmptyObject(value)){
                    $html += '<div class="letra">'+index+'</div>';
                    $html += '<div class="letraContainer">';
                    $first = true;
                    $.each(value,function(index2,value2){
                        if($first == true){
                            $class = 'primero';
                            $first = false;
                        }else{
                            $class = '';
                        }
                        $html += '<div class="proyecto '+$class+'" data-snap-ignore="1" data-project-id="'+value2._id+'">';
                        $html += '<div class="panel">';

                        //ICONO
                        if (value2.calc_type == 1) {$icono['icono'] = 'sf'; $icono['txt'] = 'Steel Frame';}
                        else if(value2.calc_type == 2) {$icono['icono'] = 'dw'; $icono['txt'] = 'DryWall';}
                        else if(value2.calc_type == 3) {$icono['icono'] = 't'; $icono['txt'] = 'Techos';}
                        $html += '<div class="icono '+$icono.icono+'">'+$icono.txt+'</div>';

                        //INFO
                        $html += '<div class="info">';
                        $html += '<div class="titulo">'+value2.project_name+'</div>';

                        //FECHA
                        $tmp = value2.created.split(' ');
                        $tmp = $tmp[0].split('-');
                        $date['dia'] = $tmp[2];
                        $date['mes'] = $tmp[1];
                        $date['año'] = $tmp[0];
                        $html += '<div class="fecha">Fecha: '+$date['dia']+' / '+$date['mes']+' / '+$date['año']+'</div>';
                        $html += '</div>'; //cierre fecha;
                        $html += '<div class="boton editar">Editar</div><div class="boton duplicar">Duplicar</div><div class="boton eliminar">Eliminar</div></div></div>';
                    })

                    $html += '</div>'; //letraContainer
                }
            });
        }
        $html += '</div>';

        $('#m2-mc .paso.paso1').html($html);
        $('#m2-mc .paso.paso1').fadeIn(400,eventosMisCalculos);
        //eventosMisCalculos();
        //console.log($html)
    });
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}