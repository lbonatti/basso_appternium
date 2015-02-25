var edit = false;

function deviceBackBtn(){

    document.addEventListener("backbutton", function(e) {
        e.preventDefault();

        exitApp = 0;

        if( $('#m-inicio.ui-page-active').length > 0 ){
            exitApp = 1;
        }else if( $('#page-1.ui-page-active').length > 0 ){
            exitApp = 1;
        }

        if(exitApp) {
            navigator.notification.confirm(
                '¿Seguro deseas salir?', // message
                onConfirm, // callback to invoke with index of button pressed
                'Cerrar Aplicación', // title
                ['Cancelar', 'Salir'] // buttonLabels
            );
        }else{
            navigator.app.backHistory();
        }
    });
}

function onConfirm(buttonIndex) {
    if(buttonIndex == 2){
        cleanSession();
        navigator.app.exitApp();
    }
}

function theLogOut(){
    var title = localStorage.getItem('username') == 'anonimo' ? 'Iniciar sesión' : 'Cerrar sesión';
    navigator.notification.confirm(
        '¿Seguro deseas salir?', // message
        onConfirmLogout, // callback to invoke with index of button pressed
        title, // title
        ['Cancelar', 'Salir'] // buttonLabels
    );
}
function onConfirmLogout(buttonIndex) {
    if(buttonIndex == 2){
        cleanSession();
        window.location.href="login.html";
    }
}

function cleanSession(){
    if( localStorage.getItem("fbLogged") == 1 ){
        logout();
    }
    localStorage.removeItem('fbLogged');
    sessionStorage.removeItem('session_code');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('username');
}

function switchFbId(userId){
    if( localStorage.getItem('fbLogged') ){
        $.ajax({
            async: false,
            url:backend_url+"/users/fbIdReplace",
            type:'POST',
            data:{userId: userId},
            success:function(result){
                if (result.Default && result.Default != null) {
                    localStorage.setItem('userInfo', JSON.stringify(result.Default.User));
                    localStorage.setItem("userId", result.Default.User.id);
                    userId = localStorage.getItem("userId");
                }else{
                    mensaje(result.Message);
                }
            },
            error:function(error){
                //alert(JSON.stringify(error));
                alertMsg('Parece haber problemas de conexión', '', '', 'Error Login', '', '');
            }
        });
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function editarCalculo(pName, pId, pType)
{
    var page;
    var $calc_type;
    edit = true;
    sessionStorage.setItem("projectName", pName);
    sessionStorage.setItem('aEditar', pId); // Generar bandera de edicion
    // Redireccionar con estado de edicion segun tipo.
    switch (pType) {
        case 'sf':
            initEditarCalculoSF();
            page = "calculo-steel-frame.html";
            $calc_type = 'Steelframe';

            break;
        case 'dw':
            initEditarCalculoDW();
            page = "calculo-dry-wall.html";
            $calc_type = 'Drywall';

            break;
        case 't':
            initEditarCalculoT();
            page = "calculo-techos.html";
            $calc_type = 'Techos';

            break;
    }
    sessionStorage.setItem('calc_type', $calc_type);

    syncNewOrEdit();

    $.mobile.changePage(page);
}


function duplicarCalculo(pName, pId)
{
    var $query = 'SELECT * FROM calculos WHERE project_name="'+pName+'" AND _id='+ pId ;
    db_customQuery($query, function(pleaseWork) {
        if (pleaseWork.length > 0) {
            var proj = pleaseWork[0];
            var _projType = proj.calc_type;
            var _projData = proj.data;

            //Tomar nombre nuevo
            var newName = pName + ' - Copia';

            // guardarNuevo
            var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id'];
            var values;
            var currentTime = getCurrentTime();

            if (logged == true){
                values = [localStorage.getItem('userId'),newName,_projType,_projData,currentTime,currentTime,0,0,0];
            }else{
                values = [0,newName,_projType,_projData,currentTime,currentTime,0,0,0];
            }
            db_insert('calculos',fields, values,'',function(result){
                if (result == 'ok') {
                    sessionStorage.setItem('newSave', 1);
                    //alertMsg('Se ha guardado el proyecto: '+newName, '', 'none', 'Duplicar Calculo', 1);
                    alertMsg('Felicitaciones el cálculo "'+newName, '" se ha duplicado', 'none', 'Cálculo duplicado', 1);

                    showMisCalculos();

                    _syncNew();
                } else {
                    alertMsg('No se ha podido guardar el proyecto', '', 'none', 'Duplicar Calculo', 1);
                }
            });

        }else{
            alertMsg('No se encontró el proyecto', '', 'none', '', 1);
        }
    });
}



function activarDotMenu(){
    $('.menu-options .editar').click(function(){
        alertMsg('¿Seguro desea editar?', '', 'none', 'Editar Proyecto', 2, function(){
            sessionStorage.setItem('aResumen', 0);

            if( sessionStorage.getItem('desdePie') != 1 ){
                sessionStorage.setItem('pasoSTactual', 1);
            }else{
                sessionStorage.setItem('desdePie', 0);
            }

            sessionStorage.setItem('aEditar', sessionStorage.getItem('editardesderesumen')); //  Tomar id de proy a editar.

            var page;
            switch ( $('.ui-page-active').attr('id') ) {
                case 'm1-csf-1':
                    page = "calculo-steel-frame.html";
                    break;
                case 'm1-cdw-1':
                    page = "calculo-dry-wall.html";
                    break;
                case 'm1-ct-1':
                    page = "calculo-techos.html";
                    break;
            }
            $.mobile.changePage(page, {reloadPage: true});
        });
    });

    $('.menu-options .duplicar').click(function(){
        var pName = $('.projectName').text();
        var pType;
        var pId;
        switch ( $('.ui-page-active').attr('id') ) {
            case 'm1-csf-1':
                pType = 1;
                break;
            case 'm1-cdw-1':
                pType = 2;
                break;
            case 'm1-ct-1':
                pType = 3;
                break;
        }

        var $query = "SELECT _id FROM calculos WHERE project_name='" + pName + "' AND calc_type=" + pType;
        db_customQuery($query, function(rows) {
            var project = rows;
            if (project && project.length > 0) {
                pId = project[0]._id;

                duplicarCalculo(pName, pId);
                $.mobile.changePage("m-mis-calculos.html", {reloadPage: true});

            }
        });

    });

    $('.menu-options .eliminar').click(function(){
        var pName = $('.projectName').text();
        var pType;
        var pId;

        switch ( $('.ui-page-active').attr('id') ) {
            case 'm1-csf-1':
                pType = 1;
                break;
            case 'm1-cdw-1':
                pType = 2;
                break;
            case 'm1-ct-1':
                pType = 3;
                break;
        }

        var $query = "SELECT _id FROM calculos WHERE project_name='" + pName + "' AND calc_type=" + pType;
        db_customQuery($query, function(rows) {
            var project = rows;
            if (project && project.length > 0) {
                pId = project[0]._id;

                alertMsg('¿Está seguro que desea eliminar este cálculo?', '', 'none', 'Eliminar Proyecto', 2, function() {
                    var $query = 'UPDATE calculos SET remove=1, sync=0 WHERE _id='+pId;
                    db_customQuery($query, function(rows) {
                        alertMsg('El cálculo ha sido eliminado.', '', 'none', 'Cálculo eliminado', 1);
                        $.mobile.changePage("m-mis-calculos.html", {reloadPage: true});
                    });
                });

            }
        });

    });

    $('.menu-options').hide();
}


function ucfirst(str) {
    str += '';
    var f = str.charAt(0)
        .toUpperCase();
    return f + str.substr(1);
}