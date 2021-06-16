const Sequelize = require('sequelize');

module.exports = {
	name: 'rank',
	description: 'Tells you your cracked counter',
	args: false,
	guildOnly: true,
	cooldown: 0.5,
	usage: '<optional: user>',
	aliases: ['level', 'r'],
    database: true,
	async execute(message, Tags, args) {
        if(!message.mentions.users.size) {
            const tag = await Tags.findOne({ where: { userid: message.author.id  } });
            if(tag) {
                message.channel.send("You've said cracked "+tag.get('count') +" times!");
            }
            else {
                message.channel.send("You have not yet used the term \'Cracked\'.");
            }
        } else {
            const taggedUser = message.mentions.users.first();
            const tag = await Tags.findOne({ where: { userid: taggedUser.id } });
            if(tag) {
                message.channel.send(taggedUser.username + " said cracked "+tag.get('count') +" times!");
            }
            else {
                message.channel.send("They have not yet used the term \'Cracked\'.");
            }
        }
	},
};