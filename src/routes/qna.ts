import * as express from "express"
import {db} from '../../db/db';

export const qnaRouter = express.Router();

interface questions {
        title: string;
        description: string;
        createat: any;
        nickname: string;
}



qnaRouter.get('/', (req:express.Request, res:express.Response, next:express.NextFunction) =>{

        db.query('select * from qna', (err, result)=>{
            if(err) next(err);
                
          let nickname: string = '';
          if(req.session.isLogined){
                  nickname = req.user + '님';
          }
           return res.render('qna',{
                   user_nickname: nickname,
                   questions_list: result
           });
        })
        
       
    
});

qnaRouter.get('/new', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        if(!req.session.isLogined){
                return res.redirect('/');
        }
        else{
                return res.render('qnacreate');
        }

     

});


qnaRouter.post('/new', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        db.query('select * from user where nickname = ?', [req.user], (err2, result2) =>{
                db.query('insert into qna (title, description, nickname) values (?, ?, ?) ', [req.body.title, req.body.description, req.user], (err, result) => {
                        if (err) next(err);

                        return res.redirect('/qna');
                })
        })
     

        

});


qnaRouter.post('/new-comment', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(!req.session.isLogined){
                return res.redirect('/auth/loginpage');
        }
        else{
                db.query('insert into comment (qna_id, description, nickname) values (?, ?, ?)', [req.body.qna_id, req.body.comment, req.user], (err, result) => {
                        if (err) next(err);
                        return res.redirect('/qna/' + req.body.qna_id);
                })
        }

       





});



qnaRouter.get('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        db.query('select * from qna where id = ?', [req.params.id], (err, result) => {
                if (err) next(err);
                let questions:questions;
                if (result.length != 0) {
                        questions = {
                                title: result[0].title,
                                description: result[0].description,
                                createat: result[0].createat,
                                nickname: result[0].nickname,
                        }
                }
                
                db.query('select * from comment where qna_id = ? ', [req.params.id], (err2, result2) =>{
                        if(err2) next(err2);
                        let nickname: string = '';
                        if (req.session.isLogined) {
                                nickname = req.user + '님';
                        }

                        return res.render('qnacontent', {
                                questions: questions,
                                qna_id: req.params.id,
                                user_nickname: nickname,
                                comments:result2
                        });
                })

                       
                

        })


});



