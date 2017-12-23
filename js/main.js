// create a global variable to hold the map
var map;
var i;
// model includes the place name,its Foursquare venue id and location
var model = [
        {title: 'University of Southern California', venue_id: '45001adcf964a520ab381fe3', location: {lat: 34.022352, lng: -118.285117}},
        {title: 'China Town', venue_id: '508760b5e4b0d647dab288a6', location: {lat: 34.062334, lng: -118.238331}},
        {title: 'Union Station', venue_id: '45b88de0f964a520ce411fe3', location: {lat: 34.056219, lng: -118.236502}},
        {title: 'Grand Park LA', venue_id: '4fecf601067d351381ea64fa', location: {lat: 34.056329, lng: -118.246771}},
        {title: 'Dodger Stadium', venue_id: '40db6b00f964a5207d011fe3', location: {lat: 34.073851, lng: -118.239958}},
        {title: 'Little Tokyo', venue_id: '41be2d00f964a520841e1fe3', location: {lat: 34.052339, lng: -118.239505}},
        {title: 'The Broad', venue_id: '4eeb4c14b634b469c36a8c80', location: {lat: 34.054469, lng: -118.250558}},
        {title: 'Los Angeles City Hall', venue_id: '4b5113edf964a520314127e3', location: {lat: 34.053527, lng: -118.242932}}
    ];
// this is the function that make a map appear
function initMap() {
    //use constructor to create a map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.056329, lng: -118.246771},
        zoom: 13
    });
    //create an instance of bounds
    var bounds = new google.maps.LatLngBounds();
    //parameter places is observable array in the viewModel
    model.forEach(function (places) {
        //addMarkers function is defined below
        addMarkers(places);
        //make the bound extend to the farest location
        bounds.extend(places.location);
        });
    map.fitBounds(bounds);
    };
//this function make markers appear on the map
function addMarkers(place) {
    var self = this;
    var latlng = {
            lat: place.location.lat,
            lng: place.location.lng
        };
    // Instance of markers
    self.marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: place.title,
        animation: google.maps.Animation.DROP,
        id: place.venue_id
    });
    // push all markers in observable array makers defined in viewModel
    self.markers.push(self.marker);
    //add a listener on marker
    self.marker.addListener('click', function () {
        // console.log('it is ok here at marker click.');
        populateInfoWindow(place);
    });
}
//build viewModel using js constructor
function viewModel() {
    this.markers = ko.observableArray([]);
    this.infoWindowArray = ko.observableArray([]);
    //search bar input
    this.query = ko.observable('');
    //observable array of model
    this.places = ko.observableArray([]);
    //google street view
    this.googlePhoto = ko.observable();
    //foursquare infowindow
    this.venue_rating = ko.observable();
    this.venue_name = ko.observable();
    this.venue_likes = ko.observable();
    this.venue_address = ko.observable();
    // push all places in model to an observableArray
    model.forEach(function (places) {
        this.places.push(places);
    });
    this.filterResult = ko.computed(function () {
        var query = this.query();
        if (!query) {
            showMarkers();
            return this.places();
        }else {
            return ko.utils.arrayFilter(model, function (item){
                if (item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    showFilteredMarkers(item);
                    return item;
                }else {
                    hideFilteredMarkers(item);
                }
            });
        }
    }, this);
    // this function is for the list view item to make the list clickable
    this.getInfoWindow = function(place) {
        populateInfoWindow(place);
        // console.log('it is ok here.');
    };
};
//make markers appear on map
function showMarkers() {
    var self = this;
    for (i=0; i<self.markers().length; i++){
        self.markers()[i].setVisible(true);
        self.markers()[i].setAnimation(null);
    }
}
//this function shows the marker of the selected item
function showFilteredMarkers(item) {
    var self = this;
    closeInfoWindows();
    for (i=0; i<self.markers().length; i++){
        if (self.markers()[i].title.toLowerCase() === item.title.toLowerCase()) {
            self.markers()[i].setVisible(true);
            self.markers()[i].setAnimation(google.maps.Animation.BOUNCE);
            // self.markers()[i].setIcon(self.highLightedIcon);
            map.setCenter(self.markers()[i].getPosition());
        }
    }
}
//this function hides markers except the selected item
function hideFilteredMarkers(item) {
    var self = this;
    // closeInfoWindows();
    for (i = 0; i < self.markers().length; i++) {
        if (self.markers()[i].title.toLowerCase() === item.title.toLowerCase()) {
            self.markers()[i].setVisible(false);
            self.markers()[i].setAnimation(null);
        }
    }
}
function populateInfoWindow(place) {
    var self = this;
    var currentClickedMarker;
    //iterate markers array to see which marker is clicked
    for (i = 0; i < self.markers().length; i++) {
        if (self.markers()[i].title.toLowerCase() === place.title.toLowerCase()) {
            currentClickedMarker = self.markers()[i];
        }
    }
    //check the clicked marker, make it no animation after clicked
    if (currentClickedMarker.getAnimation() !== null) {
        currentClickedMarker.setAnimation == (null);
    } else {
        currentClickedMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimer(currentClickedMarker);
    }
    //get google street view API
    var streetViewAPI = 'AIzaSyA-wuhRggL_R0VvRimv2eIzlPOk2JyAoRM';
    var lat = place.location.lat;
    var lng = place.location.lng;
    var streetViewAPIendPoint = 'https://maps.googleapis.com/maps/api/streetview?' + 'size=400x400&location=' + lat + ',' + lng + '&heading=151.78&pitch=-0.76&scale=2' + '&key=' + streetViewAPI;
    // Check if image available
    (!streetViewAPIendPoint) ?
    self.googlePhoto('Sorry, no photo available') :
    self.googlePhoto(streetViewAPIendPoint);
    // if(streetViewAPIendPoint == false){
    //     self.googlePhoto('Sorry, no photo available.')
    // }else{self.googlePhoto(streetViewAPIendPoint)
    // };
    //Foursquare credentials
    var foursquareClientID = 'DENTERFPABEBP30U0SMIYWBRXNZA1DLQRMEZH3HXFBENLKXT';
    var foursquareClientSecret = 'P0UYTAX53TJI3DYTNTFZTH0EL1F2TKBAF4E1HCMXRIYNA5K4';
    //Foursquare API endpoint
    var foursquareAPIEndPoint = 'https://api.foursquare.com/v2/venues/' + place.venue_id + '?client_id=' + foursquareClientID + '&client_secret=' + foursquareClientSecret + '&v=20170808';
    //Ajax request
    $.ajax({
        type: 'GET',
        url: foursquareAPIEndPoint,
        processData: false,
    }).done(function (data) {
        var fourSquareLocation = data.response.venue;
        var address = fourSquareLocation.location.formattedAddress;

        // Set the venue details
        self.venue_name(fourSquareLocation.name);
        self.venue_likes(fourSquareLocation.likes.count);
        // self.venue_rating(fourSquareLocation.rating);

        if(fourSquareLocation.rating == undefined){
            self.venue_rating('Sorry, no rating in this location.')
        }else{
            self.venue_rating(fourSquareLocation.rating)
        }

        var addressForm = '';
        address.forEach(function (address) {
            addressForm += address + ' ';
        });

        self.venue_address(addressForm);

        closeInfoWindows();

        //create a dom node for the infowindow
        var windowContent = '';
        windowContent += '<div id="infoWindowContent">';
        windowContent += '<h2>' + self.venue_name() + '</h2>';
        windowContent += '<img src=' + self.googlePhoto() + '>';
        windowContent += '<p>Address- ' + self.venue_address() +'</p>';
        windowContent += '<p>Likes- ' + self.venue_likes() +'</p>';
        windowContent += '<p>Rating- ' + self.venue_rating() + '</p>';
        windowContent += '</div>';

        //creat instance of google infowindow
        var infoWindow = new google.maps.InfoWindow({
            content: windowContent,
            position: {lat: lat, lng: lng},
            maxWidth: 300
        });
        //push infowindows into infowindow array which is observable
        self.infoWindowArray.push(infoWindow);
        // This will open infowindow on its marker
        infoWindow.open(map);
        //empty the search bar list view once a marker is clicked
        self.query('');
        //close the infowindow when it's clicked again
        infoWindow.addListener('closeclick', function () {
            self.marker = null;
        });

    })
        .fail(function(error) {
            foursquareError();
        });
}
// This function will automatically stops marker animation
// After 3 seconds
function setTimer(marker) {
    setTimeout(function () {
        marker.setAnimation(null);
    }, 3000);
}
// This function close all of the infoWindows
function closeInfoWindows() {
    for (i=0; i<this.infoWindowArray().length; i++) {
        this.infoWindowArray()[i].close();
    }
}
//apply knockout bindings
ko.applyBindings(viewModel);
// foursquare error message
function foursquareError() {
    alert('Yoops, foursquare data cannot be loaded.');
}
// google map API error message
function googleMapError() {
    alert('Google map can not be loaded');
}

