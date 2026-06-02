import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { NysUnavHeader } from './wrappers/NysUnavHeader';
import { NysGlobalHeader } from './wrappers/NysGlobalHeader';
import { NysGlobalFooter } from './wrappers/NysGlobalFooter';
import { NysUnavFooter } from './wrappers/NysUnavFooter';
import { NysButton } from './wrappers/NysButton';
import { NysAvatar } from './wrappers/NysAvatar';

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    const el = document.querySelector<HTMLElement>('h1, h2');
    if (el) {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus();
    }
  }, [location.pathname]);

  return (
    <>
      <NysUnavHeader hideSearch hideTranslate />
      <NysGlobalHeader appName="Responsible AI Safety and Education (RAISE) Act">
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/user-management">User Management</a></li>
        </ul>
          <NysButton
          slot="user-actions"
          label="User Name"
          prefixIcon="slotted"
        >
          
          <NysAvatar
            slot="prefix-icon"
            ariaLabel="User avatar"
            initials="NY"
          />
        </NysButton>
      </NysGlobalHeader>
      <main id="main-content">
        <Outlet />
      </main>
      <NysGlobalFooter agencyName="Responsible AI Safety and Education (RAISE) Act" />
      <NysUnavFooter />
    </>
  );
}
