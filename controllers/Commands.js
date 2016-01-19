module.exports = function(parameters, channel, slack, moment, Organisation, teamId, User, userId, res){
	var Command = function(syntax, action){
		this.syntax = '/slackcoin ' + syntax;
		this.action = action;

		var getParameters = syntax.match(/(\[(.*?)\])/g);

		if (getParameters){
			this.numberOfParameters = getParameters.length;
		}
	};

	Command.prototype.getResponse = function(publicResponse, text, channel){
		return {
			response_type: publicResponse ? 'in_channel' : 'ephemeral',
			channel: channel,
			text: text,
			username: 'SlackBot Coin',
			icon_emoji: ':money_bag:'
		};
	};

	Command.prototype.getErrorResponse = function(error, channel){
		return {
			response_type: 'ephemeral',
			channel: channel,
			text: ':interrobang: Error! ' + error,
			username: 'SlackBot Coin',
			icon_emoji: ':money_bag:'
		};
	};

	Command.prototype.processPlural = function(coins){
		return (coins > 1) ? 'SlackCoins' : 'SlackCoin';
	};

	Command.prototype.validateParameters = function(parameters){
		if (this.numbersOfParameters < parameters.length){
			return 'Wrong syntax: ' + syntax;
		}

		return true;
	};

	return {
		init: new Command('init [initial coin amount]', require('./commands/init')(parameters, channel, slack, User, Organisation, teamId, res)),
		give: new Command('give [username] [transfer amount] [reason]', require('./commands/give')(parameters, channel, Organisation, teamId, User, userId, res)),
		status: new Command('status', require('./commands/status')(parameters, channel, User, userId, res)),
		teamstatus: new Command('teamstatus', require('./commands/teamstatus')(parameters, channel, Organisation, teamId, res)),
		history: new Command('history', require('./commands/history')(parameters, channel, slack, moment, User, userId, res))
	};
};