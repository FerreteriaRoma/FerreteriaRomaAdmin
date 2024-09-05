// Importaciones
import multiparty from 'multiparty';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import fs from 'fs';
import mime from 'mime-types'
import { mongooseConnect } from '@/lib/mongoose';

const bucketName = 'dawid-next-ecommers';

export default async function handle(req, res) {
    await mongooseConnect();

    const form = new multiparty.Form();
    const {fields, files} = await new Promise((resolve, reject) => {
        form.parse(req, (err, flieds, files) => {
            if (err) throw err;
            resolve({flieds, files});
        });
    });

    // Intancia del cliente S3
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });

    const links = []; // Array para almacenar las URLs de los archivos subidos
 
    // Itera sobre los archivos recibidos
    for (const file of files.file) {
        const ext = file.originalFilename.split('.').pop(); // Obtiene la extencion del archivo
        const newFilename = Date.now() + '.' + ext; // Genera un nuevo nombre para el archivo basado en la marca de tiempo actual

        // Envia el archivo a S3 con la configuracion especificada
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path),
        }));

        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`; // URL publica del archivo en S3
        links.push(link);
    }
    return res.json({links});
}
// Configuracion del API
export const config = {
    api: {bodyParser: false}
};