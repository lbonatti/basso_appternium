

/* Son los que ya están sinos pero fueron editados */
function _syncNew()
{
    _showLoading();
    var $query = "SELECT * FROM calculos WHERE sync=0 AND created=modified AND remove=0 AND (user_id=0 OR user_id="+localStorage.getItem('userId')+")";
    db_customQuery($query,function(rows) {
        if (rows.length > 0) {
            _ajaxSendSync(rows, 'new', _hideLoading);
        } else {
            _hideLoading();
        }
    });
}

/* Son los que ya están sinos pero fueron editados */
function _syncEdit()
{
    _showLoading();
    $query = "SELECT * FROM calculos WHERE created<>modified AND remove=0 AND sync=0 AND remote_id<>0 AND (user_id=0 OR user_id="+localStorage.getItem('userId')+")";
    db_customQuery($query,function(rows) {
        if (rows.length > 0) {
            _ajaxSendSync(rows, 'edit', _hideLoading);
        } else {
            _hideLoading();
        }
    });
}

/* Son los que ya están sinos pero fueron editados */
function _syncDeleted()
{
    _showLoading();
    $query = "SELECT * FROM calculos WHERE remove=1 AND (user_id=0 OR user_id="+localStorage.getItem('userId')+")";
    db_customQuery($query,function(rows) {
        if (rows.length > 0) {
            _ajaxSendSync(rows, 'delete', _hideLoading);
        } else {
            _hideLoading();
        }
    });
}

function _showLoading()
{
    $('a.page-back').css({
        'display': 'block',
        "background": "url('img/ajax-loader-snake.gif') no-repeat center center scroll transparent",
        "background-size": '50%'
    });
}

function _hideLoading()
{
    $('a.page-back').css({
        "display": "block",
        "background-image": "url('img/arrow-back.png')",
        "background-size": '100%'
    });
}

function _ajaxSendSync(rows, _action, _callback) {
    //Aqui el sync ya está en 1, hay que modificar el calculo guardado anteriormente.
    $.ajax({
        type: 'POST',
        url: backend_url+'/calculos/sync_calculo',
        data: {
            values:rows,
            action: _action
        }
    }).success(function (response) {
        //Aquí debemos pasar el sync a 1, luego de que el ajax complete el request
        if (response.status == 'ok') {
            if (response.updates.length > 0) {
                $.each(response.updates, function (index, value){
                    db_update('calculos','sync=1, user_id='+localStorage.getItem('userId')+' ,remote_id=' + value.remote_id,'_id=' + value.id)
                })
            }
        }
        setTimeout(_callback, 1000);
    }).error(function (jqXHR, textStatus, errorThrown) {
        setTimeout(_hideLoading(), 1000);
    });
}

function syncNewOrEdit()
{
    setInterval(function () {
        if (edit && clickMessage) {
            clickMessage = false;
            _syncEdit();
        } else if (clickMessage) {
            clickMessage = false;
            _syncNew();
        }
    }, 1000);
}