const { verifyAccessToken } = require('../library/jwt');
const UserModel = require('../models/UserModel');

module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    if (request.headers.authorization) {
        const user = verifyAccessToken(request.headers.authorization.split(" ")[1]);
        if (user) {
            request.currentUser = user;
            next();
        } else {
            // if the token is invalid

            return response.status(403).json({
                message: 'Invalid token'
            });
        }
    } else {
        // if there is no authorization header

        return response.status(403).json({
            message: 'Token not supplied'
        });
    }
};