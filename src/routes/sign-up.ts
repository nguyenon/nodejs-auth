import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models";
import { signupDto } from "../dto";
import { validateRequest } from "../middlewares";
import { BadRequestError } from "../errors";

const router = express.Router();

router.post(
	"/api/users/signup",
	signupDto,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password, firstName, lastName, dob } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new BadRequestError("Email is already existed");
		}

		const user = User.build({
			email,
			password,
			firstName,
			lastName,
			dob,
		});
		await user.save();
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.ACCESS_TOKEN_KEY!
		);
		req.session = {
			jwt: userJwt,
		};

		return res.status(201).send(user);
	}
);

export { router as signupRouter };
