module.exports = function(mongoose){
	var OrganisationSchema = new mongoose.Schema({
		id: {type: String, unique: true},
		users: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
		startingCoins: {type: Number, default: 0}
	});

	mongoose.model('Organisation', OrganisationSchema);
};