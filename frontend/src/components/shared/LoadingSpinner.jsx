import { Center, Loader } from '@mantine/core';

function LoadingSpinner() {
    return (
        <Center h={200}>
            <Loader size='lg' />
        </Center>
    );
}

export default LoadingSpinner;
