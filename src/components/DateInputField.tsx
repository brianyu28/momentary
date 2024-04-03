import { DateComponent } from "../util/date";
import { DateData } from "../util/hooks";
import { preventNonDigits } from "../util/util";

interface DateInputFieldProps {
  date: DateData;
  field: keyof DateData;
  setDateComponent: (component: DateComponent, utc: boolean, field: string, value: string) => void,
  component: DateComponent;
  utc: boolean;
}

export default function DateInputField(props: DateInputFieldProps) {
  const {date, field, setDateComponent, component, utc} = props;

  const width = component === DateComponent.Year ? "60px" : "30px";

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setDateComponent(component, utc, field, event.target.value);
  }

  return (
    <div className="date-input">
      {
        component === DateComponent.AmPm ?
        <select
          value={date[field] ? "PM" : "AM"}
          onChange={handleChange}
        >
          <option>AM</option>
          <option>PM</option>
        </select>
        :
        <input
          type="text"
          style={{ width }}
          value={date[field] as string}
          onChange={handleChange}
          onKeyUp={preventNonDigits}
        />
      }

    </div>
  );
}