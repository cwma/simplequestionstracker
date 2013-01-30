if (Meteor.isClient) {
	
	Session.set("currentPage", "home");

	Template.entry.events = {};
	
	Template.entry.events = {
		'click #questionSubmit': function() {
			var nameEntry = document.getElementById('name');
			if(nameEntry.value == ""){
				nameEntry.value = "Anonymous";
			}
			var questionEntry = document.getElementById('questionBox');
			if(questionEntry.value != ""){
				var ts = Date.now() / 1000;
				Questions.insert({ name: nameEntry.value, question: questionEntry.value, time: ts, approved: false});
				questionEntry.value = "";
				alert("Your question has been received, please refrain from repeat submissions if your question does not appear");
			}
		}
	}
	
	Template.admin_questions.questions = function () {
		return Questions.find({}, { sort: {time: -1} });
	}

	Template.questions.questions = function () {
		return Questions.find({approved: true}, { sort: {time: -1} });
	}
	
	Template.admin_question.events = {
		'click button.approve': function() {
			console.log("Approving "+this._id);
			Questions.update({_id: this._id}, {$set: {approved: true}});
		},
		'click button.reject': function() {
			console.log("Rejecting "+this._id);
			Questions.update({_id: this._id}, {$set: {approved: false}});
		},
		'click button.delete': function() {
			console.log("Deleting "+this._id); 
			Questions.remove(this._id);
		}
	}

	Template.activeusers.count = function() {
		if(ActiveUsers.find() != undefined) {
			return ActiveUsers.find().fetch().length;
		}
		return 'Well well well...';
	}
	
	Template.menu.isHome = function (){
		if(Session.get("currentPage") == "home"){
			return true;
		} else {
			return false;
		}
	}
	
	Template.menu.isAbout = function (){
		if(Session.get("currentPage") == "about"){
			return true;
		} else {
			return false;
		}
	}
	
	Template.page.isHomePage = function (){
		if(Session.get("currentPage") == "home"){
			return true;
		} else {
			return false;
		}
	}
	
	Template.page.isAboutPage = function (){
		if(Session.get("currentPage") == "about"){
			return true;
		} else {
			return false;
		}
	}
	
	Template.menu.events = {
		'click #homelink': function() {
			Session.set("currentPage", "home");
		},
		'click #aboutlink': function() {
			Session.set("currentPage", "about");
		}
	}
}
