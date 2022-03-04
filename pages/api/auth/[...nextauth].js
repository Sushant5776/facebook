import NextAuth from 'next-auth'
import Facebook from 'next-auth/providers/facebook'

export default NextAuth({
	providers: [
		Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		})
	],
	secret: process.env.JWT_SECRET
})