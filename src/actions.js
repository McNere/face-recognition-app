import { CHANGE_INPUT_FIELD, CHANGE_BOX_DATA } from "./constants";

export const setInputField = (text) => {
	return {
		type: CHANGE_INPUT_FIELD,
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