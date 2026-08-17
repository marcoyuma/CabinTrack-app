// Browser-native replacement for the sharp-based pipeline documented in
// ADMIN-PANEL-CONTEXT.md § "Kontrak upload gambar" (that doc assumes a Node server; this repo
// is a pure Vite SPA with no server, so the same steps — resize to a 2560px max side without
// upscaling, apply-then-strip EXIF orientation, encode WebP q80, and a 16px WebP q20 blur
// placeholder — are done here with the Canvas API instead of sharp).
//
// Pure function, no Supabase/React imports, so it can be tested in isolation from a real File.

const MAX_DIMENSION = 2560;
const BLUR_WIDTH = 16;
const MAIN_QUALITY = 0.8;
const BLUR_QUALITY = 0.2;

export interface ProcessedImageResult {
    mainBlob: Blob;
    width: number;
    height: number;
    blurDataUrl: string;
}

const canvasToWebpBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Could not encode image to WebP"));
                    return;
                }
                resolve(blob);
            },
            "image/webp",
            quality,
        );
    });

const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Could not read blur thumbnail"));
        reader.readAsDataURL(blob);
    });

const drawToCanvas = (
    source: CanvasImageSource,
    width: number,
    height: number,
): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context is not available");
    ctx.drawImage(source, 0, 0, width, height);
    return canvas;
};

export async function processStayImage(file: File): Promise<ProcessedImageResult> {
    // imageOrientation: "from-image" applies the EXIF rotation tag then discards it — the same
    // net effect as sharp().rotate(). See processStayImage's caller/docs for the Safari-support
    // caveat that should be verified against real staff devices before relying on this broadly.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

    try {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const mainCanvas = drawToCanvas(bitmap, width, height);
        const mainBlob = await canvasToWebpBlob(mainCanvas, MAIN_QUALITY);

        // Draw from the already-resized canvas, not the original bitmap — cheaper, and the
        // blur placeholder doesn't need full-resolution source detail anyway.
        const blurHeight = Math.round((BLUR_WIDTH * height) / width);
        const blurCanvas = drawToCanvas(mainCanvas, BLUR_WIDTH, blurHeight);
        const blurBlob = await canvasToWebpBlob(blurCanvas, BLUR_QUALITY);
        const blurDataUrl = await blobToDataUrl(blurBlob);

        return { mainBlob, width, height, blurDataUrl };
    } finally {
        bitmap.close();
    }
}
