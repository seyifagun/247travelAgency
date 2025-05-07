import DeveloperNavbar from "../components/developerNavbarr.js";
import { Input } from "antd";

const { TextArea } = Input;

const DevelopAPI = () => {
  const DeveloperComp = ({ title }) => (
    <>
      <div className="container">
        <div style={{ padding: "0 5rem" }}>
          <p style={{ color: "#0043a4", padding: "1.5rem 0" }}>{title}</p>
          <TextArea
            rows={6}
            placeholder="maxLength is 6"
            maxLength={6}
            style={{ background: "color", border: "1px solid grey" }}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="container">
        <DeveloperNavbar />
        <div className="container developerAPI-wrapper">
          <div style={{ margin: "0 0 3rem 0" }}>
            <h3 style={{ padding: "2rem 5rem" }}>Developer - API</h3>
            <DeveloperComp title="Choose &amp; Customize Interface" />
            <DeveloperComp title="Bank Account" />
            <DeveloperComp title="Select Payment Option" />
            <DeveloperComp title="Test" />
            <DeveloperComp title="Domain Name" />
          </div>
        </div>
      </div>
    </>
  );
};

export default DevelopAPI;
