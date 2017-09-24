var map;
var markers =[];

var locations = [
 {title: 'Space Needle', lat: 47.620408, lng: -122.349007},
 {title: 'Olympic Sculpture Park', lat: 47.616426, lng: -122.355138},
 {title: 'Gum Wall', lat: 47.608494, lng: -122.340344},
 {title: 'Kerry park', lat: 47.629484, lng: -122.359901},
 {title: 'Snoqulmiae waterfalls',lat: 47.541764, lng: -121.837683}

];

function initMap() {
    ko.applyBindings(new viewModel());

}
var FavPlace = function(data){
   var self = this;
   self.name = ko.observable(data.title);
   self.isVisible = ko.observable(true);
   self.lat = ko.observable(data.lat);
   self.lng = ko.observable(data.lng);


};
function viewModel()
{
  var self = this;
  this.favPlaces = ko.observableArray([]);
  this.searchPlace = ko.observable("");
  locations.forEach(function(place){
    self.favPlaces.push(new FavPlace(place));
  });

  map = new google.maps.Map(document.getElementById('map'), {
     zoom: 12,
     center: {lat: 47.605999, lng: -122.335208}
 });

this.populateInfoWindow = function(marker,infowindow){

       // Check to make sure the infowindow is not already opened on this marker.
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
 }
 this.largeInfoWindow = new google.maps.InfoWindow();

 for (var i = 0; i < locations.length; i++) {
             this.markerTitle = locations[i].title;
             this.markerLat = locations[i].lat;
             this.markerLng = locations[i].lng;
             // Google Maps marker setup
             this.marker = new google.maps.Marker({
                 map: map,
                 position: {
                     lat: this.markerLat,
                     lng: this.markerLng
                 },
                 title: this.markerTitle,
                 lat: this.markerLat,
                 lng: this.markerLng,
                 id: i,
                 animation: google.maps.Animation.DROP
             });
             this.marker.setMap(map);
             markers.push(this.marker);

                this.marker.addListener('click', function() {
                  self.populateInfoWindow(this, self.largeInfoWindow);
                });

                this.myLocationsFilter = ko.computed(function() {
                   var result = [];
                   for (var i = 0; i < markers.length; i++) {
                         var markerLocation = markers[i];
                   if (markerLocation.title.toLowerCase().includes(this.searchPlace().toLowerCase())) {
                      result.push(markerLocation);
                      markers[i].setVisible(true);
                  } else {
                      markers[i].setVisible(false);
                  }
                  }
                  return result;
                }, this);

}

}
