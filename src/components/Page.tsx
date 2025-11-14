import "./Page.scss";

type PageProps = React.PropsWithChildren<{
  title?: string;
  className?: string;
}>;

const Page: React.FC<PageProps> = ({ title, className, children }) => {
  return (
    <div className={`Page ${className ? className : ''}`}>
      <div className="Page__title">{title}</div>
      <div className="Page__content">{children}</div>
    </div>
  );
};

export default Page;
