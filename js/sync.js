var contSync = null;
var contSyncMessage = null;
var userId = 0;

function syncDB()
{
    userId = localStorage.getItem("userId");

    if (!userId) return;
    
    contSync = $('#syncOverlay');
    contSyncMessage = $('#syncOverlay ul');

    // Mostrar un estado en la pantalla que se está sincronizando y no deja hacer nada
    contSync.fadeIn(600);


    //Aplicar a los projectos con user 0 (anonimo) el user logueado actualmente.
    db_update('calculos', 'user_id=' + localStorage.getItem('userId'), 'user_id=0');

    // Traer todos los calculos que están onlien y chequear si están en local. El que no está se inserva en local.
    syncLoad();

}

function syncEnd()
{
    // Ocultar el overlay que bloquea la aplicación
    contSync.find('span').remove();
    contSyncMessage.append('<li><p>Finalizando sincronización &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span></p></li>');
    setTimeout(function () {
        contSync.fadeOut(600, function(){
            contSync.find('li').remove();
            contSyncMessage.append('<li class="first"><p>Sincronizando con el servidor &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span> </p></li>');

            slider.destroySlider();
            slider = null;
            loadMainSlider();
        });
    }, 2000);
}

/* Se sincroniza con los calculos online */
function syncLoad()
{
    contSync.find('span').remove();
    contSyncMessage.append('<li><p>Volcando los datos desde la web &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span></p></li>');
    // Ajax para traer todos los calculos del usuario que están online.
    var $calculosOnline;
    $.ajax({
        async: false,
        url: backend_url + "/calculos/getByUser",
        data: {
            id: localStorage.getItem('userId')
        },
        success: function(result) {
            $calculosOnline = result.Default;
        }
    });

    // Traer los calculos locales del usuario
    var $calculosLocales;
    var $query = "SELECT * FROM calculos";
    db_customQuery($query, function(rows) {
        $calculosLocales = rows;

        if ($calculosOnline && $calculosOnline.length > 0) {
            $.each($calculosOnline, function(key, value) {
                if ($calculosLocales) {
                    $.each($calculosLocales, function(k, val) {
                        if (value != undefined && value.Calculo.id == val.remote_id) {
                            $calculosOnline[key] = null;
                        }
                    });
                }
            });

            // Chequear uno por uno con los calculos en local y hacer un insert (sync=1, created = modificated, remote_id=id online)
            $.each($calculosOnline, function(key, value) {
                if (value != null)
                {
                    var fields = ['user_id', 'project_name', 'calc_type', 'data', 'created', 'modified','sync','remove','remote_id'];
                    var $calculo = value.Calculo;
                    var values = [$calculo.users_id, $calculo.nombre, $calculo.calculo_tipo_id, $calculo.data, $calculo.created, $calculo.created, 1, 0, $calculo.id];
                    db_insert('calculos', fields, values, '', function(rows) {});
                }
            });
        }

        // Llamar a syncNew;
        syncNew();
    });

}

/* Son los creados y aún no están sincronizados */
function syncNew()
{
    contSync.find('span').remove();
    contSyncMessage.append('<li><p>Sincronizando nuevos cálculos &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span></p></li>');

    //Buscamos todos aquellos de la DB local que tengan el sync en 0 y que no han sido editados ni borrados
    var $query = "SELECT * FROM calculos WHERE sync=0 AND created=modified AND remove=0 AND (user_id=0 OR user_id="+localStorage.getItem('userId')+")";
    db_customQuery($query, function(rows) {
        if (rows.length > 0) {
            _ajaxSendSync(rows, 'new', syncNewEdit);
        } else {
            syncNewEdit();
        }
    });
}

/* Son los creados y editados antes de ser sincronizados */
function syncNewEdit()
{
    contSync.find('span').remove();
    contSyncMessage.append('<li><p>Sincronizando nuevos cálculos editados &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span></p></li>');

    //Buscamos todos aquellos de la DB local que hayan sido creados y editados de manera offline (nunca existieron en la bd remota)
    $query = "SELECT * FROM calculos WHERE created<>modified AND remove=0 AND sync=0 AND remote_id=0 AND (user_id=0 OR user_id="+localStorage.getItem('userId')+")";
    db_customQuery($query, function(rows) {
        if (rows.length > 0) {
            _ajaxSendSync(rows, 'new', syncEdit);
        } else {
            syncEdit();
        }
    });
}

/* Son los que ya están sinos pero fueron editados */
function syncEdit()
{
    contSync.find('span').remove();
    contSyncMessage.append('<li><p>Sincronizando cálculos editados &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span></p></li>');

    //Buscamos todos aquellos de la DB local que hayan sido editados de manera offline y aun no han sido actualizados en la BD remota
    $query = "SELECT * FROM calculos WHERE created<>modified AND remove=0 AND sync=0 AND remote_id<>0 AND (user_id=0 OR user_id="+localStorage.getItem('userId')+")";
    db_customQuery($query,function(rows) {
        if (rows.length > 0) {
            _ajaxSendSync(rows, 'edit', syncDeleted);
        } else {
            syncDeleted();
        }

    });
}

/* Son los que fueron borrados */
function syncDeleted()
{
    contSync.find('span').remove();
    contSyncMessage.append('<li><p>Sincronizando cálculos eliminados &nbsp;&nbsp;&nbsp;&nbsp;<span>...</span></p></li>');

    //Buscamos todos aquellos de la DB local que han sido eliminados y actualizamos la BD
    $query = "SELECT * FROM calculos WHERE remove=1";
    db_customQuery($query, function(rows) {
        if (rows.length > 0) {
            _ajaxSendSync(rows, 'delete', syncEnd);
        } else {
            syncEnd();
        }
    });
}

function _ajaxSendSync(rows, _action, _callback){
    //Aqui el sync ya está en 1, hay que modificar el calculo guardado anteriormente.
    $.ajax({
        type: 'POST',
        url: backend_url+'/calculos/sync_calculo',
        //url: 'http://localhost/app-ternium/backend-admin/calculos/sync_calculo',
        data: {values:rows, action: _action}
    }).success(function (response) {
        //Aquí debemos pasar el sync a 1, luego de que el ajax complete el request
        if (response.status == 'ok') {
            if (response.updates.length > 0)
            {
                $.each(response.updates, function (index, value){
                    db_update('calculos','sync=1, user_id='+localStorage.getItem('userId')+' ,remote_id=' + value.remote_id,'_id=' + value.id)
                })
            }
        } else {
            contSync.find('span').remove();
            contSyncMessage.append('<li><p>Error sincronizando</p></li>');
        }
        setTimeout(_callback, 1500);
        //_callback();
    }).error(function (jqXHR, textStatus, errorThrown) {
        contSync.find('span').remove();
        contSyncMessage.append('<li><p>Error sincronizando</p></li>');
        syncEnd();
    });
}

function getCurrentTime()
{
    var now = new Date();
    var outStr = now.getFullYear()+'-'+pad((now.getMonth()+1),2)+'-'+pad(now.getDate(),2)+' '+pad(now.getHours(),2)+':'+pad(now.getMinutes(),2)+':'+pad(now.getSeconds(),2);

    return outStr;
}

