import "../styles/app.scss";
import { useState } from "react";
import { NysButton } from "../components/wrappers/NysButton";
import { NysTextinput } from "../components/wrappers/NysTextinput";
import { NysSelect } from "../components/wrappers/NysSelect";
import { NysCheckbox } from "../components/wrappers/NysCheckbox";
import { NysFileinput } from "../components/wrappers/NysFileinput";
import { NysDivider } from "../components/wrappers/NysDivider";

interface FormDataType {
  legalName: string;
  country: string;
  streetAddress: string;
  suiteUnit: string;
  stateProvince: string;
  townCity: string;
  zipCode: string;
  pointOfContactFirstName: string;
  pointOfContactLastName: string;
  pointOfContactJobTitle: string;
  pointOfContactPhone: string;
  pointOfContactEmail: string;
  supervisorFirstName: string;
  supervisorLastName: string;
  supervisorJobTitle: string;
  supervisorPhone: string;
  supervisorEmail: string;
  files: File[];
  certification: boolean;
}

export default function UserAuthorizationForm() {
  const [formData, setFormData] = useState<FormDataType>({
    legalName: "",
    country: "",
    streetAddress: "",
    suiteUnit: "",
    stateProvince: "",
    townCity: "",
    zipCode: "",
    pointOfContactFirstName: "",
    pointOfContactLastName: "",
    pointOfContactJobTitle: "",
    pointOfContactPhone: "",
    pointOfContactEmail: "",
    supervisorFirstName: "",
    supervisorLastName: "",
    supervisorJobTitle: "",
    supervisorPhone: "",
    supervisorEmail: "",
    files: [],
    certification: false,
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.detail.value,
    }));
  };

  const handleCheckboxChange = (e: any) => {
    const { name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.detail.checked,
    }));
  };

  const handleFileChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      files: Array.from(e.detail.files || []),
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="nys-grid-container">
      <div className="nys-grid-row">
        <div className="nys-grid-col-12 nys-margin-y-400 user-auth-form">
          <h1>Request Authorization</h1>
          <p>Complete and submit the form below to request authorization.</p>
          <NysDivider />
          <form onSubmit={handleSubmit}>
            {/* Entity Information */}
            <div className="form-section">
              <h3>Entity Information</h3>
              <NysTextinput
                id="legalName"
                name="legalName"
                label="Legal Name of Entity"
                width="lg"
                value={formData.legalName}
                onNysInput={handleInputChange}
              />
              <NysSelect
                id="country"
                name="country"
                label="Country"
                width="lg"
                value={formData.country}
                onNysChange={handleSelectChange}
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
              </NysSelect>
              <NysTextinput
                id="streetAddress"
                name="streetAddress"
                label="Street Address"
                width="lg"
                value={formData.streetAddress}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="suiteUnit"
                name="suiteUnit"
                label="Suite/Unit"
                width="lg"
                value={formData.suiteUnit}
                onNysInput={handleInputChange}
              />
              <NysSelect
                id="stateProvince"
                name="stateProvince"
                label="State/Province/Region"
                width="sm"
                value={formData.stateProvince}
                onNysChange={handleSelectChange}
              >
                <option value="">Select State</option>
              </NysSelect>
              <NysTextinput
                id="townCity"
                name="townCity"
                label="Town/City/Locality"
                width="md"
                value={formData.townCity}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="zipCode"
                name="zipCode"
                label="Zip/Postal Code"
                width="md"
                value={formData.zipCode}
                onNysInput={handleInputChange}
              />
            </div>
            <NysDivider />
            {/* Point of Contact */}
            <div className="form-section">
              <h3>Point of Contact</h3>
              <p>
                This contact is responsible for receiving inquiries from the
                office or other governmental entities.
              </p>
              <NysTextinput
                id="pointOfContactFirstName"
                name="pointOfContactFirstName"
                label="First Name"
                width="lg"
                value={formData.pointOfContactFirstName}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="pointOfContactLastName"
                name="pointOfContactLastName"
                label="Last Name"
                width="lg"
                value={formData.pointOfContactLastName}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="pointOfContactJobTitle"
                name="pointOfContactJobTitle"
                label="Job Title"
                width="md"
                value={formData.pointOfContactJobTitle}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="pointOfContactPhone"
                name="pointOfContactPhone"
                label="Business Phone Number"
                type="tel"
                width="md"
                value={formData.pointOfContactPhone}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="pointOfContactEmail"
                name="pointOfContactEmail"
                label="Business Email"
                type="email"
                width="md"
                value={formData.pointOfContactEmail}
                onNysInput={handleInputChange}
              />
            </div>
            <NysDivider />
            {/* Supervisor / Approving Official */}
            <div className="form-section">
              <h3>Supervisor / Approving Official</h3>
              <NysTextinput
                id="supervisorFirstName"
                name="supervisorFirstName"
                label="First Name"
                width="lg"
                value={formData.supervisorFirstName}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="supervisorLastName"
                name="supervisorLastName"
                label="Last Name"
                width="lg"
                value={formData.supervisorLastName}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="supervisorJobTitle"
                name="supervisorJobTitle"
                label="Job Title"
                width="md"
                value={formData.supervisorJobTitle}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="supervisorPhone"
                name="supervisorPhone"
                label="Business Phone Number"
                type="tel"
                width="md"
                value={formData.supervisorPhone}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="supervisorEmail"
                name="supervisorEmail"
                label="Business Email"
                type="email"
                width="md"
                value={formData.supervisorEmail}
                onNysInput={handleInputChange}
              />
            </div>
            <NysDivider />
            {/* Supporting Documentation */}
            <div className="form-section">
              <NysFileinput
                label="Supporting Documentation"
                description="Upload any required supporting documents for this submission.
You can upload PDF, JPG, or PNG files up to 10MB each"
                id="files"
                name="files"
                multiple
                dropzone
                onNysChange={handleFileChange}
              />
            </div>

            {/* Certification */}
            <div className="form-section">
              <h3>Certification</h3>
              <NysCheckbox
                id="certification"
                name="certification"
                label="I certify that the information provided in this submission is true, complete, and current to the best of my knowledge."
                checked={formData.certification}
                onNysChange={handleCheckboxChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="nys-grid-row nys-margin-y-400">
              <div
                className="nys-grid-col-12"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "var(--nys-space-250)",
                }}
              >
                <NysButton type="button" variant="text" label="Back" />
                <NysButton type="submit" label="Submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
