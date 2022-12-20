import express from "express";
import { requireAuth } from "../middlewares";

const router = express.Router();

router.post("/api/users/signout", requireAuth, (req, res) => {
	req.session = null;

	return res.send({});
});

export { router as signoutRouter };
