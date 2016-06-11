  function mapsResume(resumeData){
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
      map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});


      /*
      locationFinder() returns an array of every location string from the JSONs
      written for bio, education, and work.
      */
      function locationFinder() {

        // initializes an empty array
        var locations = [];
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
        locations.bio[0] = { "location":resumeData.bio.contacts.location.data,
                             "name": "Currently Live Here"};
        //console.log(resumeData.bio.contacts.location);
        // iterates through school and added the location plus name of school
        // to the schools object

        for(var i=0;i<resumeData.bio.travel.length;i++){
          locations.bio[i+1]={"name": resumeData.bio.travel[i],
                               "location": resumeData.bio.travel[i] };
        }

        for(i=0;i<resumeData.edu.length;i++){
          locations.schools[i]={"name":resumeData.edu[i].name,
                               "location":resumeData.edu[i].location};
        }

        // iterates through jobs and added the location plus employer's name
        // to the jobs object

        for(i=0;i<resumeData.work.length;i++){
          locations.jobs[i] = {"name":resumeData.work[i].employer,
                               "location":resumeData.work[i].location};
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
                    if(locationsObj[objects][place].location.replace(/\+/g, " ")==results[0].formatted_address){
                       locationsObj[objects][place].lat = results[0].geometry.location.lat();
                       locationsObj[objects][place].lng = results[0].geometry.location.lng();
                    }
                }
          }
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
        for (var objects in locations) {
            for (var place in locations[objects]) {
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
  }
// Skill Section HTML
var HTMLskillsStart = '<ul class="list-inline">%data%</ul>';
var HTMLskills = "<li><span class=\"btn btn-info btn-xs\">%data%</span></li>";

// Work Section HTML
var HTMLworkStart = '<div class="work-entry"></div>';
var HTMLworkEmployer = '<a href="%data2%">%data%</a>';
var HTMLworkTitle = '<p>%data%</p>';
var HTMLworkDates = '<div class="date-text pull-right">%data%</div>';
var HTMLworkLocation = '<div class="location-text pull-left">%data%</div><br>';
var HTMLworkDescription = '<p class="pspace">%data%</p>';
var HTMLworkBpul = "<ul>%data%</ul>";
var HTMLworkBpli = "<li>%data%</li>";

// Project Section HTML
var HTMLprojectStart = '<div id="%data%" class="col-sm-6 col-md-4 project-entry"></div>';
var HTMLprojectTitle = '<a href="%data2%">%data%</a>';
var HTMLprojectDate = '<p>%data%</p>';
var HTMLprojectDescription = '<p>%data%</p>';
var HTMLprojectImage = '<img data-toggle="modal" data-target="%data2%" src="%data%" alt="%data3%">';

// Education Section HTML
var HTMLschoolStart = '<div class="education-entry"></div>';
var HTMLschoolName = '<a href="%data2%" style="display: block;">%data%';
var HTMLschoolDegree = ' - %data%</a>';
var HTMLschoolDates = '<p class="pull-right">%data%</p>';
var HTMLschoolLocation = '<p class="">%data%</p>';
var HTMLschoolMaj = '<p>Major: %data%</p>';
var HTMLschoolMin = '<p>Minor: %data%</p>';
var HTMLschoolhighlight = '<p>Hightlights: <ul>%data%</ul></p>';
var HTMLschoolhighlightBp = '<li>%data%</li>';

// Activities Section HTML
var HTMLactivitiesStart = '<div class="activities-entry"></div>';
var HTMLactivitiesTitle = '<p class="pull-left"><a href ="%data3%">%data%</a> - <i>%data2%</i></p>';
var HTMLactivitiesDates = '<p class="pull-right">%data%</p>';

// Jumbotron section HTML
var HTMLJtron = '<div class="jumbotron" role="img" aria-label="a crowd cheering for Reyes"><div class="container"><div class="btn-group"></div></div></div>';
var HTMLJtronImg = "<img class=\"profile-img\" src=\"data:image/png;base64,%data%\">";
var HTMLJtronH1 = '<h1 id=\"msg\">%data%</h1>';
var HTMLJtronP = "<p>%data%</p>";
var HTMLJtronBtn = "<a class=\"btn btn-info btn-lg\" href=\"%data2%\" target=\"_blank\" role=\"button\"><i class=\"fa %data%\"></i></a>";

//Other HTML
var HTMLloadingModal = '<div class="modal fade bs-example-modal-sm" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog modal-sm" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="myModalLabel">Wait while I write my resume</h4></div><div class="modal-body text-center"><div class="spinner-loader">Loading…</div></div></div></div></div>';

var Engine = (function (global){

	var haveSkill, haveWork, haveProj, haveEdu, haveConf = false;

	//Firebase 3.0 reference
	var fbRef = firebase.database().ref("r1");

	// The resume object from firebase is stored in this variable
	var resumeObj;
	var intervalID;

	var octopus = {
		getSectionData: function(section){
			return resumeObj[section];
		},

		getSections: function(){
			var section_names = [];
			for (var i in resumeObj){
				section_names.push(i);
			}
			return section_names;
		},

		getResumeData: function(){
			//Call back function to get resume data from firebase, after it's done it kicks off
			//the rendering of the resume, this callback is ran everytime the data changes
			fbRef.on("value", function(snapshot){
				resumeObj = snapshot.val();
				view.renderStart();
			});
		}

	};

	var view = {

		init: function(){
			view.startLoading();
			//Get resume object from firebase
			octopus.getResumeData();
		},

		startLoading: function(){
			$("#modals").append(HTMLloadingModal);
			$('#myModal').modal('show');
		},

		endLoading: function(){
			$('#myModal').modal('hide');
		},

		eraseResume: function(){
			// Erasing Jumbotron
			var divBtnG = $('.jumbotron .container .btn-group').empty().detach();
			$('.jumbotron .container').empty();
			$('.jumbotron .container').append(divBtnG);
			// Erasing main
			$('#main').empty();
		},

		renderStart: function(){

			view.eraseResume();
			view.renderJtron();
			view.endLoading();
			view.sectionOrder();
			view.renderSections();
			view.renderMap();
			view.startJtronMsg();

		},

		renderSections: function(){

			if(haveSkill){
				view.renderSkill(); 
			}
			if(haveWork){ 
				view.renderWork();  
			}
			if(haveEdu){ 
				view.renderEdu();   
			}
			if(haveProj){
				view.renderProj();
			}
			if(haveConf){
				view.renderConf();
			}

		},

		secTemplate: function(name, idx, iconx, hsize){

		    var div = document.createElement('div');
			div.id = idx;
			div.className = "row well";

			var iTag = document.createElement('i');
			iTag.className = "fa " + iconx + " section-icons";
			div.appendChild(iTag);

			var hTag = document.createElement('h'+hsize);
			hTag.className = "section-header";
			hTag.innerHTML = name;

			if(idx == "skill"){
				// need for the bootstrap badge in skill's section
				var cSpan = document.createElement('span');
				cSpan.id = "count";
				cSpan.className = "badge";
				hTag.appendChild(cSpan);
			}

			div.appendChild(hTag);

			return div;

		},

		hasSection: function(sec){

			var sections = octopus.getSections();

			for (var i in sections){
				if ( sections[i] == sec){
					return true;
				}
			}
			return false;
		},

		sectionOrder: function(){

			if ( view.hasSection("skill") ){
		    	haveSkill = true;
				$("#main").append( view.secTemplate("Skills ", "skill", "fa-wrench", 3) );	
			}

			if ( view.hasSection("project") ){
		    	haveProj = true;
				$("#main").append( view.secTemplate("Projects", "proj", "fa-file-code-o", 2) );
			}

			if ( view.hasSection("edu") ){
		    	haveEdu = true;
				$("#main").append( view.secTemplate("Education", "edu", "fa-book", 2) );	
			}

			if ( view.hasSection("work") ){
		    	haveWork = true;
				$("#main").append( view.secTemplate("Work Experience", "work", "fa-briefcase", 2) );
			}

			if ( view.hasSection("conf") ){
				haveConf = true;
				$("#main").append( view.secTemplate("Activities", "conf", "fa-users", 2) );
			}	

		},

		renderSkill: function(){
			var skillObj = octopus.getSectionData("skill");
			var formattedHTMLskill = "";

			for(var i in skillObj){
				formattedHTMLskill = formattedHTMLskill + HTMLskills.replace("%data%", skillObj[i]);
			}
			formattedSkillStart = HTMLskillsStart.replace("%data%", formattedHTMLskill);

			$("#count").append(skillObj.length);
			$("#skill").append(formattedSkillStart);
		},

		renderWork: function(){
			var workObj = octopus.getSectionData("work");
			for(var i in workObj){
				var formattedWorkBpli = "";
				$("#work").append(HTMLworkStart);
				formattedEmployer = HTMLworkEmployer.replace("%data%", workObj[i].employer);
				formattedEmployer = formattedEmployer.replace("%data2%", workObj[i].employer_url);
				formattedTitle = HTMLworkTitle.replace("%data%", workObj[i].title);
				formattedDate = HTMLworkDates.replace("%data%", workObj[i].date);
  			    formattedLocation = HTMLworkLocation.replace("%data%", workObj[i].location);
  			    formattedDes = HTMLworkDescription.replace("%data%", workObj[i].description);

  			    //loop for bullet points
  			    for(var j in workObj[i].bp){
  			    	 formattedWorkBpli =  formattedWorkBpli + HTMLworkBpli.replace("%data%", workObj[i].bp[j]);
  			    }  			    
  			    formattedWorkBP = HTMLworkBpul.replace("%data%", formattedWorkBpli);

  			    formatedWorkEntry = formattedEmployer + formattedTitle + formattedDate + formattedLocation + formattedDes + formattedWorkBP;
				$(".work-entry:last").append(formatedWorkEntry);
			}
		},

		renderEdu: function(){
			var eduObj = octopus.getSectionData("edu");
			var formattedEduEntry = "";
			var formattedHlBp = "";
			for(var i in eduObj){
				$("#edu").append(HTMLschoolStart);
				formattedEduName =  HTMLschoolName.replace("%data%", eduObj[i].name);
				formattedEduName = 	formattedEduName.replace("%data2%", eduObj[i].url);
				formattedEduDegree = HTMLschoolDegree.replace("%data%", eduObj[i].degree);
				formattedEduDate = HTMLschoolDates.replace("%data%", eduObj[i].date);
				formattedEduLoc = HTMLschoolLocation.replace("%data%", eduObj[i].location);
				formattedEduMaj = HTMLschoolMaj.replace("%data%", eduObj[i].major);
				formattedEduMin = HTMLschoolMin.replace("%data%", eduObj[i].minor);

				//clear this variable after even loop
				formattedHlBp = "";
				for (var j in eduObj[i].bp){
					formattedHlBp = formattedHlBp + HTMLschoolhighlightBp.replace("%data%", eduObj[i].bp[j]);
				}
				formattedHlUL = HTMLschoolhighlight.replace("%data%", formattedHlBp);

				formattedEduEntry = formattedEduName + formattedEduDegree + formattedEduLoc + formattedEduDate + formattedEduMaj + formattedEduMin + formattedHlUL;
				$(".education-entry:last").append(formattedEduEntry);
			}
		},

		renderProj: function(){
			var projObj = octopus.getSectionData("project");
			var formattedProjectStart = "";
			for(var i in projObj){
				formattedProjectStart = HTMLprojectStart.replace("%data%", projObj[i].id);
				$("#proj").append(formattedProjectStart);
				formattedProjectTitle = HTMLprojectTitle.replace("%data%", projObj[i].title);
				formattedProjectTitle = formattedProjectTitle.replace("%data2%", projObj[i].url);
				formattedProjectDate = HTMLprojectDate.replace("%data%", projObj[i].date);
				formattedProjectDes = HTMLprojectDescription.replace("%data%", projObj[i].description);
				formattedProjImg = HTMLprojectImage.replace("%data%", projObj[i].image);
				formattedProjEntry = formattedProjectTitle + formattedProjectDate + formattedProjImg + formattedProjectDes;
				$(".project-entry:last").append(formattedProjEntry);
			}
		},

		renderConf: function(){
			var confObj = octopus.getSectionData("conf");
			for(var i in confObj){
				$("#conf").append(HTMLactivitiesStart);
				formattedActTitle = HTMLactivitiesTitle.replace("%data%", confObj[i].title);
				formattedActTitle = formattedActTitle.replace("%data2%", confObj[i].level);
				formattedActTitle = formattedActTitle.replace("%data3%", confObj[i].url);
				formattedActDate = HTMLactivitiesDates.replace("%data%", confObj[i].date);
				formattedActEntry = formattedActTitle + formattedActDate;
				$(".activities-entry:last").append(formattedActEntry);
			}
		},
		renderMap: function(){
			
			$("#main").append( view.secTemplate("Where I've Lived, Worked, Studied & Traveled", "mapDiv", "fa-map-marker", 2) );
			$("#mapDiv").append('<div id="map"></div>');
			 google.maps.event.addDomListener(window, 'load', mapsResume(resumeObj));

		},
		renderJtron: function(){
			var bioObj = octopus.getSectionData("bio");

			formattedJtronP = HTMLJtronP.replace("%data%", resumeObj.bio.subMsg[0]);
			$(".jumbotron").children(".container").prepend(formattedJtronP);

			formattedJtronH1 = HTMLJtronH1.replace("%data%", resumeObj.bio.msg[0]);
			$(".jumbotron").children(".container").prepend(formattedJtronH1);

			formattedJtron = HTMLJtronImg.replace("%data%", resumeObj.bio.pic);
			$(".jumbotron").children(".container").prepend(formattedJtron);

			for (var i in bioObj.contacts){
				formattedJtronBtn = HTMLJtronBtn.replace("%data%", bioObj.contacts[i].icon);
				formattedJtronBtn = formattedJtronBtn.replace("%data2%", bioObj.contacts[i].data);
				$(".jumbotron").children(".container").children(".btn-group").append(formattedJtronBtn);
			}
		},
		startJtronMsg: function(){
			
			var bioObj = octopus.getSectionData("bio");
			clearInterval(intervalID);
			
			intervalID  = setInterval(function(){
				var msg;
				var x = Math.floor(Math.random()*(bioObj.msg.length));
				msg = $("#msg");
				msg.text(bioObj.msg[x]);
			}, 5000);
			
		}

	};

	view.init();

})(this);

 