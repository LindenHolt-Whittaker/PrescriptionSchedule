import { Navigate } from 'react-router-dom';

import { type OnboardingFormData } from './OnboardingForm';
import Page from '../components/Page';
import './Results.scss'

const DataField = ({ children }: { children: React.ReactNode }) => (
  <div className="DataField">{children}</div>
);

const Results = () => {
  const searchParams = new URLSearchParams(location.search);
  const scheduleData = JSON.parse(searchParams.get('data') || '{}');

  if (!scheduleData) {
    return <Navigate to="/" replace />;
  }

  return (
    <Page title="Your prescription schedule" className="Results">
      {/* {scheduleData.initialDate} */}
      {/* {scheduleData.availableDays} */}
      <DataField>{scheduleData.prescriptionType}</DataField>
      <DataField>{scheduleData.dosage}</DataField>
      {scheduleData.changeAmount && <DataField>{scheduleData.changeAmount}</DataField>}
      {scheduleData.changeFrequency && <DataField>{scheduleData.changeFrequency}</DataField>}
    </Page>
  )
};

export default Results
