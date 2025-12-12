import { notifications } from '@mantine/notifications';

export function showSuccess(message, title = 'Success') {
    notifications.show({ title, message, color: 'green' });
}

export function showError(
    error,
    title = 'Error',
    fallbackMessage = 'An error occurred'
) {
    notifications.show({
        title,
        message: error?.message || fallbackMessage,
        color: 'red',
    });
}
