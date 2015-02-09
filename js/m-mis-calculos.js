
// verifica si se esta editando un calculo
var clickMessage = false;

function eventosMisCalculos(){

    $('.proyectSlide').on('click', function () {
        var $this = $(this);
        var pName = $this.find('.titulo').text();
        var pId = $this.parent().parent().attr('data-project-id');
        var pType = $this.find('.icono').attr('class').replace('icono ', '');

        sessionStorage.setItem('aResumen', 1);
        editarCalculo(pName, pId, pType);

    });

    $('.eliminar').on('click', function () {
        var project_id = $(this).parent().parent().parent().attr('data-project-id');
        //alertMsg('¿Está seguro que desea eliminar este cálculo?', '', 'none', 'Eliminar Proyecto', 2);
        alertMsg('Está seguro que desea eliminar este cálculo?','dlg-delete-calc','delete',null,2);
        deleteCalc(project_id);
    });

    $('.editar').on('click', function () {
        var $this = $(this);
        var pName = $this.parent().parent().find('.proyectSlide .titulo').text();
        var pId = $this.parent().parent().parent().attr('data-project-id');
        var pType = $this.parent().parent().find('.proyectSlide .icono').attr('class').replace('icono ', '');

        sessionStorage.setItem('aResumen', 0);
        editarCalculo(pName, pId, pType);

    });

    $('.duplicar').on('click', function () {
        var $this = $(this);
        var pName = $this.parent().parent().find('.proyectSlide .titulo').text();
        var pId = $this.parent().parent().parent().attr('data-project-id');
        duplicarCalculo(pName, pId);
    })

}

function deleteCalc(project_id) {
    project_id = project_id || 0;
    var $query = 'UPDATE calculos SET remove=1, sync=0 WHERE _id='+project_id;

    $('#dlg-delete-calc .boton').on('click', function() {
        if (project_id != 0) {
            db_customQuery($query,function(result) {
                refreshList();
            });
            _syncDeleted();
        }
    })
}
function refreshList(){
    sessionStorage.setItem('newSave', 1);
    //console.log('Borrado Correcto, actualizando lista...');
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
        
        $html += '<div class="content">';
        if (result.length == 0)
        {
            $html += '<p align="center">No hay cálculos guardados.</p>';
        }
        else
        {
        
            $.each(result,function(i,v){

                $first_letter = (v.project_name.slice(0,1)).toUpperCase();
                abcd[$first_letter][i] = result[i];

            });


            var winW = $(window).width();
            var psW = winW-80;
            var psiW = winW-160;
            var asW = winW;

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
                        $html += '<div class="swiper-container '+$class+'" data-snap-ignore="1" data-project-id="' +value2._id+ '"><div class="swiper-wrapper"><div class="swiper-slide proyectSlide">';

                        //ICONO
                        if (value2.calc_type == 1) {$icono['icono'] = 'sf'; $icono['txt'] = 'Steel Frame';}
                        else if(value2.calc_type == 2) {$icono['icono'] = 'dw'; $icono['txt'] = 'DryWall';}
                        else if(value2.calc_type == 3) {$icono['icono'] = 't'; $icono['txt'] = 'Techos';}
                        $html += '<div class="icono '+$icono.icono+'">'+$icono.txt+'</div>';

                        //INFO
                        $html += '<div class="info" style="width: '+psiW+'px;">';
                        $html += '<div class="titulo">'+value2.project_name+'</div>';

                        //FECHA
                        $tmp = value2.created.split(' ');
                        $tmp = $tmp[0].split('-');
                        $date['dia'] = $tmp[2];
                        $date['mes'] = $tmp[1];
                        $date['año'] = $tmp[0];
                        $html += '<div class="fecha">Fecha: '+$date['dia']+' / '+$date['mes']+' / '+$date['año']+'</div>';
                        $html += '</div></div>'; //cierre info y proyectSlide;
                        $html += '<div class="swiper-slide actionsSlide"><div class="icono arrow"></div><div class="eliminar">Eliminar</div><div class="duplicar">Duplicar</div><div class="editar">Editar</div></div>';
                        $html += '</div></div>'; //cierra swiper-wrapper y container
                    });

                    $html += '</div>'; //letraContainer
                }
            });
        }
        $html += '</div>';

        $('#m2-mc .paso.paso1').html($html);
        $('#m2-mc .paso.paso1').fadeIn(400,eventosMisCalculos);


        $('.swiper-container').css('width', winW + 'px');
        $('.swiper-slide.proyectSlide').css('width', psW + 'px');
        $('.swiper-slide.actionsSlide').css('width', asW + 'px');

        var listadiv = $('.swiper-container');
        $.each(listadiv, function (){
            var mySwiper = new Swiper(this,{
                slidesPerView: 'auto',
                calculateHeight: true
            });
        });
    });
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}