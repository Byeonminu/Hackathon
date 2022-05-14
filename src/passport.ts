import passport from 'passport';
import passportLocal from 'passport-local';
import {db} from '../db/db';
import bcrypt  from 'bcrypt';
const LocalStrategy = passportLocal.Strategy;


module.exports = function (app){
    app.use(passport.initialize());
    app.use(passport.session());

        // Local Strategy
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'user_pw'
        },
            (email, pwd, done) => {
                db.query('select * from user where email =?', [email], (err, result) =>{
                    if(err) done(err);
                    if(result.length == 0){
                        console.log('아이디 틀림')
                        return done(null, false, { message: 'Incorrect email' })
                    }
                    else{
                        bcrypt.compare(pwd, result[0].password, (err1, result1) => {
                            if(result1){
                                console.log('성공', result[0])
                                return done(null, result[0], { message: 'Login Success' });
                            }
                            else{
                                console.log('비번 틀림')
                                return done(null, false, { message: 'Incorrect password' })
                            }
                        })
                        
                    }

                })
            }))
        
        passport.serializeUser<any, any>((user, done) => {
            done(null, user.email);
        });

    passport.deserializeUser(function (email, done) {
        done(null, email);
    });


}

export default passport;

    // public isAuthenticated = (req, res, next) => {
    //     if (req.isAuthenticated()) {
    //         return next();
    //     }
    //     res.redirect("/");
    // };






