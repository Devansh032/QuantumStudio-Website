import React, {useState} from 'react';

type FieldName = 'fullName' | 'email' | 'institution' | 'country' | 'researchArea' | 'operatingSystem' | 'academicRole' | 'evaluationDescription';
type Application = Record<FieldName, string> & {privacyAccepted: boolean; termsAccepted: boolean; communicationsAccepted: boolean};
type SubmissionAdapter = {submit(application: Application): Promise<void>};

const unavailableAdapter: SubmissionAdapter = {submit: async () => { throw new Error('Beta access storage is not configured for this local website preview.'); }};
const initial: Application = {fullName: '', email: '', institution: '', country: '', researchArea: '', operatingSystem: '', academicRole: '', evaluationDescription: '', privacyAccepted: false, termsAccepted: false, communicationsAccepted: false};
const limits: Record<FieldName, number> = {fullName: 120, email: 254, institution: 160, country: 100, researchArea: 1500, operatingSystem: 32, academicRole: 120, evaluationDescription: 2000};

function normalize(value: string): string { return value.trim().replace(/\s+/g, ' '); }

function validate(application: Application): Record<string, string> {
  const errors: Record<string, string> = {};
  (['fullName', 'email', 'institution', 'country', 'researchArea', 'operatingSystem'] as FieldName[]).forEach((field) => {
    if (!normalize(application[field])) errors[field] = 'This field is required.';
  });
  if (application.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) errors.email = 'Enter a valid email address.';
  (Object.keys(limits) as FieldName[]).forEach((field) => { if (application[field].length > limits[field]) errors[field] = `Use ${limits[field]} characters or fewer.`; });
  if (!application.privacyAccepted) errors.privacyAccepted = 'Privacy-notice acceptance is required.';
  if (!application.termsAccepted) errors.termsAccepted = 'Beta-terms acceptance is required.';
  return errors;
}

export default function BetaAccessForm(): React.ReactNode {
  const [application, setApplication] = useState<Application>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const setField = (field: keyof Application, value: string | boolean) => setApplication((current) => ({...current, [field]: value}));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setNotice('');
    const normalized = {...application, fullName: normalize(application.fullName), email: normalize(application.email).toLowerCase(), institution: normalize(application.institution), country: normalize(application.country), researchArea: normalize(application.researchArea), academicRole: normalize(application.academicRole), evaluationDescription: normalize(application.evaluationDescription)};
    const nextErrors = validate(normalized); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try { await unavailableAdapter.submit(normalized); } catch (error) { setNotice(error instanceof Error ? error.message : 'Beta access storage is not configured.'); }
  };
  const textField = (field: FieldName, label: string, required = false, multiline = false) => <label className={multiline ? 'qs-form__full' : ''}>{label}{required ? ' *' : ''}{multiline ? <textarea value={application[field]} maxLength={limits[field]} onChange={(event) => setField(field, event.target.value)} aria-invalid={Boolean(errors[field])} /> : <input type={field === 'email' ? 'email' : 'text'} value={application[field]} maxLength={limits[field]} onChange={(event) => setField(field, event.target.value)} aria-invalid={Boolean(errors[field])} />}{errors[field] && <span className="qs-error">{errors[field]}</span>}</label>;
  return <form className="qs-form" onSubmit={submit} noValidate>
    {textField('fullName', 'Full name', true)}{textField('email', 'Email address', true)}{textField('institution', 'Institution or organization', true)}{textField('country', 'Country', true)}
    {textField('researchArea', 'Research area or intended use', true, true)}
    <label>Operating system *<select value={application.operatingSystem} onChange={(event) => setField('operatingSystem', event.target.value)} aria-invalid={Boolean(errors.operatingSystem)}><option value="">Select an operating system</option><option value="Windows">Windows</option><option value="Linux">Linux</option><option value="Both">Windows and Linux</option><option value="Other">Other</option></select>{errors.operatingSystem && <span className="qs-error">{errors.operatingSystem}</span>}</label>
    {textField('academicRole', 'Academic role (optional)')}{textField('evaluationDescription', 'Short evaluation description (optional)', false, true)}
    <label className="qs-check qs-form__full"><input type="checkbox" checked={application.privacyAccepted} onChange={(event) => setField('privacyAccepted', event.target.checked)} /> <span>I have read and accept the <a href="/privacy">Privacy Notice</a>. *</span>{errors.privacyAccepted && <span className="qs-error">{errors.privacyAccepted}</span>}</label>
    <label className="qs-check qs-form__full"><input type="checkbox" checked={application.termsAccepted} onChange={(event) => setField('termsAccepted', event.target.checked)} /> <span>I have read and accept the <a href="/beta-terms">Beta Terms</a>. *</span>{errors.termsAccepted && <span className="qs-error">{errors.termsAccepted}</span>}</label>
    <label className="qs-check qs-form__full"><input type="checkbox" checked={application.communicationsAccepted} onChange={(event) => setField('communicationsAccepted', event.target.checked)} /> <span>I consent to optional beta and update communications. This is not required for review.</span></label>
    <div className="qs-unavailable" role="status">This local preview has no configured secure registration backend. Validated entries are never reported as submitted or stored by this site.</div>
    {notice && <div className="qs-unavailable" role="alert">{notice}</div>}
    <div className="qs-form__full"><button className="qs-button qs-button--primary" type="submit">Validate application</button></div>
  </form>;
}
