import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

function ErrorAlert({ message }) {
    return (
        <Alert
            icon={<IconAlertCircle size={16} />}
            title='Error'
            color='red'
            mb='md'
        >
            {message || 'An unexpected error occurred'}
        </Alert>
    );
}
export default ErrorAlert;
