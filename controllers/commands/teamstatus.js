module.exports = function(parameters, channel, Organisation, teamId, res){
	return (function(){
		var self = this;

		Organisation
			.findOne({id: teamId})
			.populate('users')
			.exec(function(err, organisation){
				if (err){
					res.send(self.getErrorResponse('Database connection failed.', channel));
					return;
				}

				if (!organisation){
					res.send(self.getErrorResponse('This team hasn\'t been initialized yet.', channel));
					return;
				}

				var result = '';

				organisation.users.sort(function(a, b){
					return b.coins - a.coins;
				}).forEach(function(user){
					result += user.username + ': ' + user.coins.toFixed(2) + ' '+ self.processPlural(user.coins) +'.\n';
				});

				res.send(self.getResponse(true, result, channel));
			});
	});
};