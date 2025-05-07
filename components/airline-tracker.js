import { Slider } from "antd";
import styles from '../styles/AirlineTracker.module.css';

const AirlineTracker = (props) => {
  const marks = {
    0:{
        label: <strong className={styles.startLabel}>{props.startTime}</strong>
    },
    // 26: "26°C",
    // 37: "37°C",
    100: {
      style: {
        // color: "#f50",
      },
      label: <strong className={styles.endLabel}>{props.endTime}</strong>,
    },
  };
  return (
    <>
    <p className={styles.trackerLabel}>{props.destination}</p>
      <Slider autoFocus='True' range marks={marks} defaultValue={[10, 90]} />
    </>
  );
};

export default AirlineTracker;
