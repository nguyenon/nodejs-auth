import { body } from "express-validator";

export const signupDto = [
	body("email").isEmail().withMessage("Email must be valid"),
	body("password")
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage("Password must be between 4 and 20 characters"),
	body("firstName")
		.not()
		.isEmpty()
		.trim()
		.withMessage("First name must not be empty"),
	body("lastName")
		.not()
		.isEmpty()
		.trim()
		.withMessage("Last name must not be empty"),
	body("dob")
		.not()
		.isEmpty()
		.trim()
		.withMessage("Date of birth must not be empty"),
];
