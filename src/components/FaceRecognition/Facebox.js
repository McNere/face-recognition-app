import React from "react";

const Facebox = ({ top, right, bottom, left }) => {
	return (
		<div className="bounding-box" style={{top: top, right: right, bottom: bottom, left: left}}></div>
	);
}

export default Facebox;