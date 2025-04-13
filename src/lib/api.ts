export async function getImages() {
    try {
        const response = await fetch(
            "https://multi-media-server.naimurrhman.com/api/v1/uploadImg",
            { cache: "no-store" } // This ensures we get fresh data
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }

        const data = await response.json();
        return data.data.urls;
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
}
