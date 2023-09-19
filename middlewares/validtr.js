const {body, validationResult} = require('express-validator')

const userValidationRules = () => {
    return[
        body('name').notEmpty().withMessage('name is required'),
        body('email').notEmpty().withMessage('email is required'),
        body('password').notEmpty().withMessage('password is required'),
        body('password').isLength({min: 5}).withMessage('password most be 5 letter or mor')
    ]
}

const updateUserValidationResult = () => {
    return[
        body('name').notEmpty().withMessage('name is required'),
        body('password').notEmpty().withMessage('password is required'),
        body('password').isLength({min: 5}).withMessage('password most be 5 letter or mor')
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if(errors.isEmpty()) {
        return next()
    }

    return res.status(400).json({errors: errors.array()})
}

module.exports = {
    userValidationRules,
    updateUserValidationResult,
    validate
}