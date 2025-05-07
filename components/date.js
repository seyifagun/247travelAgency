import moment from "moment";
import { DatePicker, Space } from "antd";

const { RangePicker } =  DatePicker;

const DateComp = () => {
  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  }
  return (
    <>
      <Space direction="vertical" size={12}>
        <RangePicker
          format="YYYY-MM-DD"
          disabledDate={disabledDate}
        />
        <RangePicker disabledDate={disabledDate} allowEmpty={['true', 'false']} />
        <RangePicker disabledDate={disabledDate} allowEmpty={['false', 'true']} />
        
      </Space>
    </>
  );
};

export default DateComp;
