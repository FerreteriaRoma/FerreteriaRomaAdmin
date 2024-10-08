// Importaciones
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Swal from "sweetalert2";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category:assignedCategory,
}) {
    // Definicion de estados locales para el formulario del producto.
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    // Efecto para obtener categorias de la API al montar el componente
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get('/api/categories'); // Llama a la API para obtener categorias
                setCategories(response.data); // Almacena las categorias en el estado
            } catch (err) {
                console.error('Error fetching categories:', err); // Maneja errores si la llamada falla
            }
        }

        fetchCategories(); // Llama a la funcion para obtener categorias
    }, []); // Array vacío para evitar llamadas infinitas a la API

    // Efecto para redirigir a la lista de productos si se ha guardado un producto
    useEffect(() => {
        if (goToProducts) {
            router.push('/products'); // Redirige a la pagina de productos
        }
    }, [goToProducts]);

    // Funcion para guardar el producto
    async function saveProduct(ev) {
        ev.preventDefault(); // Previene el comportamiento por defecto del formulario
        const data = { title, description, price, images, category: category || null }; // Crea un objeto de datos para enviar 

        try {
            if (_id) {
                await axios.put('/api/products', { ...data, _id }); // Si existe un ID, actualiza el producto
            } else {
                await axios.post('/api/products', data); // Si no, crea un nuevo producto
            }
            Swal.fire({
                title: 'Producto guardado exitosamente',
                icon: 'success',
                confirmButtonText: 'OK' // Muestra una alerta de exito
            });
            setSuccess(true); // Marca la operacion como exitosa
            setTitle(''); // Limpia el campo de titulo
            setDescription(''); // Limpia el campo de descripcion
            setPrice(''); // Limpia el campo de precio
            setGoToProducts(true); // Indica que se debe redirigir
            setError(null); // Resetea el estado de error
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'Error guardando el producto',
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
                    text: 'Error uploading images. Please try again.',
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
        <form onSubmit={saveProduct}>
            <label>Nombre del producto</label>
            <input 
                type="text" 
                placeholder="Nombre del producto" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} 
            />
            <label>Categoria</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">Sin categoria</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
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
            <label>Descripción</label>
            <textarea 
                placeholder="Descripción" 
                value={description}
                onChange={ev => setDescription(ev.target.value)} 
            />
            <label>Precio</label>
            <input 
                type="text" 
                placeholder="Precio"
                value={price}
                onChange={ev => setPrice(ev.target.value)} 
            />
            <button type="submit" className="btn-primary">
                Guardar
            </button>
            {success && <p>Product saved successfully</p>}
            {error && <p>{error}</p>}
        </form>
    );
}
