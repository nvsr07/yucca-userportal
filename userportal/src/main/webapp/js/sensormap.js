/* Istruzioni per l'utilizzo

    1 - Inserire nel file sensormap.css le dimensioni della mappa (elemento .map)
    2 - inserire nella pagina HTML di visualizzazione il seguente codice
    
        <div id="map" class="map">
          <div id="popup" class="ol-popup">
              <a href="#" id="popup-closer" class="ol-popup-closer"></a>
              <div id="popup-content"></div>
          </div>
        </div>

    3 - richiamare la funzione showMap() per visualizzare la mappa
    4 - se si vuole cambiare il marker, sostituire il file sensore.png
        con l'immagine desisderata
    5 - se necessario, modificare le BASE URL presenti all'inizio di questo file.
        
    per semplificare il riutilizzo del codice in altre applicazioni, e quindi,
    per evitare di definire oggetti globali usati da altri, tutte le componenti
    della mappa sono state definite come "locali" alla funzione showMap()

*/


// Base URL per il recupero dell'elenco dei sensori (API)
//var urlBaseSensor = "http://userportal.smartdatanet.it/userportal/api/proxy/virtualentitiesgeo";
var urlBaseSensor = "/userportal/api/proxy/virtualentitiesgeo";

// Base URL per il recupero delle informazioni degli stream (API)
//var urlBaseStream = "http://userportal.smartdatanet.it/userportal/api/proxy/streams/";
var urlBaseStream = "/userportal/api/proxy/streams/";

// BaseURL per il recupero della pagina web con il dettaglio dei sensori
//var urlBaseSensorWeb = "http://userportal.smartdatanet.it/userportal/#/management/viewVirtualentity/";
var urlBaseSensorWeb = "/userportal/#/management/viewVirtualentity/";

// Base URL per il recupero della pagina web con il dettaglio degli stream
//var urlBaseStreamWeb = "http://userportal.smartdatanet.it/userportal/#/dashboard/stream/";
var urlBaseStreamWeb = "/userportal/#/dashboard/stream/";

// se obj è un array restituisce obj altrimenti converte obj in un
// array di un solo elemento (serve per risolvere il comportamento
// anomalo di WSO2

  function initArrayZeroOneElements(obj){
  var result = [];
  if(obj){
   if(obj instanceof Array){
    result = obj;
   }
   else{
    result.push(obj);
   }
  }
  return result;
 };

// funzione da invocare per mostrare la mappa: invoca il servizio che restituisce 
// l'elenco dei sensori e richiama la funzione readSensori() per il parsing del risultato

function showMap() {
  var xmlHttp = new XMLHttpRequest(); 
  var latMin = 0;
  var latMax = 0;
  var lonMin = 0;
  var lonMax = 0;
  
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var sensorList = JSON.parse(xmlHttp.responseText);
        
        // definisce lo stile dell'icona in termini di immagine da visualizzare
        // e punto di ancoraggio
        var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: 'img/sensore.png'
          }))
        });
        
        // recupera il numero di sensori
        var l = sensorList.virtualEntities.virtualEntityGeo.length;
        
        // definisce le feature (i marker) da visualizzare.
        // i marker sono inseriti all'interno dell'array iconFeature
        
        var iconFeature = [];
        
        for(var i = 0; i < l; i++) {
          var tipo = sensorList.virtualEntities.virtualEntityGeo[i].tipoVirtualEntity;
          var codice = sensorList.virtualEntities.virtualEntityGeo[i].codeVirtualEntity;
          var latitudine = sensorList.virtualEntities.virtualEntityGeo[i].lat;
          var longitudine = sensorList.virtualEntities.virtualEntityGeo[i].lon;
          var codiceTenant = sensorList.virtualEntities.virtualEntityGeo[i].codiceTenant;
        
            
          // legge solo i sensori (tipo == device) che hanno delle coordinate
          // geografiche impostate. Se una virtuaEntity non è un sensore e/o
          // non ha coordinate geografiche impostate, non viene visualizzato
          // nella mappa
            
          if ((tipo === "Device") && (latitudine != 0) && (longitudine != 0)) { 
              
              // calcola il bound box per visualizzare tutti i sensori nella mappa... 
              // probabilmente c'è un modo più elegante... ma non ho trovato
              // un esempio funzionante.

              // si suppone che non ci siano sensori in Lon=0, Lat=0

              if ((lonMin === 0) && (lonMax === 0)){
                  lonMin = longitudine;
                  lonMax = longitudine;
              }

              if ((latMin === 0) && (latMax === 0)){
                  latMin = latitudine;
                  latMax = latitudine;
              }


              if (latitudine < latMin)
                  latMin = latitudine;

              if (latitudine > latMax)
                  latMax = latitudine;

              if (longitudine < lonMin)
                  lonMin = longitudine;

              if (longitudine > lonMax)
                  lonMax = longitudine;
            
            // costruisce l'URL per la lettura dell'elenco degli stream di un sensore
            // ed esegue la chiamata alla relativa API
              
            var urlSensore = urlBaseStream + codiceTenant + "/" + codice;
            var xmlHttp2 = new XMLHttpRequest(); 

            var elencoStreamSensore = [];  
            xmlHttp2.onreadystatechange = function() {
                if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200) {
                    var streamList = JSON.parse(xmlHttp2.responseText);
                    var strlist = initArrayZeroOneElements(streamList.streams.stream);
                    
                    // recupera, l'elenco degli stream associato al sensore e crea
                    // un array contenente le informazioni necessarie a visualizzare
                    // la tabella nel popup della mappa
                    
                    var n = strlist.length; 
                      for(h = 0; h < n; h++) {
                        elencoStreamSensore[elencoStreamSensore.length] = {};
                        elencoStreamSensore[elencoStreamSensore.length-1].codiceStream =
                            strlist[h].codiceStream;
                        elencoStreamSensore[elencoStreamSensore.length-1].domainStream =
                            strlist[h].domainStream;
                        elencoStreamSensore[elencoStreamSensore.length-1].nomeStream = 
                            strlist[h].nomeStream;
                    }
                }
                }
                
                // esegue l'invocazione dell'API che legge le informazioni degli stream
                xmlHttp2.open("GET", urlSensore, false);
                xmlHttp2.send();


                // definisce il contenuto della feature (icona/marker) relativa al
                // sensore e ne associa, come stile, iconStyle

                iconFeature[iconFeature.length] = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([longitudine, latitudine],
                                                                  'EPSG:4326', 'EPSG:3857')),
                    name: codice,
                    tenant: codiceTenant,
                    lat: latitudine,
                    lon: longitudine,
                    tipo: tipo,
                    streams: elencoStreamSensore
                });
              
                iconFeature[iconFeature.length -1].setStyle(iconStyle);
                    
          
          
          } // end if (tipo && lon && lat)
                  
        } // end for

        // definisce l'insieme degli oggetti vettoriali (icone/marker) 
        // da visualizzare nella mappa, come insieme di feature
        
        var vectorSource = new ol.source.Vector({
            features: iconFeature
        });

        // definisce il layer in cui visualizzare l'insieme delle feature
        
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });
      
        // recupera i riferimenti al container che deve visualizzare i popup
        var container = document.getElementById('popup');       // contenitore del popup
        var content = document.getElementById('popup-content'); // contenuto
        var closer = document.getElementById('popup-closer');   // freccia

        // il click sul pulsante "X" del popup ne provoca la chiusura
       
        closer.onclick = function() {
            container.style.display = 'none';
            closer.blur();
            return false;
        };

        // definisce un overlay, all'interno della mappa, in cui visualizzare
        // il popup
          
        var overlay = new ol.Overlay({
            element: container
        });

        
        
        // definisce la mappa e ci associa il layer dei vettori e gli overlay
        // la mappa fa riferimento al div "map"... se si cambia il nome del DIV
        // è necessario modificare questo codice
    
               
        var map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            }),
            vectorLayer
          ],
         overlays: [overlay]
        });

        // centra la mappa sulle coordinate in modo da visualizzare tutti i sensori
        // si lascia commentato il codice per l'impostazione manuale delle dimensioni
        // della mappa
        //map.getView().setCenter(ol.proj.transform([7.6761, 45.0781], 'EPSG:4326', 'EPSG:3857'));
        //map.getView().setZoom(1);
        
        var extent =ol.proj.transformExtent([lonMin, latMin, lonMax, latMax], 'EPSG:4326', 'EPSG:3857');
        map.getView().fitExtent(extent, map.getSize());

        // istanzia il popup che corrisponde al DIV "popup".
        // se si cambia il nome del DIV bisogna modificare il codice seguente
            
        var element = document.getElementById('popup');
        
        // se si fa click sulla mappa, mostra il popup
        map.on('click', function(evt) {
          var feature = map.forEachFeatureAtPixel(evt.pixel,
              function(feature, layer) {
                return feature;
              });
          if (feature) {
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();
            var strLst = feature.get('streams');
            
            // definisce il testo HTML da visualizzare dento al popup
            testo = '<b>Sensore:</b> ' + feature.get('name') + '<br/>';
            testo += '<b>Tenant:</b> ' + feature.get('tenant') + '<br/><br/>';
            testo += '<a href="' + urlBaseSensorWeb + feature.get('tenant') + 
                '/' + feature.get('name');
            testo += '" target = "_blank">Sensor Detail</a><br/><br/>';
            testo += 'Sensor Stream List:<br/><br/>';
            testo += '<table width=100%><tr><td width=33%><b>Code:</b></td>';
            testo += '<td width=33%><b>Name:</b></td><td width=34%><b>Domain:</b></td></tr>';

            for (var k = 0; k < strLst.length; k++) {
                var urlStrm = urlBaseStreamWeb + feature.get('tenant') + 
                    "/" + feature.get('name') + "/" + strLst[k].codiceStream;
                testo += '<tr><td><a href="' + urlStrm + '" target = "_blank">' + 
                    strLst[k].codiceStream + '</a></td>';
                testo += '<td>' + strLst[k].nomeStream + '</td>';
                testo += '<td>' + strLst[k].domainStream + '</td></tr>';
            }

            testo += "</table>";

            overlay.setPosition(coord);
            content.innerHTML = testo;
            container.style.display = 'block';
            $('.ol-viewport').css('overflow', '');
            //map.getView().setCenter(ol.proj.transform([feature.get('lon'), feature.get('lat')], 'EPSG:4326', 'EPSG:3857'));

          }
        });
        
        // gestise l'evento mousemove sull'icona del sensore.
        // quando si passa con il puntatore del mouse su un'icona
        // il puntatore diventa una "manina"
          
        $(map.getViewport()).on('mousemove', function(e) {
              var pixel = map.getEventPixel(e.originalEvent);
              var hit = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                return true;
              });
              var target = document.getElementById(map.getTarget());
              if (hit) {
                target.style.cursor = 'pointer';
              } else {
                target.style.cursor = '';
              }
        });   
        
        
        
    }
    
    }
    
    // esegue la chiamata all'API per il recupero dell'elenco dei sensori
    xmlHttp.open("GET", urlBaseSensor, false);
    xmlHttp.send();
}




  
    

    
