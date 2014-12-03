

$(document).ready(function(){

    cargarSlide();

    menuLateral();
    $('.bxslider').bxSlider({
        controls:false
    });

    $('.shadow').click(function(){
        unblockScreen();
    });

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

    });

    $('.menu-options .terminos').click(function(){

    });
    $('.menu-options .logout').click(function(){
        window.location.href='login.html';
    });

    esconderUserMenu();

    precargarPaises();

});

function cargarSlide(){
    var userType = localStorage.getItem("username");

    if(userType !== 'anonimo'){
        var userID = localStorage.getItem("userId");

        $.ajax({
            url:"http://projectsunderdev.com/app-ternium/ws/sliderHome.php",
            type:'POST',
            data:{userID: userID},
            success:function(result){
                console.log(result);
            },
            error:function(error){
                console.log(error);
            }
        });


    }else{
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
        localStorage.clear();
        window.location.href="login.html";
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
    esconderDotMenu();
}


