import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import MainLayout from './components/MainLayout';
import AppShell from './components/AppShell';
import LandingPage from './pages/00-LandingPage';
import BusinessInfo from './pages/01-BusinessInfo';
import Addresses from './pages/02-Addresses';
import Ownership from './pages/03-Ownership';
import Contacts from './pages/04-Contacts';
import ReviewCertify from './pages/05-ReviewCertify';
import SuccessPage from './pages/06-SuccessPage';
import UserManagement from './pages/UserManagement';
import UserAuthorizationLogin from './pages/UserAuthorization-Login';
import UserAuthorizationForm from './pages/UserAuthorization-Form';

export default function App() {
  return (
    <RegistrationProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register/success" element={<SuccessPage />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user-authentication" element={<UserAuthorizationLogin />} />
          <Route path="/user-authentication/form" element={<UserAuthorizationForm />} />
          <Route path="/register" element={<AppShell />}>
            <Route index element={<Navigate to="/register/business-info" replace />} />
            <Route path="business-info" element={<BusinessInfo />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="ownership" element={<Ownership />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="review" element={<ReviewCertify />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </RegistrationProvider>
  );
}
