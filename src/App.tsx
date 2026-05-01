import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import BusinessInfo from './steps/BusinessInfo';
import Addresses from './steps/Addresses';
import Ownership from './steps/Ownership';
import Contacts from './steps/Contacts';
import Documents from './steps/Documents';
import ReviewCertify from './steps/ReviewCertify';
import SuccessPage from './steps/SuccessPage';

export default function App() {
  return (
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
          <Route path="documents" element={<Documents />} />
          <Route path="review" element={<ReviewCertify />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
