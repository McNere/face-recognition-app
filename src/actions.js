import { CHANGE_INPUT_FIELD, CHANGE_BOX_DATA } from "./constants";

export const setInputField = (text) => {
	return {
		type: CHANGE_INPUT_FIELD,
		payload: text
	}
}

export const changeBox = (arr) => {
	return {
		type: CHANGE_BOX_DATA,
		payload: arr
	}
}