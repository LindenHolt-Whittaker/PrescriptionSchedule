import DataField, {type DataFieldItem} from "./DataField";
import './DataFields.scss';

const DataFields = ({ fields} : {
  fields: DataFieldItem[];
}) => (
  <div className="DataFields">
    {fields.map(({ label, field }: DataFieldItem) => (
      <DataField key={label} label={label} field={field} />
    ))}
  </div>
);

export default DataFields;
