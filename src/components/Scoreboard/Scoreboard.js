import React from "react";
import "./Scoreboard.css";

class Scoreboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scores: []
		}
	}

	componentDidMount() {
		//fetches score data from backend
		fetch("http://139.107.226.15:3000/scores")
			.then(response => response.json())
			.then(scores => this.setState({scores: scores}))
			.catch(err => console.log(err))
	}

	render() {
		const { scores } = this.state;
		return (
			<div className="center">
				{!scores[0] 
					? (
						<h1>Loading</h1>
					)
					: (
						<table>
							<thead>
								<tr>
									<th>#</th>
									<th className="name">Name</th>
									<th className="score">Score</th>
								</tr>	
							</thead>
							<tbody>
								{scores.map((user, i) => {
									return (
										<tr key={i}>
											<td>{i+1}</td>
											<td className="name">{user.name}</td>
											<td className="score">{user.entries}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)
				}	
			</div>
		);
	}
}

export default Scoreboard;