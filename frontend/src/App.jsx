import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@mantine/core/styles.css';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import VaultsPage from './pages/VaultsPage';
import ComicsPage from './pages/ComicsPage';
import InventoryPage from './pages/InventoryPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='vaults' element={<VaultsPage />} />
                    <Route path='comics' element={<ComicsPage />} />
                    <Route
                        path='inventory/:vaultId'
                        element={<InventoryPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;
