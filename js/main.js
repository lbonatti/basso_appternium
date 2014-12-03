//document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

$(document).on("pageinit", function(event){
   // $('#' + event.target.id).css('top', '-1px');
});

$(document).ready(function(){

});

var snapper;

function menuLateral(){
    snapper = new Snap({element:document.getElementById('content'), disable: 'right', hyperextensible: false});
    boton_menu('m-inicio');
    $('.menu .item').click(function(e){
        e.preventDefault();
        if($(this).hasClass('selected')){
        }else{
            var href = $(this).attr('href');
            //$('.menu .item').removeClass('selected');
            //$(this).addClass('selected');

            //$('#header h1').html($(this).attr('data-title'));
            $.mobile.changePage(href, { /*transition: 'none'*/ });

        }
        snapper.close();
    });

}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}