/*

Check if already in a discord voicechannel in members guild -- not doing
voicechannel = voicestate

Check if member is in a voice channel

If so then join members current voice channel

*/

const { audioPlayers, queue, playNext } = require("../general.js");

const {
	joinVoiceChannel,
	createAudioPlayer,
	NoSubscriberBehavior,
	AudioPlayerStatus } = require("@discordjs/voice");

// Checks if user who called upon the join command is in a voice channel. If not returns false otherwise joins channel
function join(message) {
	const voice = message.member.voice;

	// create queue for guild
	queue[message.guildId] = [];

	// If user is not in channel if() returns false
	if (!voice.channelId) {
		message.reply("You are not in a voice chanel");
		message.react("👎");
		return false;
	}
	/* if (message.channel.guild.me.voice.channelId) {
		message.reply("I am already in a voice channel!");
	}*/

	// Otherwise join users channel
	const connection = joinVoiceChannel({
		channelId: voice.channelId,
		guildId: voice.channel.guildId,
		adapterCreator: voice.channel.guild.voiceAdapterCreator });
	// and create audioPlayer
	const audioPlayer = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause,
		},
	});

	audioPlayer.on(AudioPlayerStatus.Idle, async () => {
		queue[message.guild.id].shift();
		if (queue[message.guild.id] && queue[message.guild.id][0]) {
			playNext(message);
		}
	});

	// Add audio player to guild:audioplayer table
	audioPlayers[message.guildId] = audioPlayer;

	// voiceConnection will play from this audioPlayer
	connection.subscribe(audioPlayer);
	message.react("👍");
	return { connection, audioPlayer };

}

module.exports = join;