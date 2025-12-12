import { useState } from 'react';
import {
    Container,
    Title,
    Button,
    Group,
    Stack,
    TextInput,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { comicApi } from '../api/comics';
import ComicList from '../components/comics/ComicList';
import ComicForm from '../components/comics/ComicForm';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorAlert from '../components/shared/ErrorAlert';

function ComicsPage() {
    const [formComic, setFormComic] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const queryClient = useQueryClient();

    // Fetch all comics and cache result
    const {
        data: comics,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['comics'],
        queryFn: comicApi.getAll,
    });

    const handleClose = () => {
        setFormComic(null);
    };

    // Invalidate query to refetch comics
    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['comics'] });
        handleClose();
    };

    // Client-side filtering of comics by search query
    const filteredComics = comics?.filter(
        (comic) =>
            comic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comic.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error.message} />;

    return (
        <Container size='xl'>
            <Stack gap='md'>
                <Group justify='space-between'>
                    <Title order={2}>Comics</Title>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setFormComic({})}
                    >
                        New Comic
                    </Button>
                </Group>

                <TextInput
                    placeholder='Search by name, SKU, or description...'
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <ComicList
                    comics={filteredComics}
                    onEdit={(comic) => setFormComic(comic)}
                />

                <ComicForm
                    opened={formComic !== null}
                    comic={formComic?.id ? formComic : null}
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                />
            </Stack>
        </Container>
    );
}

export default ComicsPage;
