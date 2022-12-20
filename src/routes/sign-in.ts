import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models";
import { Password } from "../services/password";
import { signinDto } from "../dto";
import { validateRequest } from "../middlewares";
import { BadRequestError } from "../errors";

const router = express.Router();

router.post(
	"/api/users/signin",
	signinDto,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			throw new BadRequestError("Invalid credentials");
		}

		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		);

		if (!passwordsMatch) {
			throw new BadRequestError("Invalid credentials");
		}

		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.ACCESS_TOKEN_KEY!
		);

		req.session = { jwt: userJwt };
		console.log(req.session);

		return res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
