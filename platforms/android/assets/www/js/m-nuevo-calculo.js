function eventosNuevoCalculo(){


    $('#m1-nuevo-calculo a.option').on('click', function(e){

        var $this = $(this);
        var projectName = $.trim($('.projectName').val());
        if( ! $this.hasClass('vacio') ){
            if(projectName.length === 0 ){
                alert('Debe ingresar un nombre de proyecto');
                e.preventDefault();
            }else{
                localStorage.setItem("projectName", projectName);
                if( $this.hasClass('calc1') ){
                    initNuevoCalculoSF();
                }else if ( $this.hasClass('calc2') ){
                    initNuevoCalculoDW();
                }else{
                    initNuevoCalculoT();
                }
            }
        }
    });

}