import React from "react";
import Facebox from "./Facebox";
import "./FaceRecognition.css";

const FaceRecognition = ({ box, imageUrl }) => {
	return (
		<div className="center ma">
			<div className="absolute mt2">
				<img id="inputimage" src={imageUrl} alt="" width="500px" height="auto"/>
				{box[0] ? (
					box.map((face, i) => {
						 return <Facebox 
						 	key={i}
							top={face.topRow}
							right={face.rightCol}
							bottom={face.bottomRow}
							left={face.leftCol}
						/>
					})
				) : (null)
				}
			</div>
		</div>
	);
}

export default FaceRecognition;