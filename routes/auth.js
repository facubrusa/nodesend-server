const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');


router.post('/',
    [
        check('email', 'The email is invalid').isEmail(),
        check('password', "The password can't be empty").not().isEmpty()
    ],
    authController.authenticateUser
);

router.get('/',
    auth,
    authController.authenticatedUser
);

module.exports = router;