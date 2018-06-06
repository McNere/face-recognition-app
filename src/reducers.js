import { CHANGE_INPUT_FIELD, CHANGE_BOX_DATA } from "./constants";

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

const initialStateBox = {
	box: []
}

export const changeBox = (state=initialStateBox, action={}) => {
	switch (action.type) {
		case CHANGE_BOX_DATA:
			return Object.assign({}, state, {box: action.payload})

		default:
			return state;
	}
}