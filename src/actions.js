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
	fetch(`${process.env.REACT_APP_URL}/imageurl`, {
		method: "post",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			input: input
		})
	})
		.then(response => response.json())
		.then(response => {
			if (response.outputs[0].data.regions) {
				dispatch({ type: FETCH_IMAGE_SUCCESS, payload: input })
				//dispatches object with array payload from setBox
				dispatch(setBox(response));
				//submits URL to backend to check score
				fetch(`${process.env.REACT_APP_URL}/image`, {
					method: "put",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						id: id,
						name: name,
						faceCount: response.outputs[0].data.regions.length + Number(entries),
						url: input
					})
				})
					.then(response => response.json())
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
		.catch(error => dispatch({ type: FETCH_IMAGE_FAILED, payload: error}))
}

//fetch and dispatch score data from backend
export const getScores = () => (dispatch) => {
	dispatch({ type: GET_SCORES_PENDING });
	fetch(`${process.env.REACT_APP_URL}/scores`)
		.then(response => response.json())
		.then(scores => dispatch({ type: GET_SCORES_SUCCESS, payload: scores}))
		.catch(error => dispatch({ type: GET_SCORES_FAILED, payload: error}))
}

//login user and put userdata in state upon success
export const setUser = (user, pass) => (dispatch) => {
	dispatch({ type: LOGIN_USER_PENDING });
	fetch(`${process.env.REACT_APP_URL}/signin`, {
		method: "post",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			email: user,
			password: pass
		})
	})
		.then(response => response.json())
		.then(user => {
			//backend returns user data upon successful authentication
			if (user.name) {
				//applies valid user data to store and changes route to home
				dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
				dispatch({ type: CHANGE_ROUTE, payload: "home"});
			}
			//no action if invalid userdata is returned
		})
		.catch(error => dispatch({ type: LOGIN_USER_FAILED, payload: error }))
}

//register new user and log them in upon success
export const newUser = (name, email, pass) => (dispatch) => {
	dispatch({ type: LOGIN_USER_PENDING });
	fetch(`${process.env.REACT_APP_URL}/register`, {
		method: "post",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({
			name: name,
			email: email,
			password: pass
		})
	})
		.then(response => response.json())
		.then(newUser => {
			//backend returns user data upon successful registration
			if (newUser.name) {
				//applies valid userdata to store and changes route to home
				dispatch({ type: LOGIN_USER_SUCCESS, payload: newUser });
				dispatch({ type: CHANGE_ROUTE, payload: "home" });
			}
		})
		.catch(error => dispatch({ type: LOGIN_USER_FAILED, payload: error }))
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