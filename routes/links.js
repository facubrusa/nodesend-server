const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');
const filesController = require('../controllers/filesController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');


router.post('/',
    [
        check('name', 'Upload an file').not().isEmpty(),
        check('original_name', 'Upload an file').not().isEmpty()
    ],
    auth,
    linksController.newLink
);

router.get('/',
    linksController.getAllLinks,
);

router.get('/:url',
    linksController.getLink
);

router.post('/:url',
    linksController.verifyPassword
);

module.exports = router;