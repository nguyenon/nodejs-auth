import express, { Request, Response } from "express";
import { editInfoDto } from "../dto";
import { NotAuthorizedError, NotFoundError } from "../errors";
import { requireAuth, validateRequest } from "../middlewares";
import { User } from "../models";

const router = express.Router();

router.patch(
	"/api/users/:id",
	requireAuth,
	editInfoDto,
	validateRequest,
	async (req: Request, res: Response) => {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new NotFoundError();
		}

		if (user.id !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		req.body.email = req.body.email && undefined;
		req.body.password = req.body.password && undefined;

		user.set(req.body);
		await user.save();

		return res.status(200).send(user);
	}
);

export { router as userRouter };
