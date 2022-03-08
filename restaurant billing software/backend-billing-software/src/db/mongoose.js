const mongoose = require("mongoose");
mongoose.connect(
	"URL",
	// Write MongoDB URL 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
