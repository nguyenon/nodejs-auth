import jwt from "jsonwebtoken";
import { Token } from "../models";
import crypto from "crypto";
import { NotAuthorizedError } from "../errors";
import { UserPayload } from "../middlewares";

export class Jwt {
	static generateAccessToken(id: string, email: string) {
		const accessToken = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_KEY!, {
			expiresIn: "1hr",
		});
		return accessToken;
	}

	static async generateRefreshToken(id: string) {
		const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY!, {
			expiresIn: "1hr",
		});

		const refreshTokenSha1 = crypto
			.createHash("sha1")
			.update(refreshToken)
			.digest("hex");

		const existedToken = Token.updateOne(
			{ refreshTokenSha1: refreshTokenSha1 },
			{ refreshTokenSha1, userId: id },
			{ upsert: true }
		);
		return existedToken;
	}

	static async verifyRefreshToken(userId: string, refreshToken: string) {
		const refreshTokenSha1 = crypto
			.createHash("sha1")
			.update(refreshToken)
			.digest("hex");

		const tokenExisted = await Token.find({ userId, refreshTokenSha1 });
		if (!tokenExisted) {
			throw new NotAuthorizedError();
		}

		const payload = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_KEY!
		) as UserPayload;

		const accessToken = this.generateAccessToken(payload.id, payload.email);
		return accessToken;
	}
}
