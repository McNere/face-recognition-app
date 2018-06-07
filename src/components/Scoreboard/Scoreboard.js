import React from "react";
import { connect } from "react-redux";
import { getScores } from "../../actions";
import "./Scoreboard.css";

const mapStateToProps = (state) => {
	return {
		scores: state.setScores.scores,
		isPending: state.setScores.isPending,
		error: state.setScores.error
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		loadScores: () => dispatch(getScores())
	}
}

class Scoreboard extends React.Component {

	componentDidMount() {
		//fetches score data from backend
		this.props.loadScores();
	}

	render() {
		const { scores, isPending } = this.props;

		return (
			<div className="center">
				{isPending 
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

export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard);