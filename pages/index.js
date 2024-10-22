// Importaciones
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} = useSession();

  return <Layout>
    <div className="text-negro flex justify-between">
      <h2>
      Hola, bienvenido a la pagina del administrador, desde esta pagina podran subir nuevo productos, noticias, agregar categorias y revisar los pedidos realizados <b className="text-rojoM">{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 grap-i text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"></img>
        <span className=" px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
  </Layout>
}
