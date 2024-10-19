import mongoose, { Schema, model, models } from 'mongoose';

// Define el esquema de la noticia
const NewsSchema = new Schema({
    title: { type: String, required: true },
    entrance: { type: String},
    description: { type: String, required: true },
    images: [{ type: String }] // El campo de imágenes no es obligatorio, por lo que no es necesario `required: false`
}, {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
});

// Exporta el modelo de la noticia, reutilizando el modelo si ya ha sido definido
export const News = models.News || model('News', NewsSchema);
