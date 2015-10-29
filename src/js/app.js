var Engine = (function (global){

	var octopus = {
		getSectionData: function(section){
			return resumeData[section];
		},

		getSections: function(){
			var section_names = [];
			for (i in resumeData){
				section_names.push(i);
			}
			return section_names;
		}

	};

	var haveSkill, haveWork, haveProj, haveEdu, haveConf = false;

	var view = {


		init: function(){
			view.sectionOrder();
			view.renderSections();
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
			console.log(eduObj);
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
				formattedProjEntry = formattedProjectTitle + formattedProjectDate + formattedProjectDes;
				$(".project-entry:last").append(formattedProjEntry);
			}
		}

	};

	view.init();

})(this);
