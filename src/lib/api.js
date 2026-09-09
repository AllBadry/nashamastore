export const API_URL = import.meta.env.VITE_API_URL;

export async function fetchApi(path) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_API_KEY,
    },
  });
  const data = await response.json();
  if (data.success) return data.data || [];
  throw new Error(data.message || 'Request failed');
}