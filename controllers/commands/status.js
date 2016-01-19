module.exports = function(parameters, channel, User, userId, res){
	return (function(){
		var self = this;

		User.findOne({id: userId}, function(err, user){
			if (err){
				res.send(self.getErrorResponse('Database connection failed.', channel));
				return;
			}

			if (!user){
				res.send(self.getErrorResponse('This team hasn\'t been initialized yet.', channel));
				return;
			}

			res.send(self.getResponse(false, 'Your current balance is of '+ user.coins.toFixed(2) +' '+ self.processPlural(user.coins) +'.', channel));
		});
	});
};