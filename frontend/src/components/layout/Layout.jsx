import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Group, Title } from '@mantine/core';

import Sidebar from './Sidebar';

function Layout() {
    // Mobile burger menu
    const [opened, setOpened] = useState(false);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: !opened, desktop: false },
            }}
            padding='md'
        >
            <AppShell.Header>
                <Group h='100%' px='md' justify='space-between'>
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened(!opened)}
                            hiddenFrom='sm'
                            size='sm'
                        />
                        <Title order={3}>Comic Vault</Title>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p='md'>
                <Sidebar onNavigate={() => setOpened(false)} />
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
