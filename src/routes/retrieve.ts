import express, { Request, Response } from "express";
import { NotFoundError } from "../errors";
import { currentUser } from "../middlewares";
import { User } from "../models";

const router = express.Router();

router.get(
	"/api/users/current-user",
	currentUser,
	(req: Request, res: Response) => {
		return res.send({ currentUser: req.currentUser || null });
	}
);

router.get("/api/users/:id", async (req: Request, res: Response) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		throw new NotFoundError();
	}

	return res.status(200).send(user);
});

export { router as userRouter };
