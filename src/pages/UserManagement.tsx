import { useState } from 'react';
import { NysTable } from '../components/wrappers/NysTable';
import { NysPagination } from '../components/wrappers/NysPagination';
import '../styles/app.scss';
import { NysButton } from '../components/wrappers/NysButton';

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div id="user-management">
      <div className="header">      
        <h2>Manage Users</h2>
        <NysButton variant="outline" label="Add User"></NysButton>
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
    </div>
  );
}
