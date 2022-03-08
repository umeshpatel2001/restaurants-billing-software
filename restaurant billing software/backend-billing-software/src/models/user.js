const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid");
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("Password is invalid");
			}
		},
	},
	menu: [
		{
			name: {
				type: String,
			},
			hindiName: {
				type: String,
			},
			rate: {
				type: Number,
			},
			code: {
				type: Number,
			},
			category: {
				type: String,
			},
		},
	],
	waiter: [
		{
			name: {
				type: String,
			},
		},
	],
	parcel: [
		{
			time: { type: Date, default: Date.now },
			billType: {
				type: String,
				default: "Parcel",
			},
			parcelNumber: {
				type: Number,
			},
			waiter: {
				type: String,
				default: "null",
			},
			foodItem: [
				{
					name: {
						type: String,
					},
					hindiName: {
						type: String,
					},
					rate: {
						type: Number,
					},
					quantity: {
						type: Number,
						default: 1,
					},
					amount: {
						type: Number,
					},
				},
			],
			totalAmount: {
				type: Number,
			},
			paymentMode: {
				type: String,
			},
			status: {
				type: String,
			},
		},
	],
	table: [
		{
			time: { type: Date, default: Date.now },
			billType: {
				type: String,
				default: "Table",
			},
			tableNumber: {
				type: Number,
			},
			waiter: {
				type: String,
				default: "null",
			},
			foodItem: [
				{
					name: {
						type: String,
					},
					hindiName: {
						type: String,
					},
					rate: {
						type: Number,
					},
					quantity: {
						type: Number,
						default: 1,
					},
					amount: {
						type: Number,
					},
				},
			],
			totalAmount: {
				type: Number,
			},
			paymentMode: {
				type: String,
			},
			status: {
				type: String,
			},
		},
	],
	bills: [{}],
	stocks: [
		{
			name: {
				type: String,
			},
			hindiName: {
				type: String,
			},
			rate: {
				type: Number,
			},
			code: {
				type: Number,
			},
			stock: {
				type: Number,
			},
			category: {
				type: String,
			},
		},
	],
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	return userObject;
};

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, "umeshkishorpatel");
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Unable to login..");
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Unable to login...");
	}
	return user;
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
