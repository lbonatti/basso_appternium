function adicional_barreras_paredes_externas(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA){

    var pb_meters = (anchoPB*2 + largoPB*2) * altoPB * 1.15;

    var pa_meters = (anchoPA*2 + largoPA*2) * altoPA * 1.15;

    return Math.ceil(pb_meters + pa_meters);
}

function adicional_barrera_cubierta_inclinada(anchoPB, largoPB, tipoTecho){

    var result = 0;
    if (tipoTecho == 1){

        var techo_1 = ((anchoPB * 1.15) / 2 );

        var techo = ((techo_1 * largoPB ) * 2 ) * 1.15;
        var timpano = ( anchoPB * ( anchoPB * 1.15 / 4 ) ) * 1.15;

        return Math.ceil(techo + timpano);

    }else if (tipoTecho == 2){

        var viga = anchoPB * largoPB * 1.04 * 1.15;

        return Math.ceil(viga);

    }else{
        return Math.ceil(result);
    }
}

function adicional_aislacion_termica_paredes_externas(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA){

    var pb_meters = (anchoPB*2 + largoPB*2) * altoPB * 1.15;

    var pa_meters = (anchoPA*2 + largoPA*2) * altoPA * 1.15;

    return Math.ceil(pb_meters + pa_meters);
}

function adicional_aislacion_termica_cielorraso(anchoPB, largoPB){

    var result = anchoPB * largoPB * 1.15;

    return Math.ceil(result);
}

function adicional_aislacion_acustica(anchoParedPB, altoPB, anchoParedPA, altoPA){

    var pb_meters = anchoParedPB * altoPB * 1.15;

    var pa_meters = anchoParedPA * altoPA * 1.15;

    return Math.ceil(pb_meters + pa_meters);
}

function adicional_barrera_vapor_paredes_externas(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA){

    var pb_meters = (anchoPB*2 + largoPB*2) * altoPB * 1.15;

    var pa_meters = (anchoPA*2 + largoPA*2) * altoPA * 1.15;

    return Math.ceil(pb_meters + pa_meters);
}

function adicional_barrera_vapor_techo(anchoPB, largoPB){

    var result = anchoPB * largoPB * 1.15;

    return Math.ceil(result);
}

function adicional_placas_yeso_paredes(anchoPB, largoPB, altoPB, anchoParedPB, anchoPA, largoPA, altoPA, anchoParedPA){

    var pb_meters = ( ( (anchoPB*2 + largoPB*2) * altoPB ) + ( anchoParedPB * altoPB * 2) ) * 1.15;

    var pa_meters = ( ( (anchoPA*2 + largoPA*2) * altoPA ) + ( anchoParedPA * altoPA * 2) ) * 1.15;

    return Math.ceil(pb_meters + pa_meters);
}

function adicional_placas_yeso_cielorraso(anchoPB, largoPB, anchoPA, largoPA){

    var pb_meters = anchoPB * largoPB * 1.15;

    var pa_meters = anchoPA * largoPA * 1.15;

    return Math.ceil(pb_meters + pa_meters);
}

function adicional_diafragmas_paneles(anchoPB, largoPB, altoPB, anchoPA, largoPA, altoPA, tipoTecho){
    var $_tmp1 = (anchoPB*2 + largoPB*2);
    var $_tmp2 = (anchoPA * 2) + (largoPA * 2)
    var $_tmp3 = ((anchoPB * 1.15) / 4 );
    var pb_cond = ( ( anchoPB * 1.15 ) / 2);

    if (tipoTecho == 1) {
        var pb_meters = ( $_tmp1 * altoPB + ( pb_cond * largoPB * 2 ) ) * 1.15;
        var pa_meters = (($_tmp2 * altoPA) + (anchoPB * $_tmp3)) * 1.15;
    }else{
        var pb_meters = ( $_tmp1 * altoPB ) * 1.15;
        var pa_meters = ($_tmp2 * altoPA) * 1.15;
    }
    return Math.ceil(pb_meters + pa_meters);
}

function adicional_diafragmas_entrepisos_escaleras(anchoPB, largoPB, altoPB, anchoPA, largoPA, tipoTecho, entrepiso){

    var $techosInclinadosConVigasA10 = 0;
    if (tipoTecho == 2){
        $techosInclinadosConVigasA10 = anchoPB * largoPB * 1.04 * 1.15;
    }

    var $entrepisoSeco = 0;
    if (entrepiso == 'seco') {
        $entrepisoSeco =  anchoPA * largoPA * 1.15;
    }

    var $escaleras = 0;
    if (anchoPA != 0){
        $escaleras = ( ( ( altoPB * 1.44444444444444 ) + altoPB )+ ( Math.pow(( Math.pow( ( 26/18 ), 2 ) + 1 ), (1/2) ) * altoPB ) )* 0.9 * 1.15;
    }

    var $calc = $techosInclinadosConVigasA10 + $entrepisoSeco + $escaleras;

    return Math.ceil( $calc );
}
function adicional_revestimiento_exterior(largoPB, anchoPB, altoPB, largoPA, anchoPA, altoPA, tipoTecho){
    var $supPB = (anchoPB * 2 + largoPB * 2);
    var $h = (anchoPB * 1.15)/4;
    var $supPA = (anchoPA * 2 + largoPA * 2);

    if (tipoTecho == 1){
        var $calc1 = ($supPB * altoPB + anchoPB * $h) * 1.15;
    }else{
        var $calc1 = ($supPB * altoPB) * 1.15;
    }

    var $calc2 = $supPA * altoPA * 1.15;

    var $total = $calc1 + $calc2;

    return Math.ceil( $total );
}

function adicional_terminacion_exterior_cubierta(anchoPB, largoPB, tipoTecho){
    var $b = (anchoPB * 1.15)/2;
    var $calc = 0;

    switch(tipoTecho){
        case 1:
            //inclinada
            $calc = $b * largoPB * 2 * 1.15;
            break;
        case 2:
            //vigas
            $calc = anchoPB * largoPB * 1.04 * 1.15;
            break;
        case 3:
            //plana
            $calc = anchoPB  * largoPB * 1.15;
            break;
    }

    return Math.ceil( $calc );
}
function adicional_anclajes(anchoPB, largoPB){
    var $supPB = (anchoPB * 2 + largoPB * 2);
    var $calc = $supPB /  3.5;

    return Math.ceil($calc);
}

function adicional_tornillos(anchoPB, largoPB, paredesInterioresPB, alturaPB , anchoPA, largoPA, paredesInterioresPA, alturaPA, tipoTecho, plantas, entrepiso){
    var J20 = PGC200_techoCubiertaPlana(largoPB,anchoPB)
    var J19 = anchoPB < largoPB ? anchoPB : largoPB;
    var $rigidizadores = 0;
    var $nudosCabriadas = 0;


    //Tornillos Para Perfiles T1
    var $mtsMuros = ((anchoPB*2+largoPB*2+paredesInterioresPB)*alturaPB)+((anchoPA*2+largoPA*2+paredesInterioresPA)*alturaPA);
    var $mtsTecho = anchoPB * largoPB;
    var $mtsEntrepisos = anchoPA * largoPA;

    var $total_paraPerfilesT1 = Math.ceil(($mtsMuros + $mtsTecho + $mtsEntrepisos) * 15 * 1.15)

    //Tornillos Hexagonales
    var $mtsEncuentrosPanelesMuros = (Math.ceil(((anchoPB*2+largoPB*2+paredesInterioresPB)/3.5)+((anchoPA*2+largoPA*2+paredesInterioresPA)/3.5)))*alturaPB
    var $mtsEncuentrosMuroTecho = anchoPB*2+largoPB*2+anchoPA*2+largoPA*2;
    var $hexagonales1 = Math.ceil(($mtsEncuentrosPanelesMuros + $mtsEncuentrosMuroTecho)*7*1.15);

    switch (tipoTecho){
        case 1:
            var $cabriadas = largoPB / 0.4 + 1;
            $nudosCabriadas = Math.ceil($cabriadas * 12);
            break;
        case 2:
            $rigidizadores = Math.ceil((J20/J19)*2);
            break;
        case 3:
            $rigidizadores = Math.ceil((largoPB/J20)*2);
            break
    }

    if (plantas > 1) {
        var $_tmp = largoPA/0.4
        var $rigidizadores_entrepiso = Math.ceil($_tmp * 2 * 1.3);
    }else{
        $rigidizadores_entrepiso = 0;
    }
    var $hexagonales2 = ($nudosCabriadas + $rigidizadores + $rigidizadores_entrepiso) * 5 * 1.15
    var $total_hexagonales = Math.ceil($hexagonales1 + $hexagonales2);

    //Tornillos T2 para Diafragma con alas para OSB
    var $_T2_1 = adicional_diafragmas_paneles(anchoPB, largoPB, alturaPB, anchoPA, largoPA, alturaPA, tipoTecho);
    var $_T2_2 = adicional_diafragmas_entrepisos_escaleras(anchoPB, largoPB, alturaPB, anchoPA, largoPA, tipoTecho, entrepiso);
    var $total_t2_diafragma =  ($_T2_1 + $_T2_2) * 27;

    //Tornillos T2 para Placa de yeso
    var $_t2_1 = adicional_placas_yeso_paredes(anchoPB, largoPB, alturaPB, paredesInterioresPB, anchoPA, largoPA, alturaPA, paredesInterioresPA)
    var $_t2_2 = adicional_placas_yeso_cielorraso(anchoPB, largoPB, anchoPA, largoPA)
    var $total_t2_placaYeso = Math.ceil(($_t2_1 + $_t2_2)*15);

    var $total_tornillos =  $total_paraPerfilesT1 + $total_hexagonales + $total_t2_diafragma + $total_t2_placaYeso;

    var result = {
        t1 : $total_paraPerfilesT1,
        th : $total_hexagonales,
        t2 : $total_t2_diafragma,
        t22 : $total_t2_placaYeso,
        tt : $total_tornillos
    };

    return result;
}



/************************/
/* PERFIL PGC 100x0,9 ***/
/************************/
var fLoca = Math.pow((Math.pow((26/18),2)+1),(1/2));

/* FUNCIONES CALCULOS */

/* PARA PB y PA */
function PGC100_calcPanelesExternos(ancho,largo,alto){
    var $calc = ((ancho * 2 + largo * 2)/0.4)*alto*1.3;
    return $calc.toFixed(0)
}
/* PARA PB y PA */
function PGC100_calcPanelesInternos(paredesInternas,alto){
    var $calc = ((paredesInternas/0.4)*alto)*1.3
    return $calc.toFixed(0);
}
/* SOLO PB */
function PGC100_calcTecho2Aguas(largo,ancho){
    var $calc1 = (largo/0.4)+1;
    var $a = ancho
    var $b = 1.15*$a/2;
    var $h = 1.15*$a/4;
    var $calc2 = ($a + 3*$b + 2*$h) * 1.1;
    var $calc = $calc2 * $calc1 * 1.1;
    return $calc.toFixed(0);
}
/* SOLO PB */
function PGC100_calcTimpanos(ancho){
    var $h = 1.15*ancho/4;
    var $calc = ((ancho * $h/2)/0.4)*2;
    return $calc.toFixed(0);
}
/* SOLO SI HAY PA */
function PGC100_calcEscaleras(alto){
    var $calc = fLoca * alto * 2 * 1.3;
    return $calc.toFixed(0);
}
function PGC100(altoPB, anchoPB, largoPB, paredesInternasPB, altoPA, anchoPA, largoPA, paredesInternasPA, plantas, tipoTecho){
    var $calcEscaleras = 0;
    if (plantas > 1){
        $calcEscaleras = PGC100_calcEscaleras(altoPB);
        var $calcPanelesExternos = parseFloat(PGC100_calcPanelesExternos(anchoPB,largoPB,altoPB)) + parseFloat(PGC100_calcPanelesExternos(anchoPA,largoPA,altoPA));
        var $calcPanelesInternos = parseFloat(PGC100_calcPanelesInternos(paredesInternasPB,altoPB)) +  parseFloat(PGC100_calcPanelesInternos(paredesInternasPA,altoPA))
    }else{
        $calcPanelesExternos = PGC100_calcPanelesExternos(anchoPB,largoPB,altoPB);
        $calcPanelesInternos = PGC100_calcPanelesInternos(paredesInternasPB,altoPB);
    }

    var $calcTimpanos = 0;
    var $calcTecho2Agua = 0;

    if (tipoTecho == 1){
        $calcTimpanos = PGC100_calcTimpanos(anchoPB);
        $calcTecho2Agua = PGC100_calcTecho2Aguas(largoPB,anchoPB);
    }

    var $total = parseFloat($calcPanelesExternos)  + parseFloat($calcPanelesInternos) + parseFloat($calcTecho2Agua) + parseFloat($calcTimpanos) + parseFloat($calcEscaleras);
    return $total;
}



/************************/
/* PERFIL PGU 100x0,9 ***/
/************************/
var fLoca = Math.pow((Math.pow((26/18),2)+1),(1/2));
function PGU100_panelesExternos(ancho,largo){
    var $_a = ancho * 2 + largo * 2;
    var $calc = $_a * 2 * 1.3;
    return $calc.toFixed(0);
}
function PGU100_panelesInternos(paredesInternas){
    var $calc = paredesInternas*2*1.3;
    return $calc.toFixed(0);
}
function PGU100_timpanos(ancho){
    var $_a = ancho * 1.15 / 2;
    $_a = (2 * $_a) + ancho;
    var $calc = $_a * 2;
    return $calc.toFixed(1);

}
function PGU100_dinteles(aberturas){
    var $calc = aberturas * 2 * 1.1;
    return $calc;
}
/* SOLO SI HAY PA */
function PGU100_escaleras(alto){
    var $calc = ((((alto * (26/18)) + alto) + fLoca * alto) * 2) * 1.3;
    return $calc.toFixed(0);
}
function PGU100(largoPB,anchoPB, altoPB, paredesInternasPB, largoPA ,anchoPA, altoPA, paredesInternasPA, aberturas, plantas, tipoTecho){
    var $linteles =  parseFloat(PGU100_dinteles(aberturas).toFixed(1));

    if (plantas > 1){
        var $panelesExternos = parseFloat(PGU100_panelesExternos(anchoPB,largoPB)) + parseFloat(PGU100_panelesExternos(anchoPA,largoPA));
        var $panelesInternos = parseFloat(PGU100_panelesInternos(paredesInternasPB)) + parseFloat(PGU100_panelesInternos(paredesInternasPA));
        var $escaleras = PGU100_escaleras(altoPB);
    }else{
        $panelesExternos = PGU100_panelesExternos(anchoPB,largoPB);
        $panelesInternos = PGU100_panelesInternos(paredesInternasPB)
        $escaleras = 0;
    }
    if (tipoTecho == 1){
        var $timpanos = PGU100_timpanos(anchoPB);
    }else{
        $timpanos = 0;
    }

    var $total = parseFloat($panelesExternos) + parseFloat($panelesInternos) + parseFloat($timpanos) + parseFloat($linteles) + parseFloat($escaleras);

    return Math.ceil($total);
}

/************************/
/***** PERFIL PGC 200 ***/
/************************/

/* SI TECHO = CUBIERTA PLANA/VIGAS(3) */
function PGC200_techoCubiertaPlana(largo,ancho){
    var $calc = (largo / 0.4) * ancho * 1.3;
    return Math.ceil($calc)
}
/* SI HAY PA */
function PGC200_dintelesAberturas(aberturas){
    var $calc = aberturas * 2 * 1.1
    return Math.ceil($calc)
}
function PGC200(largoPB, anchoPB, largoPA, anchoPA, aberturas, tipoTecho, plantas){

    var $dintelesAberturas = PGC200_dintelesAberturas(aberturas);

    if(tipoTecho == 3){
        var $techoCubiertaPlana = PGC200_techoCubiertaPlana(largoPB,anchoPB)
    }else{
        $techoCubiertaPlana = 0;
    }

    if(plantas > 1){
        var $entrepisos = PGC200_techoCubiertaPlana(largoPA,anchoPA)
    }else{
        $entrepisos = 0;
    }

    var $total = $dintelesAberturas + $techoCubiertaPlana + $entrepisos;
    return $total;
}


/************************/
/* PERFIL PGU 200 *******/
/************************/

//Entrepisos: Solo si hay Planta Alta y con los valores de PA.
//Cubierta Plana: solo si el tipo de techo es Cubierta plana/vigas
function PGU200_entrepisos_cubiertaPlana(ancho, largo){
    var $calc = ((ancho * 2) + (largo *2)) * 1.3;
    return Math.ceil($calc);
}
function PGU200(anchoPB, largoPB, anchoPA, largoPA, plantas, tipoTecho){
    if (plantas > 1){
        var $entrepisos = PGU200_entrepisos_cubiertaPlana(anchoPA, largoPA);
    }else{
        $entrepisos = 0;
    }

    if (tipoTecho == 3) {
        var $cubiertaPlana = PGU200_entrepisos_cubiertaPlana(anchoPB, largoPB);
    }else{
        $cubiertaPlana = 0;
    }

    var $total = $entrepisos + $cubiertaPlana;

    return $total;
}

/*************************/
/* TOTALES ***************/
/*************************/

//LOS PERFILES NO AFECTAN RESULTADO
function total_PGC100(totalPGC100){
    var $total = totalPGC100 * 1.51;
    return parseInt($total);
}
function total_PGU100(totalPGU100){
    var $total = totalPGU100 * 1.23;
    return parseInt($total);
}
//LOS PERFILES AFECTAN RESULTADO
// =+E8*SI(Computo!F8;Computo!L8;SI(Computo!F9;Computo!L9;SI(Computo!F10;Computo!L10;SI(Computo!F11;Computo!L11;SI(Computo!F12;Computo!L12;0)))))
function total_PGC200(entrepiso,luzmax,perfilPGC){
    if(entrepiso === 'humedo'){
        switch(luzmax){
            case 4:
                perfilPGC = 'Perfiles PGC 200 x 1,25';
                break;
            case 4.5:
                perfilPGC = 'Perfiles PGC 200 x 2,00';
                break;
            case 5:
                perfilPGC = 'Perfiles PGC 250 x 1,60';
                break;
            case 5.5:
                perfilPGC = 'Perfiles PGC 250 x 2,00';
                break;
            case 6:
                perfilPGC = 'Perfiles PGC 250 x 2,50';
                break;
        }
    }else{
        switch(luzmax){
            case 4:
                perfilPGC = 'Perfiles PGC 200 x 1,25';
                break;
            case 4.5:
                perfilPGC = 'Perfiles PGC 200 x 1,25';
                break;
            case 5:
                perfilPGC = 'Perfiles PGC 200 x 2,00';
                break;
            case 5.5:
                perfilPGC = 'Perfiles PGC 250 x 1,60';
                break;
            case 6:
                perfilPGC = 'Perfiles PGC 250 x 2,00';
                break;
        }
    }
}

function total_PGU200(){

}