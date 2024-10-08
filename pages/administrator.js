import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export default function Administrator() {
    const [administrators, setAdministrators] = useState([]);

    useEffect(() => {
        axios.get('/api/admins').then(response => {
            setAdministrators(response.data);
        }).catch(error => {
            console.error("Error fetching administrators:", error);
        });
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ED1C24',
            cancelButtonColor: '#6D6E71',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/admins/${id}`)
                    .then(() => {
                        setAdministrators(administrators.filter(admin => admin._id !== id));
                        Swal.fire(
                            'El administrador ha sido eliminado.',
                            '',
                            'success'
                        );
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al eliminar el administrador.',
                            'error'
                        );
                        console.error("Error deleting administrator:", error);
                    });
            }
        });
    };

    return (
        <Layout>
            <Link className="bg-rojoM text-white rounded-md py-1 px-2" href={'/administrator/new'}>
                Agregar un nuevo administrador
            </Link>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Nombre del administrador</td>
                        <td>Email del administrador</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {administrators.map((administrator) => (
                        <tr key={administrator._id}>
                            <td>{administrator.name}</td>
                            <td>{administrator.email}</td>
                            <td>
                                <button onClick={() => handleDelete(administrator._id)} className="btn-primary flex ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 ml-1 mt-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
