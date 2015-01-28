var slider = null;

$(document).on("pageshow", function(event) {

    var source = event.target || event.srcElement;
    boton_menu($(source).attr('id'));

    // Si estamos en la home
    if ( $(' #m-inicio.ui-page-active ').length > 0 )
    {
        // Si existe el slider
        if (slider)
        {
            slider.reloadSlider();
        }else{
            loadMainSlider();
        }
    }

    $('.btn-settings').click(function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            $('.menu-options').hide();
        }else{
            $(this).addClass('selected');
            $('.menu-options').show();
        }
    });

    $('.menu-options .perfil').click(function(){
        $.mobile.changePage('u-ajustes.html');
    });

    $('.menu-options .contacto').click(function(){
        $.mobile.changePage('m-feedback.html');
    });

    $('.menu-options .terminos').click(function(){
        $.mobile.changePage('u-tos.html');
    });
    $('.menu-options .logout').on( 'touchend', function(e){
        e.preventDefault();
        theLogOut();
    });

});

$(document).ready(function() {

    $('.menu-options .perfil').click(function(){
        $.mobile.changePage('u-ajustes.html');
    });

    $('.menu-options .contacto').click(function(){
        $.mobile.changePage('m-feedback.html');
    });

    $('.menu-options .terminos').click(function(){
        $.mobile.changePage('u-tos.html');
    });

    esAnonimo();

    cargarSlide();

    menuLateral();

    $('.shadow').click(function(){
        unblockScreen();
    });

    esconderUserMenu();

    precargarPaises();

});

function loadMainSlider() {

    $('#m-inicio .bxslider').html('');

    var $getEditable = 'SELECT * FROM calculos WHERE user_id='+localStorage.getItem('userId') + ' AND remove = 0 ORDER BY created DESC LIMIT 4';
    
    db_customQuery($getEditable, function(result) {
        if (result.length > 0) {
            for(var i = 0; i < result.length; i++){
                var pSlideName = result[i].project_name;
                var pSlideType = result[i].calc_type;
                var pSlideModDate = formatDate( result[i].modified );

                $('#m-inicio .bxslider').append('<li><img src="img/icon'+pSlideType+'.png" /><div class="titulo">'+pSlideName+'</div><div class="fecha">'+pSlideModDate+'</div></li>');

            }

            $bxSliderOptions = {
                controls:false
            };
        } else {

            $('#m-inicio .bxslider').append('<li style="width: 500px !important;"><div class="titulo" style="text-align: center;width: 100%;">No se encontraron proyectos</div><div class="fecha"></div></li>');

            $bxSliderOptions = {
                controls:false,
                infiniteLoop: false,
                touchEnabled: false,
                pager: false
            };
        }

        slider = $('#m-inicio .bxslider').bxSlider($bxSliderOptions);
    });

}

function formatDate(date){
    var year = date.substr(0, 4);
    var month = date.substr(5, 2);
    var day = date.substr(8, 2);
    return day + '/' + month + '/' + year ;
}

function esAnonimo(){
    var username = localStorage.getItem('username');
    if(username === 'anonimo'){
        localStorage.setItem('userId',0);
        $('.menu-options .perfil').hide();
    }
}

function cargarSlide(){
    var userType = localStorage.getItem("username");

    if (userType !== 'anonimo') {
        var userID = localStorage.getItem("userId");

        $.ajax({
            url:url_webservices+"/sliderHome.php",
            type:'POST',
            data:{userID: userID},
            success:function(result){
                //console.log(result);
            },
            error:function(error){
                //console.log(error);
            }
        });
    } else {
        console.log('es anonimo');
    }
}


function esconderUserMenu(){
    $('.menu-options').hide();
    $('.btn-settings').removeClass('selected');
}
function boton_menu(pag){
    $('.page-header a.open-menu').click(function(){
        if(snapper.state().state=='closed'){
            snapper.open('left');
        }else{
            snapper.close();
        }
    });
    $('.page-header a.page-back').click(function() {

        if( ! $(this).hasClass('btnUtilidades') ) {
            window.history.back();
        }
    });




    $('.page-content').height($(window).height()-55);
    $('.page-content').click(function(){
        esconderDotMenu();
    })

    $('.menu .item').removeClass('selected');
    if(pag.startsWith('m-inicio')){
        $('.menu a[data-title="Inicio"]').addClass('selected');
    }if(pag.startsWith('m1-')){
        $('.menu a[data-title="Nuevo cálculo"]').addClass('selected');
    }if(pag.startsWith('m2-')){
        $('.menu a[data-title="Mis cálculos"]').addClass('selected');
    }if(pag.startsWith('m3-')){
        $('.menu a[data-title="Galeria"]').addClass('selected');
    }if(pag.startsWith('m4-')){
        $('.menu a[data-title="Utilidades"]').addClass('selected');
    }if(pag.startsWith('m5-')){
        $('.menu a[data-title="Proveedores"]').addClass('selected');
    }if(pag.startsWith('m6-')){
        $('.menu a[data-title="Feedback"]').addClass('selected');
    }

}

function blockScreen(){
    $('.shadow').height($('#m-inicio').height()).show();
}

function unblockScreen(){
    $('.shadow').hide();
    $('.dialogo').hide();
    $('.alertMsg').remove();
    esconderDotMenu();
}

//Type 1: OK, type 2: Ok/Cancel
function alertMsg(text, id, action, title, type, cb){
    type = type || 1;
    title = title || 'Atención';
    action = action || '';
    cb = cb || ''; // The Callback.
    var $html = '';

    $html += '<div id="'+id+'" class="dialogo alertMsg" data-action="'+action+'">';

    $html += '<div class="titulo">'+title+'</div>';
    $html += '<div class="mensaje">'+text+'</div>';
    $html += '<div class="boton">Aceptar</div>';

    if (type == 2){
        $html += '<div class="cancelar">Cancelar</div>';
    }

    $html += '</div>'; //Cierra dlg

    $('.shadow').css('height','100%').show();
    $('.snap-content').after($html);
    $('.alertMsg').show();


    $('.alertMsg .boton, .alertMsg .cancelar').on("click",function(e){
        e.preventDefault();
        $(this).parent().remove();
        $('.shadow').css('height','0');

        if ($(this).hasClass('boton')) {
            clickMessage = 1;
        }
    });

    if(typeof cb == "function"){
        $('.dialogo.alertMsg .boton').on('click', function(){ cb(); });
    }
}

