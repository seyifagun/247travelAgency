import React, { useState, useRef } from "react";
import styles from "../styles/BookPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
	Button as ButtonAnt,
	Tabs,
	Table,
	Descriptions,
	Modal,
	Spin,
	message,
} from "antd";
import BookingSummary from "../components/BookingSummary";
import { useEffect } from "react";
import {
	useInitializePayment,
	useInitializePayFiPayment,
} from "../pages/api/apiClient";
import ApiRoutes from "../pages/api/apiRoutes";
import API from "../pages/api/apiClient";
import { useRouter } from "next/router";
import { ToastComponent } from "@syncfusion/ej2-react-notifications";
import transferImage from "../public/payment/transfer.png";
import cardImage from "../public/payment/card.png";
import payfiImage from "../public/payment/payfi.png";
import PaystackLogo from "../public/payment/Paystack-Logo.png";
import masterCard from "../public/payment/mastercard-desktop.png";
import vervedesktop from "../public/payment/Verve-desktop.png";
import visadesktop from "../public/payment/visa-desktop.png";
import mastercardMobile from "../public/payment/mastercard-mobile.png";
import verveMobile from "../public/payment/verve-mobile.png";
import visaMobile from "../public/payment/visa-mobile.png";
//   const [displayDetails, setDisplayDetails] = useState(false);
//   const HandleChange = () => {
//       setDisplayDetails(true);
//   }

function CustomTabs({ payStackTransactionFee }) {
	const [toggleState, setToggleState] = useState(1);

	const [
		flightOrderInitializationModelVisibility,
		setFlightOrderInitializationModelVisibility,
	] = useState(false);

	const toggleTab = (index) => {
		setToggleState(index);
	};

	const setSelectedFlightOfferObject = useSelector(
		(state) => state.store.selectedOffer
	);

	let setSelectedFlightOffer = [];

	setSelectedFlightOffer.push(setSelectedFlightOfferObject);

	// Set the useRouter hook
	const router = useRouter();

	// Initialize payment api hook
	const initializePayment = useInitializePayment();

	// Initialize pay fi payment api hook
	const initializePayFiPayment = useInitializePayFiPayment();

	const toastInstance = useRef(null);

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

	return (
		<>
			<div className="container">

				<div className="bloc-tabs">
					{/* Reservation */}
					<button
						className={toggleState === 1 ? "tabs active-tabs " : "tabs"}
						onClick={() => toggleTab(1)}
					>
						<div>
							<div className="tabPayLaterDiv tabPayQuery position-relative">
								<div className="bankTransferDiv bankTransferDiv-query">
									<strong className="strongTransferText">
										Continue and Pay Later
									</strong>
								</div>
								<div className="bankTransferDiv-query-mobile">
									<strong className="strongTransferTextMobile">
										Pay Later
									</strong>
								</div>
								<div className="transfer-img-div position-absolute">
									<Image
										src={transferImage}
										height={50}
										width={50}
										alt={"transfer-img"}
									/>{" "}
								</div>
							</div>
							{/* <div className="arrow-down"></div> */}
						</div>
					</button>

					{/* PayStack */}
					<button
						className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
						onClick={() => toggleTab(2)}
					>
						<div>
							<div className="tabPayCardDiv tabPayQuery position-relative">
								<div className="bankTransferDiv bankTransferDiv-query">
									<strong className="bankTransferDiv-query-desktop">
										Continue with Card Payment
									</strong>
								</div>
								<div className="bankTransferDiv-query-mobile">
									<strong className="bankTransferDiv-query-mobile">
										Card Payment
									</strong>
								</div>
								<div className="transfer-img-div position-absolute">
									<Image
										src={cardImage}
										height={50}
										width={50}
										alt={"transfer-img"}
									/>
								</div>
							</div>
							{/* <div className="arrow-down"></div> */}
						</div>
					</button>

					{/* PayFi */}
					<button
						className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
						onClick={() => toggleTab(3)}
					>
						<div>
							<div className="tabPayPayfiDiv tabPayQuery position-relative">
								<div className="bankTransferDiv bankTransferDiv-query">
									<strong className="bankTransferDiv-query-desktop">
										Pay with Pay Fi
									</strong>
								</div>
								{/* CODE to show style on mobile via media query */}
								<div className="">
									<strong className="bankTransferDiv-query-mobile">
										Pay-Fi
									</strong>
								</div>
								<div className="transfer-img-div position-absolute">
									<Image
										src={payfiImage}
										height={50}
										width={150}
										alt={"transfer-img"}
									/>{" "}
								</div>
							</div>
							{/* <div className="arrow-down"></div> */}
						</div>
					</button>
				</div>

				<div className="content-tabs mt-3">

					{/* Reservation */}
					<div
						className={
							toggleState === 1 ? "content  active-content" : "content"
						}
					>
						<div className="bankAccountWrapper">
							<strong>Account Name: 247 Travels &amp; Vacation Ltd</strong>
						</div>
						<div className="bankAccountWrapper-query"></div>
						<br />
						<Table
							dataSource={[
								{
									bank: "Sterling Bank PLC",
									accountNumber: "0027784775",
								},
								{
									bank: "Fidelity Bank PLC",
									accountNumber: "5600032999",
								},
								{
									bank: "First City Monument Bank Plc. (FCMB)",
									accountNumber: "2244296019",
								},
							]}
							pagination={false}
						>
							<Table.Column key="bank" title="Bank" dataIndex="bank" />
							<Table.Column
								key="accountNumber"
								title="Account Number"
								dataIndex="accountNumber"
							/>
						</Table>
						<br />
						<div className="pay-btn-wrapper">
							<ButtonAnt
								className="pay-btn"
								onClick={async () => {
									setFlightOrderInitializationModelVisibility(true);
									await API.post(ApiRoutes.ReserveFlight, {
										customerId: window.localStorage.getItem("customerId"),
										flightOrderId: window.localStorage.getItem("flightOrderId"),
									})
										.then((result) => {
											// TODO: Remove log
											console.log("Reservation Result:", result);

											if (result.data.successful) {
												// Set the reservation id
												window.localStorage.setItem(
													"reservationId",
													result.data.response.reservationId
												);
												// Navigate to flight reservation success page
												router.push("/reservationResult");
											} else {
												console.log(result.data.errorMessage);
												// Display error...
												setFlightOrderInitializationModelVisibility(false);
												message.error(result.data.errorMessage, 3);
											}
										})
										.catch((error) => {
											setFlightOrderInitializationModelVisibility(false);
											console.log(error);

											// Display error
											message.error(error.message, 3);
											// Log the error
											console.log("Reservation Error:", error);
											console.error("Reservation Error:", error);
										});
								}}
							>
								Confirm Reservation
							</ButtonAnt>
						</div>
					</div>

					{/* PayStack */}
					<div
						className={
							toggleState === 2 ? "content  active-content" : "content"
						}
					>
						<div className="">
							<div className="payment-type">
								<span className="" style={{ color: "grey", fontWeight: "600" }}>
									Payment methods supported are listed below
								</span>
								<div className="cardPayImg" style={{ margin: "1.5rem 0" }}>
									<div className="payment-platforms">
										<div className="row">
											<div className="desktop-transfer-platform col-4">
												{" "}
												<Image src={masterCard} alt={""} />{" "}
											</div>
											<div className="desktop-transfer-platform col-4">
												{" "}
												<Image src={vervedesktop} alt={""} />{" "}
											</div>
											<div className="desktop-transfer-platform col-4">
												{" "}
												<Image src={visadesktop} alt={""} />{" "}
											</div>
										</div>
									</div>
									<div className="payment-platforms-mobile">
										<div className="row">
											<div className="mobile-transfer-platform col-4">
												{" "}
												<Image src={mastercardMobile} alt={""} />{" "}
											</div>
											<div className="mobile-transfer-platform col-4">
												{" "}
												<Image src={verveMobile} alt={""} />{" "}
											</div>
											<div className="mobile-transfer-platform col-4">
												{" "}
												<Image src={visaMobile} alt={""} />{" "}
											</div>
										</div>
									</div>

									<div
										className="mt-3 mb-5"
										style={{ display: "flex", flexDirection: "column" }}
									>
										<div>
											<p>Pay with</p>
											<Image
												src={PaystackLogo}
												alt={""}
												width={150}
												height={25}
											/>
										</div>
									</div>
								</div>
								<div
									className="Total"
									style={{ color: "#0043a4", fontWeight: "700", marginBottom: '15px' }}
								>
									{/* TODO: Display original price */}
									<p style={{ marginBottom: '0', lineHeight: 1 }}>
										{parseFloat(
											setSelectedFlightOffer[0]?.priceBreakdown?.total
										).toLocaleString("en-NG", {
											style: "currency",
											currency: "NGN",
										})}
									</p>
									<small>
										Transaction Fee: {parseFloat(payStackTransactionFee).toLocaleString('en-NG', {
											style: 'currency',
											currency: 'NGN'
										})}
									</small>
								</div>
								<ButtonAnt
									className="pay-btn secure-payment-btn"
									onClick={async () => {
										await API.post("api/payment/initialize", {
											customerId: window.localStorage.getItem("customerId"),
											flightOrderId:
												window.localStorage.getItem("flightOrderId"),
											amount: setSelectedFlightOffer[0]?.priceBreakdown?.total,
											callbackUrl: `${ApiRoutes.FRONTEND_BASE_URL_LIVE}paymentVerify`,
										})
											.then((result) => {
												// TODO: Remove log
												console.log("Payment Initialize Result:", result);
												if (result.data.successful) {
													window.location.replace(
														result.data.response.data.authorizationUrl
													);
												} else {
													// Display error...
													message.error(result.data.errorMessage, 3);

												}
											})
											.catch((error) => {
												// Log the error
												console.error("Payment Initialize Error:", error);
												// Display error
												message.error(error, 3);
											});
									}}
								>
									Pay Securely
								</ButtonAnt>
								<div style={{ margin: "1rem 0" }}>
									{/* <span style={{ color: "grey", fontWeight: "600" }}>
                    This booking is 100% secured
                  </span> */}
								</div>
								{/* <div
                        style={{
                          margin: "2rem 0",
                          display: "flex",
                          justifyContent: "space-between",
                          width: "50%",
                          display: "inline-flex",
                        }}
                      >
                        <span style={{ color: "grey", fontWeight: "600" }}>
                          Secure transmission
                        </span>
                        <span style={{ color: "grey", fontWeight: "600" }}>
                          Encrypted storage
                        </span>
                      </div> */}
							</div>
						</div>
					</div>

					{/* PayFi */}
					<div
						className={
							toggleState === 3 ? "content  active-content" : "content"
						}
					>
						<div>
							<div className="payment-type">
								<div className="cardPayImg" style={{ margin: "1.5rem 0" }}>
									<div
										className="mt-3 mb-5"
										style={{ display: "flex", flexDirection: "column" }}
									>
										<div>
											<p>Pay with</p>
											<Image
												src={payfiImage}
												alt={""}
												width={150}
												height={50}
											/>
											<p className="mt-3">
												Buy Now, Pay Later with Payfi to split the cost of your
												purchase into 4 equal payments.
											</p>
											<div>Pay in 4 - 6 Installments</div>
										</div>
									</div>
								</div>
								<div
									className="Total"
									style={{ color: "#0043a4", fontWeight: "700" }}
								>
									{/* TODO: Display original price */}
									<p>
										{parseFloat(
											setSelectedFlightOffer[0]?.priceBreakdown?.total
										).toLocaleString("en-NG", {
											style: "currency",
											currency: "NGN",
										})}
									</p>
								</div>
								<ButtonAnt
									className="pay-btn secure-payment-btn"
									onClick={async () => {
										await API.post(ApiRoutes.InitializePayFiPayment, {
											customerId: window.localStorage.getItem("customerId"),
											flightOrderId:
												window.localStorage.getItem("flightOrderId"),
											amount: setSelectedFlightOffer[0]?.priceBreakdown?.total,
											callbackUrl: `${ApiRoutes.FRONTEND_BASE_URL_LIVE}paymentVerify`,
										})
											.then((result) => {
												// TODO: Remove log
												console.log("Payment Initialize Result:", result);
												if (result.data.successful) {
													window.location.replace(
														`https://dev.dagtkmdzhzacz.amplifyapp.com/?token=${result.data.response.token}`
													);
												} else {
													// Display error...
													message.error(
														"Your payment could not be processed, please try again later!"
													);
												}
											})
											.catch((error) => {
												// Log the error
												console.error("Payment Initialize Error:", error);
												// Display error
												message.error(
													"Your payment could not be processed, please try again later!"
												);
											});
									}}
								>
									Pay Securely
								</ButtonAnt>
								<div style={{ margin: "1rem 0" }}>
									{/* <span style={{ color: "grey", fontWeight: "600" }}>
                    This booking is 100% secured
                  </span> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal
				onCancel={() => setFlightOrderInitializationModelVisibility(false)}
				centered
				open={flightOrderInitializationModelVisibility}
				style={{ color: "#fff" }}
				width="auto"
				keyboard={false}
				footer={null}
				className="loadFlightModal"
				bodyStyle={{ backgroundColor: "#0043a4", padding: "3rem" }}
			>
				<p className="flightModalTitle">Booking your reservation</p>
				<div className="spinner-center">
					<Spin />
				</div>
			</Modal>
		</>
	);
}

export default CustomTabs;
