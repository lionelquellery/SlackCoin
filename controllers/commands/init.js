module.exports = function(parameters, channel, slack, User, Organisation, teamId, res){
	return (function(){
		var self 	  = this,
			validated = this.validateParameters(parameters);

		if (validated){
			var startingCoins = parameters[0];

			if (isNaN(startingCoins)){
				res.send(this.getErrorResponse('The initial amount of SlackCoins distributed must be a number. Syntax: ' + this.syntax, channel));
			}

			else {
				slack.api('users.list', function(err, response) {
					var users = [];

					response.members.forEach(function(member, index){
						if (!member.is_bot && !member.deleted){
							users.push({
								id: member.id,
								username: member.name
							});
						}
					});

					Organisation.findOne({id: teamId}, function(err, team){
						if (team){
							res.send(self.getErrorResponse('This team has already been initialized.', channel));
						}

						else {
							var organisation = new Organisation({
								id: teamId,
								startingCoins: startingCoins
							});

							users.forEach(function(user){
								var user = new User(user);

								user.coins = organisation.startingCoins;

								user.save(function(err, user){
									if (err){
										res.send(self.getErrorResponse('Database connection failed.', channel));
										return;
									}

									organisation.users.push(user._id);

									if (organisation.users.length == users.length){
										organisation.save(function(err, organisation){
											if (err){
												res.send(self.getErrorResponse('Database connection failed.', channel));
												return;
											}

											var responseMessage = 'SlackCoin was successfully initialized. All users have been granted '+ organisation.startingCoins.toFixed(2) +' '+ self.processPlural(organisation.startingCoins) +'.';

											res.send(self.getResponse(true, responseMessage, channel));
										});
									}
								});
							});
						}
					});
				});
			}
		}

		else {
			res.send(this.getErrorResponse(validated, channel));
		}
	});
};