/**
 * Created by Riter on 11/09/14.
 */

/* Class Facebook*/
var FacebookPlugin = function(){
    this.access_token = null;
    this.appID = '883848108306441';

    this.FBProfile = function (callback) {
        try{
            FB.api('/me', { fields: '' },  function(response) {
                if(typeof callback == 'function')
                    callback(response);
            });
        }catch (e){ }
    };

    this.FBLogout = function (callback) {
        try{
            FB.logout(function(response) {
                if(typeof callback == 'function')
                    callback();
            });
        }catch (e){ }
    };

    this.FBLogin = function(callback){
        try{
            var self = this;
            FB.login(function(response) {
                if (response.authResponse) {
                    self.access_token = response.authResponse.accessToken;
                    if(typeof callback == 'function')
                        callback(response.authResponse);
                }else{
                    if(typeof callback == 'function')
                        callback();
                }
            },
            {scope: 'email'});

        }catch (e){ console.error(e.message);}
    };

    this.FBFriends = function(callback,next){
        try{
            FB.api('/me/friends' + (next?next:'?limit=30'), function(response) {
                if(response.paging.next)
                    next = response.paging.next.substring(response.paging.next.indexOf('?'),response.paging.next.length);
                else
                    next = null;

                if(typeof callback == 'function')
                    callback(response,next);
            });
        }catch (e){ console.error(e.message);}
    };

    this.FBLikes = function(callback,next){
        try{
            FB.api('/me/likes', { fields: 'name,id',limit:30, after: (next?next:'')},  function(response) {
                if(response.paging.next)
                    next = response.paging.cursors.after;
                else
                    next = null;

                if(typeof callback == 'function')
                    callback(response,next);
            });
        }catch (e){ console.error(e.message);}
    };

    this.FBLoginStatus = function(callback){
        var self = this;
        try{
            FB.getLoginStatus(function(response) {
                if (response.status == 'connected') {
                    self.access_token = response.authResponse.accessToken;
                    callback(response.authResponse);
                } else {
                    callback(null);
                }
            });
        }catch (e){ }
    };

    this.FBShare = function(title,picture,message,description,venue,link){
        var self = this;
        var params = {
            name: title,
            caption: venue,
            link: link,
            picture: picture,
            description: description,
            message: message
        };

        this.FBLoginStatus(function(response){
            try{
                if(response){
                    FB.api('/me/feed', 'post',params ,function(obj) {});
                }else{
                    self.FBLogin(function(response){
                        if(response){
                            FB.api('/me/feed', 'post',params ,function(obj) { });
                        }
                    });
                }
            }catch (e){ }
        });
    };

    this.initialize = function(){
        try{
            var self = this;
            FB.init({ appId: self.appID, nativeInterface: CDV.FB, useCachedDialogs: false, status: true });
        }catch (e){ }
    };
    this.initialize();
};