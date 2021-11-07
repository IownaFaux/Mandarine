/*

Check if user is in voiceChannel
Check if bot is in voiceChannel


If user and bot are in same voice channel, pause

If unpause returns true, respond paused
If unpause returns false, respond An error occured while pausing

*/

const { audioPlayers } = require("../general.js");

function unpause(message) {
	if (!(message.guild.me.voice.channelId) && !(message.member.voice.channelId == message.guild.me.voice.channelId)) {
		message.react("👎");
		return false;
	}
	message.react("👍");
	audioPlayers[message.guild.id].unpause();
}

module.exports = unpause;