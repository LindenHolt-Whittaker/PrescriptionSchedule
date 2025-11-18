import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Page from '../../components/Page';
import Button from '../../components/Button';
import './Home.scss';

const Home = () => {
  const [scheduleKey, setScheduleKey] = useState<string>("");
  const navigate = useNavigate();

  const onScheduleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleKey.trim()) {
      navigate(`/schedule?k=${scheduleKey}`);
    }
  };

  return (
    <Page className="Home">
      <div>
        <h1 className="Home__title">Manage Your Prescription Schedule</h1>
        <p className="Home__description">
          Get your personalized 14-day prescription schedule based on your availability and dosage requirements.
        </p>
        <Button 
          onClick={() => navigate('/onboarding')}
          className="Home__cta"
        >
          Get Started
        </Button>
      </div>

      <div className="Home__divider">
        <span>or</span>
      </div>

      <div className="Home__scheduleKeySection">
        <h2>Already have a schedule?</h2>
        <p>Enter your schedule key to view your prescription plan</p>
        <form onSubmit={onScheduleKeySubmit} className="Home__scheduleKeyForm">
          <div className="Home__scheduleKeyInput">
            <span className="Home__scheduleKeyHash">#</span>
            <input
              type="text"
              name="scheduleKey"
              placeholder="Enter your schedule key"
              value={scheduleKey}
              onChange={(e) => setScheduleKey(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={!scheduleKey.trim()}>
            View Schedule
          </Button>
        </form>
      </div>
    </Page>
  );
};

export default Home;