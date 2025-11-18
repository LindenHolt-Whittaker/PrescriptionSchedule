import { useNavigate } from "react-router-dom";

import ErrorPage from "../../components/ErrorPage";
import Button from "../../components/Button";

const InvalidSchedule = () => {
  const navigate = useNavigate();

  const content = (
    <>
      <p>Sorry, but this schedule is invalid.</p>
      <p>Try creating a new prescription schedule.</p>
      <Button onClick={() => navigate("/onboarding")}>
        Create New Schedule
      </Button>
    </>
  );

  return (
    <ErrorPage title="Invalid Schedule" content={content} graphic={'☹'} />
  );
};

export default InvalidSchedule;
