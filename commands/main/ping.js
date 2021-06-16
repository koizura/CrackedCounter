module.exports = {
	name: 'ping',
	description: 'pong!',
	args: false,
	guildOnly: true,
	cooldown: 0.5,
	usage: '',
	aliases: [],
	permissions: '',
	execute(message, args) {
		message.channel.send(`pong!`);
	},
};