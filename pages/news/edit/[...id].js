import Layout from "@/components/Layout";
import NewsForm from "@/components/newsForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditNewsPages() {
    const [newsInfo, setNewsInfo] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/news?id=' + id).then(response => {
            setNewsInfo(response.data);
        })
    }, [id]);

    return (
        <Layout>
            <h1>Editar noticia</h1>
            {newsInfo && (
                <NewsForm {...newsInfo}/>
            )}
        </Layout>
    );
}