
$(function(){

    var model = [
    {title:'Staples Center', location:{lat:34.043006, lng:-118.26736}},
    {title:'University of Southern California', location:{lat:34.022352, lng:-118.285117}},
    {title:'China Town', location:{lat:34.062334, lng:-118.238331}},
    {title:'Pershing Square', location:{lat:34.048569, lng:-118.252892}},
    {title:'Union Station', location:{lat:34.056219, lng:-118.236502}},
    {title:'Grand Park LA', location:{lat:34.056329, lng:-118.246771}},
    {title:'Dodger Stadium', location:{lat:34.073851, lng:-118.239958}},
    {title:'Little Tokyo', location:{lat:34.052339, lng:-118.239505}},
    {title:'The Broad', location:{lat:34.054469, lng:-118.250558}},
    {title:'Los Angeles City Hall', location:{lat:34.053527, lng:-118.242932}}
    ];

    var viewModel = {
        query: ko.observable('')
    };

    viewModel.model = ko.dependentObservable(function(){
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(model, function(item){
            return item.title.toLowerCase().indexOf(search) >= 0;
        });
    }, viewModel);

    ko.applyBindings(viewModel);

    var map;
    // var markers = [];
    function initMap(){
        //constructor of creating a map
        map = new google.maps.Map(document.getElementById('map'),{
            center: {lat:34.056329,lng:-118.246771},
            zoom: 10
        });
    }
    // this is the function that make a map appear

    // Create infowindow and bounds variable for later use
    // var LargeInfoWindow = new google.maps.InfoWindow();
    // var bounds = new google.maps.LatLngBounds();

    // // Loop over the model to create markers
    // for (var i = 0; i < model.length; i++){
    //     var position = model[i].location;
    //     var title = model[i].title;
    //     // Create a marker for each location
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: position,
    //         title:title,
    //         animation: google.maps.Animation.DROP,
    //         id: i
    //     });

    //     // console.log(title);


    //     var listItems = title;
    //     document.getElementById('list').innerHTML += listItems + '<br>';


    //     // listItems += title + '<br>';

    //     //push markers to the markers array
    //     markers.push(marker);
    //     // Create a onclick event to open an infowindow
    //     marker.addListener('click',function(){
    //         populateInfoWindow(this, LargeInfoWindow);
    //     });

    //     bounds.extend(markers[i].position);
    // }
    // // Extend the boundaries of the map for each map
    // map.fitBounds(bounds);
    // };
    // This function makes the infowindow filled with info

    // function populateInfoWindow (marker, infowindow){
    //     // Check to make sure the window is not open
    //     if(infowindow.marker != marker){
    //         infowindow.marker = marker;
    //         infowindow.setContent('<div>' + marker.title + '</div>');
    //         infowindow.open(map, marker);
    //         // Make sure the marker property is cleared if the infowindow is closed.
    //         infowindow.addListener('closeclick', function(){
    //             infowindow.setMarker = null;
    //         });
    //     };
    // };



});








