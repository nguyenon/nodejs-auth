import mongoose from "mongoose";

interface TokenAttrs {
	refreshTokenSha1: string;
	userId: string;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
	build(attrs: TokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document {
	refreshTokenSha1: string;
	userId: string;
}

const tokenSchema = new mongoose.Schema(
	{
		refreshTokenSha1: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

tokenSchema.statics.build = (attrs: TokenAttrs) => {
	return new Token(attrs);
};

const Token = mongoose.model<TokenDoc, TokenModel>("Token", tokenSchema);

export { Token };
