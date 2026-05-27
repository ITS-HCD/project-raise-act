import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import AppShell from './components/AppShell';
import BusinessInfo from './steps/01-BusinessInfo';
import Addresses from './steps/02-Addresses';
import Ownership from './steps/03-Ownership';
import Contacts from './steps/04-Contacts';
import ReviewCertify from './steps/05-ReviewCertify';
import SuccessPage from './steps/06-SuccessPage';

export default function App() {
  return (
    <RegistrationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register/business-info" replace />} />
        <Route path="/register/success" element={<SuccessPage />} />
        <Route path="/register" element={<AppShell />}>
          <Route index element={<Navigate to="/register/business-info" replace />} />
          <Route path="business-info" element={<BusinessInfo />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="ownership" element={<Ownership />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="review" element={<ReviewCertify />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </RegistrationProvider>
  );
}
