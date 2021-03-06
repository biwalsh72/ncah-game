const path = require('path');
const Cookies = require('js-cookie');
const Rooms = require('../server.js');

module.exports = function (app, passport) {
    // normal routes ===============================================================

    // show the home page (will also have login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION (not currently being used) =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    // ADMIN MENU ============================================
    app.get('/menu', isLoggedIn, function (req, res) {
        res.render('menu.ejs', {
            user: req.user,
            rooms: Rooms.rooms
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // CREATE GAME PAGE ========================
    app.get('/create', isLoggedIn, function (req, res) {
        let user = req.user;
        Cookies.set('username', user.local.username);
        res.cookie('username', user.local.username);
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    });

    //website address for each instance of the game should have address /room/(roomName)
     app.get('/room/:id', isLoggedIn, function (req, res) {
        res.sendFile(path.resolve(__dirname + '/../public/room.html'));
    });
    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        failureRedirect: '/login' }), (req, res) => {
        if (req.user.local.role === 'admin') {
            res.redirect('/menu');
        }
        if (req.user.local.role === 'user') {
            res.redirect('/create');
        }
    });

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/create', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/create', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove username and password
    // User account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.username = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });


};


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}