'use strict';

module.exports = function (){
	return {
		SignUpValidation: (req, res, next) => {
			req.checkBody('username', 'Username is Required').notEmpty();
			req.checkBody('username', 'Username Must Not Be Less Than 5').isLength({min: 5});
			req.checkBody('password', 'password is Required').notEmpty();
			req.checkBody('password', 'password Must Not Be Less Than 5').isLength({min: 5});
			req.checkBody('email', 'Email is Required').notEmpty();
			req.checkBody('email', 'Email Must Not Be Less Than 5').isEmail();
			req.getValidationResult()
				.then(result => {
					const errors = result.array();
					const messages = [];
					errors.forEach((error) => {
						messages.push(error.msg)
					});
					req.flash('error', messages);
					res.redirect('/signup');
				})
				.catch(err => {
					return next();
				})
		}
	}
}