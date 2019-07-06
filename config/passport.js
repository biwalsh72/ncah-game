var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/users');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize users for the session
    passport.serializeUser(function (users, done) {
        done(null, users.id);
    });

    // used to deserialize users
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, users) {
            done(err, users);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            usersnameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a users is logged in or not)
        },
        function (req, username, password, done) {
            if (username)
                username = username.toLowerCase(); // Use lower-case usernames to avoid case-sensitive matching

            // asynchronous
            process.nextTick(function () {
                User.findOne({
                    'local.username': username
                }, function (err, users) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!users)
                        return done(null, false, req.flash('loginMessage', 'No users found.'));

                    if (!users.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                    //return user
                    else
                        return done(null, users);
                });
            });

        }));


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            usersnameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a users is logged in or not)
        },
        function (req, username, password, done) {
            if (username)
                username = username.toLowerCase(); // Use lower-case usernames to avoid case-sensitive matching

            // asynchronous
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.users) {
                    User.findOne({
                        'local.username': username
                    }, function (err, users) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that username
                        if (users) {
                            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                        } else {

                            // create the user
                            var newUser = new User();

                            newUser.local.username = username;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });
                    // if the users is logged in but has no account...
                } else if (!req.users.local.username) {
                    User.findOne({
                        'local.username': username
                    }, function (err, users) {
                        if (err)
                            return done(err);

                        if (users) {
                            return done(null, false, req.flash('loginMessage', 'That username is already taken.'));
                        } else {
                            var users = req.users;
                            users.local.username = username;
                            users.local.password = users.generateHash(password);
                            users.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, users);
                            });
                        }
                    });
                } else {
                    // user is logged in and already has an account. Ignore signup.
                    return done(null, req.users);
                }

            });

        }));



};