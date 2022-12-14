const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const Sentry = require('@sentry/node');

const config = require('../config.js');
const { getTeams } = require('../util/getTeams.js');

module.exports = {
	arguments: ['region (use,usw,eu)', 'port (3005,3015,3025)'],
	description: 'Get the teams and their players for the specified server',
	interaction: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Get the teams and their players for the specified server')
		.addStringOption((option) =>
			option
				.setName('region')
				.setDescription('Server region (use, usw, eu, tr)')
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName('port')
				.setDescription('Server port (3005, 3015...)')
				.setRequired(true)
		),
	command: async (message, args, client) => {
		const serverRegion = message.interaction ? args.region : args[0];
		const serverPort = message.interaction ? args.port : args[1];
		if (!serverPort || !serverRegion) {
			return message.reply({
				content: `Something went wrong getting teams. Please try a region of use, usw, eu, or tr (tournament) and a valid port (3005, 30015, etc.)`,
				ephemeral: true,
			});
		}

		try {
			serverRes = await getTeams({
				region: serverRegion,
				port: serverPort,
			});
		} catch (err) {
			Sentry.captureException(err);
			return message.reply({
				content: `Something went wrong getting teams. Please try a region of use, usw, eu, or tr (tournament) and a valid port (3005, 30015, etc.)`,
				ephemeral: true,
			});
		}
		const defuseMode = serverPort.endsWith('2');
		const embed = new EmbedBuilder()
			.setColor(config.EMBED.MAIN)
			.setTitle(`${serverRegion.toUpperCase()} ${serverPort}`)
			.setURL(
				`https://defly.io/#${defuseMode ? 2 : 1}-${
					config.REGION_LIST.find((i) => serverRegion === i.alias).ws
				}:${serverPort}`
			)
			.addFields(
				serverRes.map((u) => {
					return {
						name: !defuseMode
							? `${u.team.color} - ${Math.round(u.mapPercent)}% ${
									u.available ? '' : ':x:'
							  }`
							: `${u.team.color} ${u.available ? '' : ':x:'}`,
						value:
							u.players.length !== 0
								? u.players
										.map(
											(e) =>
												e.name +
												' ' +
												(e.badge
													? client.guilds.cache
															.get('877177181413994496')
															.emojis.cache.find(
																(badge) =>
																	badge.name ===
																	`badge${
																		e.badge < 10 ? '0' + e.badge : e.badge
																	}`
															)
															.toString()
													: '')
										)
										.join(', ')
								: 'N/A',
					};
				})
			);

		await message.reply({ embeds: [embed] });
	},
};
