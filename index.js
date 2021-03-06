const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();
const config = require('./config.json'); // console.log(config.prefix)
const dotenv = require('dotenv');

dotenv.config();

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
	userid: {
		type: Sequelize.STRING,
		unique: true,
	},
    username: {
        type: Sequelize.STRING,
    },
	count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity('Counting is all I do. try ' + config.prefix + "help");
    //Tags.sync({ force: true }); // resets our table every time
    Tags.sync (); // doesn't reset our table every time
});

client.login(process.env.TOKEN);

client.on('message', async message => {
    if(message.author.bot) return;

    if(message.content.toLocaleLowerCase().search(/cracked/) != -1) {
        
        const tag = await Tags.findOne({ where: { userid: message.author.id  } });
        if(tag) {
            tag.increment('count');
            //message.channel.send('Cracked counter increased by 1. Count: ' + tag.get('count'));
        } else {
            console.log("need to make a new tag");
            try {
                const tag = await Tags.create({
                    userid: message.author.id,
                    username: message.author.username,
                    count: 1,
                });
            } 
            catch(e) {
                console.log('error. something wrong with adding a tag');
            }
        }
    }

	if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
    if (!command) return;
        
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('You can not do this!');
        }
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        if(command.database) {
            command.execute(message, Tags, args);
        }
        else {
            command.execute(message, args);
        }
    } catch (error) {
        message.reply("there was an error executing that command. rip.");
    }
    
});