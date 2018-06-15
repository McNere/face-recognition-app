import {
	CHANGE_INPUT_FIELD,
	CHANGE_BOX_DATA,
	GET_SCORES_PENDING,
	GET_SCORES_FAILED,
	GET_SCORES_SUCCESS,
	LOGIN_USER_PENDING,
	LOGIN_USER_FAILED,
	LOGIN_USER_SUCCESS,
	LOGOUT_USER,
	CHANGE_EMAIL_FIELD,
	CHANGE_PASSWORD_FIELD,
	CHANGE_NAME_FIELD,
	CHANGE_ROUTE,
	FETCH_IMAGE_PENDING,
	FETCH_IMAGE_SUCCESS,
	FETCH_IMAGE_FAILED,
	RESET_IMAGE_DATA
} from "./constants";

export const setInputField = (text) => {
	return {
		type: CHANGE_INPUT_FIELD,
		payload: text
	}
}

export const setEmailField = (text) => {
	return {
		type: CHANGE_EMAIL_FIELD,
		payload: text
	}
}

export const setPasswordField = (text) => {
	return {
		type: CHANGE_PASSWORD_FIELD,
		payload: text
	}
}

export const setNameField = (text) => {
	return {
		type: CHANGE_NAME_FIELD,
		payload: text
	}
}

//function for submitting and fetching data from API
function callApi(url, method, body) {
	const route = `${process.env.REACT_APP_URL}/${url}`
	if (!method) {
		return fetch(route)
			.then(response => {
				if (response.status !== 200) {
					return Promise.reject();
				}
				return response.json();
			})
			
	} else {
		return fetch(route, {
			method: method,
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(body)
		})
			.then(response => {
				if (response.status !== 200) {
					return Promise.reject();
				}
				return response.json();
			})
	}
	
}

//calculates facebox from received data and returns an object with array as payload
export const setBox = (data) => {
	const clarifaiFace = data.outputs[0].data.regions;
    const image = document.querySelector("#inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

	return {
		type: CHANGE_BOX_DATA,
		//calculates position of faceboxes based on image dimensions
		payload: clarifaiFace.map(face => {
	      return {
	        leftCol: face.region_info.bounding_box.left_col * width,
	        topRow: face.region_info.bounding_box.top_row * height,
	        rightCol: width - (face.region_info.bounding_box.right_col * width),
	        bottomRow: height - (face.region_info.bounding_box.bottom_row * height)
	      }
	    })
	}
}

//sends imageurl upon submit to back end and handles returned data
export const findFace = (id, name, entries, input) => (dispatch) => {
	dispatch({ type: FETCH_IMAGE_PENDING, payload: input });
	callApi("imageurl", "post", {
			input: input
		})
		.then(response => {
			if (response.outputs[0].data.regions) {
				dispatch({ type: FETCH_IMAGE_SUCCESS, payload: input })
				//dispatches object with array payload from setBox
				dispatch(setBox(response));
				//submits URL to backend to check score
				callApi("image", "put", {
						id: id,
						name: name,
						faceCount: response.outputs[0].data.regions.length + Number(entries),
						url: input
				})
					.then(user => {
						if (user) {
							//dispatches updated user data if received from backend
							dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
						}
						//no change if nothing is returned
					})
					.catch(error => console.log("Something went wrong"))
			} else {
				dispatch({ type: FETCH_IMAGE_FAILED, payload: "Invalid data returned"})
			}
		})
		.catch(error => dispatch({ type: FETCH_IMAGE_FAILED, payload: "Invalid data returned"}))
}

//fetch and dispatch score data from backend
export const getScores = () => (dispatch) => {
	dispatch({ type: GET_SCORES_PENDING });
	callApi("score")
		.then(scores => dispatch({ type: GET_SCORES_SUCCESS, payload: scores}))
		.catch(error => dispatch({ type: GET_SCORES_FAILED, payload: "Error loading scores"}))
}

//login user and put userdata in state upon success
export const setUser = (user, pass) => (dispatch) => {
	dispatch({ type: LOGIN_USER_PENDING });
	callApi("signin", "post", {
		email: user,
		password: pass
	})
		.then(user => {
			//backend returns user data upon successful authentication
			if (user.name) {
				//applies valid user data to store and changes route to home
				dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
				dispatch({ type: CHANGE_ROUTE, payload: "home"});
			}
			//no action if invalid userdata is returned
		})
		.catch(error => dispatch({ type: LOGIN_USER_FAILED, payload: "Login failed" }))
}

//register new user and log them in upon success
export const newUser = (name, email, pass) => (dispatch) => {
	dispatch({ type: LOGIN_USER_PENDING });
	callApi("register", "post", {
		name: name,
		email: email,
		password: pass
	})
		.then(newUser => {
			//backend returns user data upon successful registration
			if (newUser.name) {
				//applies valid userdata to store and changes route to home
				dispatch({ type: LOGIN_USER_SUCCESS, payload: newUser });
				dispatch({ type: CHANGE_ROUTE, payload: "home" });
			}
		})
		.catch(error => dispatch({ type: LOGIN_USER_FAILED, payload: "Error while registering new user" }))
}

//changes route based on input
export const setRoute = (text) => {
	return {
		type: CHANGE_ROUTE,
		payload: text
	}
}

//remove user and image data from state
export const logoutUser = () => (dispatch) => {
	dispatch({ type: LOGOUT_USER });
	dispatch({ type: RESET_IMAGE_DATA });
}