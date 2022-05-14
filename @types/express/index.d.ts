import * as express from "express"
declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}
// interface IUserRequest extends express.Request {
//     user: any
// }