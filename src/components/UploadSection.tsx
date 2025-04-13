"use client";

import { useState } from "react";

export default function UploadSection() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = async (files: FileList) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();

        formData.append("image", files[0]);

        try {
            const response = await fetch(
                "https://multi-media-server.naimurrhman.com/api/v1/uploadImg",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to upload image: ${response.status}`);
            }

            const data = await response.json();
            // We'll handle adding the new image via the parent component
            window.dispatchEvent(
                new CustomEvent("imageUploaded", { detail: data.data.url })
            );
            setError(null);
        } catch (err) {
            console.error("Error uploading image:", err);
            setError("Failed to upload image. Please try again later.");
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target?.files?.length > 0) {
            handleUpload(e.target.files);
        }
    };

    return (
        <>
            {/* Upload Section */}
            <div className="mb-12 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex flex-col items-center justify-center text-center mb-6">
                    <span className="inline-block p-3 rounded-full bg-blue-500 bg-opacity-20 mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </span>
                    <h2 className="text-xl md:text-2xl font-semibold mb-2">
                        Upload Media Files
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        Drag and drop your images or click to browse your files
                    </p>
                </div>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="max-w-2xl mx-auto"
                >
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out ${
                            dragActive
                                ? "border-blue-400 bg-blue-500 bg-opacity-10"
                                : "border-gray-600 hover:border-gray-400"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                            disabled={uploading}
                        />
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-gray-400 group-hover:text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                )}
                            </div>
                            <p className="text-base text-gray-300 mb-2">
                                {uploading
                                    ? "Uploading..."
                                    : "Drag & drop an image here or click to browse"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Supported formats: JPEG, PNG, GIF, etc.
                            </p>
                        </div>
                    </div>
                </form>
            </div>

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
        </>
    );
}
