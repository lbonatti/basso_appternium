var newSave = 1;
if (sessionStorage.getItem('username') != 'anonimo'){
    setInterval(function(){
        if($('.page-header h1').text() == 'Inicio' && newSave == 1){
            syncDB();
            newSave = 0;
        }
    },1000);
}

$(document).on("pageshow", function(event) {
    if ($('.bx-wrapper').length == 0) {
        loadMainSlider();
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
    $('.menu-options .logout').click(function(){
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
    $('.menu-options .logout').click(function(){
        theLogOut();
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
    var $getEditable = 'SELECT * FROM calculos WHERE user_id='+sessionStorage.getItem('userId') + ' AND remove = 0 ORDER BY modified DESC LIMIT 10';
    db_customQuery($getEditable, function(result) {
        if (result.length > 0) {
            for(var i = 0; i < result.length; i++){
                var pSlideName = result[i].project_name;
                var pSlideType = result[i].calc_type;
                var pSlideModDate = result[i].modified;

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

        $('#m-inicio .bxslider').bxSlider($bxSliderOptions);
    });

}

function esAnonimo(){
    var username = sessionStorage.getItem('username');
    if(username === 'anonimo'){
        sessionStorage.setItem('userId',0);
        $('.menu-options .perfil').hide();
    }
}

function cargarSlide(){
    var userType = sessionStorage.getItem("username");

    if (userType !== 'anonimo') {
        var userID = sessionStorage.getItem("userId");

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
    $('.page-header a.page-back').click(function(){
        window.history.back();
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

    $('.menu a[data-title="Logout"]').click(function(){
        theLogOut();
    });
}

$(document).on("pageshow",function(evt){
    var source = evt.target || evt.srcElement;
    boton_menu($(source).attr('id'))
});

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
    });

    if(typeof cb == "function"){
        $('.dialogo.alertMsg .boton').on('click', function(){ cb(); });
    }
}

