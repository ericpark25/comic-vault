import ky from 'ky';

// Base API client configured with default options
export const apiClient = ky.create({
    prefixUrl: '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    hooks: {
        beforeError: [
            async (error) => {
                const { response } = error;
                if (response) {
                    try {
                        // Try to parse Spring Boot error response
                        const errorData = await response.json();
                        error.message =
                            errorData.message ||
                            errorData.error ||
                            response.statusText;
                    } catch {
                        // Fall back to text if JSON parsing fails
                        try {
                            error.message = await response.text();
                        } catch {
                            error.message = response.statusText;
                        }
                    }
                }
                return error;
            },
        ],
    },
});
