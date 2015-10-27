var Engine = (function (global){

	var octopus = {
		getSection: function(section){
			return resumeData[section];
		}

	};

	var view = {

		init: function(){
			view.renderWork();
			view.renderEdu();
			view.renderSkill();
		},

		renderSkill: function(){
			var bioObj = octopus.getSection("bio");
			var formattedHTMLskill = "";

			for(i in bioObj["skills"]){
				formattedHTMLskill = formattedHTMLskill + HTMLskills.replace("%data%", bioObj["skills"][i]);
			}
			formattedSkillStart = HTMLskillsStart.replace("%data%", formattedHTMLskill);
			$("#skills").append(formattedSkillStart);
		},

		renderWork: function(){
			var workObj = octopus.getSection("jobs");
			for(i in workObj){
				var formattedWorkBpli = "";
				$("#workExperience").append(HTMLworkStart);
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
			var eduObj = octopus.getSection("education");
			console.log(eduObj);
		}

	};

	view.init();

})(this);
