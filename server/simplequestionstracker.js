Meteor.startup(function(){
    
    Accounts.config({forbidClientAccountCreation :true})
    Meteor.users.remove({});
    Accounts.createUser({
        username: "admin",
        email: "email@email.com",
        password: "password"
    });
    ActiveUsers.remove({});
    //Questions.remove({});
    
    Questions.allow({
        insert: function(userId, doc) {
            if(doc.approved == true) {
                return(userId);
            } else {
                return true;
            }
        },
        update: function(userId, doc) {
            return(userId);
        },
        remove: function(userId, doc) {
            return(userId);
        }
    });
    
    Questions.deny({
        insert: function(userId, doc) {
            if(doc.approved == true) {
                if(userId) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        update: function(userId, docs, fields, modifier) {
            if(userId){
                return false;
            } else {
                return true;
            }
        },
        remove: function(userId, docs, fields, modifier) {
            if(userId){
                return false;
            } else {
                return true;
            }
        }
    });
    
    //method to count how many users are online by murilopolese
    //source: https://github.com/murilopolese/howmanypeoplearelooking
    Meteor.default_server.stream_server.register( Meteor.bindEnvironment( function(socket) {
        var intervalID = Meteor.setInterval(function() {
            if (socket.meteor_session) {

                var connection = {
                    connectionID: socket.meteor_session.id,
                    connectionAddress: socket.address,
                    userID: socket.meteor_session.userId
                };

                socket.id = socket.meteor_session.id;

                ActiveUsers.insert(connection); 

                Meteor.clearInterval(intervalID);
            }
        }, 1000);

        socket.on('close', Meteor.bindEnvironment(function () {
            ActiveUsers.remove({
                connectionID: socket.id
                });
        }, function(e) {
            Meteor._debug("Exception from connection close callback:", e);
        }));
    }, function(e) {
        Meteor._debug("Exception from connection registration callback:", e);
    }));
})


