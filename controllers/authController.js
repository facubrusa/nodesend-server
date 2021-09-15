const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const { validationResult } = require('express-validator');

exports.authenticateUser = async (req, res, next) => {

    // Show the error message of express validator
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // Verify if the user is registered
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if(!user) {
        return res.status(401).json({ msg: "The user doesn't exist"});
    }

    // Verify password and authenticate user
    if(bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET, {
            expiresIn: '8h'
        });

        res.json({ token });
    } else {
        return res.status(401).json({ msg: 'Incorrect password'});
    }
}

exports.authenticatedUser = (req, res, next) => {
    res.json({ user: req.user });
}