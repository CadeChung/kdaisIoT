const passport = require("passport");
const passportLocal = require("passport-local");
const loginService = require("../services/loginService");

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                await loginService.findUserByEmail(email).then(async (user) => {
                    if (!user) {
                        return done(null, false, req.flash("errors", `這個Email "${email}" 不存在，請重新嘗試`));
                    }
                    if (user) {
                        let match = await loginService.comparePassword(password, user);
                        if (match === true) {
                            return done(null, user,  null);
                        } else {
                            return done(null, false, req.flash("errors", match));
                        }
                    }
                });   
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err});
            }
        }));
};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    loginService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(err => {
        return done(err, null)
    });
});

module.exports = initPassportLocal;