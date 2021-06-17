const Sequelize = require('sequelize');

module.exports = {
	name: 'leaderboard',
	description: 'Lists the top cracked count users',
	args: false,
	guildOnly: true,
	cooldown: 0.5,
	usage: '<optional: page>',
	aliases: ['top', 'lb', 'l'],
    database: true,
	async execute(message, Tags, args) {
        
        const tagList = await Tags.findAll({ 
            order: [
                ['count', 'DESC'],
            ],
            attributes: ['userid', 'username', 'count'] 
        });
        let start = 0;
        if(!isNaN(args[0])) {
            start = Math.floor(args[0]-1)*5;
            if(start > tagList.length) {
                start = Math.floor(tagList.length/5)*5;
            }
            if(start <= 0) {
                start = 0;
            }
        }
        let lb = "<a:bcWIGGLE:749029643251875891> __**Global Leaderboard \"Cracked\" Counter:**__ <a:bcWIGGLE:749029643251875891>\n";
        for(let i = start; i < tagList.length && i < start+5; i++) {
            lb += "**" + (i+1) + ":**\t" + tagList[i].get('username') + ":   " + tagList[i].get('count') + "      (owes "+(tagList[i].get('count') * 25)+" cents)\n";
        }
        lb += "Page " + (Math.floor(start/5)+1) + "/" + (Math.floor(tagList.length/5)+1);
        return message.channel.send(lb);
	},
};