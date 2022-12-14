const axios = require('axios');
const Response = require('../util/apiResponse.js');

module.exports = async (req, res) => {
	const code = req.query.code;

	if (code) {
		try {
			const parameters = new URLSearchParams();
			parameters.append('client_id', process.env.APP_ID);
			parameters.append('client_secret', process.env.CLIENT_SECRET);
			parameters.append('grant_type', 'authorization_code');
			parameters.append('code', code);
			parameters.append(
				'redirect_uri',
				process.env.NODE_ENV === 'production'
					? 'https://defly.monster/api/auth/'
					: 'http://localhost:3000/api/auth/'
			);
			parameters.append('scope', 'identity');

			const authData = await axios.post(
				'https://discord.com/api/oauth2/token',
				parameters,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			const auth = authData.data;

			const userData = await axios.get('https://discord.com/api/users/@me', {
				headers: {
					Authorization: `Bearer ${auth.access_token}`,
				},
			});
			const user = userData.data;

			const isAdmin = process.env.ADMINS.split(',').find(
				(usr) => usr === user.id
			)
				? true
				: false;

			req.session.accessToken = auth.access_token;
			req.session.refreshToken = auth.refresh_token;
			req.session.userId = user.id;
			req.session.username = user.username;
			req.session.isAdmin = isAdmin;

			res.redirect('/dashboard');
		} catch (err) {
			Response(res, {
				type: 'serverError',
				err,
			});
		}
	} else {
		return Response(res, {
			type: 'unauthorized',
		});
	}
};
