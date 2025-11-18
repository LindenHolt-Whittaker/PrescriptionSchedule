import Page from "./Page";
import "./ErrorPage.scss";

const ErrorPage = ({
  title,
  content,
  graphic,
}: {
  title: string;
  content: React.ReactNode;
  graphic?: React.ReactNode;
}) => (
  <Page className="ErrorPage">
    <div className="ErrorPage__container">
      <div className="ErrorPage__graphic">{graphic}</div>
      <div className="ErrorPage__title">
        <h1>{title}</h1>
      </div>
      <div className="ErrorPage__content">{content}</div>
    </div>
  </Page>
);

export default ErrorPage;
