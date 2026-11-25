import type { FormEvent, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { ArrowLeft, FileText, Info, UserPlus } from 'lucide-react'
import type { MemberRecord } from '../types'
import '../styles/member-registration.css'

type FieldConfig = {
  label: string
  name: string
  type?: HTMLInputTypeAttribute
  required?: boolean
  options?: string[]
  placeholder?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  min?: number
  max?: number
  multiline?: boolean
  wide?: boolean
}

type FormSectionProps = {
  number: string
  title: string
  description?: string
  fields: FieldConfig[]
  initialValues?: Record<string, string>
}

function FormSection({ number, title, description, fields, initialValues = {} }: FormSectionProps) {
  return (
    <section className="member-form-section">
      <div className="member-form-section__heading">
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="member-form-grid">
        {fields.map(({ label, name, type = 'text', required, options, placeholder, inputMode, min, max, multiline, wide }) => (
          <label className={`member-form-field${wide ? ' member-form-field--wide' : ''}`} key={name}>
            <span>{label}{required && <b aria-label="required"> *</b>}</span>
            {options ? (
              <select name={name} required={required} defaultValue={initialValues[name] ?? ''}>
                <option value="" disabled>Select {label.toLowerCase()}</option>
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : multiline ? (
              <textarea name={name} rows={3} placeholder={placeholder} defaultValue={initialValues[name] ?? ''} />
            ) : (
              <input
                name={name}
                type={type}
                required={required}
                placeholder={placeholder}
                defaultValue={type === 'file' ? undefined : initialValues[name] ?? ''}
                inputMode={inputMode}
                min={min}
                max={max}
                autoComplete={type === 'password' ? 'off' : undefined}
                accept={type === 'file' ? '.pdf,.jpg,.jpeg,.png' : undefined}
              />
            )}
          </label>
        ))}
      </div>
    </section>
  )
}

const sections: FormSectionProps[] = [
  {
    number: '01',
    title: 'Personal information',
    fields: [
      { label: 'First name', name: 'firstName', required: true },
      { label: 'Last name', name: 'lastName', required: true },
      { label: 'Father / husband name', name: 'guardianName', required: true },
      { label: 'Date of birth', name: 'dateOfBirth', type: 'date', required: true },
      { label: 'Gender', name: 'gender', options: ['Female', 'Male', 'Other'], required: true },
      { label: 'Marital status', name: 'maritalStatus', options: ['Single', 'Married', 'Widowed', 'Divorced', 'Other'] },
      { label: 'Mobile number', name: 'mobileNumber', type: 'tel', required: true },
      { label: 'Alternate mobile number', name: 'alternateMobile', type: 'tel' },
      { label: 'Email address', name: 'email', type: 'email' },
      { label: 'Photograph', name: 'photograph', type: 'file' },
    ],
  },
  {
    number: '02',
    title: 'Address information',
    fields: [
      { label: 'Village / town', name: 'villageTown' },
      { label: 'Post office', name: 'postOffice' },
      { label: 'Police station', name: 'policeStation' },
      { label: 'Gram panchayat / municipality', name: 'localBody' },
      { label: 'District', name: 'district' },
      { label: 'State', name: 'state' },
      { label: 'PIN code', name: 'pinCode', inputMode: 'numeric' },
      { label: 'Residence type', name: 'residenceType', options: ['Own', 'Rented', 'Other'] },
      { label: 'Years at current address', name: 'yearsAtAddress', type: 'number', min: 0 },
      { label: 'Present address', name: 'presentAddress', multiline: true, wide: true },
      { label: 'Permanent address', name: 'permanentAddress', multiline: true, wide: true },
      { label: 'Address verification status', name: 'addressVerification', options: ['Pending', 'Verified', 'Requires review'] },
    ],
  },
  {
    number: '03',
    title: 'Family & financial information',
    description: 'Record household income and existing obligations consistently for responsible lending.',
    fields: [
      { label: 'Family members', name: 'familyMembers', type: 'number', min: 0 },
      { label: 'Earning members', name: 'earningMembers', type: 'number', min: 0 },
      { label: 'Number of dependents', name: 'dependents', type: 'number', min: 0 },
      { label: 'Occupation', name: 'occupation' },
      { label: 'Member monthly income (₹)', name: 'monthlyIncome', type: 'number', min: 0 },
      { label: 'Spouse occupation', name: 'spouseOccupation' },
      { label: 'Spouse monthly income (₹)', name: 'spouseMonthlyIncome', type: 'number', min: 0 },
      { label: 'Other household income (₹)', name: 'otherHouseholdIncome', type: 'number', min: 0 },
      { label: 'Monthly household expenses (₹)', name: 'monthlyExpenses', type: 'number', min: 0 },
      { label: 'Household annual income (₹)', name: 'annualIncome', type: 'number', min: 0 },
      { label: 'Existing loan details', name: 'existingLoanDetails' },
      { label: 'Existing monthly loan repayment (₹)', name: 'existingMonthlyRepayment', type: 'number', min: 0 },
    ],
  },
  {
    number: '04',
    title: 'KYC & identity verification',
    description: 'Sensitive identity fields are masked while entered. Collect only information required by your policy.',
    fields: [
      { label: 'Identity proof type', name: 'identityProofType', options: ['Voter ID', 'PAN', 'Driving licence', 'Passport', 'Other'] },
      { label: 'Identity proof number', name: 'identityProofNumber', type: 'password', placeholder: 'Sensitive information' },
      { label: 'Address proof type', name: 'addressProofType', options: ['Voter ID', 'Utility bill', 'Bank statement', 'Rent agreement', 'Other'] },
      { label: 'Address proof reference', name: 'addressProofReference', type: 'password', placeholder: 'Sensitive information' },
      { label: 'PAN (if applicable)', name: 'pan', type: 'password', placeholder: 'Sensitive information' },
      { label: 'Voter ID (if applicable)', name: 'voterId', type: 'password', placeholder: 'Sensitive information' },
      { label: 'Document upload / reference', name: 'kycDocuments', type: 'file' },
      { label: 'KYC status', name: 'kycStatus', options: ['Pending', 'In review', 'Verified', 'Rejected'] },
      { label: 'Verified by', name: 'verifiedBy' },
      { label: 'Verification date', name: 'verificationDate', type: 'date' },
    ],
  },
  {
    number: '05',
    title: 'Nominee information',
    fields: [
      { label: 'Nominee full name', name: 'nomineeName' },
      { label: 'Relationship to member', name: 'nomineeRelationship' },
      { label: 'Nominee date of birth', name: 'nomineeDateOfBirth', type: 'date' },
      { label: 'Nominee mobile number', name: 'nomineeMobile', type: 'tel' },
      { label: 'Nominee address', name: 'nomineeAddress', multiline: true, wide: true },
      { label: 'Nominee identity proof', name: 'nomineeIdentityProof', type: 'password', placeholder: 'Sensitive information' },
    ],
  },
  {
    number: '06',
    title: 'Bank account details',
    description: 'Bank details are sensitive and must be restricted to authorized staff.',
    fields: [
      { label: 'Account holder name', name: 'accountHolder' },
      { label: 'Bank name', name: 'bankName' },
      { label: 'Account number', name: 'accountNumber', type: 'password', placeholder: 'Sensitive information' },
      { label: 'IFSC code', name: 'ifscCode' },
      { label: 'Account type', name: 'accountType', options: ['Savings', 'Current', 'Other'] },
      { label: 'Passbook / cancelled cheque', name: 'bankDocument', type: 'file' },
      { label: 'Bank verification status', name: 'bankVerification', options: ['Pending', 'Verified', 'Requires review'] },
    ],
  },
  {
    number: '07',
    title: 'Branch, center & group assignment',
    fields: [
      { label: 'Branch', name: 'branch', options: ['Main Branch', 'North Branch', 'South Branch', 'East Branch'] },
      { label: 'Center', name: 'center' },
      { label: 'Group', name: 'group' },
      { label: 'Field officer', name: 'fieldOfficer' },
      { label: 'Joining date', name: 'joiningDate', type: 'date' },
      { label: 'Member status', name: 'memberStatus', options: ['Draft', 'Submitted', 'Under Review', 'KYC Pending', 'Approved', 'Rejected', 'Inactive', 'Active'] },
      { label: 'Assigned by', name: 'assignedBy' },
    ],
  },
  {
    number: '08',
    title: 'Verification, consent & declarations',
    description: 'Record the applicable consent or lawful basis for each verification and communication purpose.',
    fields: [
      { label: 'Field verification status', name: 'fieldVerification', options: ['Pending', 'Completed', 'Requires review'] },
      { label: 'Residence verification', name: 'residenceVerification', options: ['Pending', 'Verified', 'Not verified'] },
      { label: 'Income verification', name: 'incomeVerification', options: ['Pending', 'Verified', 'Not verified'] },
      { label: 'Credit bureau check status', name: 'creditBureauStatus', options: ['Not requested', 'Consent pending', 'Completed'] },
      { label: 'Credit bureau consent reference / date', name: 'creditBureauConsent' },
      { label: 'Privacy notice accepted', name: 'privacyAccepted', options: ['Yes', 'No'] },
      { label: 'Communication consent', name: 'communicationConsent', options: ['SMS', 'WhatsApp', 'Call', 'SMS / WhatsApp / Call', 'No consent recorded'] },
      { label: 'Consent date', name: 'consentDate', type: 'date' },
      { label: 'Consent recorded by', name: 'consentRecordedBy' },
      { label: 'Member declaration signed', name: 'declarationSigned', options: ['Yes', 'No'] },
      { label: 'KYC approval status', name: 'kycApprovalStatus', options: ['Pending', 'Approved', 'Rejected'] },
    ],
  },
  {
    number: '09',
    title: 'Internal office & approval information',
    fields: [
      { label: 'Created by', name: 'createdBy' },
      { label: 'Created date & time', name: 'createdAt', type: 'datetime-local' },
      { label: 'Reviewed by', name: 'reviewedBy' },
      { label: 'Review date', name: 'reviewDate', type: 'date' },
      { label: 'Approved by', name: 'approvedBy' },
      { label: 'Approval date', name: 'approvalDate', type: 'date' },
      { label: 'Rejection / hold reason', name: 'holdReason' },
    ],
  },
]

type MemberRegistrationPageProps = {
  initialMember?: MemberRecord | null
  onBack: () => void
  onSave: (member: MemberRecord) => void
}

function getTodayDate() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function createMemberId() {
  return `DTMF-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

function MemberRegistrationPage({ initialMember, onBack, onSave }: MemberRegistrationPageProps) {
  const initialValues: Record<string, string> = {
    firstName: initialMember?.firstName ?? '',
    lastName: initialMember?.lastName ?? '',
    guardianName: initialMember?.guardianName ?? '',
    dateOfBirth: initialMember?.dateOfBirth ?? '',
    gender: initialMember?.gender ?? '',
    mobileNumber: initialMember?.mobileNumber ?? '',
    email: initialMember?.email ?? '',
    registrationDate: initialMember?.registrationDate ?? getTodayDate(),
    registrationBranch: initialMember?.branchName ?? '',
    branch: initialMember?.branchName ?? '',
    registrationStatus: initialMember?.status ?? 'Draft',
    memberStatus: initialMember?.status ?? 'Draft',
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const getValue = (name: string) => String(formData.get(name) ?? '').trim()
    onSave({
      id: initialMember?.id ?? createMemberId(),
      firstName: getValue('firstName'),
      lastName: getValue('lastName'),
      guardianName: getValue('guardianName'),
      dateOfBirth: getValue('dateOfBirth'),
      gender: getValue('gender'),
      mobileNumber: getValue('mobileNumber'),
      email: getValue('email'),
      registrationDate: getValue('registrationDate') || getTodayDate(),
      branchName: getValue('registrationBranch') || getValue('branch'),
      status: getValue('memberStatus') || getValue('registrationStatus') || 'Draft',
    })
  }

  return (
    <main className="member-registration">
      <div className="member-registration__topline">
        <button className="member-registration__back" type="button" onClick={onBack}>
          <ArrowLeft size={17} /> Back to member list
        </button>
        <span className="member-registration__office-label"><FileText size={15} /> Office use · {initialMember?.id ?? 'Member ID generated on save'}</span>
      </div>

      <header className="member-registration__header">
        <div className="member-registration__icon"><UserPlus size={23} /></div>
        <div>
          <p>MEMBER MANAGEMENT</p>
          <h1>{initialMember ? 'Edit member' : 'Register a member'}</h1>
          <span>{initialMember ? 'Update this member profile.' : 'Capture member details for DoorToDoor MicroFoundation.'}</span>
        </div>
        <span className="member-registration__required">* Required fields</span>
      </header>

      <div className="member-registration__notice" role="note">
        <Info size={18} />
        <p>This is a demo form. Only basic directory fields are kept in memory for this session; KYC details, bank details, and selected files are not retained or uploaded. No backend is connected.</p>
      </div>

      <form className="member-registration__form" onSubmit={handleSubmit}>
        <section className="member-form-section member-form-section--office">
          <div className="member-form-section__heading">
            <span>00</span>
            <div>
              <h2>Registration details</h2>
              <p>Office use and member assignment details.</p>
            </div>
          </div>
          <div className="member-form-grid">
            <label className="member-form-field">
              <span>Member ID</span>
              <input value={initialMember?.id ?? 'Generated on save'} readOnly />
            </label>
            <label className="member-form-field">
              <span>Registration date</span>
              <input name="registrationDate" type="date" defaultValue={initialValues.registrationDate} />
            </label>
            <label className="member-form-field">
              <span>Branch name</span>
              <select name="registrationBranch" defaultValue={initialValues.registrationBranch}>
                <option value="" disabled>Select branch</option>
                <option>Main Branch</option><option>North Branch</option><option>South Branch</option><option>East Branch</option>
              </select>
            </label>
            <label className="member-form-field">
              <span>Assigned field officer</span>
              <input name="registrationFieldOfficer" defaultValue={initialValues.registrationFieldOfficer ?? ''} />
            </label>
            <label className="member-form-field">
              <span>Center name</span>
              <input name="registrationCenter" defaultValue={initialValues.registrationCenter ?? ''} />
            </label>
            <label className="member-form-field">
              <span>Group name</span>
              <input name="registrationGroup" defaultValue={initialValues.registrationGroup ?? ''} />
            </label>
            <label className="member-form-field">
              <span>Member category</span>
              <select name="memberCategory" defaultValue={initialValues.memberCategory ?? ''}>
                <option value="" disabled>Select category</option>
                <option>Group</option><option>Individual</option><option>Business</option>
              </select>
            </label>
            <label className="member-form-field">
              <span>Registration status</span>
              <select name="registrationStatus" defaultValue={initialValues.registrationStatus}>
                <option>Draft</option><option>Submitted</option><option>Under Review</option><option>KYC Pending</option>
                <option>Approved</option><option>Rejected</option><option>Inactive</option><option>Active</option>
              </select>
            </label>
          </div>
        </section>

        {sections.map((section) => <FormSection key={section.number} {...section} initialValues={initialValues} />)}

        <label className="member-form-field member-form-field--remarks">
          <span>Internal remarks</span>
          <textarea name="internalRemarks" rows={3} placeholder="Add any notes for the internal review" />
        </label>

        <div className="member-registration__actions">
          <button type="reset" className="member-registration__reset">Reset form</button>
          <button type="submit" className="member-registration__submit">{initialMember ? 'Save changes' : 'Save member'}</button>
        </div>
      </form>

      <footer className="member-registration__footer">
        Required personal fields must be completed before saving. Identity documents and bank details should only be collected where lawful and necessary.
      </footer>
    </main>
  )
}

export default MemberRegistrationPage
