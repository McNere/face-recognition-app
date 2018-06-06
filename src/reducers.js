import { CHANGE_INPUT_FIELD, CHANGE_BOX_DATA } from "./constants";

const initialState = {
	inputField: "",
	box: []
}

export const changeInput = (state=initialState, action={}) => {
	switch (action.type) {
		case CHANGE_INPUT_FIELD:
			return Object.assign({}, state, {inputField: action.payload});

		default:
			return state;
	}
}

export const changeBox = (state=initialState, action={}) => {
	switch (action.type) {
		case CHANGE_BOX_DATA:
			return Object.assign({}, state, {box: action.payload})

		default:
			return state;
	}
}