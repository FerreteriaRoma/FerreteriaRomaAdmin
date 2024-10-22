// Importaciones 
import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from '@auth/mongodb-adapter';

const adminEmails = ['famnetflix0803@gmail.com', 'julprogram131@gmail.com']

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session }) {
      if (adminEmails.includes(session?.user?.email)) {
        session.user.isAdmin = true;
      } else {
        session.user.isAdmin = false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user.isAdmin) {
    res.status(403).json("Not an admin");
    return; // Finaliza la ejecución de la función aquí
  }
}
