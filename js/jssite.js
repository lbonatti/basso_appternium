
function deviceBackBtn(){

    document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        navigator.notification.confirm(
            '¿Seguro deseas salir?', // message
            onConfirm, // callback to invoke with index of button pressed
            'Cerrar Aplicación', // title
            ['Cancelar', 'Salir'] // buttonLabels
        );
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
    sessionStorage.removeItem('fbLogged');
    sessionStorage.removeItem('session_code');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('username');
}