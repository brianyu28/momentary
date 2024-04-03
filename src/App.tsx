import "./App.css";
import DateInputField from "./components/DateInputField";
import { DateComponent } from "./util/date";
import { useDateData } from "./util/hooks";
import { preventNonDigits } from "./util/util";

function App() {
  const [dateData, setDateComponent, setToNow] = useDateData();

  function changeHandler(component: DateComponent, utc: boolean, field: string) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setDateComponent(component, utc, field, event.target.value);
    };
  }

  return (
    <div id="main">

      <div className="date-area">
        <div className="date-title">Unix</div>
        <div className="date-details" style={{ textAlign: "left" }}>
          <div className="date-timestamp">
            <input type="number" value={dateData.timestamp} onChange={changeHandler(DateComponent.Timestamp, true, "timestamp")} onKeyUp={preventNonDigits} />
            <span style={{ paddingRight: "20px" }} />{dateData.timestampUnitsSecs ? "seconds" : "milliseconds"}
          </div>
        </div>
      </div>

      <div className="date-area">
        <div className="date-title">Local</div>
        <div className="date-details">
          <div>
            {dateData.localText}
          </div>
          <div className="date-inputs">
            <DateInputField date={dateData} field={"localYear"} setDateComponent={setDateComponent} component={DateComponent.Year} utc={false} />
            <span>-</span>
            <DateInputField date={dateData} field={"localMonth"} setDateComponent={setDateComponent} component={DateComponent.Month} utc={false} />
            <span>-</span>
            <DateInputField date={dateData} field={"localDay"} setDateComponent={setDateComponent} component={DateComponent.Day} utc={false} />
            <span style={{ paddingRight: "20px" }} />
            <DateInputField date={dateData} field={"localHours"} setDateComponent={setDateComponent} component={DateComponent.Hour} utc={false} />
            <span>:</span>
            <DateInputField date={dateData} field={"localMinutes"} setDateComponent={setDateComponent} component={DateComponent.Minute} utc={false} />
            <span>:</span>
            <DateInputField date={dateData} field={"localSeconds"} setDateComponent={setDateComponent} component={DateComponent.Second} utc={false} />
            <DateInputField date={dateData} field={"localPm"} setDateComponent={setDateComponent} component={DateComponent.AmPm} utc={false} />
          </div>
        </div>
      </div>

      <div className="date-area">
        <div className="date-title">UTC</div>
        <div className="date-details">
          <div>
            {dateData.utcText}
          </div>
          <div className="date-inputs">
            <DateInputField date={dateData} field={"utcYear"} setDateComponent={setDateComponent} component={DateComponent.Year} utc={true} />
            <span>-</span>
            <DateInputField date={dateData} field={"utcMonth"} setDateComponent={setDateComponent} component={DateComponent.Month} utc={true} />
            <span>-</span>
            <DateInputField date={dateData} field={"utcDay"} setDateComponent={setDateComponent} component={DateComponent.Day} utc={true} />
            <span style={{ paddingRight: "20px" }} />
            <DateInputField date={dateData} field={"utcHours"} setDateComponent={setDateComponent} component={DateComponent.Hour} utc={true} />
            <span>:</span>
            <DateInputField date={dateData} field={"utcMinutes"} setDateComponent={setDateComponent} component={DateComponent.Minute} utc={true} />
            <span>:</span>
            <DateInputField date={dateData} field={"utcSeconds"} setDateComponent={setDateComponent} component={DateComponent.Second} utc={true} />
            <DateInputField date={dateData} field={"utcPm"} setDateComponent={setDateComponent} component={DateComponent.AmPm} utc={true} />
          </div>
        </div>
      </div>

      <div className="date-area">
        <div className="date-title"></div>
        <div className="date-details date-controls">
          <button onClick={setToNow}>Now</button>
        </div>
      </div>

    </div>
  );
}

export default App;
