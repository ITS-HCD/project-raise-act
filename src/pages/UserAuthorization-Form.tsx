import "../styles/app.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NysButton } from "../components/wrappers/NysButton";
import { NysTextinput } from "../components/wrappers/NysTextinput";
import { NysSelect } from "../components/wrappers/NysSelect";
import { NysCheckbox } from "../components/wrappers/NysCheckbox";
import { NysFileinput } from "../components/wrappers/NysFileinput";
import { NysDivider } from "../components/wrappers/NysDivider";

// Country list mirrors the principal-address selector on Step 2 (Addresses) so
// the two address experiences stay consistent.
const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "CN", label: "China" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "SG", label: "Singapore" },
  { value: "OTHER", label: "Other" },
];

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "AS", label: "American Samoa" },
  { value: "GU", label: "Guam" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "PR", label: "Puerto Rico" },
  { value: "VI", label: "U.S. Virgin Islands" },
];

// Phone country codes mirror the contact phone selector on Step 4 (Contacts).
// Labels lead with the dial code so the prefix stays visible in the narrow
// select even when the country name is truncated.
const COUNTRY_CODES = [
  { value: "+1", label: "+1 (US)" },
  { value: "+1", label: "+1 (CA)" },
  { value: "+52", label: "+52 (MX)" },
  { value: "+44", label: "+44 (UK)" },
  { value: "+61", label: "+61 (AU)" },
  { value: "+86", label: "+86 (CN)" },
  { value: "+49", label: "+49 (DE)" },
  { value: "+33", label: "+33 (FR)" },
  { value: "+91", label: "+91 (IN)" },
  { value: "+81", label: "+81 (JP)" },
  { value: "+82", label: "+82 (KR)" },
  { value: "+65", label: "+65 (SG)" },
];

interface FormDataType {
  legalName: string;
  country: string;
  streetAddress: string;
  suiteUnit: string;
  stateProvince: string;
  townCity: string;
  zipCode: string;
  requestorFirstName: string;
  requestorLastName: string;
  requestorJobTitle: string;
  requestorPhoneCountryCode: string;
  requestorPhone: string;
  requestorPhoneExtension: string;
  requestorEmail: string;
  supervisorFirstName: string;
  supervisorLastName: string;
  supervisorJobTitle: string;
  supervisorPhoneCountryCode: string;
  supervisorPhone: string;
  supervisorPhoneExtension: string;
  supervisorEmail: string;
  files: File[];
  certification: boolean;
}

export default function UserAuthorizationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataType>({
    legalName: "",
    country: "",
    streetAddress: "",
    suiteUnit: "",
    stateProvince: "",
    townCity: "",
    zipCode: "",
    requestorFirstName: "",
    requestorLastName: "",
    requestorJobTitle: "",
    requestorPhoneCountryCode: "+1",
    requestorPhone: "",
    requestorPhoneExtension: "",
    requestorEmail: "",
    supervisorFirstName: "",
    supervisorLastName: "",
    supervisorJobTitle: "",
    supervisorPhoneCountryCode: "+1",
    supervisorPhone: "",
    supervisorPhoneExtension: "",
    supervisorEmail: "",
    files: [],
    certification: false,
  });

  // Treat an empty country selection as US so the form defaults to the US
  // state/zip layout, matching the principal-address behavior on Step 2.
  const isUS = formData.country === "US" || formData.country === "";

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
    navigate("/user-authorization/confirmation");
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
                label="Legal Name of Large Frontier Developer"
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
                <option value="">-- Select a country --</option>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
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
              {isUS ? (
                <NysSelect
                  id="stateProvince"
                  name="stateProvince"
                  label="State"
                  width="sm"
                  value={formData.stateProvince}
                  onNysChange={handleSelectChange}
                >
                  <option value="">-- Select a state --</option>
                  {US_STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.value}
                    </option>
                  ))}
                </NysSelect>
              ) : (
                <NysTextinput
                  id="stateProvince"
                  name="stateProvince"
                  label="State/Province/Region"
                  width="sm"
                  value={formData.stateProvince}
                  onNysInput={handleInputChange}
                />
              )}
              <NysTextinput
                id="townCity"
                name="townCity"
                label="Town/City/Locality"
                width="md"
                value={formData.townCity}
                onNysInput={handleInputChange}
              />
              {isUS ? (
                <NysTextinput
                  id="zipCode"
                  name="zipCode"
                  label="Zip"
                  width="md"
                  pattern="^\d{5}(-\d{4})?$"
                  value={formData.zipCode}
                  onNysInput={handleInputChange}
                />
              ) : (
                <NysTextinput
                  id="zipCode"
                  name="zipCode"
                  label="Postal Code"
                  width="md"
                  value={formData.zipCode}
                  onNysInput={handleInputChange}
                />
              )}
            </div>
            <NysDivider />
            {/* Requestor Information */}
            <div className="form-section">
              <h3>Requestor Information</h3>
              <p>
                The person requesting authorization to file on behalf of the
                entity.
              </p>
              <NysTextinput
                id="requestorFirstName"
                name="requestorFirstName"
                label="First Name"
                width="lg"
                value={formData.requestorFirstName}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="requestorLastName"
                name="requestorLastName"
                label="Last Name"
                width="lg"
                value={formData.requestorLastName}
                onNysInput={handleInputChange}
              />
              <NysTextinput
                id="requestorJobTitle"
                name="requestorJobTitle"
                label="Job Title"
                width="md"
                value={formData.requestorJobTitle}
                onNysInput={handleInputChange}
              />
              <div
                style={{
                  display: "flex",
                  gap: "var(--nys-space-100)",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <NysSelect
                  id="requestorPhoneCountryCode"
                  name="requestorPhoneCountryCode"
                  label="Country code"
                  width="sm"
                  value={formData.requestorPhoneCountryCode}
                  onNysChange={handleSelectChange}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.label} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </NysSelect>
                <NysTextinput
                  id="requestorPhone"
                  name="requestorPhone"
                  label="Business Phone Number"
                  type="tel"
                  width="md"
                  value={formData.requestorPhone}
                  onNysInput={handleInputChange}
                />
                <NysTextinput
                  id="requestorPhoneExtension"
                  name="requestorPhoneExtension"
                  label="Extension"
                  width="sm"
                  value={formData.requestorPhoneExtension}
                  onNysInput={handleInputChange}
                />
              </div>
              <NysTextinput
                id="requestorEmail"
                name="requestorEmail"
                label="Business Email"
                type="email"
                width="md"
                value={formData.requestorEmail}
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
              <div
                style={{
                  display: "flex",
                  gap: "var(--nys-space-100)",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <NysSelect
                  id="supervisorPhoneCountryCode"
                  name="supervisorPhoneCountryCode"
                  label="Country code"
                  width="sm"
                  value={formData.supervisorPhoneCountryCode}
                  onNysChange={handleSelectChange}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.label} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </NysSelect>
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
                  id="supervisorPhoneExtension"
                  name="supervisorPhoneExtension"
                  label="Extension"
                  width="sm"
                  value={formData.supervisorPhoneExtension}
                  onNysInput={handleInputChange}
                />
              </div>
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
              <h3>Confirmation</h3>
              <NysCheckbox
                id="certification"
                name="certification"
                label="The information provided in this submission is true, complete, and current to the best of my knowledge."
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
