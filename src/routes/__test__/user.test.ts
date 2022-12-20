import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

it("response with details about the current user", async () => {
	const cookie = global.signin();

	const response = await request(app)
		.get("/api/users/current-user")
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("response with null if not authenticated", async () => {
	const response = await request(app)
		.get("/api/users/current-user")
		.send()
		.expect(200);

	expect(response.body.currentUser).toEqual(null);
});

it("returns a 404 if the user is not found", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/users/${id}`).send().expect(404);
});

it("returns the user if the user is found", async () => {
	const user = {
		email: "test@test.com",
		password: "password",
		firstName: "test",
		lastName: "test last name",
		dob: "150600",
	};
	const response = await request(app)
		.post("/api/users/signup")
		.send(user)
		.expect(201);

	const userResponse = await request(app)
		.get(`/api/users/${response.body.id}`)
		.send()
		.expect(200);

	expect(userResponse.body.email).toEqual(user.email);
});
