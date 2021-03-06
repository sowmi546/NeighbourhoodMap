

var map;
var markers = [];

var locations = [
  {title: 'Space Needle', lat: 47.620408, lng: -122.349007},
  {title: 'Olympic Sculpture Park', lat: 47.616426, lng: -122.355138},
  {title: 'Gum Wall', lat: 47.608494, lng: -122.340344},
  {title: 'Kerry park', lat: 47.629484, lng: -122.359901},
  {title: 'Snoqulmiae waterfalls', lat: 47.541764, lng: -121.837683}

];

var FavPlace = function (data) {
  "use strict";
  var self = this;
  self.name = ko.observable(data.title);
  self.isVisible = ko.observable(true);
  self.lat = ko.observable(data.lat);
  self.lng = ko.observable(data.lng);


};

function viewModel() {
  var self = this;
  this.favPlaces = ko.observableArray([]);
  this.searchPlace = ko.observable("");
  locations.forEach(function (place) {
    self.favPlaces.push(new FavPlace(place));
  });
  //setting the center to a given point based on the latitute and longitude
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 47.605999, lng: -122.335208}
  });
  this.setInfo = function () {

    self.populateInfoWindow(this, self.largeInfoWindow);
    this.setAnimation(google.maps.Animation.BOUNCE);
    //setting the time for animation(bounce)
    setTimeout((function () {
      this.setAnimation(null);
    }).bind(this), 2000);


  };
  //populating the info window with the details
  this.populateInfoWindow = function (marker, infowindow) {
    if (infowindow.marker !== marker) {
      infowindow.setContent('');
      infowindow.marker = marker;

      var foursquare = 'https://api.foursquare.com/v2/venues/search?client_id=MHY0AB0H4WO2GO4PPYSTHGFXRJJDRXPDIOBYGBH12TXXANAJ&client_secret=D3BPZLRG0P4T2VU35K34PWWCGZXBCGE2JANFENPY4JJBLV0Q&v=20150321&ll=' + marker.lat + ',' + marker.lng + '&query=' + marker.title;

      //using foursquare API to get the necessary details about the place
      $.getJSON(foursquare).done(function (marker) {
        var response = marker.response.venues[0];
        self.address = response.location.formattedAddress[0];
        self.stateDetails = response.location.formattedAddress[1];
        self.countryDetails = response.location.formattedAddress[2];
        //self.contactDetails = marker.response.venues[0].contact.formattedPhone;
        self.myName = marker.response.venues[0].name;

        if (self.countryDetails === undefined) {
          self.countryDetails = "additional details are not available";
        }

        self.fourSquareDetails =

        '<h5><b>' + self.myName +
        '</b></h5>' + '<div>' +
        '<h6> Address: </h6>' +
        '<p>' + self.address + '</p>' +
        '<p>' + self.stateDetails + '</p>' +
        '<p>' + self.countryDetails + '</p>' +
        //  '<p>' + self.contactDetails + '</p>'+
        '</div>';


        infowindow.setContent(self.fourSquareDetails);
      }).fail(function () {
        // Send alert
        alert("Encounted a problem with loading Foursquare API. Please try again");
      });

      infowindow.open(map, marker);


      infowindow.addListener('closeclick', function () {
        infowindow.marker = null;
      });
    }
  };

  // info window to display the details of the place
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
    this.marker.addListener('click',self.setInfo);


  }
  //implementing the Filtering functionality and setting the visibility of the selected place
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
//initializing the map
function initMap() {
  "use strict";
  ko.applyBindings(new viewModel());
}
//error handling when google maps fails to load
function mapError() {
  "use strict";
  alert("Google Maps has failed to load. Please try later");
}
