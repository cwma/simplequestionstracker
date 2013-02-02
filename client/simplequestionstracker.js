if (Meteor.isClient) {
    
    var Router = Backbone.Router.extend({
        routes: {
            "": "home",
            "about": "about"
        },
        home: function() {
            Session.set("currentPage", "home");
        },
        about: function() {
            Session.set("currentPage", "about");
        }
    });
    
    var app = new Router;
    
    Session.set("currentPage", "home");
    Session.set("alert", false);

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
				
                if(Session.get("alert") == false) {
                    alertQuestions = [{alert: questionEntry.value}];
                } else {
                    Meteor.clearTimeout(Session.get("alertTimeout"));
                    alertQuestions = Session.get("alert");
                    alertQuestions.push({alert: questionEntry.value});
                }
                Session.set("alert", alertQuestions);
                
                questionEntry.value = "";
                var timeout = Meteor.setTimeout(function() {
                    Session.set("alert", false);
                }, 10000);
                Session.set("alertTimeout", timeout);
             }
        }
    }
	
    Template.alerts.alerts = function () {
        return Session.get("alert");
    }
    
    Template.homePage.hasAlert = function (){
        return Session.get("alert") != false;
    }
    
    Template.alerts.events = {
        'click button.close': function() {
            Meteor.clearTimeout(Session.get("alertTimeout"));
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
            Questions.update({_id: this._id}, {$set: {approved: true}});
        },
        'click button.reject': function() {
            Questions.update({_id: this._id}, {$set: {approved: false}});
        },
        'click button.delete': function() {
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
        return Session.get("currentPage") == "home";
    }
    
    Template.menu.isAbout = function (){
        return Session.get("currentPage") == "about";
    }
    
    Template.page.isHomePage = function (){
        return Session.get("currentPage") == "home";
    }
    
    Template.page.isAboutPage = function (){
        return Session.get("currentPage") == "about";
    }
    
    Template.menu.events = {
        'click #homelink': function(event) {
            event.preventDefault();
            app.navigate("", true);
        },
        'click #aboutlink': function(event) {
            event.preventDefault();
            app.navigate("about", true);
        }
    }
}

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
