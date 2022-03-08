const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	bills:[{
		
	}]
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
