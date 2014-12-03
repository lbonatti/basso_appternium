function eventosNuevoCalculo(){
    $('#m1-nuevo-calculo a.option').on('click', function(e){
        var $this = $(this);
        var projectName = $.trim($('.projectName').val());
        if( ! $this.hasClass('vacio') ){
            if(projectName.length === 0 ){
                alert('Debe ingresar un nombre de proyecto');
                e.preventDefault();
            }else{
                sessionStorage.setItem("projectName", projectName);
                if( $this.hasClass('calc1') ){
                    if( ifProjectExists(projectName, 1) ){
                        alert('El nombre de proyecto ingresado ya ha sido utilizado');
                        e.preventDefault();
                    }else{
                        initNuevoCalculoSF();
                    }
                }else if ( $this.hasClass('calc2') ){
                    if( ifProjectExists(projectName, 2) ){
                        alert('El nombre de proyecto ingresado ya ha sido utilizado');
                        e.preventDefault();
                    }else{
                        initNuevoCalculoDW();
                    }
                }else{
                    if( ifProjectExists(projectName, 3) ){
                        alert('El nombre de proyecto ingresado ya ha sido utilizado');
                        e.preventDefault();
                    }else{
                        initNuevoCalculoT();
                    }
                }
            }
        }
    });

}

function ifProjectExists(projectName, tipo){

    var $salida = 0; //No existe el proyecto

    if (localStorage.getItem('calculos')){
        var $_this = $.parseJSON(localStorage.getItem('calculos'));

        switch (tipo){
            case 1:
                if( $_this.tipo.steel_frame ){ /* Si aun no existe el tipo. */
                    $salida = searchName(projectName, $_this.tipo.steel_frame); /* Si existe el tipo, controlar que no exista el proyecto.*/
                }
                break;
            case 2:
                if( $_this.tipo.dry_wall ){
                    $salida = searchName(projectName, $_this.tipo.dry_wall);
                }
                break;
            case 3:
                if( $_this.tipo.techos ){
                    $salida = searchName(projectName, $_this.tipo.techos);
                }
                break;
        }
    }
    return $salida
}

/* Recorre el tipo de proyecto buscando si existe el nombre. */
function searchName(projectName, varType){
    var $existe = 0;
    $.each(varType,function(pName,temp){
        if (projectName.toLowerCase() == pName.toLowerCase()){
            $existe = 1;
        }
    });

    return $existe;
}