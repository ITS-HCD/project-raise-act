import "../styles/app.scss";
import { useNavigate } from "react-router-dom";
import { NysButton } from "../components/wrappers/NysButton";
import { NysAlert } from "../components/wrappers/NysAlert";

export default function UserAuthorizationConfirmation() {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate("/user-authorization");
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="nys-grid-container">
      <div className="nys-grid-row">
        <div className="nys-grid-col-12 nys-margin-y-400 user-auth-confirmation">
          <NysAlert
            type="success"
            heading="Your authorization request was successfully submitted!"
            text={`Your authorization request for the RAISE System has been received on ${formattedDate}.`}
          />
          <div>
            <p>
              <strong>
                A confirmation email has been sent to marsaijoe@marsai.com.
              </strong>
            </p>
            <p>
              <strong>Authorization Request ID:</strong>{" "}
              [authorization_request_id]
            </p>
            <br />
            <p>
              New York State is currently reviewing your authorization request
              and will update you when the status of your request has changed,
              or to request additional information.
            </p>
          </div>
          <NysButton
            label="Return to dashboard"
            onClick={handleReturnToDashboard}
          />
        </div>
      </div>
    </div>
  );
}
