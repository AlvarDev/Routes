/*****************************************************
* database will get de array with the alvaras info
*****************************************************/
var database;
var database2;
var back;
var sentido;

var load1 = false;
var load2 = false;

/*****************************************************
* Google Map we use in the front end
*****************************************************/
var map;

/*****************************************************
* Route line to show on Google Map
*****************************************************/
var routeLine = [];

/*****************************************************
* Route line setting
*****************************************************/
var routePath;

/*****************************************************
* When the document is ready,
* we get the array from the files/alvaras.csv
*****************************************************/
$(document).ready(function() {
     $.ajax({
         url:   'https://raw.githubusercontent.com/AlvarDev/HostJson/master/shape225.json',//url a pedir, este sería el servlet
         type:  'GET',			//tipo de peticion [GET, POST.DELETE,PUT]
         dataType: "json",		//el formato con el que trabajamos, hoy en día todo se hace con Json

         //si la peticion es exitosa, se ejecuta el siguiente codigo
         success:  function (response) {
           database = response;
           load1 = true;
           if(load1 && load2){
             google.maps.event.addDomListener(window, 'load', initialize);
           }
         },

         //si la peticion no es exitosa se ejecuta el siguiente codigo
         error: function(response){
           //muestro en la consola [f12] el mensaje de error
           console.log("damm");
         }
       });

       $.ajax({
           url:   'https://raw.githubusercontent.com/AlvarDev/HostJson/master/route225.json',//url a pedir, este sería el servlet
           type:  'GET',			//tipo de peticion [GET, POST.DELETE,PUT]
           dataType: "json",		//el formato con el que trabajamos, hoy en día todo se hace con Json

           //si la peticion es exitosa, se ejecuta el siguiente codigo
           success:  function (response) {
             database2 = response;
             load2 = true;
             if(load1 && load2){
               google.maps.event.addDomListener(window, 'load', initialize);
             }
           },

           //si la peticion no es exitosa se ejecuta el siguiente codigo
           error: function(response){
             //muestro en la consola [f12] el mensaje de error
             console.log("damm");
           }
         });

});

/*****************************************************
* Initialize the map, the clusters, the polygons,
* the Slider for years range and the components
*****************************************************/
//google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
      center: new google.maps.LatLng(-25.383948, -49.246980),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel:  false,
      styles : mapStylesGray
    }

  map = new google.maps.Map(mapCanvas, mapOptions);
  setPoints();
}

function setPoints(){
  pos = 0;
    $.each(database, function(i, point) {
      point.LAT = point.LAT.replace(",", ".");
      point.LON = point.LON.replace(",", ".");
    });

    $.each(database2, function(i, point) {
      point.LAT = point.LAT.replace(",", ".");
      point.LON = point.LON.replace(",", ".");
    });



    $.each(database, function(i, point) {
        routeLine.push({lat: parseFloat(point.LAT), lng: parseFloat(point.LON)});
        //getMarker(point, i).setMap(map);
    });

    database2.sort(compare);
    sentido = database2.length > 0 ? database2[0].SENTIDO : "";
    $.each(database2, function(i, point) {
        //routeLine.push({lat: parseFloat(point.LAT), lng: parseFloat(point.LON)});
        getMarker(point, i).setMap(map);
    });

    routePath = new google.maps.Polyline({
              path: routeLine,
              geodesic: true,
              strokeColor: '#1565c0',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
    routePath.setMap(map);
}

function compare(a,b) {
  if (a.SEQ < b.SEQ)
    return -1;
  if (a.SEQ > b.SEQ)
    return 1;
  return 0;
}

function getMarker (item, number) {
	var latLng = new google.maps.LatLng(item.LAT, item.LON);
  var iconURL = sentido == item.SENTIDO ?
                "http://maps.google.com/mapfiles/ms/icons/green-dot.png" :
                "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

	var marker = new google.maps.Marker({position: latLng, icon: iconURL});
	marker.addListener('click', function() {
   		var contentString ='<strong>'+item.NOME+'</strong> <br> '+item.SEQ;
   		var infowindow = new google.maps.InfoWindow({content: contentString});
       	 infowindow.open(map, marker);
    });
  return marker;
}
