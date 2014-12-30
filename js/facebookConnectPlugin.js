/* global FB */
"use strict";

/*
 * @author Ally Ogilvie
 * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2014
 * @file - facebookConnectPlugin.js
 * @about - JavaScript interface for PhoneGap bridge to Facebook Connect SDK
 *
 *
 */

if (!window.cordova) {
// This should override the existing facebookConnectPlugin object created from cordova_plugins.js
    var facebookConnectPlugin = {

        getLoginStatus: function (s, f) {
            // Try will catch errors when SDK has not been init
            try {
                FB.getLoginStatus(function (response) {
                    s(response);
                });
            } catch (error) {
                if (!f) {
                    console.error(error.message);
                } else {
                    f(error.message);
                }
            }
        },

        showDialog: function (options, s, f) {

            if (!options.name) {
                options.name = "";
            }
            if (!options.message) {
                options.message = "";
            }
            if (!options.caption) {
                options.caption = "";
            }
            if (!options.description) {
                options.description = "";
            }
            if (!options.href) {
                options.href = "";
            }
            if (!options.picture) {
                options.picture = "";
            }
            
            // Try will catch errors when SDK has not been init
            try {
                FB.ui(options,
                function (response) {
                    if (response && (response.request || !response.error_code)) {
                        s(response);
                    } else {
                        f(response);
                    }
                });
            } catch (error) {
                if (!f) {
                    console.error(error.message);
                } else {
                    f(error.message);
                }
            }
        },
        // Attach this to a UI element, this requires user interaction.
        login: function (permissions, s, f) {
            // JS SDK takes an object here but the native SDKs use array.
            var permissionObj = {};
            if (permissions && permissions.length > 0) {
                permissionObj.scope = permissions.toString();
            }
            
            FB.login(function (response) {
                if (response.authResponse) {
                    s(response);
                } else {
                    f(response.status);
                }
            }, permissionObj);
        },

        getAccessToken: function (s, f) {
            var response = FB.getAccessToken();
            if (!response) {
                if (!f) {
                    console.error("NO_TOKEN");
                } else {
                    f("NO_TOKEN");
                }
            } else {
                s(response);
            }
        },

        logEvent: function (eventName, params, valueToSum, s, f) {
            // AppEvents are not avaliable in JS.
            s();
        },

        logPurchase: function (value, currency, s, f) {
            // AppEvents are not avaliable in JS.
            s();
        },

        logout: function (s, f) {
            // Try will catch errors when SDK has not been init
            try {
                FB.logout( function (response) {
                    s(response);
                });
            } catch (error) {
                if (!f) {
                    console.error(error.message);
                } else {
                    f(error.message);
                }
            }
        },

        api: function (graphPath, permissions, s, f) {
            // JS API does not take additional permissions
            
            // Try will catch errors when SDK has not been init
            try {
                FB.api(graphPath, function (response) {
                    if (response.error) {
                        f(response);
                    } else {
                        s(response);
                    }
                });
            } catch (error) {
                if (!f) {
                    console.error(error.message);
                } else {
                    f(error.message);
                }
            }
        },

        // Browser wrapper API ONLY
        browserInit: function (appId, version) {
            if (!version) {
                version = "v2.0";
            }
            FB.init({
                appId      : appId,
                cookie     : true,
                xfbml      : true,
                version    : version
            });
        }
    };
    
    // Bake in the JS SDK
    (function () {
        if (!window.FB) {
            console.log("launching FB SDK");
            var e = document.createElement('script');
            e.src = document.location.protocol + '//connect.facebook.net/en_US/sdk.js';
            e.async = true;
            try{
                document.getElementById('fb-root').appendChild(e);
            }catch(err){

            }
        }
    }());

}

var login = function () {
    if (!window.cordova) {
        var appId = 324103614450696;
        facebookConnectPlugin.browserInit(appId);
    }
    facebookConnectPlugin.login( ["email"],
        function (response) {
            var uID = '/'+response.authResponse.userID;
            getEmail();
        },
        function (response) {
            var theR = JSON.stringify(response);
            alert(theR);
        });
}
var registerFb = function () {
    if (!window.cordova) {
        var appId = 324103614450696;
        facebookConnectPlugin.browserInit(appId);
    }
    facebookConnectPlugin.login( ["email"],
        function (response) {
            getRegEmail();
        },
        function (response) {
            mensaje('Error al intentar registrarse con Facebook');
        });
}

function getEmail(){
    facebookConnectPlugin.api( "me/?fields=email", ["email"],
        function (response) {
            var theRawEmail = JSON.stringify(response.email);
            var theEmail = theRawEmail.replace(/"/g , '');
            sessionStorage.setItem("username", theEmail);
            window.location.href="m-inicio.html";
        },
        function (response) { alert(JSON.stringify(response)) });
}
function getRegEmail(){
    facebookConnectPlugin.api( "me/?fields=email,birthday,first_name,last_name", ["email", "public_profile"],
        function (response) {
            var theRawEmail = JSON.stringify(response.email);
            var theEmail = theRawEmail.replace(/"/g , '');
            sessionStorage.setItem("username", theEmail);
            sessionStorage.setItem("last_name", JSON.stringify(response.last_name).replace(/"/g , ''));
            sessionStorage.setItem("first_name", JSON.stringify(response.first_name).replace(/"/g , ''));
            sessionStorage.setItem("birthday", response.birthday ? JSON.stringify(response.birthday).replace(/"/g , '') : '00-00-0000');

            return getDataFbRegister();
        },
        function (response) { alert(JSON.stringify(response)) });
}
function showEmail(){
    facebookConnectPlugin.api( "me/?fields=email", ["email"],
        function (response) { alert(JSON.stringify(response.email)) },
        function (response) { alert(JSON.stringify(response)) });
}

var showDialog = function () {
    facebookConnectPlugin.showDialog( { method: "feed" },
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var apiTest = function () {
    facebookConnectPlugin.api( "me/?fields=id,email", ["user_birthday"],
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}
var getAccessToken = function () {
    facebookConnectPlugin.getAccessToken(
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var getStatus = function () {
    facebookConnectPlugin.getLoginStatus(
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}
var logout = function () {
    facebookConnectPlugin.logout(
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}