  function mapsResume(){
    console.log("in mapsResume function");
    /*
    This is the fun part. Here's where we generate the custom Google Map for the website.
    See the documentation below for more details.
    https://developers.google.com/maps/documentation/javascript/reference
    */
    var map;    // declares a global map variable


    /*
    Start here! initializeMap() is called when page is loaded.
    */
    function initializeMap() {

      var locations;
      var locationsObj;

      var mapOptions = {
        disableDefaultUI: true
      };

      // This next line makes `map` a new Google Map JavaScript Object and attaches it to
      // <div id="map">, which is appended as part of an exercise late in the course.
      map = new google.maps.Map(document.querySelector('#map'), mapOptions);
      // make the map undraggable
      console.log("selected #map!");
      map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});


      /*
      locationFinder() returns an array of every location string from the JSONs
      written for bio, education, and work.
      */
      function locationFinder() {

        // initializes an empty array
        var locations = [];
        console.log(resumeData.bio.travel);
        // adds the single location property from bio to the locations array
        //locations.push(bio.contacts.location);
        locations.push(resumeData.bio.travel);
        // iterates through school locations and appends each location to
        // the locations array
        /* for (var school in education.schools) {
          locations.push(education.schools[school].location);
        }

        // iterates through work locations and appends each location to
        // the locations array
        for (var job in work.jobs) {
          locations.push(work.jobs[job].location);
        } */

        return locations;
      }

      function locationFinderObj() {

        // initializes an empty object
        var locations = {};

        // initializes empty arrays
        locations.bio = [];
        locations.schools = [];
        locations.jobs = [];

        // puts my current location into the bio object
        locations.bio[0] = { "location":bio.contacts.location,
                             "name": "Currently Live Here"};

        // iterates through school and added the location plus name of school
        // to the schools object

        for(var i=0;i<education.schools.length;i++){
          locations.schools[i]={"name":education.schools[i].name,
                               "location":education.schools[i].location};
        }

        // iterates through jobs and added the location plus employer's name
        // to the jobs object

        for(var i=0;i<work.jobs.length;i++){
          locations.jobs[i] = {"name":work.jobs[i].employer,
                               "location":work.jobs[i].location};
        }

        return locations;
      }

      /*
      createMapMarker(placeData) reads Google Places search results to create map pins.
      placeData is the object returned from search results containing information
      about a single location.
      */
      function createMapMarker(placeData) {
        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.lat();  // latitude from the place service
        var lng = placeData.geometry.location.lng();  // longitude from the place service
        var name = placeData.formatted_address;   // name of the place from the place service
        var bounds = window.mapBounds;            // current boundaries of the map window
        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
          map: map,
          position: placeData.geometry.location,
          title: name
        });

        // infoWindows are the little helper windows that open when you click
        // or hover over a pin on a map. They usually contain more information
        // about a location.
        var name2 = getName(lat,lng);

        var infoWindow = new google.maps.InfoWindow({
          content: "<h3>" +name2+"</h3></br>" + name
        });

        // hmmmm, I wonder what this is about...
        google.maps.event.addListener(marker, 'click', function() {
          // your code goes here!
          infoWindow.open(map,marker);
        });

        // this is where the pin actually gets added to the map.
        // bounds.extend() takes in a map location object
        bounds.extend(new google.maps.LatLng(lat, lng));
        // fit the map to the new marker
        map.fitBounds(bounds);
        // center the map
        map.setCenter(bounds.getCenter());
      }
      function getName (lat, lng){

        for (var objects in locationsObj) {
            for (var place in locationsObj[objects]) {
                  if(locationsObj[objects][place].lat==lat && locationsObj[objects][place].lng==lng){
                    return locationsObj[objects][place].name;
                  }
              }
        }

      }
      /*
      callback(results, status) makes sure the search returned results for a location.
      If so, it creates a new map marker for that location.
      */
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

          for (var objects in locationsObj) {
              for (var place in locationsObj[objects]) {
                console.log(locationsObj[objects][place].location.replace(/\+/g, " ") + " " + results[0].formatted_address);

                    if(locationsObj[objects][place].location.replace(/\+/g, " ")==results[0].formatted_address){
                       locationsObj[objects][place].lat = results[0].geometry.location.lat();
                       locationsObj[objects][place].lng = results[0].geometry.location.lng();
                    }
                }
          }
          console.log(locationsObj);
          createMapMarker(results[0]);
        }
      }

      /*
      pinPoster(locations) takes in the array of locations created by locationFinder()
      and fires off Google place searches for each location
      */
      function pinPoster(locations) {

        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
        var service = new google.maps.places.PlacesService(map);

        // Iterates through the array of locations, creates a search object for each location
        for (var place in locations) {

          // the search request object
          var request = {
            query: locations[place]
          };

          // Actually searches the Google Maps API for location data and runs the callback
          // function with the search results after each search.
          service.textSearch(request, callback);
        }
      }

      function pinPosterObj(locations) {

        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
        var service = new google.maps.places.PlacesService(map);

        // Iterates through the array of locations, creates a search object for each location
        for (objects in locations) {
            for (place in locations[objects]) {
              // the search request object
              var request = {
                query: locations[objects][place].location
              };
              // Actually searches the Google Maps API for location data and runs the callback
              // function with the search results after each search.
              service.textSearch(request, callback);

            }
        }
      }


      // Sets the boundaries of the map based on pin locations
      window.mapBounds = new google.maps.LatLngBounds();

      // locations is an array of location strings returned from locationFinder()
      locations = locationFinder();
      locationsObj = locationFinderObj();
      pinPosterObj(locationsObj);

      // pinPoster(locations) creates pins on the map for each location in
      // the locations array
    //  pinPoster(locations);

    }

    /*
    Uncomment the code below when you're ready to implement a Google Map!
    */

    // Calls the initializeMap() function when the page loads
    // window.addEventListener('load', initializeMap);
    initializeMap();
    // Vanilla JS way to listen for resizing of the window
    // and adjust map bounds
    window.addEventListener('resize', function(e) {
      // Make sure the map bounds get updated on page resize
      map.fitBounds(mapBounds);
    });
  };