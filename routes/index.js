import { CheckUser } from '../middleware/checkUser.js';
import { Verify, VerifyRole } from '../middleware/verify.js';
import Auth from './auth.js';

const Router = (app) => {
     app.get('/v1', (req, res) => {
          try {
               res.status(200).json({
                    status: 'success',
                    data: [],
                    message: 'Welcome to our API Home page.'
               });
          } catch (error) {
               res.status(500).json({
                    status: 'error',
                    message: error.message,
                    data: null
               });
          }
     })
     app.use('/v1/auth', Auth);

     app.get("/v1/user", Verify, CheckUser, (req, res) => {
          res.status(200).json({
               status: "success",
               message: "Welcome to the your Dashboard!",
               user: req.userDetails,
          });
     });

     app.get("/v1/admin", Verify, CheckUser, VerifyRole, (req, res) => {
          res.status(200).json({
               status: "success",
               message: "Welcome to the Admin portal!",
          });
     });
};



export default Router;