import { useNavigate } from "react-router-dom";

import ErrorPage from "../../components/ErrorPage";
import Button from "../../components/Button";

const NotFound = () => {
  const navigate = useNavigate();

  const content = (
    <>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p>It might have been moved or deleted.</p>
      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </>
  );

  return (
    <ErrorPage title="Page Not Found" content={content} graphic={'404'} />
  );
};

export default NotFound;
