import express, { Request, Response } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { signinRouter } from "./routes/sign-in";
import { signoutRouter } from "./routes/sign-out";
import { signupRouter } from "./routes/sign-up";
import { currentUser, errorHandler } from "./middlewares";
import { NotFoundError } from "./errors";
import { userRouter } from "./routes/retrieve";

const app = express();
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);

app.use(signinRouter);
app.use(signupRouter);
app.use(userRouter);

app.use(currentUser);
app.use(signoutRouter);

app.all("*", async (req: Request, res: Response) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
