import Layout from "@/components/Layout";
import NewsForm from "@/components/newsForm";

export default function NewNews() {
    return (
        <Layout>
            <h1 className="text-rojoM">Nueva noticia</h1>
            <NewsForm />
        </Layout>
    )
}