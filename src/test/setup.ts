import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
	var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
	process.env.ACCESS_TOKEN_KEY = "3HwONd9ACh3A8ArVQWN2";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	mongoose.set("strictQuery", false);
	await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});

global.signin = () => {
	const payload = {
		email: "test@test.com",
		password: "password",
		firstName: "test",
		lastName: "test",
		dob: "150600",
	};

	const token = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY!);
	const session = { jwt: token };
	const sessionJSON = JSON.stringify(session);
	const base64 = Buffer.from(sessionJSON).toString("base64");

	return [`session=${base64}`];
};
