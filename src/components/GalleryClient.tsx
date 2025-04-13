"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function GalleryClient({
    initialImages,
}: {
    initialImages: string[];
}) {
    const [images, setImages] = useState<string[]>(initialImages);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const refreshImages = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "https://multi-media-server.naimurrhman.com/api/v1/uploadImg"
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch images: ${response.status}`);
            }

            const data = await response.json();
            setImages(data.data.urls);
            setError(null);
        } catch (err) {
            console.error("Error fetching images:", err);
            setError("Failed to load images. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const copyImageUrl = (url: string) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setCopiedUrl(url);
                setTimeout(() => setCopiedUrl(null), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy URL: ", err);
            });
    };

    useEffect(() => {
        // Listen for the custom event when a new image is uploaded
        const handleImageUploaded = (event: CustomEvent) => {
            setImages((prev) => [...prev, event.detail]);
        };

        window.addEventListener(
            "imageUploaded",
            handleImageUploaded as EventListener
        );

        return () => {
            window.removeEventListener(
                "imageUploaded",
                handleImageUploaded as EventListener
            );
        };
    }, []);

    return (
        <>
            {/* Error Display */}
            {error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mb-4"></div>
                    <p className="text-gray-400">Loading your gallery...</p>
                </div>
            )}

            {/* Gallery Grid */}
            {!loading && images.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium flex items-center">
                            <span className="mr-2">Your Gallery</span>
                            <span className="text-sm bg-gray-700 rounded-full px-2 py-0.5 text-gray-300">
                                {images?.length}{" "}
                                {images?.length === 1 ? "image" : "images"}
                            </span>
                        </h2>
                        <button
                            onClick={refreshImages}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {images
                            ?.sort()
                            .reverse()
                            .map((url) => (
                                <div
                                    key={url}
                                    className="group relative overflow-hidden rounded-lg bg-gray-800 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                                    onClick={() => copyImageUrl(url)}
                                >
                                    <div className="aspect-w-16 aspect-h-10 relative overflow-hidden">
                                        <Image
                                            src={url}
                                            alt="Gallery image"
                                            className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                                            unoptimized={true}
                                            width={720}
                                            height={480}
                                        />

                                        {/* Overlay with copy icon */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-200 truncate max-w-[80%]">
                                                    {url}
                                                </span>
                                                <span className="bg-white bg-opacity-20 backdrop-blur-sm p-1.5 rounded-md">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Copied notification */}
                                        {copiedUrl === url && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-all">
                                                <div className="bg-white text-black px-4 py-2 rounded-md font-medium flex items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 mr-2 text-green-600"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    URL Copied!
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && images.length === 0 && (
                <div className="text-center py-12 bg-gray-800 bg-opacity-30 rounded-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-gray-600 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">No images yet</h3>
                    <p className="text-gray-400 mb-6">
                        Upload your first image to get started
                    </p>
                    <button
                        onClick={refreshImages}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Refresh Gallery
                    </button>
                </div>
            )}
        </>
    );
}
