const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next) => {
    // Check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // Create link object
    const { name, original_name } = req.body;

    const link = new Link();
    link.url = shortid.generate();
    link.name = name;
    link.original_name = original_name;

    // If the user is authenticated
    if(req.user) {
        const { password, downloads } = req.body;

        // Assign to link a max number of downloads
        if(downloads) {
            link.downloads = downloads;
        }

        // Assign a password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }

        // Assign an author
        link.author = req.user.id;
    }

    // Store in database
    try {
        await link.save();
        res.json({ msg: `${link.url}` });
        next();
    } catch (error) {
        return res.status(500).json({ msg: 'Oops! Something break' });
    }
}

exports.getAllLinks = async (req, res) => {
    try {
        const links = await Link.find({}).select('url -_id');
        res.json({links});
    } catch (error) {
        return res.status(500).json({ msg: 'Oops! Something break' });
    }
}

exports.getLink = async (req, res, next) => {
    const { url } = req.params;

    // Verify if the link exist
    const link = await Link.findOne({url});

    if(!link) {
        res.status(404).json({ msg: "This link doesn't exist"});
        return next();
    }

    // If the link exist
    res.json({file: link.name, password: link.password, url: link.url});

    next(); 
}

exports.verifyPassword = async (req, res, next) => {

    const { url } = req.params;
    const { password } = req.body;

    const link = await Link.findOne({url});

    // Verify password
    if(bcrypt.compareSync(password, link.password)) {
        // Allow download file
        return res.json({ error: false });
    } else {
        return res.status(401).json({ msg: 'Incorrect password' });
    }
}