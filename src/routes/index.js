import { Verify, VerifyRole } from '../middleware/verify.js';
import { getErrorMessage } from '../types/index.js';
import Auth from './auth.js';
const Router = (app) => {
    app.get('/v1', (req, res) => {
        try {
            res.status(200).json({
                status: 'success',
                data: [],
                message: 'Welcome to our API Home page.'
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: getErrorMessage(error),
                data: null
            });
        }
    });
    app.use('/v1/auth', Auth);
    app.get('/v1/user', Verify, (req, res) => {
        res.status(200).json({
            message: 'Welcome to the user dashboard!',
            user: req.user,
        });
    });
    app.get('/v1/admin', Verify, VerifyRole('ADMIN'), (req, res) => {
        res.status(200).json({
            message: 'Welcome to the admin portal!',
            user: req.user,
        });
    });
};
export default Router;
