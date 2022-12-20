import { body } from "express-validator";

export const signinDto = [
	body("email").isEmail().withMessage("Email must be valid"),
	body("password")
		.not()
		.isEmpty()
		.trim()
		.withMessage("Password must be provided"),
];
