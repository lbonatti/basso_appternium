var db;

//DB Connect
DBConnect();
function DBConnect(){
    var version = '4.0';
    var dbName = "app_ternium_dbV4";
    var dbDisplayName = "app_ternium_dbV4";
    var dbSize = 2 * 1024 * 1024;
    db = openDatabase(dbName, version, dbDisplayName, dbSize,
        function(database)
    {
        console.log('Database is open')
    });
}

/* creamos la tabla CALCULOS */
//fields: id, user_id, project_name, calc_type, data, created, modified
var fields_calculos = "_id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,project_name VARCHAR(100),calc_type INTEGER,data text,created VARCHAR(19), modified VARCHAR(19), sync INTEGER, remove INTEGER(1), remote_id INTEGER, version INTEGER";
db_createTable('calculos', fields_calculos);

/* FUNCIONES PERSONALIZADAS */
function db_createTable(tableName, fields,extras){
    extras = extras || '';
    var newExtras = '';
    if (extras != ''){
        newExtras = ', '+extras;
    }

    var $query = 'CREATE TABLE IF NOT EXISTS '+tableName+'('+fields+newExtras+')'

    db.transaction(function(t)
    {
        t.executeSql($query,[],function(t, rs){
           console.log('Tabla '+tableName+' creada')
        })
    });
}

function db_customQuery(query, callBack){ // <-- extra param
    var result = [];
    db.transaction(function (tx) {
        tx.executeSql(query, [], function(tx, rs){
            for(var i=0; i<rs.rows.length; i++) {
                var row = rs.rows.item(i)
                result[i] = { _id: row['_id'],
                    user_id: row['user_id'],
                    project_name: row['project_name'],
                    calc_type: row['calc_type'],
                    data: row['data'],
                    created: row['created'],
                    modified: row['modified'],
                    remote_id: row['remote_id'],
                    version: row['version']
                }
            }
            callBack(result); // <-- new bit here
        }, function(){alert('Ocurrió un error!')});
    });
}

function db_updateQueryEdit(query, callBack){ // <-- extra param
    var result = [];
    var updatedID;
    db.transaction(function (tx) {
        tx.executeSql(query, [], function(tx, rs){
            result='ok';
            callBack(result); // <-- new bit here
        }, function(rs){result='error';callBack(result)});
    });
}

//var fields= ['id', 'category_id', 'name', 'price']
//var values = [
//    ['', 5, 'Fancy Hat', '$200'],
//    ['', 5, 'Less Fancy Hat', '$100'],
//    ['', 5, 'Least Fancy Hat', '$5']
//]

function db_insert(table, fields, values, extraValues, callBack){
    extraValues = extraValues || '';
    var error = null;
    var fields_string = '';
    var values_string = '';
    //Generamos un string con el array de los campos
    for ( var i = 0; i < fields.length; i = i + 1 ) {
        if (i == (fields.length - 1)){
            fields_string += fields[i]
            values_string += '?';
        }else{
            fields_string += fields[i]+', ';
            values_string += '?,';
        }
    }
    var $query = 'INSERT INTO '+table+' ('+fields_string+') VALUES ('+values_string+')';
    db.transaction(function(t){
        var result;
        t.executeSql($query,values,function(t, rs){
                var result='ok';
                if (rs.insertId)
                {
                    sessionStorage.setItem('editardesderesumen', rs.insertId);
                }
                callBack(result);
            },function(rs){
                var result='error';
                callBack(result);
            }
        );
    });
}

// fields: col1 = ?, col2 = ?, col3 = ?
// values: [col1Val, col2Val, col3Val]
function db_update(table, fields, where){
    var error = 0;

    var $query = 'UPDATE '+table+' SET '+fields+' WHERE '+where;
    db.transaction(function(t)
    {
        t.executeSql($query,[],function(t, rs){

        },function(t){
            error = 1;
        })
    });
    return error;
}

/* EXAMPLE: HOW TO USE PLUGIN */
/*
db.query(
    'CREATE TABLE products (id, category_id, name, price)',
    'CREATE INDEX products__category_id ON products (category_id)',
    'INSERT INTO products (id, category_id, name, price) VALUES (?,?,?,?)',
    'INSERT INTO mientras (id, category_id, name, price) VALUES (?,?,?,?)
    [
        [1, 5, 'Fancy Hat', '$200'],
        [2, 5, 'Less Fancy Hat', '$100'],
        [3, 5, 'Least Fancy Hat', '$5']
    ],
    'SELECT * FROM products WHERE category_id = ?', [5]
).fail(function (tx, err) {
    throw new Error(err.message);
}).done(function (products) {
    console.log(products);
});
*/


/* REMOTE DATABASE FUNCTIONS */
function ajaxSaveBDNew(tableName, fields, values,lastID){
    lastID = lastID || null;
    //Con el success de este ajax debemos darle a la variable SINC del projecto el valor 1.
    $.ajax({
        type: 'POST',
        url: url_webservices+'/calculos.php',
        data: {nuevo_calculo:{table:tableName,fields:fields,values:values}}
    }).success(function (response, textStatus, jqXHR){
        //Aquí debemos pasar el sync a 1, luego de que el ajax complete el request
        if(lastID){
            db_update('calculos','sync=1','_id='+lastID)
            console.log('Enviado a BD remota y cambiado valor sync de proyecto en BD local')
        }
    }).error(function (jqXHR, textStatus, errorThrown) {
        console.error(
            "Ha ocurrido un error: " +
            textStatus, errorThrown
        )
    });
}

function ajaxSaveBDEdit(tableName, fields, values,lastID){
    //Aqui el sync ya está en 1, hay que modificar el calculo guardado anteriormente.
    $.ajax({
        type: 'POST',
        url: url_webservices+'/calculos.php',
        data: {edit_calculo:{table:tableName,fields:fields,values:values}}
    }).success(function (response, textStatus, jqXHR){
        //Aquí debemos pasar el sync a 1, luego de que el ajax complete el request
        if(lastID){
            db_update('calculos','sync=1','_id='+lastID)
            console.log('Enviado a BD remota y cambiado valor sync de proyecto en BD local')
        }
    }).error(function (jqXHR, textStatus, errorThrown) {
        console.error(
            "Ha ocurrido un error: " +
            textStatus, errorThrown
        )
    });
}



function getCurrentTime(){
    var now = new Date();
    var outStr = now.getFullYear()+'-'+pad((now.getMonth()+1),2)+'-'+pad(now.getDate(),2)+' '+pad(now.getHours(),2)+':'+pad(now.getMinutes(),2)+':'+pad(now.getSeconds(),2);
    return outStr;
}

