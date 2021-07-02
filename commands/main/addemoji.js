const { TeamMember } = require("discord.js");

module.exports = {
	name: 'addemoji',
	description: 'adds emojis',
	args: true,
	guildOnly: true,
	cooldown: 0.5,
	usage: ':emoji1: :emoji2: :emoji3:',
	aliases: [],
	database: false,
	async execute(message, args) {
		if(!message.member.hasPermission('MANAGE_EMOJIS')) {
			message.channel.send('You need the `MANAGE_EMOJIS` permission to use this command!');
			return;
		}
		//const static = /<:[^:]+:(\d+)>/gm;
		//const gif = /<a:[^:]+:(\d+)>/gm;

		// with name
		const static = /<:([^:]+):(\d+)>/gm;
		const gif = /<a:([^:]+):(\d+)>/gm;
		
		const staticemojis = [...message.content.matchAll(static)];
		const gifemojis = [...message.content.matchAll(gif)];


		for(const emoji of staticemojis) {
			const name = emoji[1];
			const url = "https://cdn.discordapp.com/emojis/" + emoji[2] + ".png?v=1";
			//message.channel.send(emoji[1] + ':\n' + url);
			message.channel.startTyping();
			await message.guild.emojis.create(url, name)
  .then(emj => message.channel.send(`Created new emoji with name ${emj.name}! <:${emj.name}:${emj.id}>`))
  .catch(console.error);
			message.channel.stopTyping();
		}
		for(const emoji of gifemojis) {
			const name = emoji[1];
			const url = "https://cdn.discordapp.com/emojis/" + emoji[2] + ".gif?v=1";
			//message.channel.send(emoji[1] + ':\n' + url);
			message.channel.startTyping();
			await message.guild.emojis.create(url, name)
  .then(emj => message.channel.send(`Created new emoji with name ${emj.name}! <a:${emj.name}:${emj.id}>`))
  .catch(console.error);
			message.channel.stopTyping();
		}
		message.channel.send("Done adding all emojis");
		message.channel.stopTyping(true);
	},
};