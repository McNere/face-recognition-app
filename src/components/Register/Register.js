import React from "react";
import { connect } from "react-redux";
import { 
	setNameField, 
	setEmailField, 
	setPasswordField, 
	newUser, 
	logoutUser 
} from "../../actions";

const mapStateToProps = (state) => {
	return {
		signInEmail: state.getUser.signInEmail,
		signInPassword: state.getUser.signInPassword,
		signInName: state.getUser.signInName
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onNameChange: (event) => dispatch(setNameField(event.target.value)),
		onEmailChange: (event) => dispatch(setEmailField(event.target.value)),
		onPasswordChange: (event) => dispatch(setPasswordField(event.target.value)),
		registerUser: (name, email, pass) => dispatch(newUser(name, email, pass)),
		logout: () => dispatch(logoutUser())
	}
}

class Register extends React.Component {

	//ensures that no userdata remains when switching login/register routes
	componentDidMount() {
		this.props.logout();
	}

	//submits user registration when pressing enter
	onKeySubmit = (event) => {
		const { registerUser, signInName, signInEmail, signInPassword } = this.props;
		if (event.keyCode === 13) {
			registerUser(signInName, signInEmail, signInPassword);
		}
	}

	render() {
		const { registerUser, signInName, signInEmail, signInPassword } = this.props;
		return (
			<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Register</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
				        <input 
				        	onChange={this.props.onNameChange}
					        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="text" 
					        name="email-address"
					        id="name" 
					        onKeyDown={this.onKeySubmit}
				        />
				      </div>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				        	onChange={this.props.onEmailChange}
					        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="email" 
					        name="email-address"
					        id="email-address" 
					        onKeyDown={this.onKeySubmit}
				        />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        	onChange={this.props.onPasswordChange}
					        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        type="password" 
					        name="password" 
					        id="password" 
					        onKeyDown={this.onKeySubmit}
				        />
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
					      onClick={() => registerUser(signInName, signInEmail, signInPassword)} 
					      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
					      type="submit" 
					      value="Register" 
				      />
				    </div>
				  </div>
				</main>
			</article>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);