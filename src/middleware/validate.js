import { validationResult } from '../../node_modules/express-validator/lib/validation-result.js';
const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = {};
        errors.array().forEach((err) => {
            error[err.param] = err.msg;
        });
        console.error('Validation errors:', error);
        return;
    }
    next();
};
export default Validate;
