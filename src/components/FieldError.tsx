import './FieldError.scss';

const FieldError = ({
  children,
}: {children?: string | undefined}) => (
  <div className={`FieldError ${!children ? 'FieldError__hidden' : ''}`}>
    {/* Render '\u00A0' (non-breaking space) to ensure we maintain spacing even when hidden */}
    <div className="FieldError__message">{children || '\u00A0'}</div>
  </div>
);

export default FieldError;
