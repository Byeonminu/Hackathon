import * as express from "express"
import {db} from '../../db/db';

export const studyRouter = express.Router();

interface study{
        user_email:string;
        title:string;
        description:string;
        createat:any;
        nickname:string;
}


studyRouter.get('/', (req:express.Request, res:express.Response, next:express.NextFunction) =>{

        db.query('select * from study', (err, result)=>{
            if(err) next(err);
            console.log('모두 출력 : ', result);
           return res.render('study',{
                   studylist: result
           });
        })
        
       
    
});

studyRouter.get('/new', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        // db.query('insert into test (id) values (300)', (err2, result2)=>{
        //     res.send('router success');
        // })

        return res.render('studycreate');

});


studyRouter.post('/new', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        db.query('select * from user where nickname = ?', [req.user], (err2, result2) =>{
                console.log('이메일 들어가나', result2[0]);
                db.query('insert into study (user_email, title, description, nickname) values (?, ?, ?, ?) ', [result2[0].email, req.body.title, req.body.description, req.user], (err, result) => {
                        if (err) next(err);

                        return res.redirect('/study');
                })
        })
     

        

});


studyRouter.get('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        db.query('select * from study where id = ?',[req.params.id] ,(err, result)=>{
            if(err) next(err);
                let writing: study;
            if(result.length !=0){
                    console.log('정보 : ', result[0]);
                    writing = {
                            user_email: result[0].user_email,
                            title: result[0].title,
                            description: result[0].description,
                            createat: result[0].createat,
                            nickname: result[0].nickname,
                    }
            }

                return res.render('studycontent', {
                        writing: writing
                } );
        })

       

});