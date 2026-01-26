import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ConnectPage from '@/pages/ConnectPage';
import ChatPage from '@/pages/ChatPage';
import AccountsPage from '@/pages/AccountsPage';
import MovementPage from '@/pages/MovementPage';
import ProxiesPage from '@/pages/ProxiesPage';
import SettingsPage from '@/pages/SettingsPage';
import CreditsPage from '@/pages/CreditsPage';
import DashboardPage from '@/pages/DashboardPage';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<ConnectPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="movement" element={<MovementPage />} />
        <Route path="proxies" element={<ProxiesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="credits" element={<CreditsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
