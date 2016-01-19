module.exports = function(parameters, channel, slack, moment, User, userId, res){
	return (function(){
		var self = this;

		User
			.findOne({id: userId})
			.populate('history.partner').
			exec(function(err, user){
				if (err){
					res.send(self.getErrorResponse('Database connection failed.', channel));
					return;
				}

				if (!user){
					res.send(self.getErrorResponse('This team hasn\'t been initialized yet.', channel));
					return;
				}

				if(!user.history.length){
					res.send(self.getErrorResponse('You haven\'t transfered any SlackCoin yet.', channel));
					return;
				}

				slack.api('users.info', {user: userId}, function(err, response){
					var timeZone = response.user.tz,
						result 	 = {text: '', transfersCount: 0};

					user.history.forEach(function(transfer){
						var date  = moment.tz(transfer.timestamp, timeZone).locale('US').format('lll'),
							entry = date + ': ' + transfer.amount.toFixed(2) + ' ' + self.processPlural(transfer.amount);

						entry += (transfer.debtor ? ' to ': ' from ') + transfer.partner.username + '. Reason: ' + (transfer.reason ? transfer.reason : '/') + '\n';

						result.text += entry;
						result.transfersCount++;

						if (result.transfersCount == user.history.length){
							res.send(self.getResponse(false, result.text, channel));
						}
					});
				});
			});
	});
};