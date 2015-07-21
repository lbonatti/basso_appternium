var slider = null;

var isLandscapeMode = window.innerWidth > window.innerHeight;

$(window).on("orientationchange", function(e) {
    $('body').removeClass('landscape portrait').addClass(e.orientation);
    adjustBtns(e.orientation);
});


function adjustBtns(o){
    //console.log(o);
    if(o == 'landscape'){
        var winW = $(window).innerWidth();
        var winH = $(window).innerHeight();
        var heightFix = winH - 55; // 55 Header
        //var theBtnsH = winW * .333;
        //var theUtilBtnsH = winW * .25;

        if( $('#m-inicio.ui-page-active').length > 0 ){
            $('.page-content').css('height', heightFix);

            //$('.botongrissuave.option').css('padding-top', theBtnsH);
            //$('.botongrissuave.option').css({
            //    'padding-top': '0px',
            //    'height': theBtnsH
            //});

        }
        if( $('#m1-nuevo-calculo.ui-page-active').length > 0 ){
            //$('.botongrissuave.option').css('padding-top', theBtnsH);
            //$('.botongrissuave.option').css({
            //    'padding-top': '0px',
            //    'height': theBtnsH
            //});

            $('.page-content').css('height', heightFix);
        }
        if( $('#m4-u.ui-page-active').length > 0 ){
            //$('.botongrissuave.option').css('padding-top', '25%');

        }

    }else{
        if( $('#m1-nuevo-calculo.ui-page-active').length > 0 ) {
            //$('.botongrissuave.option').css('padding-top', '50%');
        }
        if( $('#m4-u.ui-page-active').length > 0 ){
            //$('.botongrissuave.option').css('padding-top', '50%');
        }
    }
}

$(document).on('pagebeforeshow', function(){
    $('.botongrissuave.option').hide();
});

$(document).on("pageshow", function(event) {

    setTimeout(function(){
        $(window).trigger("orientationchange");
        $('.botongrissuave.option').show();
    },100);

    var source = event.target || event.srcElement;
    boton_menu($(source).attr('id'));

    // Si estamos en la home
    if ($(' #m-inicio.ui-page-active ').length > 0) {
        // Si existe el slider
        if (slider) {
            $('.page-content .bx-wrapper').remove();
            if ($('.page-content .bxslider').length == 0) {
                $('.page-content').prepend('<ul class="bxslider" data-snap-ignore="1"></ul>');
            }
            loadMainSlider();
        } else {
            loadMainSlider();
        }
    }

    $('.btn-settings').unbind('click').click(function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            $('.menu-options').hide();
        }else{
            $(this).addClass('selected');
            $('.menu-options').show();
        }
    });
    $('.btn-settings').removeClass('selected');
    $('.menu-options').hide();

    $('.menu-options .perfil').unbind('click').click(function(){
        $.mobile.changePage('u-ajustes.html');
    });

    $('.menu-options .contacto').unbind('click').click(function(){
        $.mobile.changePage('m-feedback.html');
    });

    $('.menu-options .terminos').unbind('click').click(function(){
        $.mobile.changePage('u-tos.html');
    });

    $('.menu-options .version').unbind('click').click(function(){
        showAppVersion();
    });
    
    $('.menu-options .logout').unbind('click').on( 'click', function(e){
        e.preventDefault();
        theLogOut();
    });

});

$(document).ready(function() {

    $('.menu-options .perfil').unbind('click').click(function(){
        $.mobile.changePage('u-ajustes.html');
    });

    $('.menu-options .contacto').unbind('click').click(function(){
        $.mobile.changePage('m-feedback.html');
    });

    $('.menu-options .terminos').unbind('click').click(function(){
        $.mobile.changePage('u-tos.html');
    });

    $('.menu-options .version').unbind('click').click(function(){
        showAppVersion();
    });

    esAnonimo();

    cargarSlide();

    menuLateral();

    $('.shadow').unbind('click').click(function(){
        unblockScreen();
    });

    esconderUserMenu();

    precargarSectores();
    precargarPaises();

});

function loadMainSlider() {

    $('#m-inicio .bxslider').html('');

    var user_id = localStorage.getItem('userId') ? localStorage.getItem('userId') : 0;
    var $getEditable = 'SELECT * FROM calculos WHERE user_id=' + user_id + ' AND remove = 0 ORDER BY created DESC LIMIT 4';
    var $noProyect = false;
    db_customQuery($getEditable, function(result) {
        if (result.length > 0) {
            for(var i = 0; i < result.length; i++){
                var pSlideName = result[i].project_name;
                var pSlideType = result[i].calc_type;
                var pSlideId = result[i]._id;
                var pSlideModDate = formatDate( result[i].modified );

                $('#m-inicio .bxslider').append('<li data-id="'+pSlideId+'" data-name="'+pSlideName+'" data-type="'+pSlideType+'"><img src="img/icon'+pSlideType+'.png" /><div class="titulo">'+pSlideName+'</div><div class="fecha">'+pSlideModDate+'</div></li>');

            }

            $bxSliderOptions = {
                controls:false
            };
        } else {
            $noProyect = true;
            $('#m-inicio .bxslider').append('<li style="width: 500px !important;"><div class="titulo" style="text-align: center;width: 100%;">No se encontraron proyectos</div><div class="fecha"></div></li>');
            $bxSliderOptions = {
                controls:false,
                infiniteLoop: false,
                touchEnabled: false,
                pager: false
            };
        }

        slider = $('#m-inicio .bxslider').bxSlider($bxSliderOptions);

        if ($noProyect) {
            var style = $('.bx-wrapper').attr('style');
            $('.bx-wrapper').attr('style', style + " margin-bottom: 0px !important;");
        }

        $('#m-inicio .bxslider li').unbind('click').on('click', function() {
            var $this = $(this);
            var pId = $this.attr('data-id');
            var pName = $this.attr('data-name');
            var pType;

            switch ($this.attr('data-type')) {
                case '1':
                    pType = 'sf';
                    break;
                case '2':
                    pType = 'dw';
                    break;
                case '3':
                    pType = 't';
                    break;
            }

            sessionStorage.setItem('aResumen', 1);
            sessionStorage.setItem('pasoSTactual', 1);
            editarCalculo(pName, pId, pType);
        });
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
        //console.log('es anonimo');
    }
}


function esconderUserMenu(){
    $('.menu-options').hide();
    $('.btn-settings').removeClass('selected');
}
function boton_menu(pag){
    $('.page-header a.open-menu').unbind('click').click(function(){
        if(snapper.state().state=='closed'){
            snapper.open('left');
        }else{
            snapper.close();
        }
    });
    $('.page-header a.page-back').unbind('click').click(function() {

        if( ! $(this).hasClass('btnUtilidades') ) {
            window.location.href="m-inicio.html";
        }
    });




    $('.page-content').height($(window).height()-55);
    $('.page-content').unbind('click').click(function(){
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
    title = ((title != undefined && title != '') ? title : 'Atención');
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

function showAppVersion(){
    $('.btn-settings.selected').click();
    alertMsg(sessionStorage.getItem('appVersion'), 'popAppVersion', '', 'App Version', 1);
}

function optionMsg(text, title, cb){
    title = ((title != undefined && title != '') ? title : 'Atención');

    var $html = '';

    $html += '<div class="dialogo alertMsg">';

    $html += '<div class="titulo">'+title+'</div>';
    $html += '<div class="mensaje">'+text+'</div>';
    $html += '<div class="boton">Aceptar</div>';
    $html += '<div class="cancelar">Cancelar</div>';
    $html += '</div>'; //Cierra dlg

    $('.shadow').css('height','100%').show();
    $('.snap-content').after($html);
    $('.alertMsg').show();

    if(typeof cb == "function"){
        $('.dialogo.alertMsg .boton').on('click', function(){ cb(); });
    }

    $('.alertMsg .boton, .alertMsg .cancelar').on("click",function(e){
        e.preventDefault();
        $(this).parent().remove();
        $('.shadow').css('height','0');
    });
}