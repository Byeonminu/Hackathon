import * as express from "express"
declare global {
    namespace Express {
        interface Request {
            user?: any;
            params?: any;
            flash ? : any
        }
    }
}
// interface IUserRequest extends express.Request {
//     user: any
// }