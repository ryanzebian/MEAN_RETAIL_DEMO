function setupAuth(User, app) {
    var passport = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;

    //High Level Serialize and Deserialize configuaration for passport
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.
            findOne({ _id: id },function(err,user){
                done(user);
            })
            
    });
    //Facebook Specific
    passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
             profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function (acessToken, refreshToken, profile, done) {
            if (!profile.emails || !profile.emails.length) {
                return done('No emails associated with this account!');
            }
            User.findOneAndUpdate(
                { 'data.oauth': profile.id },
                {
                    $set: {
                        'profile.username': profile.emails[0].value,
                        'profile.picture': 'http://graph.facebook.com/' + profile.id.toString() + '/picture?type=large'
                    }
                }, { 'new': true, upsert: true, runValidators: true },
                function (error, user) {
                    done(error, user);
                });
        }
    ));

    //Express middlewares
    app.use(require('express-session')({
        secret: 'this is a secret',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    //Express routes for auth
    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: ['email'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/fail' }),
        function (req, res) {
            res.send('Welcome, ' + req.user.profile.username);
        });
}
module.exports = setupAuth;