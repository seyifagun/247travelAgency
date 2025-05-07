import React, { useState } from 'react';
import Head from "next/head";
import Image from "next/image";
import styles from "/styles/Home.module.css";
import contactBanner from "../public/contact-us.webp";
import locationIcon from "../public/location.webp";
import callIcon from "/public/call.webp";
import emailIcon from "/public/Email.webp";
import { Button, Col, Form, Input, InputNumber, message, Row, Spin } from 'antd';
import { useCreateContact } from "./api/apiClient";

const Contact_Us = () => {

  // #region Hooks

  // The contact us form instance
  const [contactUsForm] = Form.useForm();

  // The create contact API client hook
  const createContact = useCreateContact();

  // #endregion

  // #region States

  // Contact processing state
  const [contactIsSending, setContactIsSending] = useState(false);

  // #endregion

  return (
    <>
      <Head>
        <title>247Travels | Contact Us</title>
      </Head>
      <div>
        <div className="container">
          <div className="contactus-banner-container">
            <Image src={contactBanner} alt={"contactus-banner"} />
          </div>
        </div>
        <div className="container-fluid ">
          <div className="contact-form">

            <div className="container">
              <div className="contactform-div">
                <div className="row">
                  <div className="col-md-12 col-lg-5">
                    <div className="card-contact-info">
                      <div className="contact-intro">
                        <p className="contact-p contact-intro-p">Hey there,</p>
                        <h3 className="contact-heading">Let&apos;s Get In Touch</h3>
                      </div>
                      <div className="contact-info">
                        <div className="location-icon pt-4 pb-3 d-flex">
                          <div className="img-wrapper-1">
                            <Image src={locationIcon} alt={"location-icon"} />
                          </div>
                          <p className="contact-p">
                            19, Pariola Street, Ogudu G.R.A, Lagos
                          </p>
                        </div>
                        <div className="call-icon pt-4 pb-3 d-flex">
                          <div className="img-wrapper-1">
                            <Image src={callIcon} alt={"call-icon"} />
                          </div>
                          <p className="contact-p">+234 705 70000 247</p>
                        </div>
                        <div className="message-icon pt-4 pb-3 d-flex">
                          <div className="img-wrapper">
                            <Image src={emailIcon} alt={"message-icon"} />
                          </div>
                          <p className="contact-p">info@247travels.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  <div className="col-md-12 col-lg-7">
                    <div className="card-text-area">
                      <Form form={contactUsForm}
                        layout="vertical"
                        className="position-relative"
                      >
                        <div className="tile-1 mb-2">
                          <Row gutter={10}>
                            <Col span={12}>
                              <Form.Item
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                className="contact-us-form"
                                rules={
                                  [{
                                    required: true,
                                    message: "First name is required"
                                  }]}>
                                <Input name="firstName"
                                  placeholder="Enter your first name" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                className="contact-us-form"
                                rules={
                                  [{
                                    required: true,
                                    message: "Last name is required"
                                  }]}>
                                <Input name="lastName"
                                  placeholder="Enter your last name" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                        <div className="tile-2 mb-2">
                          <Row gutter={10}>
                            <Col span={12}>
                              <Form.Item
                                id="email"
                                name="email"
                                label="Email"
                                className="contact-us-form"
                                rules={[
                                  {
                                    required: true,
                                    message: "Email address is required"
                                  },
                                  {
                                    type: 'email',
                                    message: 'A valid email address is required'
                                  }
                                ]}>
                                <Input name="email"
                                  placeholder="Enter your email" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Phone Number"
                                className="contact-us-form"
                                rules={
                                  [{
                                    required: true,
                                    message: "Phone number is required"
                                  }]}>
                                <InputNumber name="phoneNumber"
                                  placeholder="Enter your phone number"
                                  controls={false}
                                  style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                        <div className="tile-3 mb-2">
                          <Row gutter={10}>
                            <Col span={24}>
                              <Form.Item
                                id="contactMessage"
                                name="contactMessage"
                                label="Message"
                                className="contact-us-form"
                                rules={
                                  [{
                                    required: true,
                                    message: "Message is required"
                                  }]}>
                                <Input.TextArea />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                        <div className="tile-4">
                          <Button
                            type="submit"
                            id="contact_btn"
                            className="btn bttn-custom position-absolute"
                            onClick={() => {
                              contactUsForm
                                .validateFields()
                                .then(async () => {
                                  // Flag the contact processing state
                                  setContactIsSending(true);
                                  await createContact(contactUsForm.getFieldsValue())
                                    .then((result) => {
                                      // If the response failed...
                                      if (!result.data.successful) {
                                        // Display error message
                                        message.error(`Failed: ${result.data.errorMessage}`);
                                      } else {
                                        // Clear all fields
                                        contactUsForm.setFieldsValue({
                                          firstName: '',
                                          lastName: '',
                                          email: '',
                                          phoneNumber: '',
                                          contactMessage: ''
                                        });
                                        message.success("We have received your information. We will get back to you soon.");
                                      }
                                      // Unflag the flag
                                      setContactIsSending(false);
                                    })
                                    .catch((error) => {
                                      // Unflag the flag
                                      setContactIsSending(false);
                                      message.error("Failed to send your information");
                                      console.error(`Failed: ${error}`);
                                    });
                                })
                                .catch((error) => {
                                  console.error('Form Validation Failed:', error);
                                });
                            }}
                          >
                            {contactIsSending ? <Spin size='small' /> : <span>Send</span>}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact_Us;
