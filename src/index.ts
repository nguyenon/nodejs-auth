import { app } from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DatabaseConnectionError } from "./errors";

dotenv.config();

const start = async () => {
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(err);
		throw new DatabaseConnectionError();
	}
};

app.listen(3000, () => {
	console.log("Listening on port 3000");
});

start();
