
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
    cleanSession();
    window.location.href="login.html";
}

function cleanSession(){
    if( sessionStorage.getItem("fbLogged") == 1 ){
        logout();
    }
    sessionStorage.removeItem('fbLogged');
    sessionStorage.removeItem('session_code');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('username');
}

function switchFbId(userId){
    if( sessionStorage.getItem('fbLogged') ){
        $.ajax({
            async: false,
            url:backend_url+"/users/fbIdReplace",
            type:'POST',
            data:{userId: userId},
            success:function(result){
                if(result.Default && result.Default != null){
                    sessionStorage.setItem("userId", result.Default.User.id);
                    userId = sessionStorage.getItem("userId");
                }else{
                    mensaje(result.Message);
                }
            },
            error:function(error){
                alert(JSON.stringify(error));
            }
        });
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}