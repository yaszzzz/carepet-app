'use server';

import { put, del } from '@vercel/blob';

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Upload file to Vercel Blob storage
 * @param file - File to upload
 * @param folder - Folder path in blob storage
 * @returns Public URL of uploaded file
 */
export async function uploadToBlob(file: File, folder: string): Promise<string> {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 5MB limit');
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const filename = `${folder}/${Date.now()}-${sanitizedName}`;

    const blob = await put(filename, file, {
        access: 'public',
    });

    return blob.url;
}

/**
 * Delete file from Vercel Blob storage
 * Safely ignores if url is not a vercel blob url or empty
 * @param url - URL of the blob to delete
 */
export async function deleteFromBlob(url: string | null | undefined): Promise<void> {
    if (!url) return;

    // Only delete if it's a Vercel Blob URL (contains just the hostname usually, or vercel-storage)
    // Example: https://storeId.public.blob.vercel-storage.com/path/to/file
    if (url.includes('.public.blob.vercel-storage.com')) {
        try {
            await del(url);
        } catch (error) {
            console.error('Failed to delete blob:', url, error);
            // We do not throw here to avoid failing the main operation
        }
    }
}
