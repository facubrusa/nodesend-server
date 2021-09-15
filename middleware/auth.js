const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if(authHeader) {
        // Get the token
        const token = authHeader.split(' ')[1];

        // Check the JWT
        try {
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;
        } catch (error) {
            return res.status(401).json({ msg: 'Oops! Your session expired'});
        }
    }

    return next(); // Continue executing the next lines
}