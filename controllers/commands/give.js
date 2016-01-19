module.exports = function(parameters, channel, Organisation, teamId, User, userId, res){
	return (function(){
		var self 	  = this,
			validated = this.validateParameters(parameters.slice(0, -1));

		if (validated){
			var recipientId    = parameters[0],
				transferAmount = parameters[1],
				reason 		   = parameters.slice(2).join(' ');

			if (isNaN(transferAmount)){
				res.send(this.getErrorResponse('The transfer amount must be a number. Syntax: ' + this.syntax, channel));
			}

			else {
				Organisation
					.findOne({id: teamId})
					.populate('users')
					.exec(function(err, organisation){
						recipientId = organisation.users.filter(function(user){
							return (user.username == recipientId);
						});

						if (recipientId.length){
							recipientId = recipientId[0].id;
						}

						else {
							res.send(self.getErrorResponse('The recipient doesn\'t exist.', channel));
							return;
						}


						User.findOne({id: userId}, function(err, debtor){
							if (err){
								res.send(self.getErrorResponse('Database connection failed.', channel));
								return;
							}

							if (!debtor){
								res.send(self.getErrorResponse('This team hasn\'t been initialized yet.', channel));
								return;
							}

							if (transferAmount <= 0){
								res.send(self.getErrorResponse('The transfer amount must be greater than 0. Syntax: '+ this.syntax, channel));
								return;
							}

							if (recipientId != debtor.id){
								User.findOne({id: recipientId}, function(err, recipient){
									if (err){
										res.send(self.getErrorResponse('Database connection failed.', channel));
										return;
									}

									if (debtor.coins - transferAmount >= 0){
										if (recipient){
											User.update({_id: recipient._id}, {
												$inc: {coins: transferAmount},
												$push: {history: {
													debtor: false,
													partner: debtor._id,
													amount: transferAmount,
													reason: reason
												}}
											}, function(){
												User.update({_id: debtor._id}, {
													$inc: {coins: -transferAmount},
													$push: {history: {
														debtor: true,
														partner: recipient._id,
														amount: transferAmount,
														reason: reason
													}}
												}, function(){
													var responseMessage = debtor.username +' just gave '+ recipient.username +' '+ transferAmount +' '+ self.processPlural(transferAmount) +'.';

													if (reason){
														responseMessage += ' Reason: ' + reason
													}

													res.send(self.getResponse(true, responseMessage, channel));
												});
											});
										}

										else {
											res.send(self.getErrorResponse('The recipient doesn\'t exist.', channel));
										}
									}

									else {
										var errorMessage = 'You cannot give '+ transferAmount +' '+ self.processPlural(transferAmount) +' to '+ recipient.username +' as your current balance is of only '+ debtor.coins +' '+ self.processPlural(debtor.coins) +'.';

										res.send(self.getErrorResponse(errorMessage, channel));
									}
								});
							}

							else {
								res.send(self.getErrorResponse('You can\'t transfer SlackCoins to yourself.', channel));
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