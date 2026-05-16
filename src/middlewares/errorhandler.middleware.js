// src/middlewares/errorHandler.js
import AppError from '../utils/AppError.js';

// JWT library throws this when token is fake/tampered
// we convert it to a clean AppError so client gets a proper 401
const handleJWTError = () =>
    new AppError('Invalid token. Please log in again.', 401);

// JWT library throws this when token is expired
const handleJWTExpiredError = () =>
    new AppError('Your token has expired. Please log in again.', 401);

// decides what to send to client
const sendError = (err, res) => {
    if (err.isOperational) {
        // we threw this on purpose — safe to show real message
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    }

    // unexpected crash — log privately, hide internals from client
    console.error('ERROR:', err);
    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong'
    });
};

// 4 arguments = Express knows this is an error handler
// MUST be registered last in index.js after all routes
export default (err, req,  res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // copy error so we can safely replace it below
    // message copied manually because it's non-enumerable on Error objects
    let error = { ...err, message: err.message };

    // JWT library errors have no isOperational
    // replace them with clean AppErrors so client gets proper message
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendError(error, res);
};