var Engine = (function (global){

	var haveSkill, haveWork, haveProj, haveEdu, haveConf = false;

	var fbURL = "https://blistering-torch-1167.firebaseio.com";
	var fbResume = "r1";
	var myFb;
	var resumeObj;

	var octopus = {
		getSectionData: function(section){
			return resumeData[section];
		},

		getSections: function(){
			var section_names = [];
			for (i in resumeObj){
				section_names.push(i);
			}
			return section_names;
		},

		getResumeData: function(){
			myFb = new Firebase(fbURL);
			//Call back function to get resume data from firebase, after it's done it kicks off
			//the rendering of the resume
			$(".progress-bar").width("90%");
			myFb.child(fbResume).on("value", function(snapshot){
				$(".progress-bar").width("95%");
				resumeObj = snapshot.val();  
				view.renderStart();
			
			});

		}

	};

	var view = {


		init: function(){
			//myApp.showPleaseWait();
			//$("#myp1").modal('show');
			$('#myModal').modal('show');
			//$('#myModal').modal('toggle');

			octopus.getResumeData();

		},

		renderStart: function(){

			view.sectionOrder();
			//view.renderSkillFb();
			view.renderSections();
			$('#myModal').modal('hide');
			view.renderMap();
			formattedPic = profileImg.replace("%data%", resumeObj.bio.pic);
			$("#main").append(formattedPic);
			$(".progress-bar").width("100%");


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
				console.log("this is a skill");
				var cSpan = document.createElement('span');
				cSpan.id = "count";
				cSpan.className = "badge";
				hTag.appendChild(cSpan);
			}

			div.appendChild(hTag);

			return div;

		},

		sectionOrder: function(){

			var sections = octopus.getSections();

			for (i in sections){

				switch (sections[i]) {
				    case "skill":
				    	haveSkill = true;
						$("#main").append( view.secTemplate("Skills ", "skill", "fa-wrench", 3) );
				        break;

				    case "project":
				    	haveProj = true;
						$("#main").append( view.secTemplate("Projects", "proj", "fa-file-code-o", 2) );
				        break;

				    case "work":
				    	haveWork = true;
						$("#main").append( view.secTemplate("Work Experience", "work", "fa-briefcase", 2) );
				        break;

				    case "edu":
				    	haveEdu = true;
						$("#main").append( view.secTemplate("Education", "edu", "fa-book", 2) );
						break;

				    case "conf":
				    	haveConf = true;
						$("#main").append( view.secTemplate("Activities", "conf", "fa-users", 2) );
				        break;		        
				}

			}

		},

		renderSkill: function(){
			var skillObj = octopus.getSectionData("skill");
			var formattedHTMLskill = "";

			for(i in skillObj){
				formattedHTMLskill = formattedHTMLskill + HTMLskills.replace("%data%", skillObj[i]);
			}
			formattedSkillStart = HTMLskillsStart.replace("%data%", formattedHTMLskill);

			$("#count").append(skillObj.length);
			$("#skill").append(formattedSkillStart);
		},

		renderWork: function(){
			var workObj = octopus.getSectionData("work");
			for(i in workObj){
				var formattedWorkBpli = "";
				$("#work").append(HTMLworkStart);
				formattedEmployer = HTMLworkEmployer.replace("%data%", workObj[i].employer);
				formattedEmployer = formattedEmployer.replace("%data2%", workObj[i].employer_url);
				formattedTitle = HTMLworkTitle.replace("%data%", workObj[i].title);
				formattedDate = HTMLworkDates.replace("%data%", workObj[i].date);
  			    formattedLocation = HTMLworkLocation.replace("%data%", workObj[i].location);
  			    formattedDes = HTMLworkDescription.replace("%data%", workObj[i].description);

  			    //loop for bullet points
  			    for(j in workObj[i].bp){
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
			for(i in eduObj){
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
				for (j in eduObj[i].bp){
					console.log(i+" "+eduObj[i].bp[j]);
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
			for(i in projObj){
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
			for(i in confObj){
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
		renderSkillFb: function(){

			myFb.child("r1").on("value", function(snapshot) {
				//var skillObj = snapshot.val(); 
				var resumeObj = snapshot.val();  				
 				console.log(resumeObj);
	 
			});

		}

	};

	var myApp;
	myApp = myApp || (function () {
	    var pleaseWaitDiv = $('<div class="modal fade" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-header"><h1>Processing...</h1></div><div class="modal-body"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div></div>');
	    return {
	        showPleaseWait: function() {
	            pleaseWaitDiv.modal();
	        },
	        hidePleaseWait: function () {
	            pleaseWaitDiv.modal('hide');
	        },

	    };
	})();
	//myApp.showPleaseWait();
	view.init();

})(this);

 