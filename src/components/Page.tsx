import Header from "./Header";
import ThemeToggle from "./ThemeToggle";
import "./Page.scss";

type PageProps = {
  children?: React.ReactNode;
  title?: string;
  className?: string;
};

const Page = ({ title, className, children }: PageProps) => {
  return (
    <div className={`Page ${className ? className : ""}`}>
      <div className="Page__header">
        <Header />
      </div>
      <div className="Page__title">
        <h1>{title}</h1>
      </div>
      <div className="Page__content">{children}</div>
      <div className="Page__themeToggle">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Page;
