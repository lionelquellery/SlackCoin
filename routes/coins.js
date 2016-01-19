module.exports = function(app, mongoose){
	var User  		 = mongoose.model('User'),
		Organisation = mongoose.model('Organisation'),
		moment 		 = require('moment-timezone'),
		Slack 		 = require('slack-node'),
		token 		 = 'INSERT YOUR TEAM TOKEN HERE',
		slack 		 = new Slack(token),
		WebSocket 	 = require('ws');

	function rtmStart(){
		slack.api('rtm.start', {token: token}, function(err, response){
			if (response){
				var ws 	   = new WebSocket(response.url),
					teamId = response.team.id;

				ws.on('message', function(message){
					var message = JSON.parse(message);

					if (message.type == 'team_join'){
						require('../controllers/events/teamJoin')(message, User, Organisation, teamId);
					}

					else if (message.type == 'user_change'){
						require('../controllers/events/userChange')(message, User);
					}
				});

				ws.on('close', function(){
					rtmStart();
				});
			}

			else {
				rtmStart();
			}
		});
	}

	rtmStart();

	app.post('/api/coins', function(req, res, next){
		var command    = req.body.text.split(' ')[0],
			parameters = req.body.text.split(' ').slice(1),
			channel    = req.body.channel_id,
			teamId 	   = req.body.team_id,
			userId 	   = req.body.user_id;

		var commands = require('../controllers/Commands')(parameters, channel, slack, moment, Organisation, teamId, User, userId, res);

		if (commands[command]){
			commands[command].action.call(commands[command]);
		}

		else {
			res.send({
				response_type: 'ephemeral',
				channel: channel,
				text: ':interrobang: Error! This command doesn\'t exist.',
				username: 'SlackBot Coin',
				icon_emoji: ':money_bag:'
			});
		}
	});
};