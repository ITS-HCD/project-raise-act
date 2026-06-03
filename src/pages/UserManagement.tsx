import { useState } from 'react';
import { NysTable } from '../components/wrappers/NysTable';
import { NysPagination } from '../components/wrappers/NysPagination';
import { NysModal } from '../components/wrappers/NysModal';
import { NysButton } from '../components/wrappers/NysButton';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysSelect } from '../components/wrappers/NysSelect';
import { NysOption } from '../components/wrappers/NysOption';
import '../styles/app.scss';

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ firstname: '', lastname: '', role: '', email: '' });

  return (
    <div id="user-management">
      <div className="header">
        <h2>Manage Users</h2>
        <NysButton
          variant="filled"
          label="Add User"
          onClick={() => setShowModal(true)}
        />
      </div>

      <NysTable bordered sortable>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>DFS Approver</td>
              <td>john.doe@ny.gov</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>DFS Approver</td>
              <td>jane.smith@ny.gov</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>Bob Johnson</td>
              <td>DFS Approver</td>
              <td>bob.johnson@ny.gov</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>Alice Williams</td>
              <td>DFS Approver</td>
              <td>alice.williams@ny.gov</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>
      </NysTable>
      <NysPagination
        currentPage={currentPage}
        totalPages={5}
        onNysChange={(e: CustomEvent) => setCurrentPage(e.detail.page)}
      />

      <NysModal
        id="add-user-modal"
        heading="Add New User"
        open={showModal}
        onNysClose={() => setShowModal(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('New user:', formData);
            setShowModal(false);
            setFormData({ firstname: '', lastname: '', role: '', email: '' });
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <NysTextinput
            label="Email address"
            type="email"
            value={formData.email}
            onNysInput={(e: any) => setFormData({ ...formData, email: e.detail.value })}
            required
          />
          <NysTextinput
            label="First name"
            value={formData.firstname}
            onNysInput={(e: any) => setFormData({ ...formData, firstname: e.detail.value })}
            required
          />
          <NysTextinput
            label="Last name"
            value={formData.lastname}
            onNysInput={(e: any) => setFormData({ ...formData, lastname: e.detail.value })}
            required
          />
          <NysSelect
            label="Role"
            value={formData.role}
            onNysChange={(e: any) => setFormData({ ...formData, role: e.detail.value })}
            required
          >
            <NysOption value="">Select a role</NysOption>
            <NysOption value="DFS Approver">DFS Approver</NysOption>
            <NysOption value="Admin">Admin</NysOption>
            <NysOption value="Viewer">Viewer</NysOption>
          </NysSelect>
        </form>
        <div slot="actions">
          <NysButton
            label="Cancel"
            variant="outline"
            onClick={() => setShowModal(false)}
          />
          <NysButton
            label="Add User"
            variant="filled"
            onClick={() => {
              console.log('New user:', formData);
              setShowModal(false);
              setFormData({ firstname: '', lastname: '', role: '', email: '' });
            }}
          />
        </div>
      </NysModal>
    </div>
  );
}
