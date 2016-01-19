module.exports = function(message, User, Organisation, teamId){
	var data = message.user,
		user = new User({
			id: data.id,
			username: data.name
		});

	Organisation.findOne({id: teamId}, function(err, organisation){
		user.coins = organisation.startingCoins;

		user.save(function(err, user){
			if (err){
				return next(err);
			}

			Organisation.update({id: teamId}, {$addToSet: {users: user._id}});
		});
	});
};