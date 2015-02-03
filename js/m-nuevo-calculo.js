var projectName = '';
var logged;

if (localStorage.getItem('username') == 'anonimo') {
    logged = false;
} else if(localStorage.getItem('userId')) {
    logged = true;
}

function eventosNuevoCalculo() {

    $('#m1-nuevo-calculo a.option').on('click', function(e) {
        var $this = $(this);

        e.preventDefault();
        e.stopPropagation();

        projectName = $.trim($('.projectName').val());
        if (!$this.hasClass('vacio')) {
            if (projectName.length === 0) {
                alertMsg('Debe ingresar un nombre de proyecto', '', 'none', 'Nuevo Calculo', 1);
            } else {
                //Hacemos un select para saber si el nombre del projecto ingresado ya existe.
                var tipo;
                var page;

                if ($this.hasClass('calc1')) {
                    tipo = 1;
                } else if ($this.hasClass('calc2')) {
                    tipo = 2;
                } else if ($this.hasClass('calc3')) {
                    tipo = 3;
                }

                var $query = 'SELECT * FROM calculos WHERE project_name="'+projectName+'" AND calc_type='+tipo+' AND user_id='+localStorage.getItem('userId');
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
        }
    });
}