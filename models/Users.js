module.exports = function(mongoose){
	var UserSchema = new mongoose.Schema({
		id: String,
		username: String,
		coins: {type: Number, default: 0},
		history: [{
			debtor: Boolean,
			partner: {type: mongoose.Schema.ObjectId, ref: 'User'},
			amount: Number,
			reason: String,
			timestamp: {type: Date, default: Date.now}
		}]
	});

	mongoose.model('User', UserSchema);
};