var map, layer;

function initialize() {
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: chicago,
    zoom: 11
  });
  
var geojson;
var origjson;



var public_spreadsheet_url = '1gPnmxxDFYE1nv8ZCAYG3j1DCYgmrtJ7ZHwvRzop7XNs';
 $(document).ready(function(){
    Tabletop.init( { key: public_spreadsheet_url,
                     //callback: convertToGeoJSON,
                     callback: placeSomeMarkers,
                     simpleSheet: true } )
  });
  //Tabletop.callbacks = {convertToGeoJSON, filterMarkers};
  markers = [];
  function placeSomeMarkers(data) {
    
    
    for ( var i = 0; i < data.length; i++) {
	  var marker = new google.maps.Marker({
	    position: {lat: Number(data[i]["Latitude"]), lng: Number(data[i]["Longitude"])},
	    map: map,
	    title: data[i]["Center Name"],
	    tags: data[i]["Tags"]
	  });
	   window.markers.push(marker);
	  //we need to have a conditional and break the loop then show the infowindow

	var getMapClickListener = function (m) {
		var infoWindow = new google.maps.InfoWindow();
    var content = data[i]["Center Name"].bold() + "<br>" + "Address: ".bold()+ data[i]["Address"] + "<br>" + "Phone Number:".bold() + data[i]["Phone Number"] + "<br>" + "Services: ".bold() + data[i]["Description"] +"<br>" + "Hours of Operation: ".bold() + data[i]["Hours of Operation"];
    infoWindow.setContent("<div style='width:150px;'>" + content + "</div>");
        return function () {
            infoWindow.open(m, this);
	    
        };
    };
    google.maps.event.addListener(marker, 'click', getMapClickListener(map));

    }//end of loop
  }
  
  function convertToGeoJSON(data){
  	console.log(data);
  	places = [];
  	for( i = 0;i < data.length; i ++ ){
  	  window.origjson=data;
  	  place = {
  		type: 'Feature',
  		properties: {
  			title: data[i]["Center Name"],
  			description: data[i]["Address"] +  data[i]["Phone Number"] + data[i]["Description"] + data[i]["Hours of Operation"],
  			tags: data[i]["Tags"],
  			// "Condoms,HIV,Pregnancy,Condoms,Pregnancy..."
  			// go through every character in the string -> if comma enter the previous string into your list
  			},
  			geometry: {
  				type:'Point',
  				coordinates: [ Number(data[i]["Longitude"]), Number(data[i]["Latitude"])]
  			}
  	    }
  	  places.push(place);
  	}
  	geojson = {type: 'FeatureCollection', features:places};
  	//setupMap(geojson);
  	map.data.addGeoJson(geojson);
  } 
  
 /* var infowindow = new google.maps.InfoWindow();
  map.data.addListener('click', function(event) {
	var myHTML = event.feature.getProperty("description");
	infowindow.setContent("<div style='width:150px;'>"+myHTML+"</div>");
	// position the infowindow on the marker
	infowindow.setPosition(event.feature.getGeometry().get());
	// anchor the infowindow on the marker
	infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
	infowindow.open(map);
}); */

/*
  layer = new google.maps.FusionTablesLayer({
    query: {
      select: "col5",
      from: '1MPAuwYRh1UFafkiFz6kqn3eDcnqBtW9Ohw-gOgsp'
    }   
    
  }); */
   var mapOptions = {
    zoom: 6
  };

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
                                       
		map.panTo( pos);
		map.setZoom(15);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Location found using HTML5.'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
  //layer.setMap(map);
}


function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(41.850033, -87.6500523),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}
/*new google.maps.Marker({
    position: {Number(window.origjson[i]["Longitude"]), Number(data[i]["Latitude"])},
    map: map,
  }); */

function filterMarkers (category) {
	
    for (i = 0; i < window.markers.length; i++) {
    	var marker = window.markers[i]
        var diffTags= marker.tags;
        var tagArr = diffTags.split(",");
        console.log(tagArr);
        for( j = 0; j < tagArr.length ; j ++ ){
        	console.log(tagArr[j]);
        	// If is same category or category not picked
        	if (tagArr[j] === category || category.length === 0) {
            	marker.setVisible(true);
            	break;
        		}
        	// Categories don't match 
        	else {
            	marker.setVisible(false);
        		}
        		}
     }
}

/*function area( category){
	filterMarkers(origjson,category);
	//cynthia tried here, data not recognized
	// goal = get it recognized 

} */


google.maps.event.addDomListener(window, 'load', initialize);