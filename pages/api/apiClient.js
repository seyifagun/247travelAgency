import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
	setAirports,
	setFlightRequestMeta,
	setFlightResults,
	setLoginCredentials,
	setSelectedFlightOffer,
} from "../../redux/actions/flightActions";
import ApiRoutes from "./apiRoutes";
import https from "https";
import RouteModel from "../../components/routeModel";

const BASE_URL = ApiRoutes.BASE_URL_LIVE;

const httpsAgent = new https.Agent({
	rejectUnauthorized: false,
});

export default axios.create({
	baseURL: BASE_URL,
	httpsAgent,
});

const API = axios.create({
	baseURL: BASE_URL,
	httpsAgent,
});

function checkProperties(obj) {
	for (var key in obj) {
		if (obj[key] !== null && obj[key] != "") {
			return false;
		}
	}
	return true;
}

export function useFetchAirportsWithReturnData() {
	async function fetchAirportsWithReturnData() {
		var result = await API.get(ApiRoutes.FetchAirports);

		return result;
	}

	return fetchAirportsWithReturnData;
}

export function useFetchAirports() {
	const dispatch = useDispatch();

	async function fetchAirports() {
		var data = {
			url: `${BASE_URL}api/airports/fetch`,
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": "https:localhost:3000",
				"Access-Control-Allow-Credentials": true,
			},
		};
		await axios(data)
			.then((result) => {
				// result.data.response.forEach(airport => {
				//   airport.name = airport.name.toUpperCase(),
				//   airport.city = airport.city.toUpperCase(),
				//   airport.country = airport.country.toUpperCase(),
				//   airport.iataCode = airport.iataCode.toUpperCase()
				// });
				// console.log(result);
				const newData = [
					...new Set(
						result.data.response.map((x) => ({
							iataCode: x.iataCode,
							name: x.name,
							city: x.city,
							country: x.country,
						}))
					),
				];
				dispatch(setAirports(newData));
			})
			.catch((err) => {
				console.error("HttpErr:", err);
			});
	}

	return fetchAirports;
}

export function useFetchFlightResultsOneway() {
	let loginCredentials = useSelector((state) => state.store.loginCredentials);
	const dispatch = useDispatch();

	async function fetchFlightResultsOneway(data) {
		var originDestinations = [];

		var travelers = [];

		var sources = ["GDS"];

		var searchCriteria = {
			maxFlightOffers: 250,
			flightFilters: {
				connectionRestriction: {
					maxNumberOfConnections: data.directFlightOnly ? "0" : null,
				},
				cabinRestrictions: [
					{
						cabin: data.flightClass.toUpperCase(),
						coverage: "ALL_SEGMENTS",
						// remind peter the meaning of this json
						originDestinationIds: ["1"],
					},
				]
			},
			additionalInformation: {
				chargeableCheckedBags: false,
				brandedFares: false,
				fareRules: false,
			},
			pricingOptions: {
				fareType: ["CORPORATE", "PUBLISHED", "NEGOTIATED"],
			},
		};

		for (let i = 1; i <= data.numberOfAdults; i++) {
			travelers.push({
				id: i,
				travelerType: "ADULT",
				fareOptions: ["STANDARD"],
			});
		}

		if (!data.numberOfChildren < 1) {
			for (let i = 1; i <= data.numberOfChildren; i++) {
				travelers.push({
					id: i,
					travelerType: "CHILD",
					fareOptions: ["STANDARD"],
				});
			}
		}

		if (!data.numberOfInfants < 1) {
			for (let i = 1; i <= data.numberOfInfants; i++) {
				travelers.push({
					id: i,
					associatedAdultId: (data.numberOfAdults - (data.numberOfAdults - i)).toString(),
					travelerType: "HELD_INFANT",
					fareOptions: ["STANDARD"],
				});
			}
		}

		travelers.forEach((traveler, index) => {
			let id = ++index;
			traveler.id = id.toString();
		});

		originDestinations.push({
			id: "1",
			originLocationCode: data.originLocationCityCode,
			destinationLocationCode: data.originDestinationCityCode,
			departureDateTimeRange: {
				date: data.departureDate,
				// do logic for the dateWindow
				dateWindow: data.dateWindow ? "I3D" : null,
			},
		});

		// Set the search credentials
		var searchCredentials = {
			currencyCode: "NGN",
			originDestinations: originDestinations,
			travelers: travelers,
			sources: sources,
			searchCriteria: searchCriteria,
		};

		// Set the body of the request
		var content = {
			credentials: searchCredentials,
			meta: {
				routeModel: RouteModel.OneWay,
				flightRequest: JSON.stringify(data),
			},
		};

		let headers;
		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		// Set the request options
		var options = {
			url: `${BASE_URL}api/flightrequest/save`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
			headers: headers,
		};

		var result = await API.post(ApiRoutes.SaveFlightRequest, content, {
			headers
		});
		// dispatch(setFlightRequestMeta(content));

		// return await axios(options)
		//   .then(async (result) => {
		//     return result;
		//   })
		//   .catch((err) => {
		//     console.error("Http Error", err);
		//     throw new Error(err);
		//   });
		return result;
	}

	return fetchFlightResultsOneway;
}

export function useFetchFlightResults() {
	const dispatch = useDispatch();
	let loginCredentials = useSelector((state) => state.store.loginCredentials);

	async function fetchFlightResults(data) {
		var originDestinations = [];

		var travelers = [];

		var sources = ["GDS"];

		var searchCriteria = {
			maxFlightOffers: 250,
			flightFilters: {
				connectionRestriction: {
					maxNumberOfConnections: data.directFlightOnly ? "0" : null,
				},
				cabinRestrictions: [
					{
						cabin: data.flightClass,
						coverage: "ALL_SEGMENTS",
						// remind peter the meaning of this json
						originDestinationIds: ["1", "2"],
					},
				]
			},
			additionalInformation: {
				chargeableCheckedBags: false,
				brandedFares: false,
				fareRules: false,
			},
			pricingOptions: {
				fareType: data.dateWindow ? ["PUBLISHED", "NEGOTIATED"] : ["CORPORATE", "PUBLISHED", "NEGOTIATED"]
			},
		};

		for (let i = 1; i <= data.numberOfAdults; i++) {
			travelers.push({
				id: i,
				travelerType: "ADULT",
				fareOptions: ["STANDARD"],
			});
		}

		if (!data.numberOfChildren < 1) {
			for (let i = 1; i <= data.numberOfChildren; i++) {
				travelers.push({
					id: i,
					travelerType: "CHILD",
					fareOptions: ["STANDARD"],
				});
			}
		}

		if (!data.numberOfInfants < 1) {
			for (let i = 1; i <= data.numberOfInfants; i++) {
				travelers.push({
					id: i,
					associatedAdultId: (data.numberOfAdults - (data.numberOfAdults - i)).toString(),
					travelerType: "HELD_INFANT",
					fareOptions: ["STANDARD"],
				});
			}
		}

		travelers.forEach((traveler, index) => {
			let id = ++index;
			traveler.id = id.toString();
		});

		originDestinations.push({
			id: "1",
			originLocationCode: data.originLocationCityCode,
			destinationLocationCode: data.originDestinationCityCode,
			departureDateTimeRange: {
				date: data.departureDate,
				// do logic for the dateWindow
				dateWindow: data.dateWindow ? "I3D" : null,
			},
		});

		originDestinations.push({
			id: "2",
			originLocationCode: data.originDestinationCityCode,
			destinationLocationCode: data.originLocationCityCode,
			departureDateTimeRange: {
				date: data.returningDate,
				// do logic for the dateWindow
				dateWindow: data.dateWindow ? "I3D" : null,
			},
		});

		// Set the search credentials
		var searchCredentials = {
			currencyCode: "NGN",
			originDestinations: originDestinations,
			travelers: travelers,
			sources: sources,
			searchCriteria: searchCriteria,
		};

		// Set the body of the request
		var content = {
			credentials: searchCredentials,
			meta: {
				dateWindow: data.dateWindow,
				routeModel: RouteModel.RoundTrip,
				flightRequest: JSON.stringify(data),
			},
		};

		let headers = {};

		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		var result = await API.post(ApiRoutes.SaveFlightRequest, content, {
			headers
		});

		// dispatch(setFlightRequestMeta(content));

		return result;
	}

	return fetchFlightResults;
}

export function useFetchFlightResultsMultiCity() {
	const dispatch = useDispatch();
	let loginCredentials = useSelector((state) => state.store.loginCredentials);

	async function fetchFlightResultsMultiCity(
		data,
		originDestinations,
		searchRows
	) {
		// Initialize origin destination ids
		var originDestinationIds = [];

		// Set origin destination id based on origin destination
		originDestinations.forEach((origin, index) => {
			let id = index + 1;
			originDestinationIds.push(id.toString());
		});

		var travelers = [];

		var sources = ["GDS"];

		var searchCriteria = {
			maxFlightOffers: 250,
			flightFilters: {
				connectionRestriction: {
					maxNumberOfConnections: data.directFlightOnly ? "0" : null,
				},
				cabinRestrictions: [
					{
						cabin: data.flightClass,
						coverage: "ALL_SEGMENTS",
						// remind peter the meaning of this json
						originDestinationIds: originDestinationIds,
					},
				]
			},
			additionalInformation: {
				chargeableCheckedBags: false,
				brandedFares: false,
				fareRules: false,
			},
			pricingOptions: {
				fareType: ["CORPORATE", "PUBLISHED", "NEGOTIATED"]
			},
		};

		for (let i = 1; i <= data.numberOfAdults; i++) {
			travelers.push({
				id: i,
				travelerType: "ADULT",
				fareOptions: ["STANDARD"],
			});
		}

		if (!data.numberOfChildren < 1) {
			for (let i = 1; i <= data.numberOfChildren; i++) {
				travelers.push({
					id: i,
					travelerType: "CHILD",
					fareOptions: ["STANDARD"],
				});
			}
		}

		if (!data.numberOfInfants < 1) {
			for (let i = 1; i <= data.numberOfInfants; i++) {
				travelers.push({
					id: i,
					associatedAdultId: (data.numberOfAdults - (data.numberOfAdults - i)).toString(),
					travelerType: "HELD_INFANT",
					fareOptions: ["STANDARD"],
				});
			}
		}

		travelers.forEach((traveler, index) => {
			let id = ++index;
			traveler.id = id.toString();
		});

		// Set the search credentials
		var searchCredentials = {
			currencyCode: "NGN",
			originDestinations: originDestinations,
			travelers: travelers,
			sources: sources,
			searchCriteria: searchCriteria,
		};

		// Set the body of the request
		var content = {
			credentials: searchCredentials,
			meta: {
				routeModel: RouteModel.MultiCity,
				searchRows: searchRows,
				flightRequest: JSON.stringify(data),
			},
		};

		let headers = {};
		// console.log(loginCredentials.response);
		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		var options = {
			url: `${BASE_URL}api/flightrequest/save`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
			headers: headers,
		};

		return await axios(options)
			.then(async (result) => {
				// dispatch(setFlightRequestMeta(content));
				// Return the response
				return result;
			})
			.catch((err) => {
				console.error("Http Error", err);
				throw new Error("Could not contact the server");
			});
	}

	return fetchFlightResultsMultiCity;
}

export function useLogin() {
	const dispatch = useDispatch();
	async function login(data) {
		let content = {
			usernameOrEmail: data.username,
			password: data.password,
		};

		// dispatch(setLogin(content));
		// console.log("Login Request Content", content);

		let options = {
			url: `${BASE_URL}api/login`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
		};

		return await axios(options)
			.then(async (result) => {
				dispatch(setLoginCredentials(result.data));
				return result.data;
				// console.log("Login Response:", result);
				// Set the search results in redux
			})
			.catch((err) => {
				// console.log("Http Error", err);
				throw new Error("Could not contact the server");
			});
	}
	return login;
}

export function useSignUp() {
	// const dispatch = useDispatch();
	async function signUp(data) {
		let content = {
			title: data.title,
			firstName: data.firstname,
			lastName: data.surname,
			username: data.email,
			email: data.email,
			mobileNumber: data.number,
			countryCallingCode: "234",
			password: data.password,
			businessName: data.business_name,
			businessAddress: data.business_address,
		};

		// dispatch(setLogin(content));
		// console.log("Login Request Content", content);
		// return;

		let options = {
			url: `${BASE_URL}api/affilate/register`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
		};

		return await axios(options)
			.then(async (result) => {
				// dispatch(setLoginCredentials(result.data));
				// console.log(result);
				return result.data;
				// console.log("Login Response:", result);
				// Set the search results in redux
			})
			.catch((err) => {
				// console.log("Http Error", err);
				throw new Error("Could not contact the server");
			});
	}
	return signUp;
}

export function useSignUpB2C() {
	// const dispatch = useDispatch();
	async function signUpB2C(data) {
		let content = {
			title: data.title,
			firstName: data.firstname,
			lastName: data.surname,
			username: data.email,
			email: data.email,
			mobileNumber: data.number,
			countryCallingCode: "234",
			password: data.password,
		};

		// dispatch(setLogin(content));
		// console.log("Login Request Content", content);
		// return;

		let options = {
			url: `${BASE_URL}api/register`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
		};

		return await axios(options)
			.then(async (result) => {
				// dispatch(setLoginCredentials(result.data));
				// console.log(result);
				return result.data;
				// console.log("Login Response:", result);
				// Set the search results in redux
			})
			.catch((err) => {
				return "Something went wrong. Could not connect to the server";
				console.log("Http Error", err);
				throw new Error("Could not contact the server");
			});
	}
	return signUpB2C;
}

export function useForgotPassword() {
	// const dispatch = useDispatch();
	async function forgotPassword(data) {
		let content = {
			email: data.email,
		};

		// dispatch(setLogin(content));
		// console.log("Login Request Content", content);
		// return;

		let options = {
			url: `${BASE_URL}api/passwordresettoken/send`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
		};

		return await axios(options)
			.then(async (result) => {
				// dispatch(setLoginCredentials(result.data));
				// console.log(result);
				return result.data;
				// console.log("Login Response:", result);
				// Set the search results in redux
			})
			.catch((err) => {
				return "Something went wrong. Could not connect to the server";
				console.log("Http Error", err);
				throw new Error("Could not contact the server");
			});
	}
	return forgotPassword;
}

export function useResetPassword() {
	// const dispatch = useDispatch();
	async function resetPassword(data, userId, resetToken) {
		let content = {
			userId: userId,
			resetToken: encodeURIComponent(resetToken),
			newPassword: data.password,
		};

		let options = {
			url: `${BASE_URL}api/password/reset`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
		};

		return await axios(options)
			.then(async (result) => {
				// dispatch(setLoginCredentials(result.data));
				// console.log(result);
				return result.data;
				// console.log("Login Response:", result);
				// Set the search results in redux
			})
			.catch((err) => {
				return "Something went wrong. Could not connect to the server";
				console.log("Http Error", err);
				throw new Error("Could not contact the server");
			});
	}
	return resetPassword;
}

export function useChangePassword() {
	let loginCredentials = useSelector((state) => state.store.loginCredentials);
	// const dispatch = useDispatch();
	async function changePassword(data) {
		let content = {
			currentPassword: data.old_password,
			newPassword: data.new_password,
		};

		// dispatch(setLogin(content));
		// console.log("Login Request Content", content);
		// return;

		let headers = {};
		// console.log(loginCredentials.response);
		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		let options = {
			url: `${BASE_URL}api/password/change`,
			method: "post",
			data: content,
			httpsAgent: httpsAgent,
			headers: headers,
		};

		return await axios(options)
			.then(async (result) => {
				// dispatch(setLoginCredentials(result.data));
				// console.log(result);
				return result.data;
				// console.log("Login Response:", result);
				// Set the search results in redux
			})
			.catch((err) => {
				// console.log("Http Error", err);
				throw new Error("Could not contact the server");
				return "Something went wrong. Could not connect to the server";
			});
	}
	return changePassword;
}

export function useShareFlightResults() {
	const dispatch = useDispatch();
	let loginCredentials = useSelector((state) => state.store.loginCredentials);

	async function shareFlightResults(data) {
		var content = {
			contactEmail: data.email,
			offerInfo: data.offerInfo,
		};

		let headers = {};

		headers = {
			"Ama-Client-Ref": localStorage.getItem("Ama-Client-Ref"),
		};

		var result = await API.post(`${BASE_URL}api/flightoffer/send`, content, {
			headers
		});

		return result;
	}

	return shareFlightResults;
}

export function useConfirmPrice() {
	const dispatch = useDispatch();

	async function confirmPrice(data) {
		dispatch(setSelectedFlightOffer(data));

		let headers = {};

		headers = {
			"Ama-Client-Ref": data?.amaClientRef
		};

		var options = {
			url: `${BASE_URL}api/flight/offers/pricing/?offerId=${data?.id}&officeId=${data?.officeId}`,
			method: "get",
			// data: content,
			httpsAgent: httpsAgent,
			headers: headers,
		};

		return await axios(options)
			.then(async (result) => {
				console.log('API Result:', result.data.result);
				// 1. Update the pricing.
				// update priceBreakdown object
				data.priceBreakdown = result?.data?.result?.verifiedPriceBreakdown;
				data.travelerPricings = result?.data?.result?.travelerPricings;
				
				// 2. dispatch the json data
				if (result?.data?.response?.priceChanged) {
					data = {
						...data,
						priceChangeStatus: true,
					};

					dispatch(setSelectedFlightOffer(data));
					return "This price has changed";
				}

				dispatch(setSelectedFlightOffer(data));

				return;
			})
			.catch((err) => {
				console.error("Http Error", err);
				console.log("Http Error", err);
				return "Something went wrong, Could not contact the server";
				throw new Error("Could not contact the server");
			});
	}

	return confirmPrice;
}

export function useFetchFareRules() {

	async function fetchFareRules(offerId) {
		// Set headers
		let headers = { 'Ama-Client-Ref': localStorage.getItem("Ama-Client-Ref") };

		// Send the request
		var result = API.get(`${BASE_URL}api/flight/offers/pricing/${offerId}?includeFareRules=true`, {
			headers: headers,
		});

		// Return the result
		return result;
	}

	return fetchFareRules;
}

export function useInitializeFlightOrder() {
	let loginCredentials = useSelector((state) => state.store.loginCredentials);
	async function initializeFlightOrder(
		travelerInfo,
		travelerPricings,
		priceBreakdown,
		flightOfferId,
		officeId
	) {
		var travelers = [];

		travelerPricings.forEach((traveler, index) => {
			// Set keys
			let travelerTitle = `travelerTitle${traveler.travelerId}`;
			let travelerSurName = `travelerSurName${traveler.travelerId}`;
			let travelerFirstName = `travelerFirstName${traveler.travelerId}`;
			let travelerMiddleName = `travelerMiddleName${traveler.travelerId}`;
			let travelerType = `travelerType${traveler.travelerId}`;
			let basePrice = `basePrice${traveler.travelerId}`;
			let taxesAndFees = `taxesAndFees${traveler.travelerId}`;
			let totalPrice = `totalPrice${traveler.travelerId}`;
			// let travelerCountry = `travelerCountry${traveler.travelerId}`;
			let travelerCountry = `Nigeria`;
			let travelerGender = `travelerGender${traveler.travelerId}`;
			// let travelerYearOfBirth = `travelerYearOfBirth${traveler.travelerId}`;
			let travelerYearOfBirth = `1960`;
			// let travelerMonthOBirth = `travelerMonthOBirth${traveler.travelerId}`;
			let travelerMonthOBirth = `01`;
			// let travelerDayOfBirth = `travelerDayOfBirth${traveler.travelerId}`;
			let travelerDayOfBirth = `01`;

			travelers.push({
				title: travelerInfo[travelerTitle],
				firstName: travelerInfo[travelerFirstName],
				lastName: travelerInfo[travelerSurName],
				middleName: travelerInfo[travelerMiddleName],
				travelerId: traveler.travelerId,
				travelerType: travelerInfo[travelerType],
				basePrice: travelerInfo[basePrice],
				taxesAndFees: travelerInfo[taxesAndFees],
				totalPrice: travelerInfo[totalPrice],
				nationality: travelerCountry,
				gender: travelerInfo[travelerGender],
				dateOfBirth: `${travelerYearOfBirth}-${travelerMonthOBirth}-${travelerDayOfBirth}`,
			});
		});

		// Set the body of the request
		var content = {
			officeId: officeId,
			flightOfferId: flightOfferId,
			travelers: travelers,
			priceBreakdown: priceBreakdown,
			travelerContact: {
				email: travelerInfo.email,
				phone: travelerInfo.phone,
				countryCallingCode: "234",
			},
		};

		// Set the headers
		let headers = {
			"Ama-Client-Ref": window.localStorage.getItem("Ama-Client-Ref"),
		};

		// let headers = {};
		// console.log(loginCredentials.response);
		if (checkProperties(loginCredentials) == false) {
			headers = {
				...headers,
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		// Fire the request
		var result = await API.post(ApiRoutes.InitializeFlightOrder, content, {
			headers: headers,
		});

		// Return the result
		return result;
	}

	return initializeFlightOrder;
}

// Initialize payment transaction
export function useInitializePayment() {
	async function initializePayment(data) {
		// Set the body of the request
		let content = {
			customerId: data.customerId,
			flightOrderId: data.flightOrderId,
			amount: data.amount,
			callbackUrl: data.callbackUrl,
		};

		// Fire the API request
		let result = await API.post(ApiRoutes.InitializePayment, content, {
			headers,
		});

		// Return the API response
		return result;
	}

	return initializePayment;
}

// Verify payment transaction
export function useVerifyPayment() {
	async function verifyPayment(data) {
		// Fire the API request
		var result = await API.get(
			`${ApiRoutes.VerifyPayment}?trxref=${data.trxref}&reference=${data.reference}`
		);

		// Return the response
		return result;
	}

	return verifyPayment;
}

// Verify payment transaction
export function useSavedSearch() {
	const dispatch = useDispatch();
	let loginCredentials = useSelector((state) => state.store.loginCredentials);
	async function savedSearch(data) {
		let headers = {};
		// console.log(loginCredentials.response);
		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		// Fire the API request
		var response = await API.get(
			`${ApiRoutes.SavedSearch}?flightRequestId=${data.flightRequestId}`,
			{ headers }
		);

		// Persist flight offers
		dispatch(setFlightResults(response.data.result.flightOffers));

		// Persist search meta data
		dispatch(setFlightRequestMeta(response.data.result.searchMeta));

		localStorage.setItem("Ama-Client-Ref", response.data.result.searchMeta.amaClientRef);

		// Return the response
		return response;
	}

	return savedSearch;
}

// Retrieve Search History
export function useFetchSavedSearch() {
	const dispatch = useDispatch();
	let loginCredentials = useSelector((state) => state.store.loginCredentials);
	async function fetchSavedSearch(data) {
		let headers = {};

		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		// Fire the API request
		var result = await API.get(`${ApiRoutes.FetchSavedSearch}`, { headers });

		dispatch(setFlightResults(result.data.response));

		// Return the response
		return result;
	}

	return fetchSavedSearch;
}

// Retrieve Reservation History
export function useFetchReservation() {
	const dispatch = useDispatch();
	let loginCredentials = useSelector((state) => state.store.loginCredentials);
	async function fetchReservation() {
		let headers = {};
		console.log(loginCredentials.response);
		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		// Fire the API request
		var result = await API.get(`${ApiRoutes.FetchReservation}`, { headers });

		dispatch(setFlightResults(result.data.response));

		// Return the response
		return result;
	}

	return fetchReservation;
}

// Retrieve Payments History
export function useFetchPayment() {
	const dispatch = useDispatch();
	let loginCredentials = useSelector((state) => state.store.loginCredentials);
	async function fetchPayments() {
		let headers = {};

		if (checkProperties(loginCredentials) == false) {
			headers = {
				Authorization: `Bearer ${loginCredentials.response.token}`,
			};
		}

		// Fire the API request
		var result = await API.get(`${ApiRoutes.FetchPayments}`, { headers });

		dispatch(setFlightResults(result.data.response));

		// Return the response
		return result;
	}

	return fetchPayments;
}

// Verify Email
export function useVerifyEmail() {
	async function verifyEmail(data) {
		// Fire the API request
		var result = await API.get(
			`${ApiRoutes.VerifyEmail}?userId=${data.userId}&emailToken=${data.emailToken}`
		);

		// Return the response
		return result;
	}

	return verifyEmail;
}

export function useInitializeFlightReservation() {
	async function initializeFlightReservation() {
		var result = await API.post(ApiRoutes.ReserveFlight);

		return result;
	}

	return initializeFlightReservation;
}

export function useCreateNewsletterSubscriber() {
	async function createNewsletterSubscriber(data) {
		// Set the request content
		var content = {
			email: data.email,
		};

		// Fire the API request
		let result = await API.post(ApiRoutes.CreateNewsletterSubscriber, content);

		// Return the API response
		return result;
	}

	return createNewsletterSubscriber;
}

// Create contact
export function useCreateContact() {
	async function createContact(data) {
		// Set the request content
		var content = {
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: data.phoneNumber,
			email: data.email,
			contactMessage: data.contactMessage,
		};

		// Fire the API request
		let result = await API.post(ApiRoutes.CreateEnquiry, content);

		// Return the API response
		return result;
	}

	return createContact;
}

// Create enquiry
export function useCreateClientEnquiry() {
	async function createClientEnquiry(data) {
		// Set the request content
		var content = {
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: data.phoneNumber,
			email: data.email,
			offerType: data.offerType,
		};

		// Fire the API request
		let result = await API.post(ApiRoutes.CreateEnquiry, content);

		// Return the API response
		return result;
	}

	return createClientEnquiry;
}

export function useInitializePayFiPayment() {
	async function initializePayFiPayment(data) {
		// Set the request content
		var content = {
			customerId: data.customerId,
			flightOrderId: data.flightOrderId,
			amount: data.amount,
			callbackUrl: data.callbackUrl,
		};

		// Fire the API request
		let result = await API.post(ApiRoutes.initializePayFiPayment, content);

		// Return the API response
		return result;
	}

	return initializePayFiPayment;
}

// Verify payment transaction
export function useVerifyPayFiPayment() {
	async function verifyPayFiPayment(data) {
		// Fire the API request
		var result = await API.get(
			`${ApiRoutes.VerifyPayFiPayment}?reference=${data.reference}`
		);

		// Return the response
		return result;
	}

	return verifyPayFiPayment;
}

// create hook to return promise && export
export function useFetchArticles() {
	// on the invoking of the hook, the async fetchArticles fn gets response from API
	async function fetchArticles() {
		//get data from API call and assign to variable
		var fetchArticlesResult = await API.get(ApiRoutes.FetchArticles);

		return fetchArticlesResult;
	}
	return fetchArticles;
}

export function useGetPayStackTransactionFee() {
	async function getPayStackTransactionFee() {

		var result = await API.get(ApiRoutes.GetPayStackTransactionFee);

		return result;
	}

	return getPayStackTransactionFee;
}
