import * as express from "express"
import {db} from '../../db/db';
import nodemailer from 'nodemailer';
export const studyRouter = express.Router();
import {senderinfo} from '../../config/senderinfo';

interface study{
        user_email:string;
        title:string;
        description:string;
        createat:any;
        nickname:string;
}

interface applicants{
        applicant_email:string;
        applicant_nickname: string;
        applyat:string;
}


studyRouter.get('/', (req:express.Request, res:express.Response, next:express.NextFunction) =>{

        db.query('select * from study', (err, result)=>{
            if(err) next(err);
                
          let nickname: string = '';
          if(req.session.isLogined){
                  nickname = req.user + '님';
          }
           return res.render('study',{
                   user_nickname: nickname,
                   studylist: result
           });
        })
        
       
    
});

studyRouter.get('/new', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        if(!req.session.isLogined){
                return res.redirect('/');
        }
        else{
                return res.render('studycreate');
        }

     

});


studyRouter.post('/new', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        db.query('select * from user where nickname = ?', [req.user], (err2, result2) =>{
                db.query('insert into study (user_email, title, description, nickname) values (?, ?, ?, ?) ', [result2[0].email, req.body.title, req.body.description, req.user], (err, result) => {
                        if (err) next(err);

                        return res.redirect('/study');
                })
        })
     

        

});


studyRouter.post('/apply', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(!req.session.isLogined){
                return res.redirect('/auth/loginpage');
        }
        else{
                db.query('select * from user where nickname = ?', [req.user], (err2, result2) => {
                        db.query('insert into studygroup (study_id, applicant_email, applicant_nickname) values (?, ?, ?) ', [req.body.study_id, result2[0].email, result2[0].nickname], (err, result) => {
                                db.query('select * from study where id = ?', [req.body.study_id], async(err, recruit) =>{

                              
                                if (err) next(err);
                                let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        host: 'smtp.gmail.com',
                                        port: 587,
                                        secure: false,
                                        auth: {

                                                user: senderinfo.user,
                                                pass: senderinfo.pass,
                                        },
                                });
                                let info = await transporter.sendMail({

                                        from: `"포개다" <${senderinfo.user}>`,

                                        to: recruit[0].user_email,

                                        subject: '[포개다] 새 지원자가 등록되었습니다.',

                                        html: `<b> 안녕하세요. ${recruit[0].nickname}님 <br/>
                                        '${req.user}'님이 방금 '${recruit[0].title}'에 지원 하셨습니다.</b>`,
                                });
                                console.log('Message sent: %s', info.messageId);
                                return res.redirect('/study');
                                })
                        })
                })
        }
       

});

studyRouter.get('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {

        db.query('select * from study where id = ?',[req.params.id] ,(err, result)=>{
            if(err) next(err);
                let writing: study;
            if(result.length !=0){
                    writing = {
                            user_email: result[0].user_email,
                            title: result[0].title,
                            description: result[0].description,
                            createat: result[0].createat,
                            nickname: result[0].nickname,
                    }
            }
            let applicants_list:applicants[] = [];
            let i:number;
            if(result[0].nickname == req.user){ // 글을 작성한 사람일 때
                db.query('select * from studygroup where study_id = ?', [req.params.id], (err, applicant) =>{
                        for (i = 0; i < applicant.length; i++) {
                                applicants_list.push({
                                        applicant_email: applicant[i].applicant_email,
                                        applicant_nickname: applicant[i].applicant_nickname,
                                        applyat: applicant[i].applyat
                                })
                        };
                        console.log("지원자: ", applicants_list);
                        let nickname: string = '';
                        if (req.session.isLogined) {
                                nickname = req.user + '님';
                        }

                        return res.render('studycontent', {
                                writing: writing,
                                study_id: req.params.id,
                                user_nickname: nickname,
                                applicants_list: applicants_list
                        });
                })
            }
            else{
                    let nickname: string = '';
                    if (req.session.isLogined) {
                            nickname = req.user + '님';
                    }

                    return res.render('studycontent', {
                            writing: writing,
                            study_id: req.params.id,
                            user_nickname: nickname,
                            applicants_list: applicants_list
                    });
            }
                
        })

       

});



