module.exports = function(message, User){
	var data = message.user;

	User.update({id: data.id}, {$set: {username: data.name}});
};