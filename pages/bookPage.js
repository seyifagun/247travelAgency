import React, { useState, useRef } from "react";
import styles from "../styles/BookPage.module.css";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useSelector } from "react-redux";
import { } from "antd";
import {
	message,
	List,
	Tabs,
	Card,
	Form,
	Modal,
	Spin,
	Row,
	Col,
	Input,
	Tooltip,
	Select,
	Checkbox,
	Drawer,
	Button as ButtonAnt,
	Space,
} from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import Button from "react-bootstrap/Button";
import BookingSummary from "../components/BookingSummary";
import "../components/Files/countries";
import "../components/Files/months";
import "../components/Files/years";
import "../components/Files/days";
import { useInitializeFlightOrder } from "./api/apiClient";
import { useRouter } from "next/router";
import { ToastComponent } from "@syncfusion/ej2-react-notifications";
import FlightItem from "../components/FlightItem";
import FlightDetailsMobile from "../components/FlightDetailsMobile";

const { TabPane } = Tabs;

const Flight_match = () => {
	const [travelerForm] = Form.useForm();
	const router = useRouter();

	const onClick = ({ key }) => {
		message.info(`Click on item ${key}`);
	};

	// const [checkboxValue, setCheckBoxValue] = useState(true);
	const { Option } = Select;

	const state = { disabled: false };

	const setSelectedFlightOfferObject = useSelector(
		(state) => state.store.selectedOffer
	);

	let setSelectedFlightOffer = [];

	setSelectedFlightOffer.push(setSelectedFlightOfferObject);
	// console.log(objectIntoArray);

	// console.log("Selected Offer 1:", setSelectedFlightOffer);

	const flightResults = useSelector((state) => state.store.flightResults);
	// console.log("Selected Offer 2:", flightResults.offerInfos[0]);

	function handleChange(value) {
		console.log(`selected ${value}`);
	}

	// const handleOnChange = (e) => {
	//   setCheckBoxValue(!checkboxValue);
	// };
	// console.log(checkboxValue);

	const { disabled } = state;

	const [isShow, setIsShow] = useState(true);

	const [
		flightOrderInitializationModelVisibility,
		setFlightOrderInitializationModelVisibility,
	] = useState(false);

	const handleEvent = () => {
		setIsShow(!isShow);
	};

	// console.log(travelerForm.getFieldsValue());

	const onContinue = (e) => {
		// if (checkboxValue === true) {
		travelerForm
			.validateFields()
			.then(async () => {
				// console.log('Travelers Info', travelerForm.getFieldsValue());
				// Display dialog
				setFlightOrderInitializationModelVisibility(true);
				// Send the request
				await initializeFlightOrder(
					travelerForm.getFieldsValue(),
					setSelectedFlightOffer[0]?.travelerPricings,
					setSelectedFlightOffer[0]?.priceBreakdown,
					setSelectedFlightOffer[0]?.id,
					setSelectedFlightOffer[0]?.officeId
				)
					.then((result) => {
						if (result.data.successful) {

							// Persist the customer id
							window.localStorage.setItem(
								"customerId",
								result.data.response.customerId
							);

							// Persist the flight order id
							window.localStorage.setItem(
								"flightOrderId",
								result.data.response.flightOrderId
							);

							// Route to the payment page
							router.push("/payment");
						} else {
							// Display error...
							displayError(
								"Error",
								"Sorry your flight order could not be processed. Please try again."
							);
						}
					})
					.catch((error) => {
						// Log the error
						// console.error("Payment Initialize Error:", error);
						// Display error
						displayError(
							"Error",
							"Your payment could not be processed due to an error"
						);
					});
			})
			.catch((err) => {
				console.error("Form Error:", err);
			});
		// } else {
		//   displayError(
		//     "Warning",
		//     "Kindly Agree to the terms and conditions to continue."
		//   );
		// }
	};

	// const { Link } = Anchor;

	const toastInstance = useRef(null);

	const initializeFlightOrder = useInitializeFlightOrder();

	function displayError(title, content) {
		toastInstance.current.title = title;
		toastInstance.current.content = content;
		toastInstance.current.cssClass = "e-error";
		toastInstance.current.show();
	}

	function displayInfo(title, content) {
		toastInstance.current.title = title;
		toastInstance.current.content = content;
		toastInstance.current.cssClass = "e-info";
		toastInstance.current.show();
	}

	// Hook for terms and conditions modal
	const [isShowModal, setIsShowModal] = useState(false);

	function showModal() {
		setIsShowModal(true);
	}

	function handleOk() {
		setIsShowModal(false);
	}

	function handleCancel() {
		setIsShowModal(false);
	}

	// Function & hooks for updating state of custom tabs
	const [showTab1, setShowTab1] = useState(false);

	const onToggle1 = () => {
		setShowTab1(!showTab1);
	};
	const [showTab2, setShowTab2] = useState(true);

	const onToggle2 = () => {
		setShowTab2(!showTab2);
	};
	const [showTab3, setShowTab3] = useState(true);

	const onToggle3 = () => {
		setShowTab3(!showTab3);
	};

	const [toggleState, setToggleState] = useState(1);

	const [resultPanelVisible, setResultPanelVisible] = useState(false);

	const toggleTab = (index) => {
		setToggleState(index);
	};

	function getCabinClass(cabinClass) {
		switch (cabinClass) {
			case "PREMIUM_ECONOMY":
				return "Premium Economy";
			case "ECONOMY":
				return "Economy";
			case "BUSINESS":
				return "Business";
			case "FIRST":
				return "First";
			default:
				break;
		}
	}

	function openResultPanel(flightOffer) {
		let serializedFlightOffer = JSON.stringify(flightOffer);
		window.localStorage.setItem('flightOffer', serializedFlightOffer);
		setResultPanelVisible(true);
	}

	function closeResultPanel() {
		setResultPanelVisible(false);
	}

	return (
		<>
			<Head>
				<title>247Travels | Book Flight</title>
			</Head>
			<div className={styles.containercustom}>
				<div className="container">
					{/* <FlightNavBar /> */}
					<div className="row pt-5 pb-5">
						<div className="col-xl-3 col-lg-4 col-12  drawercustom-desktop">
							<BookingSummary setSelectedFlightOffer={setSelectedFlightOffer} />
						</div>
						<div className="drawercustom-mobile mb-3">
							<DrawerCustom />
						</div>

						<div className="col-xl-9 col-lg-8 col-12">
							{/* <div className="action-panel-extended"></div> */}


							<div className="flight-description">
								<FlightItem flightOffer={setSelectedFlightOffer[0]} openResultPanel={() => openResultPanel(setSelectedFlightOffer[0])} enableFurtherAction={false} />

								<FlightDetailsMobile visible={resultPanelVisible} closeResultPanel={closeResultPanel} enableFurtherAction={false} />

								{/* <ToggleTabs /> */}
								{/* Load travelers form entry by iteration */}
								<Form form={travelerForm} autoComplete="off">
									{setSelectedFlightOffer[0]?.travelerPricings.map(
										(traveler, index) => {
											// console.log('Traveler Pricing:', traveler.travelerType);
											return (
												<Card
													key={index}
													title={
														traveler?.travelerId == 1
															? `Passenger ${traveler?.travelerId} ${traveler?.travelerType} - (Primary Contact)`
															: `Passenger ${traveler?.travelerId} (${traveler?.travelerType})`
													}
													className="ant-card-head-custom mt-5"
													extra={
														<small style={{ color: "orange" }}>Protected</small>
													}
												>
													<Card className="ant-card-body-custom" type="inner">
														<div className="container bookpage-input-field">
															<div className="row">
																{/* Traveler Title */}
																<div className="col-sm-12 col-md-6 traveler-input">
																	<span className="passenger-form-label">
																		Surname
																	</span>
																	<div className={styles.bookPageInput}>
																		<Row>
																			<Col span={6}>
																				<Form.Item
																					name={`travelerTitle${traveler?.travelerId}`}
																					rules={[
																						{
																							required: true,
																							// message: "Please input a Title",
																						},
																					]}
																				>
																					<Select
																						defaultValue="Title"
																						style={{ width: "100%", height: "2.5rem", lineHeight: '2' }}
																						// style={{
																						//   width: "30%",
																						//   display: "flex",
																						//   justifyContent: "start",
																						// }}
																						placeholder="Title"
																						name={`travelerTitle${traveler?.travelerId}`}
																					>
																						<Option value="Mr">Mr</Option>
																						<Option value="Mrs">Mrs</Option>
																						<Option value="Miss">Miss</Option>
																						<Option value="Ms">Ms</Option>
																						<Option value="Master">
																							Master
																						</Option>
																						<Option value="Dr">Dr</Option>
																						<Option value="Sir">Sir</Option>
																						<Option value="Chief">Chief</Option>
																						<Option value="Alh">Alh</Option>
																						<Option value="Sen">Sen</Option>
																						<Option value="Pst">Pst</Option>
																						<Option value="HRH">HRH</Option>
																					</Select>
																				</Form.Item>
																			</Col>
																			<Col span={18}>
																				<Form.Item
																					name={`travelerSurName${traveler?.travelerId}`}
																					rules={[
																						{
																							required: true,
																							message:
																								"Please input your Surname!",
																						},
																					]}
																				// noStyle={true}
																				>
																					<Input
																						defaultValue=""
																						placeholder="Enter Surname"
																						name={`travelerSurName${traveler?.travelerId}`}
																						className=""
																						style={{
																							border: 0,
																							lineHeight: 2,
																							height: '2.5rem',
																						}}
																					/>
																				</Form.Item>
																				{/* Traveler Type */}
																				<Form.Item
																					name={`travelerType${traveler?.travelerId}`}
																					hidden={true}
																					initialValue={traveler?.travelerType}
																				>
																					<Input
																						defaultValue=""
																						name={`travelerType${traveler?.travelerId}`}
																					/>
																				</Form.Item>
																				{/* Base Price */}
																				<Form.Item
																					name={`basePrice${traveler?.travelerId}`}
																					hidden={true}
																					initialValue={
																						traveler?.priceBreakdown?.base
																					}
																				>
																					<Input
																						defaultValue=""
																						name={`basePrice${traveler?.travelerId}`}
																					/>
																				</Form.Item>
																				{/* Taxes and Fees */}
																				<Form.Item
																					name={`taxesAndFees${traveler?.travelerId}`}
																					hidden={true}
																					initialValue={
																						traveler?.priceBreakdown?.taxesAndFees
																					}
																				>
																					<Input
																						defaultValue=""
																						name={`taxesAndFees${traveler?.travelerId}`}
																					/>
																				</Form.Item>
																				{/* Total Price */}
																				<Form.Item
																					name={`totalPrice${traveler?.travelerId}`}
																					hidden={true}
																					initialValue={
																						traveler?.priceBreakdown?.total
																					}
																				>
																					<Input
																						defaultValue=""
																						name={`totalPrice${traveler?.travelerId}`}
																					/>
																				</Form.Item>
																			</Col>
																		</Row>
																	</div>
																</div>

																{/* Traveler First Name */}
																<div className="col-sm-12 col-md-6 traveler-input">
																	<span className="passenger-form-label">
																		First Name{" "}
																	</span>
																	<div className={styles.bookPageInput}>
																		<Form.Item
																			name={`travelerFirstName${traveler?.travelerId}`}
																			rules={[
																				{
																					required: true,
																					message:
																						"Please input your Firstname!",
																				},
																			]}
																		>
																			<Input
																				className={styles.inputAntd}
																				placeholder="Enter First Name"
																				name={`travelerFirstName${traveler?.travelerId}`}
																				prefix={
																					<UserOutlined
																						style={{
																							color: "#0095ff",
																							paddingRight: "1rem",
																						}}
																					/>
																				}
																				suffix={
																					<Tooltip title="Field is required">
																						<InfoCircleOutlined
																							style={{
																								color: "rgba(0,0,0,.45)",
																							}}
																						/>
																					</Tooltip>
																				}
																			/>
																		</Form.Item>
																	</div>
																</div>
															</div>
															<div className="mt-3">
																<div className="row">
																	{/* Traveler Middle Name */}
																	<div className="col-sm-12 col-md-6 traveler-input">
																		<span className="passenger-form-label">
																			Middle Name{" "}
																		</span>
																		<div className={styles.bookPageInput}>
																			<Form.Item
																				name={`travelerMiddleName${traveler?.travelerId}`}
																			>
																				<Input
																					className={styles.inputAntd}
																					placeholder="Enter Middle Name"
																					name={`travelerMiddleName${traveler?.travelerId}`}
																					prefix={
																						<UserOutlined
																							style={{
																								color: "#0095ff",
																								paddingRight: "1rem",
																							}}
																						/>
																					}
																				// suffix={
																				//   <Tooltip title="Field is required">
																				//     <InfoCircleOutlined
																				//       style={{
																				//         color: "rgba(0,0,0,.45)",
																				//       }}
																				//     />
																				//   </Tooltip>
																				// }
																				/>
																			</Form.Item>
																		</div>
																	</div>

																	{/* Traveler Country */}
																	{/* <div className="col-sm-12 col-md-3 traveler-input">
                                  <span className="passenger-form-label">
                                    Country
                                  </span>
                                  <div className={styles.inputNameField}>
                                    <Form.Item
                                      name={`travelerCountry${traveler.travelerId}`}
                                    >
                                      <Select
                                        defaultValue="Nigeria"
                                        style={{ width: "100%" }}
                                        onChange={handleChange}
                                        name={`travelerCountry${traveler.travelerId}`}
                                      >
                                        {countries.map((country, index) => (
                                          <Option
                                            value={country.name}
                                            key={index}
                                          >
                                            {country.name}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                </div> */}

																	{/* Traveler Gender */}
																	<div className="col-sm-12 col-md-3 traveler-input">
																		<span className="passenger-form-label">
																			Gender{" "}
																		</span>
																		<div className={styles.bookPageInput}>
																			<Form.Item
																				name={`travelerGender${traveler?.travelerId}`}
																				rules={[
																					{
																						required: true,
																						message: "Please input a Title",
																					},
																				]}
																			>
																				<Select
																					defaultValue="Gender"
																					style={{ width: "100%", height: "2.5rem" }}
																					onChange={handleChange}
																					name={`travelerGender${traveler?.travelerId}`}
																				// style={{
																				//   width: "100%",
																				//   height: "2.5rem",
																				//   border: "2px solid #0043a4",
																				// }}
																				>
																					<Option value={1}>Male</Option>
																					<Option value={0}>Female</Option>
																				</Select>
																			</Form.Item>
																		</div>
																	</div>
																</div>

																{/* Date of Birth */}
																{/* <div className="row mt-3">
                                <div className="col-sm-12 col-md-6 traveler-input">
                                  <div className="row">
                                    <div className="col-md-4 traveler-input">
                                    <span className="passenger-form-label">Date of Birth </span>
                                      <div className={styles.inputNameField}>
                                        <Form.Item
                                          name={`travelerYearOfBirth${traveler.travelerId}`}
                                        >
                                          <Select
                                            defaultValue="Year"
                                            style={{ width: "100%" }}
                                            onChange={handleChange}
                                            name={`travelerYearOfBirth${traveler.travelerId}`}
                                          >
                                            {years.map((year, index) => (
                                              <Option
                                                value={year.number}
                                                key={index}
                                              >
                                                {year.number}
                                              </Option>
                                            ))}
                                          </Select>
                                        </Form.Item>
                                      </div>
                                    </div>

                                    <div className="col-md-5 traveler-input">
                                    <span className="passenger-form-label mt-3"></span>
                                      <div className={styles.inputNameField}>
                                        <Form.Item
                                          name={`travelerMonthOBirth${traveler.travelerId}`}
                                        >
                                          <Select
                                            defaultValue=" Month"
                                            style={{ width: "100%" }}
                                            onChange={handleChange}
                                            name={`travelerMonthOBirth${traveler.travelerId}`}
                                          >
                                            {months.map((months, index) => (
                                              <Option
                                                value={months.value}
                                                key={index}
                                              >
                                                {months.name}
                                              </Option>
                                            ))}
                                          </Select>
                                        </Form.Item>
                                      </div>
                                    </div>
                                    <div className="col-md-3 traveler-input">
                                    <span className="passenger-form-label mt-3"></span>
                                      <div className={styles.inputNameField}>
                                        <Form.Item
                                          name={`travelerDayOfBirth${traveler.travelerId}`}
                                        >
                                          <Select
                                            defaultValue="Day"
                                            style={{ width: "100%" }}
                                            onChange={handleChange}
                                            name={`travelerDayOfBirth${traveler.travelerId}`}
                                          >
                                            {days.map((day, index) => (
                                              <Option
                                                value={day.number}
                                                key={index}
                                              >
                                                {day.number}
                                              </Option>
                                            ))}
                                          </Select>
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
															</div>
														</div>
													</Card>
												</Card>
											);
										}
									)}

									<Card
										title="Contact Information"
										className="ant-card-head-custom mt-5"
										extra={
											<small style={{ color: "rgba(252, 166, 43, 0.5)" }}>
												Protected
											</small>
										}
									>
										<Card
											className="ant-card-body-custom"
											type="inner"
											style={{ padding: "0" }}
										>
											<div className="container bookpage-input-field">
												<div className="row">
													<div className="col-sm-12 col-md-6 traveler-input">
														<span className="passenger-form-label">
															Email Address{" "}
														</span>
														<div>
															<Form.Item
																name="email"
																rules={[
																	{
																		required: true,
																		type: "email",
																		message: "Please enter valid email",

																	},
																]}
																className="contact-info-field"
															>
																<Input
																	className={styles.bookPageInput}
																	style={{
																		width: "100%",
																		height: "2.5rem",
																	}}
																	placeholder="Enter Email"
																	name="email"
																/>
															</Form.Item>
														</div>
													</div>
													{/* *********************************** */}
													<div className="col-sm-12 col-md-6 traveler-input">
														<span className="passenger-form-label">
															Mobile Number
														</span>
														<div>
															<Form.Item
																name="phone"
																rules={[
																	{
																		required: true,
																		message: "Please input your phone number",
																	},
																]}
															>
																<Input
																	name="phone"
																	className={styles.bookPageInput}
																	placeholder="Enter Mobile Number"
																	style={{
																		width: "100%",
																		height: "2.5rem",
																		border: "2px solid #0043a4",
																	}}
																	prefix={
																		<UserOutlined
																			style={{
																				color: "#0095ff",
																				paddingRight: "1rem",
																			}}
																		/>
																	}
																	suffix={
																		<Tooltip title="Field is required">
																			<InfoCircleOutlined
																				style={{ color: "rgba(0,0,0,.45)" }}
																			/>
																		</Tooltip>
																	}
																/>
															</Form.Item>
														</div>
													</div>
												</div>
											</div>
										</Card>
									</Card>
								</Form>
							</div>

							<div>
								<div className="container">
									<div className="mt-4 mb-5">
										<div className={styles.termsCondition}>
											{/* <Form.Item name="agreeToTermsAndConditions" valuePropName="checked"> */}
											{/* <Checkbox onChange={handleOnChange} defaultChecked={true}>
                        I agree to 247travels flight{" "}
                        <span onClick={showModal} style={{ color: "orange" }}>
                          terms &amp; condition{" "}
                        </span>
                      </Checkbox> */}
											<span style={{ color: "#0043a4" }}>
												{" "}
												By clicking continue, you are agreeing to the &nbsp;
											</span>
											<span
												onClick={showModal}
												style={{ color: "orange", cursor: "pointer" }}
											>
												terms &amp; conditions &nbsp;{" "}
											</span>
											{/* </Form.Item> */}
											<Button
												className="bookpage-continue-btn"
												style={{
													backgroundColor: "#0043a4",
												}}
												onClick={onContinue}
											>
												Continue
											</Button>
											{/* </a>
                  </Link> */}
										</div>
									</div>
									{/* <div className="row">
                    <div className="col-xl-3 col-lg-4 col-12"></div>
                    <div className="col-xl-9 col-lg-8 col-12"> */}
									{/* <div className="accordionSection mb-3">
                <Accordion />
              </div> */}
									{/* </div>
                  </div> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Modal
				title="Terms &amp; Conditions"
				open={isShowModal}
				onOk={handleOk}
				// footer={
				//   <ButtonAnt onClick={handleOk}>
				//     Ok
				//   </ButtonAnt>}
				cancelText={<></>}
				width={1000}
				className="termsCondition"
			>
				<p>
					1. Cancellation and Date Change penalty applicable. Penalty amount
					will depend on the Date and Time of Cancellation or Date Change.
				</p>
				<p>
					2. All booking/reservations made on 247Travels.com are subject to
					third party operating Airline&apos;s rules and terms of carriage.
				</p>
				<p>
					3. 247Travels merely acts as a travel agent of third party operating
					Airlines and SHALL have NO responsibility, whatsoever, for any
					additional cost (directly or indirectly) incurred by any passenger due
					to any delay, loss, cancellation, change, inaccurate/insufficient
					information arising whether during booking reservation or after ticket
					issuance.
				</p>
				<p>
					4. All the Arik Air flight bookings/reservations are subject to
					airline availability and are valid for 1 (one) hour from time of
					booking to payment confirmation and ticket issuance.
				</p>
				<p>
					5. All flight fare quoted on www.247travels.com are subject to
					availability, and to change at any time by the third party Airline
					operators
				</p>
				<p>
					6. Passengers are liable for; all card transactions (whether
					successful or not) travel details, compliance and adequacy of visa
					requirements, travel itinerary and names (as appear on passport)
					provided for bookings
				</p>
				<p>
					7. Ticket issuance SHALL BE subject to payment confirmation by
					247Travels.
				</p>
				<p>
					8. Please ensure that your International passport has at least 6 (six)
					months validity prior to its expiration date as 247Travels shall not
					be liable for any default.
				</p>
				<p>
					9. For all non-card transactions, please contact us at 0705 7000 247
					to confirm booking details, travel dates and travel requirements
					before proceeding to payment.
				</p>
				<p>
					10. Refund, cancellation and change requests, where applicable, are
					subject to third party operating airline&apos;s policy, plus a service
					charge of $50
				</p>
				<p>
					11. Refund settlement in 9 above, shall be pursuant to fund remittance
					by the operating airline
				</p>
				<p>
					12. Passengers are advised to arrive at the airport at least 3-5 hours
					prior to flight departure.
				</p>
				<p>
					13. First time travelers are advised to have a return flight ticket,
					confirmed hotel/accommodation and a minimum of $1000 for Personal
					Travel Allowance (PTA) or Business Travel Allowance (BTA).
				</p>
				<p>
					14. An original child&apos;s Birth Certificate and Consent letter from
					parent(s) must be presented before the check-in counter at the
					Airport.
				</p>
				<p>
					15. All tickets are non-transferable at any time. Some tickets may be
					non-refundable or non-changeable.
				</p>
				<p>
					16. Some Airlines may require additional Medical Report/Documents in
					the case of pregnant passenger(s).
				</p>
				<p>
					17. The Passenger hereby confirms to have read and understood this
					booking information notice and has agreed to waive all rights, by law
					and to hold harmless and absolve 247Travels of all liabilities that
					may arise thereof.
				</p>
			</Modal>

			<Modal
				// onCancel={() => setFlightOrderInitializationModelVisibility(false)}
				centered
				open={flightOrderInitializationModelVisibility}
				style={{ color: "#fff" }}
				width="auto"
				keyboard={false}
				footer={null}
				className="loadFlightModal"
				bodyStyle={{ backgroundColor: "#0043a4", padding: "3rem" }}
			>
				<p className="flightModalTitle">Submitting your details</p>
			</Modal>

			<ToastComponent
				ref={toastInstance}
				animation={{
					show: { effect: "SlideLeftIn", duration: 300, easing: "linear" },
					hide: { effect: "SlideLeftOut", duration: 300, easing: "linear" },
				}}
			/>
		</>
	);
};

export default Flight_match;

export function DrawerCustom() {
	const setSelectedFlightOfferObject = useSelector(
		(state) => state.store.selectedOffer
	);

	let setSelectedFlightOffer = [];

	setSelectedFlightOffer.push(setSelectedFlightOfferObject);

	// Set the useRouter hook
	const router = useRouter();
	const [visible, setVisible] = useState(false);
	const [placement, setPlacement] = useState("left");

	const showDrawer = () => {
		setVisible(true);
	};

	const onChange = (e) => {
		setPlacement(e.target.value);
	};

	const onClose = () => {
		setVisible(false);
	};
	return (
		<>
			<Space>
				<Button className="filter-Btn" type="primary" onClick={showDrawer}>
					Summary
				</Button>
			</Space>
			<Drawer
				title="Summary"
				placement={placement}
				width={500}
				onClose={onClose}
				open={visible}
			>
				<BookingSummary setSelectedFlightOffer={setSelectedFlightOffer} />
			</Drawer>
		</>
	);
}
