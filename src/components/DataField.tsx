import './DataField.scss';

export type DataFieldItem = {
  label: string;
  field: string;
};

const DataField = ({
  label,
  field,
}: DataFieldItem) => (
  <div className="DataField">
    <div className="DataField__label">{label}:</div>
    <div className="DataField__field">{field}</div>
  </div>
);

export default DataField;
