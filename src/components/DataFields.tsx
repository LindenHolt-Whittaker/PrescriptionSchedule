import DataField, { type DataFieldItem } from "./DataField";
import "./DataFields.scss";

type DataFieldItemWithCol = DataFieldItem & {
  column?: number;
};

const DataFields = ({ fields }: { fields: DataFieldItemWithCol[] }) => {
  const leftColumnFields = fields.filter((f) => f.column === 0);
  const rightColumnFields = fields.filter((f) => f.column === 1 || f.column === undefined);

  return (
    <div className="DataFields">
      <div>
        {leftColumnFields.map(({ label, field }: DataFieldItem) => (
          <DataField key={label} label={label} field={field} />
        ))}
      </div>
      <div>
        {rightColumnFields.map(({ label, field }: DataFieldItem) => (
          <DataField key={label} label={label} field={field} />
        ))}
      </div>
    </div>
  );
};

export default DataFields;
