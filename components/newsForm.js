// Importaciones
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Swal from "sweetalert2";

export default function NewsForm({
    _id,
    title: existingTitle,
    entrance: existingEntrance,
    description: existingDescription,
    images: existingImages,
}) {
    // Definicion de estados locales para el formulario de la noticia
    const [title, setTitle] = useState(existingTitle || '');
    const [entrance, setEntrance] = useState(existingEntrance || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [images, setImages] = useState(existingImages || []);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [goToNews, setGoToNews] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    // Efecto para redirigir a la lista de noticias si se ha guardado un noticia
    useEffect(() => {
        if (goToNews) {
            router.push('/news'); // Redirige a la pagina de noticia
        }
    }, [goToNews]);

    // Funcion para guardar la noticia
    async function saveNews(ev) {
        ev.preventDefault(); // Previene el comportamiento por defecto del formulario
        const data = { title, entrance, description, images }; // Crea un objeto de datos para enviar 

        try {
            if (_id) {
                await axios.put('/api/news', { ...data, _id }); // Si existe un ID, actualiza el producto
            } else {
                await axios.post('/api/news', data); // Si no, crea una nueva noticia
            }
            Swal.fire({
                title: 'Notica guardada exitosamente',
                icon: 'success',
                confirmButtonText: 'OK' // Muestra una alerta de exito
            });
            setSuccess(true); // Marca la operacion como exitosa
            setTitle(''); // Limpia el campo de titulo
            setDescription(''); // Limpia el campo de descripcion
            setGoToNews(true); // Indica que se debe redirigir
            setError(null); // Resetea el estado de error
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Error guardando la noticia',
                icon: 'error',
                confirmButtonText: 'OK' // Muestra una alerta de error
            });
            console.error(err); // Imprime el error en consola
        }
        setSuccess(false); // Resetea el estado de exito
    }
 
    // Funcion para manejar la subida de imagenes
    async function uploadImages(ev) {
        const files = ev.target?.files; // Obtiene archivos seleccionados
        if (files?.length > 0) { 
            setIsUploading(true); // Indica que se esta subiendo imagenes
            const data = new FormData();
            for (const file of files) {
                data.append('file', file); // Agrega cada archivo al FormData
            }
            try {
                const res = await axios.post('/api/upload', data); // Envia la solicitud de subida de imagenes
                setImages(oldImages => [...oldImages, ...res.data.links]); // Añade las imagenes a la lista existente
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error subiendo la imagen',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                console.error(err);
            }
            setIsUploading(false);
        }
    }

    // Funcion para actualizar el orden de las imagenes
    function updateImagesOrder(images) {
        setImages(images); // Actualiza el estado con el nuevo orden de imagenes
    }

    // Render del componente
    return (
        <form onSubmit={saveNews}>
            <label>Titulo de la noticia</label>
            <input 
                type="text" 
                placeholder="Titulo de la noticia" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} 
            />
            <label>Entradilla de la noticia</label>
            <input 
                type="text"
                placeholder="Entradilla de la noticia"
                value={entrance}
                onChange={ev => setEntrance(ev.target.value)}
            />
            <label>Descripción</label>
            // Reemplaza el textarea actual por este bloque
            <div style={{position: 'relative'}}>
              <textarea 
                placeholder="Descripción" 
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                style={{whiteSpace: 'pre-line', minHeight: '200px'}}
                />
              <button 
                type="button"
                onClick={() => setDescription(prev => prev + '**Texto en negrita**')}
                style={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                padding: '5px 10px',
                background: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
            >
            Negrita
            </button>
        </div>
            <label>Imagenes</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable 
                    list={images} 
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                    {!!images.length && images.map(link => (
                        <div key={link} className="h-24">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer border text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Subir</div>
                    <input type="file" onChange={uploadImages} className="hidden"></input>
                </label>
            </div>
            <button type="submit" className="btn-primary">
                Guardar
            </button>
            {success && <p>Product saved successfully</p>}
            {error && <p>{error}</p>}
        </form>
    );
}
