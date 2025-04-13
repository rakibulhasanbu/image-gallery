import GalleryClient from "@/components/GalleryClient";
import UploadSection from "@/components/UploadSection";
import { getImages } from "@/lib/api";

export default async function Home() {
    // Fetch images on the server
    const images = await getImages();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl text-center font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    WEB BANT MEDIA
                </h1>

                {/* Upload Section - Client Component */}
                <UploadSection />

                {/* Gallery - Client Component with Server-Fetched Data */}
                <GalleryClient initialImages={images} />
            </div>
        </div>
    );
}
