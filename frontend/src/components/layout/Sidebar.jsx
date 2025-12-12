import { NavLink } from 'react-router-dom';
import { Stack, UnstyledButton, Group, Text, Box } from '@mantine/core';
import { IconLayoutDashboard, IconBox, IconBooks } from '@tabler/icons-react';

const navLinks = [
    { to: '/', label: 'Dashboard', icon: IconLayoutDashboard },
    { to: '/vaults', label: 'Vaults', icon: IconBox },
    { to: '/comics', label: 'Comics', icon: IconBooks },
];

function Sidebar() {
    return (
        <Box h='100%' display='flex' style={{ flexDirection: 'column' }}>
            {/* Main navigation */}
            <Stack gap='xs' style={{ flex: 1 }}>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        style={{ textDecoration: 'none' }}
                    >
                        {({ isActive }) => (
                            <UnstyledButton
                                w='100%'
                                p='sm'
                                style={{
                                    borderRadius: '8px',
                                    backgroundColor: isActive
                                        ? '#228be6'
                                        : 'transparent',
                                    color: isActive ? 'white' : '#495057',
                                    transition: 'background-color 150ms ease',
                                }}
                                styles={{
                                    root: {
                                        '&:hover': {
                                            backgroundColor: isActive
                                                ? '#1c7ed6'
                                                : '#f1f3f5',
                                        },
                                    },
                                }}
                            >
                                <Group gap='sm'>
                                    <link.icon size={20} stroke={1.5} />
                                    <Text size='sm' fw={500}>
                                        {link.label}
                                    </Text>
                                </Group>
                            </UnstyledButton>
                        )}
                    </NavLink>
                ))}
            </Stack>
        </Box>
    );
}

export default Sidebar;
