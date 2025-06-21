const { MODE, VITE_API_URL } = import.meta.env

const protocol = MODE === 'production' ? 'https' : 'http'
const domain = MODE === 'production' ? VITE_API_URL : 'localhost:3000'
const baseUrl = `${protocol}://${domain}`

export const fetchData = async (body, method = 'GET') => {
    try {
        const res = await fetch(`${baseUrl}/join`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        })

        return { res }
    } catch (err) {
        return { err }
    }
}
