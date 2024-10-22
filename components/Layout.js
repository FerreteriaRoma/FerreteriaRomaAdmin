// components/Layout.js
import Nav from "@/components/Nav";
import { useSession, signIn } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="bg-vinoT min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        {children}
      </div>
    </div>
  );
}
