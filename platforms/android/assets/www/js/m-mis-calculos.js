
function abrirProyecto(p){
    cerrarTodos()
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
    $('.proyecto .panel').on('swipeleft',  function(event){
        if(event.handled !== true) {
            abrirProyecto(this)
            event.handled = true;
        }
        return false;
    });
    $('.proyecto .panel').on('swiperight',  function(event){
        if(event.handled !== true) {
            cerrarProyecto(this)
            event.handled = true;
        }
        return false;
    });
    $('.proyecto .panel').click(function(event){
        toogleProyecto(this)
    });



}