import React from "react";
import Tilt from "react-tilt";
import "./logo.css";
import Image from "./logo.png";

const Logo = () => {
	return (
		<div className="ma4 mt0">
			<Tilt className="Tilt br2 shadow-2" options={{ max: 25 }} style={{ height: 150, width: 200}} >
				<div className="Tilt-inner pa3">
					<img style={{ paddingTop: "5px"}} src={Image} alt="logo" />
				</div>
			</Tilt>
		</div>
	);
}

export default Logo;