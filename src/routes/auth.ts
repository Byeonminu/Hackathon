import * as express from "express"
import {db} from '../../db/db';

export const authRouter = express.Router();

authRouter.get('/loginpage', (req:express.Request, res:express.Response, next:express.NextFunction) =>{

        // db.query('insert into test (id) values (300)', (err2, result2)=>{
        //     res.send('router success');
        // })
       res.render('loginpage')
    
});

authRouter.get('/registerpage', (req: express.Request, res: express.Response, next: express.NextFunction) => {


        res.render('registerpage')

});

authRouter.post('/register', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        

        db.query('insert into user (email, password, nickname) values(?, ?, ?)', [req.body.email, req.body.new_pw1, req.body.nickname], (err, result) =>{
                if(err) next(err);
                console.log('wjdqh', req.body.email, req.body.new_pw1, req.body.nickname );
                return res.redirect('/');
        })

});

authRouter.post('/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {


        db.query('select * from user where email = ? and password = ? ', [req.body.email, req.body.user_pw], (err, result) => {
                console.log('로그인', req.body.email, req.body.new_pw1);
                if (err) next(err);
                if(result.length !=0){
                        console.log('result : ', result);
                        return res.redirect('/');
                }
                else{
                        return res.redirect('/');
                }

        })

});
