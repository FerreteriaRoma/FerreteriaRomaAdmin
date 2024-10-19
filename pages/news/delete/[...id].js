import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [noticeInfo, setNoticeInfo] = useState();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/news?id=' + id).then(response => {
            setNoticeInfo(response.data);
        }).catch(error => {
            console.error('Error fetching product:', error);
        });
    }, [id]);

    function goBack() {
        router.push('/news');
    }

    async function deleteNews() {
        try {
            await axios.delete('/api/news?id=' + id);
            goBack();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    return (
        <Layout>
            <h1 className="text-center">
                Realmente quieres eliminar &nbsp;&quot;{noticeInfo?.title}&quot;?
            </h1>
            <div className="flex gap-2 justify-center">
                <button
                    onClick={deleteNews}
                    className="btn-red">
                    Si, eliminar
                </button>
                <button
                    className="btn-default"
                    onClick={goBack}>
                    No, cancelar
                </button>
            </div>
        </Layout>
    );
}
