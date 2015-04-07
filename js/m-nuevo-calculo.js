var projectName = '';
var logged;
var tipo;


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if (localStorage.getItem('username') == 'anonimo') {
    logged = false;
} else if(localStorage.getItem('userId')) {
    logged = true;
}

function eventosNuevoCalculo() {

    setTimeout(function(){
        setBackBtn();

        $('#m1-nuevo-calculo .blockName .btnChangeCalc').on('click', function(){
            window.location.reload();
            //$('#m1-nuevo-calculo .blockName').hide();
            //$('#m1-nuevo-calculo .blockType').show();
        });


        $('#m1-nuevo-calculo input').on('paste keyup', function(){
            var $this = $(this);
            var valu = $this.val();
            $this.val( valu.capitalize() );
        });

    },1000);


    $('#m1-nuevo-calculo a.option').unbind('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        setBackBtn('Nuevo');

        var $this = $(this);

        if (!$this.hasClass('vacio')) {

            $('.blockType').hide();
            $('.blockName').show();

            if ($this.hasClass('calc1')) {
                tipo = 1;
            } else if ($this.hasClass('calc2')) {
                tipo = 2;
            } else if ($this.hasClass('calc3')) {
                tipo = 3;
            }
        }
    });


    $('#m1-nuevo-calculo a.btnNewCalc').unbind('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        projectName = $.trim($('.projectName').val());

        if (projectName.length === 0) {
            alertMsg('Debe ingresar un nombre de proyecto', '', 'none', 'Nuevo Calculo', 1);
        } else {
            //Hacemos un select para saber si el nombre del projecto ingresado ya existe.
            var page;

            var $query = 'SELECT * FROM calculos WHERE project_name="'+projectName+'" AND calc_type='+tipo+' AND remove=0 AND user_id='+localStorage.getItem('userId');
            db_customQuery($query, function(pleaseWork) {
                if (pleaseWork.length > 0) {
                    alertMsg('El nombre del proyecto ya existe. Intente con otro.', '', 'none', 'Este proyecto ya existe', 1);
                } else {
                    sessionStorage.setItem("projectName", projectName);
                    switch (tipo) {
                        case 1:
                            initNuevoCalculoSF();
                            page = "calculo-steel-frame.html";
                            $calc_type = 'Steelframe';

                            break;
                        case 2:
                            initNuevoCalculoDW();
                            page = "calculo-dry-wall.html";
                            $calc_type = 'Drywall';

                            break;
                        case 3:
                            initNuevoCalculoT();
                            page = "calculo-techos.html";
                            $calc_type = 'Techos';

                            break;
                    }
                    sessionStorage.setItem('calc_type', $calc_type);

                    syncNewOrEdit();

                    $.mobile.changePage(page);
                }
            });
        }
    });
}

function setBackBtn(){

    $('#m1-nuevo-calculo .page-back.ui-link').unbind('click').on('click', function(e) {
        e.preventDefault();

        if ($('.blockType:visible').length == 1) {
            window.location.href="m-inicio.html";
        } else {
            $('#m1-nuevo-calculo .blockName').hide();
            $('#m1-nuevo-calculo .blockType').show();
        }
    });
}