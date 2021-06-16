module.exports = {
	name: 'ping',
	description: 'pong!',
	args: false,
	guildOnly: true,
	cooldown: 0.5,
	usage: '',
	aliases: [],
	database: false,
	execute(message, args) {
		message.channel.send('Pinging...').then(sent => {
			sent.edit(`Roundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
		});
	},
};