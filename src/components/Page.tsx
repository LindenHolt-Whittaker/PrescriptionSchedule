import "./Page.scss";

type PageProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

const Page = ({ title, className, children }: PageProps) => {
  return (
    <div className={`Page ${className ? className : ''}`}>
      <div className="Page__header">{title}</div>
      <div className="Page__content">{children}</div>
      <div className="Page__footer">Footer</div>
    </div>
  );
};

export default Page;
