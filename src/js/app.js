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

 