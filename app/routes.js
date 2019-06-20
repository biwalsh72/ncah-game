const path = require('path');
const cookieParser = require('cookie-parser');
const Cookies = require('js-cookie');

module.exports = function (app, passport) {
    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/menu', isLoggedIn, function (req, res) {
        res.render('menu.ejs', {
            user: req.user
        });
    });

    app.get('/testmenu', isLoggedIn, function (req, res) {
        res.render('testmenu.ejs', {
            user: req.user
        });
    });


    app.get('/room', isLoggedIn, function (req, res) {
        res.render('room.ejs', {
            user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/create', isLoggedIn, function (req, res) {
        let user = req.user;
        Cookies.set('username', user.local.username);
        res.cookie('username', user.local.username);
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    });

     app.get('/room/:id', isLoggedIn, function (req, res) {
        //let user = req.user;
       // Cookies.set('username', user.local.username);
      //  res.cookie('username', user.local.username);
        res.sendFile(path.resolve(__dirname + '/../public/room.html'));
    });

    /*
    app.use('/setuser', isLoggedIn, function (req, res) {
        let user = req.user;
        res.cookie('username', user.local.username);
    });
    */

  //  app.use(cookieParser());
/*
    app.get('/setuser', isLoggedIn, (req, res) => {
        //let user = req.user;
        //console.log(user.local.username);
        //Cookies.set('username', user.local);
       // res.cookie("username", user.local.username);
        //res.send('user data added to cookie');
       // console.log(document.cookie);
    });
    */
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
        successRedirect: '/create', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

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




// route middleware to ensure User is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}