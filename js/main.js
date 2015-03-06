//document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

$(document).on("pageinit", function(event){
   // $('#' + event.target.id).css('top', '-1px');
});

$(document).on("pageshow", function(event) {
    setTimeout(function(){
        heightBug();

        $('.menu a[data-title="Logout"]').unbind('click').click(function(){
            theLogOut();
        });

        var htmlLogout = localStorage.getItem('username') == 'anonimo' ? 'Iniciar sesión' : 'Cerrar sesión';
        $('.menu a[data-title="Logout"]').html(htmlLogout);
        $('.logout').html(htmlLogout);
    }, 1000);
});

function heightBug(){
    var winH = $(window).height();
    var pageCH = winH - 55;
    var $pageC = $('.ui-page-active .page-content');
    $pageC.css('height', pageCH);
}


var snapper;

function menuLateral(){
    snapper = new Snap({element:document.getElementById('content'), disable: 'right', hyperextensible: false});
    //boton_menu('m-inicio');
    $('.menu .item').unbind('click').click(function(e){
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

var urlToFile;
function sharePDF(filename, type)
{
    var $html = generateHtml(type);
    callAjaxPdf($html, filename);

    animateBtnEnd('shareCalc', 'Compartir');

    if ($.trim(filename).length > 0 ) {
        window.plugins.socialsharing.share(null, null, null, urlToFile);
    } else {
        alertMsg('No se encontró el nombre del archivo, reintente.', '', '', 'Ocurrió un error al compartir', '', '');
    }
}

function viewPDF(filename, type)
{
    var $html = generateHtml(type);

    callAjaxPdf($html, filename);

    animateBtnEnd('savePDF', 'Ver PDF');

    window.open( urlToFile, '_system', 'location=yes,toolbar=yes' );
}

function callAjaxPdf($html, filename)
{
    $.ajax({
        type: 'POST',
        url: url_webservices+'/download-pdf.php',
        async: false,
        data: {
            content: $html,
            fileName: filename,
            calc_type: sessionStorage.getItem('calc_type'),
            project_name: sessionStorage.getItem('projectName')
        },
        async: false,
        success: function(data) {
            urlToFile = data;
        },
        error: function(error) {
            alertMsg('Parece haber problemas de conexión', '', '', 'Error PDF', '', '');
        }
    });
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

            $_html = '';
            var $_temp_table_b = '<table cellspacing="0" style="width: 100%; text-align: center; font-size: 10pt;"><tbody>';
            var $_temp_table_e = '</tbody></table>';

            $_html = $_temp_table_b + '<tr><td style="width: 100%; border: none !important; color: #bbbbba;  font-size: 15pt;">NOMBRE DE PROYECTO: '+ sessionStorage.getItem("projectName")+'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%; border: none !important; color: #bbbbba;  font-size: 15pt;">TIPO DE CÁLCULO: TECHO</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%; border: none !important;">&nbsp;</td></tr>' + $_temp_table_e;

            // Resumen de datos
            $_html += $_temp_table_b + '<tr><td style="width: 100%; background-color: #bbbbba;">' + $html.find('.texto.t1.resumenDatos').text() +'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%;">&nbsp;</td></tr>' + $_temp_table_e;

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Superficie de techo</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Largo</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item10 .largo .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Ancho</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item10 .ancho .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Tipo de chapa</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 90%; text-align: left;">' + $('.item11 .tipo').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 90%; text-align: left;">' + $('.item11 .ultimo').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;


            $_html += '<br /><br /><br />';


            $_html += $_temp_table_b + '<tr><td style="width: 100%; background-color: #bbbbba;">' + $_rt + ' ' + $_rm + ' ' + $_rl +'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%;">&nbsp;</td></tr>' + $_temp_table_e;

            var $_temp_divs = $html.find('div').not('.resumItem');

            $_temp_divs.each(function (k, ht){

                $_div = $(ht);
                if ($_div.hasClass('resultado'))
                {
                    $_html += $_temp_table_b;
                    $_html += '<tr>';
                    $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">' + $_div.text() +'</td>';
                    $_html += '</tr>';
                    $_html += $_temp_table_e;
                }
                else if ($_div.hasClass('valor'))
                {
                    $_html += $_temp_table_b;
                    $_html += '<tr>';
                    $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                    $_html += '    <td style="width: 60%; text-align: left;">' + $_div.find("span:eq(0)").text() +'</td>';
                    if($_div.hasClass('colorValue')){
                        var colorSample = $('.valor.ultimo.colorValue .colorSample').css('background-color');
                        $_html += '    <td style="width: 30%; text-align: center;"><div style="display: block;background-color:'+ colorSample +';height:20px;width:20px;border-radius: 10px;margin: 0 auto;"></div></td>';
                    }else{
                        $_html += '    <td style="width: 30%; text-align: center;">' + $_div.find("span:eq(1)").text() +'</td>';
                    }

                    $_html += '</tr>';
                    $_html += $_temp_table_e;

                }
            });

            return $_html;
        break;

        case 'steel-frame':
        case 'steel_frame':
            $html = $('#myRenderSave').clone();
            $html.find('div.mas').remove();
            $html.find('span.showMore').remove();

            $_html = '';
            var $_temp_table_b = '<table cellspacing="0" style="width: 750px; text-align: center; font-size: 10pt;"><tbody>';
            var $_temp_table_e = '</tbody></table>';

            $_html = $_temp_table_b + '<tr><td style="width: 100%; border: none !important; color: #bbbbba;  font-size: 15pt;">NOMBRE DE PROYECTO: '+ sessionStorage.getItem("projectName")+'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%; border: none !important; color: #bbbbba;  font-size: 15pt;">TIPO DE CÁLCULO: STEEL FRAME</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%; border: none !important;">&nbsp;</td></tr>' + $_temp_table_e;


            // Resumen de datos
            $_html += $_temp_table_b + '<tr><td style="width: 100%; background-color: #bbbbba;">' + $html.find('.texto.t1.resumenDatos').text() +'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%;">&nbsp;</td></tr>' + $_temp_table_e;

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Vigas de entrepiso y cubierta plana</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Lux máx entre apoyos</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item10 .ultimo .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            if( $('.item11:visible').length > 0 ) {
                $_html += $_temp_table_b;
                $_html += '<tr>';
                $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Entrepisos</td>';
                $_html += '</tr>';
                $_html += $_temp_table_e;
                $_html += $_temp_table_b;
                $_html += '<tr>';
                $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                $_html += '    <td style="width: 90%; text-align: left;">' + $('.item11 .ultimo .texto').html() + '</td>';
                $_html += '</tr>';
                $_html += $_temp_table_e;
            }

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Planta Baja</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Ancho</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item12 .ancho .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Largo</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item12 .largo .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Altura</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item12 .altura .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Paredes Interiores</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item12 .ultimo .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            if( $('.item13:visible').length > 0 ) {

                $_html += $_temp_table_b;
                $_html += '<tr>';
                $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Planta Alta</td>';
                $_html += '</tr>';
                $_html += $_temp_table_e;
                $_html += $_temp_table_b;
                $_html += '<tr>';
                $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                $_html += '    <td style="width: 60%; text-align: left;">Ancho</td>';
                $_html += '    <td style="width: 30%; text-align: center;">' + $('.item13 .ancho .medida').html() + '</td>';
                $_html += '</tr>';
                $_html += $_temp_table_e;
                $_html += $_temp_table_b;
                $_html += '<tr>';
                $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                $_html += '    <td style="width: 60%; text-align: left;">Largo</td>';
                $_html += '    <td style="width: 30%; text-align: center;">' + $('.item13 .largo .medida').html() + '</td>';
                $_html += '</tr>';
                $_html += $_temp_table_e;
                $_html += $_temp_table_b;
                $_html += '<tr>';
                $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                $_html += '    <td style="width: 60%; text-align: left;">Altura</td>';
                $_html += '    <td style="width: 30%; text-align: center;">' + $('.item13 .altura .medida').html() + '</td>';
                $_html += '</tr>';
                $_html += $_temp_table_e;
                $_html += $_temp_table_b;
                $_html += '<tr>';
                $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                $_html += '    <td style="width: 60%; text-align: left;">Paredes Interiores</td>';
                $_html += '    <td style="width: 30%; text-align: center;">' + $('.item13 .ultimo .medida').html() + '</td>';
                $_html += '</tr>';
                $_html += $_temp_table_e;

            }

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Metros lineales de aberturas en paneles portantes</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Metros lineales de aberturas en paneles portantes</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item14 .ultimo .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Tipo de techo</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 90%; text-align: left;">' + $('.item15 .ultimo .texto').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            // Relleno para el salto de pagina.
            $_html += '<table cellspacing="0" style="width: 100%; text-align: center; font-size: 10pt;"><tbody>' +
            '           <tr><td style="border: medium none;width: 100%;">&nbsp;</td></tr>' +
            '           <tr><td style="border: medium none;width: 100%;">&nbsp;</td></tr>' +
            '</tbody></table>';

            // Computo de datos
            $_html += $_temp_table_b + '<tr><td style="width: 100%; background-color: #bbbbba;">' + $html.find('.texto.t1.computoAprox').text() +'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%;">&nbsp;</td></tr>' + $_temp_table_e;

            var $_temp_divs = $html.find('div.item > div').not('.resumItem');

            $_temp_divs.each(function (k, ht){
                $_div = $(ht);
                if ($_div.hasClass('resultado'))
                {
                    $_html += $_temp_table_b;
                    $_html += '<tr>';
                    $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">' + $_div.text() +'</td>';
                    $_html += '</tr>';
                    $_html += $_temp_table_e;
                }
                else if ($_div.hasClass('valor'))
                {
                    $_html += $_temp_table_b;
                    $_html += '<tr>';
                    $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                    $_html += '    <td style="width: 60%; text-align: left;">' + $_div.find("span:eq(0)").text() +'</td>';
                    $_html += '    <td style="width: 30%; text-align: center;">' + $_div.find("span:eq(1)").text() +'</td>';
                    $_html += '</tr>';
                    $_html += $_temp_table_e;
                }
            });

            return $_html;
        break;

        case 'dry-wall':
            $html = $('#myRenderSaveDW').clone();

            $_html = '';
            var $_temp_table_b = '<table cellspacing="0" style="width: 100%; text-align: center; font-size: 10pt;"><tbody>';
            var $_temp_table_e = '</tbody></table>';

            $_html = $_temp_table_b + '<tr><td style="width: 100%; border: none !important; color: #bbbbba;  font-size: 15pt;">NOMBRE DE PROYECTO: '+ sessionStorage.getItem("projectName")+'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%; border: none !important; color: #bbbbba;  font-size: 15pt;">TIPO DE CÁLCULO: DRY WALL</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%; border: none !important;">&nbsp;</td></tr>' + $_temp_table_e;

            // Resumen de datos
            $_html += $_temp_table_b + '<tr><td style="width: 100%; background-color: #bbbbba;">' + $html.find('.texto.t1.resumenDatos').text() +'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%;">&nbsp;</td></tr>' + $_temp_table_e;

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Metros Lineales de paredes interiores</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Altura</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item10 .altura .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Largo</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item10 .largo .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Espesor del perfil</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 60%; text-align: left;">Espesor del perfil</td>';
            $_html += '    <td style="width: 30%; text-align: center;">' + $('.item11 .ultimo .medida').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">Tipo de pared</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 90%; text-align: left;">' + $('.item12 .cara .texto').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;
            $_html += $_temp_table_b;
            $_html += '<tr>';
            $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
            $_html += '    <td style="width: 90%; text-align: left;">' + $('.item12 .ultimo .texto').html() + '</td>';
            $_html += '</tr>';
            $_html += $_temp_table_e;

            // Relleno para el salto de pagina.
            $_html += '<table cellspacing="0" style="width: 100%; text-align: center; font-size: 10pt;"><tbody>' +
            '           <tr><td style="border: medium none;width: 100%;">&nbsp;</td></tr>' +
            '           <tr><td style="border: medium none;width: 100%;">&nbsp;</td></tr>' +
            '</tbody></table>';

            // Computo de datos
            $_html += $_temp_table_b + '<tr><td style="width: 100%; background-color: #bbbbba;">' + $html.find('.texto.t1.computoAprox').text() +'</td></tr>' + $_temp_table_e;
            $_html += $_temp_table_b + '<tr><td style="width: 100%;">&nbsp;</td></tr>' + $_temp_table_e;

            var $_temp_divs = $html.find('div:first > div');

            $_temp_divs.each(function (k, ht){
                var $_div = $(ht);
                if ($_div.hasClass('resultado'))
                {
                    $_html += $_temp_table_b;
                    $_html += '<tr>';
                    $_html += '    <td style="width: 100%; text-align: left; background-color: #bbbbba;">' + $_div.text() +'</td>';
                    $_html += '</tr>';
                    $_html += $_temp_table_e;
                }
                else if ($_div.hasClass('valor'))
                {
                    $_html += $_temp_table_b;
                    $_html += '<tr>';
                    $_html += '    <td style="width: 10%; text-align: left;">&nbsp;</td>';
                    $_html += '    <td style="width: 60%; text-align: left;">' + $_div.find("span:eq(0)").text() +'</td>';
                    $_html += '    <td style="width: 30%; text-align: center;">' + $_div.find("span:eq(1)").text() +'</td>';
                    $_html += '</tr>';
                    $_html += $_temp_table_e;
                }
            });

            $_html += '<table cellspacing="0" style="width: 100%; text-align: center; font-size: 10pt;"><tbody>' +
            '           <tr><td style="border: medium none;width: 100%;">&nbsp;</td></tr>' +
            '           <tr><td style="border: medium none;width: 100%;">&nbsp;</td></tr>' +
            '           <tr><td style="border: medium none;width: 100%;">&nbsp;</td></tr>' +
                    '</tbody></table>';

            return $_html;
        break;
    }

    return $html.html();
}

function animateBtnStart($this, animateText){
    //Animamos el boton
    $this.html(animateText + ' <img src="./img/ajax-loader.gif"/>');
}
function animateBtnEnd(btnClass, btnText) {
    var $this = $('.boton.'+btnClass);
    $this.html(btnText);
}


var mostrandoteclado;
document.addEventListener("showkeyboard", function() {
    mostrandoteclado = true;
}, false);
document.addEventListener("hidekeyboard", function() {
    mostrandoteclado = false;
}, false);