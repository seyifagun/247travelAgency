import React, { useState, useEffect, useLayoutEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import FlightResults from "./flightResults";
import { Spin } from "antd";
import API from "../pages/api/apiClient";
import { useSavedSearch } from "../pages/api/apiClient";
import ApiRoutes from "../pages/api/apiRoutes";
import { useDispatch } from "react-redux";
import { setAirlines } from "../redux/actions/flightActions";

export const getStaticProps = async () => {
	const result = await API.get(ApiRoutes.FetchAirports);

	// Fetch airlines
	const airlinesResult = await API.get(ApiRoutes.FetchAirlines);

	const airports = result.data.response;

	let airlines = airlinesResult.data.response;

	return {
		props: { airports: airports, airlines: airlines },
	};
};

const Flight_match = ({ airports, airlines }) => {
	// states
	const [loadSpinner, setLoadSpinner] = useState(true);

	const [searchById, setSearchById] = useState(false);

	// variables /constants /properties
	const router = useRouter();

	const savedSearch = useSavedSearch();

	// change this to getServerSideProps
	useLayoutEffect(() => {
		// Get the current url
		let urlString = window.location.href;

		// Get parameter and query strings
		let paramString = urlString.split("?")[1];
		let queryString = new URLSearchParams(paramString);

		// Check if the query parameter is present
		let checkQueryParam = queryString.has("flightRequestId");

		// Get the flightRequestId parameter from the query string
		if (checkQueryParam) {
			let flightRequestId = queryString.get("flightRequestId");
			// Invoke the payment verification request
			async function savedSearchAsync() {
				await savedSearch({ flightRequestId: flightRequestId })
					.then((response) => {
						// console.log(response.data.response);
						if (response.data.result.flightOffers.meta.count > 0) {
							if (response.data.result.flightOffers.id == null) {
								// we're searching by Id
								if (response.data.successful) {
									// update state
									setLoadSpinner(false);
									setSearchById(true);
								} else {
									// either push to error page or homepage
									router.push("/");
								}
							}
						} else {
							router.push("/flight-not-found");
						}
					})
					.catch((error) => {
						console.error("Flight Error:", error);
					});
			}
			savedSearchAsync();
		} else {
			router.push("/");
		}
	}, [router, savedSearch]);

	const dispatch = useDispatch();

	// #endregion

	// Persist airlines
	dispatch(setAirlines(airlines));

	// *********************************
	return (
		<>
			<Head>
				<title>247Travels | Flight Results</title>
			</Head>

			{loadSpinner && (
				<div
					className="center-spinner"
					style={{ textAlign: "center", margin: "100px auto" }}
				>
					<Spin size="large" />
				</div>
			)}

			{/* {searchById && <FlightResults airports={airports} />} */}
			{searchById && <FlightResults airports={airports} />}
			{/* Flight Itinery , Flight segment with fare breakdown done below  */}
		</>
	);
};

export default Flight_match;
