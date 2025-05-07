import { react, useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { DropdownButton } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import usernameIcon from "../public/icons/username.webp";
import passwordIcon from "../public/icons/password.png";
import visibilityIcon from "../public/icons/visibility.webp";
import contactIcon from "../public/icons/contact.webp";
import { useCreateClientEnquiry } from "../pages/api/apiClient";
import { Input, Form as FormAnt, Select, Row, Col, Divider, Spin, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ToastComponent } from "@syncfusion/ej2-react-notifications";
import Spinner from "../components/Spinner";

const { Option } = Select;

const CallToAction = () => {
    const toastInstance = useRef(null);
    const router = useRouter();
    const [clientEnquiryForm] = FormAnt.useForm();
    const createClientEnquiry = useCreateClientEnquiry();

    const handleClientEnquiry = () => {
        clientEnquiryForm.validateFields()
            .then(async () => {
                // Flag enquiry is creating...
                setEnquiryIsCreating(true);
                await createClientEnquiry(clientEnquiryForm.getFieldsValue())
                    .then((result) => {
                        // Unflag enquiry form is creating...
                        setEnquiryIsCreating(false);

                        // If the transaction successful...
                        if (result.data.successful) {
                            // Display success message
                            message.success('Your enquiry was sent successfully!');
                        } else {
                            // Log the error message
                            console.error('Create Enquiry Error:', result.data.errorMessage);

                            // Display error
                            message.error('Failed to send your enquiry! Please try again.');
                        }
                    })
                    .catch((error) => {
                        // Unflag enquiry is creating...
                        setEnquiryIsCreating(false);

                        // Log the error
                        console.log("Create Enquiry Error:", error);

                        // Display error
                        message.error('Failed to send your enquiry! Please try again.');
                    });
            })
            .catch((err) => {
                // Unflag enquiry is creating...
                setEnquiryIsCreating(false);
                // Log the error
                console.log("Create Enquiry Validation Error:", err);
            });
    };

    // #region States

    // Enquiry is creating boolean state
    const [enquiryIsCreating, setEnquiryIsCreating] = useState(false);

    // #endregion

    // #region Use Effect

    useEffect(() => {
        // Get the current url
        let urlString = window.location.href;

        // Get parameter and query strings
        let paramString = urlString.split("?")[1];
        let queryString = new URLSearchParams(paramString);

        // Get the trxref parameter from the query string
        let actionId = queryString.get('actionId');

        // Set the value of the action id
        clientEnquiryForm.setFieldsValue({
            offerType: actionId
        });
    }, []);

    // #endregion

    return (
        <>
            <Head>
                <title>247Travels | Call to Action</title>
            </Head>
            <div className="row mt-5 mb-5">
                <div className="col-md-4 card m-auto shadow-lg">
                    <div className="card-body custom-made p-5">
                        <div className="p-4">
                            <div className="edit-profile-form">
                                <span
                                    style={{
                                        color: "#0043a4",
                                        fontWeight: "700",
                                        fontSize: "20px",
                                    }}
                                ></span>
                                <span
                                    style={{
                                        color: "#0043a4",
                                        fontWeight: "700",
                                        fontSize: "20px",
                                    }}
                                >
                                    Enquiry Form
                                </span>
                            </div>
                        </div>
                        <FormAnt form={clientEnquiryForm}
                            layout='vertical'>
                            <Row gutter={10}>
                                <Col span={12}>
                                    <FormAnt.Item
                                        name="firstName"
                                        label="First Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your first name",
                                            },
                                        ]}
                                        className="call-to-action-form">
                                        <Input
                                            defaultValue=""
                                            placeholder="Enter first name"
                                            name="firstName"
                                            className="form-control affiliate-input custom-input p-2"
                                        />
                                    </FormAnt.Item>
                                </Col>
                                <Col span={12}>
                                    <FormAnt.Item
                                        name="lastName"
                                        label="Last Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter your last name"
                                            }
                                        ]}
                                        className="call-to-action-form"
                                    >
                                        <Input
                                            name="lastName"
                                            className="form-control affiliate-input custom-input"
                                            placeholder="Enter last name"
                                        />
                                    </FormAnt.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Row>
                                <Col span={24}>
                                    <FormAnt.Item
                                        name="phoneNumber"
                                        label="Phone Number"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter your phone number"
                                            }
                                        ]}
                                        className="call-to-action-form">
                                        <Input
                                            name="phoneNumber"
                                            className="form-control affiliate-input custom-input"
                                            placeholder="Enter phone number" />
                                    </FormAnt.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Row>
                                <Col span={24}>
                                    <FormAnt.Item
                                        name="offerType"
                                        label="Offer Type"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Offer type is required"
                                            }
                                        ]}
                                        className="call-to-action-form">
                                        <Select
                                            className="form-control affiliate-input custom-input p-2"
                                            name="offer">
                                            {/* <Option value="Student Offer">Student Offer</Option>
                                            <Option value="Discount Offer">Discount Offer</Option> */}
                                            <Option value="All in One Offer">All in One Offer</Option>
                                            <Option value="Travel Plans Offer">Travel Plans</Option>
                                            <Option value="Travel Later Offer">Travel Later</Option>
                                        </Select>
                                    </FormAnt.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Row>
                                <Col span={24}>
                                    <FormAnt.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter Email Address"
                                            },
                                            {
                                                type: 'email',
                                                message: 'Enter a valid email address'
                                            }
                                        ]}
                                        className="call-to-action-form">
                                        <Input
                                            name="email"
                                            className="form-control affiliate-input custom-input"
                                            placeholder="Email Address"
                                        />
                                    </FormAnt.Item>
                                </Col>
                            </Row>

                            {/*BUTTON  */}
                            <div className="form-group pt-4" style={{ textAlign: "center" }}>
                                <FormAnt.Item>
                                    <div className="signup-btn">

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="btn btn-primary affiliate-login-btn"
                                            style={{ backgroundColor: '#0043a4', width: '115px' }}
                                            onClick={handleClientEnquiry}
                                            disabled={enquiryIsCreating}>
                                            {enquiryIsCreating ? <Spin size="small" /> : <span>Submit</span>}
                                        </Button>
                                    </div>
                                </FormAnt.Item>
                            </div>
                        </FormAnt>
                    </div>
                </div>
            </div>

            <ToastComponent
                ref={toastInstance}
                animation={{
                    show: { effect: "SlideRightIn", duration: 300, easing: "linear" },
                    hide: { effect: "SlideRightOut", duration: 300, easing: "linear" },
                }}
                position={{ X: "Right", Y: "Top" }}
            />
        </>
    );
};

export default CallToAction;
