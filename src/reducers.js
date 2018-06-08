import { 
	CHANGE_INPUT_FIELD, 
	CHANGE_BOX_DATA,
	GET_SCORES_PENDING,
	GET_SCORES_SUCCESS,
	GET_SCORES_FAILED,
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


//state and reducer for image URL field
const initialStateInput = {
	inputField: ""
}

export const changeInput = (state=initialStateInput, action={}) => {
	switch (action.type) {
		case CHANGE_INPUT_FIELD:
			return Object.assign({}, state, {inputField: action.payload});

		default:
			return state;
	}
}

//state and reducer for the facebox
const initialStateBox = {
	box: [],
	imageUrl: "",
	isPending: false,
	error: ""
}

export const changeBox = (state=initialStateBox, action={}) => {
	switch (action.type) {
		case CHANGE_BOX_DATA:
			return Object.assign({}, state, {box: action.payload});

		case FETCH_IMAGE_PENDING:
			return Object.assign({}, state, {isPending: true, imageUrl: action.payload});

		case FETCH_IMAGE_FAILED:
			return Object.assign({}, state, {isPending: false, error: action.payload});

		case FETCH_IMAGE_SUCCESS:
			return Object.assign({}, state, {isPending: false, imageUrl: action.payload});

		case RESET_IMAGE_DATA:
			return initialStateBox;

		default:
			return state;
	}
}

//state and reducer for scoreboard
const initialStateScores = {
	scores: [],
	isPending: false,
	error: ""
}

export const setScores = (state=initialStateScores, action={}) => {
	switch (action.type) {
		case GET_SCORES_PENDING:
			return Object.assign({}, state, {isPending: true});

		case GET_SCORES_FAILED:
			return Object.assign({}, state, {isPending: false, error: action.payload});

		case GET_SCORES_SUCCESS:
			return Object.assign({}, state, {isPending: false, scores: action.payload});

		default:
			return state;
	}
}

//state
const initialStateUser = {
	user: {
		id: "",
    	name: "",
    	email: "",
    	entries: 0,
    	joined: "",
	},
    isPending: false,
    error: "",
    signInEmail: "",
    signInPassword: "",
    signInName: ""
}

export const getUser = (state=initialStateUser, action={}) => {
	switch (action.type) {
		case LOGIN_USER_PENDING:
			return Object.assign({}, state, {isPending: true});

		case LOGIN_USER_SUCCESS:
			return Object.assign({}, state, {isPending: false, user: action.payload});

		case LOGIN_USER_FAILED:
			return Object.assign({}, state, {isPending: false, error: action.payload});

		case CHANGE_EMAIL_FIELD:
			return Object.assign({}, state, {signInEmail: action.payload});

		case CHANGE_PASSWORD_FIELD:
			return Object.assign({}, state, {signInPassword: action.payload});

		case CHANGE_NAME_FIELD:
			return Object.assign({}, state, {signInName: action.payload});

		case LOGOUT_USER:
			return initialStateUser;

		default:
			return state;
	}
}

const initialStateRoute = {
	route: "signin"
}

export const getRoute = (state=initialStateRoute, action={}) => {
	switch (action.type) {
		case CHANGE_ROUTE:
			return Object.assign({}, state, {route: action.payload});

		default:
			return state;
	}
}