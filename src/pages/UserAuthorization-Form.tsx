import "../styles/app.scss";
import { useState } from "react";
import { NysButton } from "../components/wrappers/NysButton";
import { NysTextinput } from "../components/wrappers/NysTextinput";
import { NysSelect } from "../components/wrappers/NysSelect";
import { NysCheckbox } from "../components/wrappers/NysCheckbox";
import { NysFileinput } from "../components/wrappers/NysFileinput";

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

          <form onSubmit={handleSubmit}>
            {/* Entity Information */}
            <h3>Entity Information</h3>
            <NysTextinput
              id="legalName"
              name="legalName"
              label="Legal Name of Entity"
              value={formData.legalName}
              onNysInput={handleInputChange}
            />
            <NysSelect
              id="country"
              name="country"
              label="Country"
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
              value={formData.streetAddress}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="suiteUnit"
              name="suiteUnit"
              label="Suite/Unit"
              value={formData.suiteUnit}
              onNysInput={handleInputChange}
            />
            <NysSelect
              id="stateProvince"
              name="stateProvince"
              label="State/Province/Region"
              value={formData.stateProvince}
              onNysChange={handleSelectChange}
            >
              <option value="">Select State</option>
            </NysSelect>
            <NysTextinput
              id="townCity"
              name="townCity"
              label="Town/City/Locality"
              value={formData.townCity}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="zipCode"
              name="zipCode"
              label="Zip/Postal Code"
              value={formData.zipCode}
              onNysInput={handleInputChange}
            />

            {/* Point of Contact */}

            <h3>Point of Contact</h3>
            <p>
              This contact is responsible for receiving inquiries from the
              office or other governmental entities.
            </p>

            <NysTextinput
              id="pointOfContactFirstName"
              name="pointOfContactFirstName"
              label="First Name"
              value={formData.pointOfContactFirstName}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="pointOfContactLastName"
              name="pointOfContactLastName"
              label="Last Name"
              value={formData.pointOfContactLastName}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="pointOfContactJobTitle"
              name="pointOfContactJobTitle"
              label="Job Title"
              value={formData.pointOfContactJobTitle}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="pointOfContactPhone"
              name="pointOfContactPhone"
              label="Business Phone Number"
              type="tel"
              value={formData.pointOfContactPhone}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="pointOfContactEmail"
              name="pointOfContactEmail"
              label="Business Email"
              type="email"
              value={formData.pointOfContactEmail}
              onNysInput={handleInputChange}
            />
            {/* Supervisor / Approving Official */}
            <h3>Supervisor / Approving Official</h3>
            <NysTextinput
              id="supervisorFirstName"
              name="supervisorFirstName"
              label="First Name"
              value={formData.supervisorFirstName}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="supervisorLastName"
              name="supervisorLastName"
              label="Last Name"
              value={formData.supervisorLastName}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="supervisorJobTitle"
              name="supervisorJobTitle"
              label="Job Title"
              value={formData.supervisorJobTitle}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="supervisorPhone"
              name="supervisorPhone"
              label="Business Phone Number"
              type="tel"
              value={formData.supervisorPhone}
              onNysInput={handleInputChange}
            />
            <NysTextinput
              id="supervisorEmail"
              name="supervisorEmail"
              label="Business Email"
              type="email"
              value={formData.supervisorEmail}
              onNysInput={handleInputChange}
            />

            {/* Supporting Documentation */}
            <h3>Supporting Documentation</h3>
            <p>
              Upload any required supporting documents for this submission. You
              can upload PDF, JPG, or PNG files up to 10MB each.
            </p>
            <NysFileinput
              id="files"
              name="files"
              label="Choose files"
              multiple
              onNysChange={handleFileChange}
            />

            {/* Certification */}
            <h3>Certification</h3>
            <NysCheckbox
              id="certification"
              name="certification"
              label="I certify that the information provided in this submission is true, complete, and current to the best of my knowledge."
              checked={formData.certification}
              onNysChange={handleCheckboxChange}
            />

            {/* Action Buttons */}
            <div className="nys-grid-row nys-margin-y-400">
              <div className="nys-grid-col-12">
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
