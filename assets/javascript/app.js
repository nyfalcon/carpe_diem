$(document).ready(function(){
  // Golobal Varibale
  var eventsArray= [];
  var markers;  
  
  // set up current time

    function timer() {
        var datetime = null,
        date = null;

        var update = function () {
        date = moment(new Date())
        datetime.html("<i class='far fa-clock'></i> " + date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
        };

        $(document).ready(function(){
        datetime = $('#current-time')
        update();
        setInterval(update, 1000);
        });
    }
    timer();

    $("#searchBtn").on("click", function(event){
        
        event.preventDefault();

        var addressOne = $("#inputAddress").val().trim();
        var addressTwo = $("#inputAddress2").val().trim();
        var inputCity = $("#inputCity").val().trim();
        var inputState = $("#inputState").val().trim();
        var inputZip = $("#inputZip").val().trim();
        var category = $("#inputCategories").val().trim();
        var radius = $("#inputRadius").val().trim();
        var priceRange = $("#priceRange").val().trim();

    
    })

    function searchEventsNearMe(address) {
      eventsArray = [];
      $("#search-view").empty();
      $("#detail-view").empty();
      // Querying the EventBrite api for the selected address
      var queryURL = "https://www.eventbriteapi.com/v3/events/search/?sort_by=best&location.address=" + address + "&location.within=1mi&token=CM3FPDQCMD3DZSJA47PF&expand=venue";
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {

        // Printing the entire object to console
        console.log(response);
          for (var i = 0; i <= 5; i++) {
            var eventNearMe = {
              eventName: response.events[i].name.text,
              eventURL: response.events[i].url,
              eventImage: response.events[i].logo.url,
              eventLat: response.events[i].venue.latitude,
              eventLon: response.events[i].venue.longitude,
              eventVenueName: response.events[i].venue.name,
              eventAddress1: response.events[i].venue.address.address_1,
              eventAddress2: response.events[i].venue.address.address_2,
              eventAddressCity: response.events[i].venue.address.city,
              eventAddressState: response.events[i].venue.address.region,
              eventAddressZipcode: response.events[i].venue.address.postal_code,
              eventTime: response.events[i].start.local,
              eventCost: response.events[i].is_free
            }
          eventsArray.push(eventNearMe)
          $("#search-view").append($("<p>").html(i+1 + ".   " + eventNearMe.eventName).attr("index",i).attr("class","events"));
        }
      });
    }

    $(document).on("click",".events", function(){
      console.log("hi");
      var index= $(this).attr("index");
      var fullAddress = eventsArray[index].eventAddress1 + " " +eventsArray[index].eventAddress2 + " " + eventsArray[index].eventAddressCity + ", "+ eventsArray[index].eventAddressState + ", " +eventsArray[index].eventAddressZipcode;
      console.log(index);
      var time = eventsArray[index].eventTime;
      time = moment(time).format('MMMM Do YYYY, h:mm a')
      $("#detail-view").empty();
      $("#detail-view").append($("<h1>").html(eventsArray[index].eventName).addClass("eventTitle"));
      $("#detail-view").append($("<img>").attr("src",eventsArray[index].eventImage).addClass("eventImage"));
      $("#detail-view").append($("<div>").wrap('<a href="'+ eventsArray[index].eventURL + '"></a>').addClass("eventURL"));
      $("#detail-view").append($("<div>").html("<p> <strong>Address : </strong></p>" + fullAddress).addClass("eventAddress"));
      $("#detail-view").append($("<div>").html("<p> <strong>Date & Time : </strong></p>" + time).addClass("eventTime"));
      $("#detail-view").append($("<div>").addClass("text-center").html("<button type='button' id='eventBtn' class='btn btn-success btn-lg'>More Detail</button>"));
      $("#eventBtn").on("click", function() {
        document.location = eventsArray[index].eventURL;
      });
      var location= {lat: parseFloat(eventsArray[index].eventLat), lng: parseFloat(eventsArray[index].eventLon)};
      console.log(location);
      if(markers==null){
            markers= new google.maps.Marker({
                map: map,
                title: "none",
                position: location
              });
      }
      else{
          markers.setMap(null);
          markers= null;
          markers= new google.maps.Marker({
              map: map,
              title: "none",
              position: location
            });
      }
    })
  
    // Event handler for user clicking the get-address button
    $("#search-btn").on("click", function(event) {
      // Preventing the button from trying to submit the form
      event.preventDefault();
      // Storing the address
      var inputAddress = $("#inputAddress").val().trim();
      var inputAddressTwo = $("#inputAddress2").val().trim();
      var inputCity = $("#inputAddress2").val().trim();
      var inputState = $("#inputAddress2").val().trim();
      var combinedAddress = inputAddress+ "" + inputAddressTwo + "" + inputCity + "" + inputState + "" + inputZip;
  
      console.log(combinedAddress);
      // Running the searchEventsNearMe function(passing in the address as an argument)
      searchEventsNearMe(combinedAddress);
    });

// NEW SEARCH BOX MAP FUNCTION BY MATTHEW A

var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);

// Relate traffic layer variable to an option button
var trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(map);

// Relate transit layer variable to an option button 
var transitLayer = new google.maps.TransitLayer();
transitLayer.setMap(map);

// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function() {
  searchBox.setBounds(map.getBounds());
});

var markers = [];
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function() {
  var places = searchBox.getPlaces();
  var image = 'http://maps.google.com/mapfiles/kml/shapes/man.png';
    
  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  markers.forEach(function(marker) {
   
    marker.setMap(map);
    position: center;
    
  });
  markers = [];


  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
      
      

    };

    // Create a custome marker for user start location .
    markers.push(new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      map: map,
      icon: image,
      label:"YOU",
      label: {
                text: "YOU",
                color: "#eb3a44",
                fontSize: "30px",
                fontWeight: "bold"
               
            },
            labelInBackground: true,
      title: "place.name",
      position: place.geometry.location
     
     
      
   
     
    }));

    if (place.geometry.viewport) { 
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
   
    }
  });
  map.fitBounds(bounds);
});

//END MATTHEW A CODE

});