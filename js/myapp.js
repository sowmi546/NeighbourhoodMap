
var map;
var markers =[];

var locations = [
 {title: 'Space Needle', lat: 47.620408, lng: -122.349007},
 {title: 'Olympic Sculpture Park', lat: 47.616426, lng: -122.355138},
 {title: 'Gum Wall', lat: 47.608494, lng: -122.340344},
 {title: 'Kerry park', lat: 47.629484, lng: -122.359901},
 {title: 'Snoqulmiae waterfalls',lat: 47.541764, lng: -121.837683},

];
var styles = [
  {
    featureType: 'water',
    stylers: [
      { color: '#19a0d8' }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#ffffff' },
      { weight: 6 }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -40 }
    ]
  },{
    featureType: 'transit.station',
    stylers: [
      { weight: 9 },
      { hue: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      { visibility: 'off' }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { lightness: 100 }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { lightness: -100 }
    ]
  },{
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { visibility: 'on' },
      { color: '#f0e4d3' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -25 }
    ]
  }
];



var FavPlace = function(data){
  var self = this;
  var makeMarkerIcon = function(markerColor) {
   var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
};
  var defaultIcon = makeMarkerIcon('0091ff');

  self.name = ko.observable(data.title);
  //self.isVisible = ko.observable(true);
  self.lat = ko.observable(data.lat);
  self.lng = ko.observable(data.lng);

  self.marker = new google.maps.Marker({

  //  position: new google.maps.LatLng(this.lat,this.lng),
    //title: this.name,
    position: {lat: self.lat(), lng: self.lng()},
    //console.log(position +"POSITION VALUE");
    map:map,
    animation: google.maps.Animation.DROP,
    icon: this.defaultIcon,

  });
  map.bounds.extend(self.marker.position);

  //this.marker.setMap(map);
  /*this.showMarker = ko.computed(function() {
  		if(this.isVisible() === true) {
  			this.marker.setMap(map);
  		} else {
  			this.marker.setMap(null);
  		}
  		return true;
  	}, this); */
  this.marker.addListener('click',function(){
      var infowindow = new google.maps.InfoWindow();
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);
              infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
              var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                  heading: heading,
                  pitch: 30
                }
              };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          } else {
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Street View Found</div>');
          }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
      }
  });
};


function viewModel()
{
  var self = this;
  this.favPlaces = ko.observableArray([]);
  locations.forEach(function(place){
    self.favPlaces.push(new FavPlace(place))
  });
  //this.currentPlace =
//  this.setLocation = function(){
//    alert('Alert from setLocation');
//  };
  map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat: 47.605999, lng: -122.335208}
	});

}
function initMap() {
    ko.applyBindings(new viewModel());

}
