const DEFAULT_BACKEND_URL = "http://127.0.0.1:5000";

export function getBackendUrl() {
    return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;
}