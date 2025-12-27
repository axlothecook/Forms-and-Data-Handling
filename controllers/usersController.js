const usersStorage = require('../storages/usersStorage');
const { body, query, validationResult, matchedData } = require('express-validator');

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be bewtween 1 and 10 characters.';
const emptyErr = 'field can not be empty.';
const emailErr = 'input does not reflect a valid email.';

const validateUser = [
    body('firstName').trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body('lastName').trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body('email').trim()
    .isLength({min: 1, max: 15 }).withMessage(`Email ${emptyErr}`)
    .isEmail().withMessage(`Email ${emailErr}`),
    body('age').trim()
    .optional({ values: "falsy" })
    .isNumeric().withMessage('Age must be a numeric value.')
    .isLength({min: 0, max: 2 }).withMessage('Age must be between 0 and 2 characters.'),
    body('bio').trim()
    .optional({ values: "falsy" })
    .isLength({min: 0, max: 200 }).withMessage('Biography must be less than 200 characters.')
    .matches(/[a-zA-Z0-9 .,]/).withMessage('Only letters, numbers, commas and dots allowed.'),
];

const validateSearch = [
    query('searchedName').trim()
    .matches(/[a-zA-Z\s]+/).withMessage(`Full name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage('Full name must be bewtween 1 and 20 characters.'),
    query('searchedEmail').trim()
    .isLength({min: 1, max: 15 }).withMessage(`Email ${emptyErr}`)
    .isEmail().withMessage(`Email ${emailErr}`),
];

exports.usersListGet = (req, res) => {
    res.render('index', {
        title: 'User list',
        users: usersStorage.getUsers(),
    });
};

exports.usersCreateGet = (req, res) => {
    res.render('createUser', {
        title: 'Create user',
    });
};

exports.usersCreatePost = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('createUser', {
                title: "Create user",
                errors: errors.array(),
            });
        };

        const { firstName, lastName, email, age, bio } = matchedData(req);
        usersStorage.addUser({ firstName, lastName, email, age, bio });
        res.redirect('/');
    }
];

exports.usersSearchGet = [
    validateSearch,
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('index', {
                title: 'User list',
                errors: errors.array(),
            });
        };
        const { searchedName, searchedEmail } = matchedData(req); 
        const results = usersStorage.searchUser({ searchedName, searchedEmail });
        res.render('search', {
            title: 'Searched User',
            searchedName,
            searchedEmail,
            results
        });
    }
];

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render('updateUser', {
        title: 'Update user',
        user: user,
    });
};

exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('updateUser', {
                title: 'Update user',
                user: user,
                errors: errors.array(),
            });
        };
        const { firstName, lastName, email, age, bio } = matchedData(req);
        usersStorage.updateUser(req.params.id, {
            firstName, 
            lastName, 
            email, 
            age, 
            bio
        });
        res.redirect('/');
    }
];

exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect('/');
};