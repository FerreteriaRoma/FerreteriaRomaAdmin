import { mongooseConnect } from "@/lib/mongoose";
import { News } from "@/models/News";

export default async function handle(req, res) {
    const { method } = req;
    const { id } = req.query;  // Solo req.query ya que estamos usando query params en Next.js

    try {
        await mongooseConnect();

        switch (method) {
            case 'GET':
                if (id) {
                    const news = await News.findById(id);
                    if (!news) {
                        return res.status(404).json({ error: 'News not found' });
                    }
                    return res.status(200).json(news);
                } else {
                    const newsList = await News.find();
                    return res.status(200).json(newsList);
                }

            case 'POST':
                const { title, entrance, description, images } = req.body;
                if (!title || !entrance || !description ) {
                    return res.status(400).json({ error: 'Title, entrace and description are required' });
                }
                const newsDoc = await News.create({ title, entrance, description, images });
                return res.status(201).json(newsDoc);

            case 'PUT':
                const { _id, title: updatedTitle, entrance: updateEntrance, description: updatedDescription, images: updatedImages } = req.body;
                if (!_id || !updatedTitle || !updateEntrance || !updatedDescription) {
                    return res.status(400).json({ error: 'ID, title, and description are required' });
                }
                const updatedNews = await News.findByIdAndUpdate(_id, { title: updatedTitle, entrance: updateEntrance, description: updatedDescription, images: updatedImages }, { new: true });
                if (!updatedNews) {
                    return res.status(404).json({ error: 'News not found' });
                }
                return res.status(200).json(updatedNews);

            case 'DELETE':
                if (!id) {
                    return res.status(400).json({ error: 'ID is required to delete news' });
                }
                const deletedNews = await News.findByIdAndDelete(id);
                if (!deletedNews) {
                    return res.status(404).json({ error: 'News not found' });
                }
                return res.status(200).json({ message: 'News deleted successfully' });

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
