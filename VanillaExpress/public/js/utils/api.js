export const api = async (path, {method = "GET", body = undefined, headers, credentials = 'omit'} = {}) => {
    return await fetch(`http://localhost:5000/api/v1${path}`, {
        method,
        headers,
        credentials,
        body: typeof body === 'object' ? JSON.stringify(body) : undefined
    });
}