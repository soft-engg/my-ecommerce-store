import NextAuth from 'next-auth';
import db from '../../../utils/db';
import User from '../../../models/users';
import bcrypt from 'bcryptjs';
import credentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token._isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?._isAdmin) session.user.isAdmin = token._isAdmin;
      return session;
    },
  },
  providers: [
    credentialsProvider({
      async authorize(credentials) {
        // here connecting to db to get user from database
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        // here we are matching users from credential to the user from database
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          //user and passoword id correct
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('invalid email or password');
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
});
