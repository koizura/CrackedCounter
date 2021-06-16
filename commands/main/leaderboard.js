const Sequelize = require('sequelize');

module.exports = {
	name: 'leaderboard',
	description: 'Lists the top cracked count users',
	args: false,
	guildOnly: true,
	cooldown: 0.5,
	usage: '<optional: user>',
	aliases: ['top', 'lb'],
    database: true,
	async execute(message, Tags, args) {
        const tagList = await Tags.findAll({ attributes: ['userid', 'username', 'count'] });
        let lb = "Leaderboard:\n";
        for(let i = 0; i < tagList.length; i++) {
            lb += tagList[i].get('username') + ": " + tagList[i].get('count') + "\n";
        }
        return message.channel.send(lb);
	},
};