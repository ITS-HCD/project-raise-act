import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { NysUnavHeader } from './wrappers/NysUnavHeader';
import { NysGlobalHeader } from './wrappers/NysGlobalHeader';
import { NysGlobalFooter } from './wrappers/NysGlobalFooter';
import { NysUnavFooter } from './wrappers/NysUnavFooter';
import { NysButton } from './wrappers/NysButton';
import { NysAvatar } from './wrappers/NysAvatar';
import { NysDropdownMenu } from './wrappers/NysDropdownMenu';
import { NysDropdownMenuItem } from './wrappers/NysDropdownMenuItem';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.querySelector<HTMLElement>('h1, h2');
    if (el) {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('authed');
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      <NysUnavHeader hideSearch hideTranslate />
      <NysGlobalHeader appName="Responsible AI Safety and Education (RAISE) Act">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/user-management">User Management</Link></li>
        </ul>
        <div slot="user-actions" style={{ display: 'flex', alignItems: 'center' }}>
          <NysButton
            id="user-menu-trigger"
            label="User Name"
            prefixIcon="slotted"
          >
            <NysAvatar
              slot="prefix-icon"
              initials="NY"
            />
          </NysButton>
          <NysDropdownMenu for="user-menu-trigger">
            <NysDropdownMenuItem label="Sign out" onClick={handleLogout} />
          </NysDropdownMenu>
        </div>
      </NysGlobalHeader>
      <main id="main-content">
        <Outlet />
      </main>
      <NysGlobalFooter agencyName="Responsible AI Safety and Education (RAISE) Act" />
      <NysUnavFooter />
    </>
  );
}
