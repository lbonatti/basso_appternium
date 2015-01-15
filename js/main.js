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
        //if($(this).hasClass('selected')){
        //}else{
            var href = $(this).attr('href');
            //$('.menu .item').removeClass('selected');
            //$(this).addClass('selected');

            //$('#header h1').html($(this).attr('data-title'));
            $.mobile.changePage(href, { /*transition: 'none'*/ });

        //}
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

function sharePDF(title, text, filename, type)
{
    var $html = generateHtml(type);
    createPDF($html, filename);

    var urlToFile = url_webservices+'/download-pdf.php?pdf=' + filename + '.pdf';

    if ($.trim(filename).length > 0 ) {
        window.plugins.socialsharing.share(null, null, null, urlToFile);
    } else {
        alertMsg('No se encontró el nombre del archivo, reintente.', '', '', 'Ocurrió un error al compartir', '', '');
    }
}

function createPDF($html, filename)
{
    return $.ajax({
        type: 'POST',
        url: url_webservices+'/download-pdf.php',
        data: {content:$html, fileName: filename},
        dataType: 'text'
    });
}

function generateHtml(type)
{
    var $html;
    var $_rt;
    var $_rm;
    var $_rl;
    switch (type) {
        case 'techo':
            $html = $('#myRenderSaveT').clone();
            $_rt = $html.find('.resultado-techo').text();
            $_rm = $html.find('.resultado-medida').text();
            $_rl = $html.find('.resultado-leyenda').text();

            $html.find('.resultado-techo').html($_rt + ' ' + $_rm + ' ' + $_rl).css('font-size','20px').css('text-transform','uppercase').css('text-align','center');
            $html.find('.boton.savePDFT').remove();
            $html.find('.resultado-medida').remove();
            $html.find('.resultado-leyenda').remove();
        break;
        case 'steel-frame':
            $html = $('.paso5 #myRenderSave').clone();
            $html.find('span.showMore').remove();
        break;
        case 'dry-wall':
            $html = $('#myRenderSaveDW').clone();
            $html.find('.boton.savePDFDW').remove();
            $html.find('.boton.saveCalc').remove();
            $html.find('.boton.shareCalc').remove();
        break;
    }

    return $html.html();
}