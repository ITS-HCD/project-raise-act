import { NysButton } from '../components/wrappers/NysButton';
import { NysDivider } from '../components/wrappers/NysDivider';
import '../styles/app.scss';

export default function UserAuthentication() {
  return (
    <div id="user-authentication" className="nys-grid-container">
      <div className="nys-grid-row">
        <div className="nys-grid-col-12 nys-margin-y-400 user-auth-signin">
          <h2>Responsible AI Safety and Education (RAISE) Act</h2>
          <p>This site is for large frontier companies to submit a disclosure statement to comply with New York State requirements.</p>
          <div className='nygov-card'>
            <div>
              <h2 id="nygov-header">NY.GOV ID</h2>
              </div>
            <NysButton label="Sign in" fullWidth></NysButton>
            <NysButton label="Find my account" variant="outline" fullWidth></NysButton>
            <NysDivider />
            <div>
              <p>First time using NY.GOV ID?</p>
              <NysButton label="Create an account" variant="text"></NysButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
