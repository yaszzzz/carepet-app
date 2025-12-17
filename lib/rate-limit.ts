
const trackers = new Map<string, { count: number; expiresAt: number }>();

/**
 * Simple in-memory rate limiter.
 * @param identifier Unique key for the user/IP (e.g. session user ID)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if rate limited, false otherwise
 */
export function isRateLimited(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();

    // cleanup
    // In a real production serverless env, this shared state might not work as expected (per lambda).
    // But for a VPS/Container or `npm start` it works fine.
    // For proper distribution, use Redis/KV.
    if (Math.random() < 0.1) {
        for (const [key, data] of trackers.entries()) {
            if (data.expiresAt < now) {
                trackers.delete(key);
            }
        }
    }

    if (!trackers.has(identifier)) {
        trackers.set(identifier, { count: 1, expiresAt: now + windowMs });
        return false;
    }

    const tracker = trackers.get(identifier)!;

    // If window expired, reset
    if (now > tracker.expiresAt) {
        trackers.set(identifier, { count: 1, expiresAt: now + windowMs });
        return false;
    }

    tracker.count++;
    if (tracker.count > limit) {
        return true;
    }

    return false;
}
