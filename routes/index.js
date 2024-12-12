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
};

export default Router;