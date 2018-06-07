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
	CHANGE_ROUTE
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

export const setBox = (data) => {
	const clarifaiFace = data.outputs[0].data.regions;
    const image = document.querySelector("#inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    
	return {
		type: CHANGE_BOX_DATA,
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

export const getScores = () => (dispatch) => {
	dispatch({ type: GET_SCORES_PENDING });
	fetch(`${process.env.REACT_APP_URL}/scores`)
		.then(response => response.json())
		.then(scores => dispatch({ type: GET_SCORES_SUCCESS, payload: scores}))
		.catch(error => dispatch({ type: GET_SCORES_FAILED, payload: error}))
}

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
			if (user.name) {
				dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
				dispatch({ type: CHANGE_ROUTE, payload: "home"});
			}
		})
		.catch(error => dispatch({ type: LOGIN_USER_FAILED, payload: error }))
}

export const setRoute = (text) => {
	return {
		type: CHANGE_ROUTE,
		payload: text
	}
}

export const logoutUser = () => {
	return {
		type: LOGOUT_USER,
		payload: {}
	}
}