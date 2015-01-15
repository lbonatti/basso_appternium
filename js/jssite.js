

deviceBackBtn();

function deviceBackBtn(){

    document.addEventListener("backbutton", function(e){
        e.preventDefault();
        var exitApp = 0;
        if( $("#m-inicio").length > 0 ){
            exitApp = 1;
        }else if( $("#page-1").length > 0 ){
            exitApp = 1;
        }

        if( exitApp ){
            navigator.notification.confirm(
                '¿Seguro deseas salir?', // message
                onConfirm, // callback to invoke with index of button pressed
                'Cerrar Aplicación', // title
                ['Cancelar','Salir'] // buttonLabels
            );
        }else{
            navigator.app.backHistory();
        }
    }, false);
}

function onConfirm(buttonIndex) {
    if(buttonIndex == 2){
        navigator.app.exitApp();
    }
}

function theLogOut(){
    sessionStorage.removeItem('fbLogged');
    sessionStorage.removeItem('session_code');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('username');
    window.location.href="login.html";
}