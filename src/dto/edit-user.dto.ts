import { body } from "express-validator";

export const editInfoDto = [
	body("firstName")
		.exists()
		.trim()
		.notEmpty()
		.withMessage("First name must not be empty"),
	body("lastName")
		.exists()
		.trim()
		.notEmpty()
		.withMessage("Last name must not be empty"),
	body("dob")
		.exists()
		.trim()
		.notEmpty()
		.withMessage("Date of birth must not be empty"),
];
