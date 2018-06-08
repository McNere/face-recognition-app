import React from "react";
import { connect } from "react-redux";
import { setUser, setEmailField, setPasswordField, logoutUser } from "../../actions";

const mapStateToProps = (state) => {
	return {
		userPending: state.getUser.isPending,
		userError: state.getUser.error,
		signInEmail: state.getUser.signInEmail,
		signInPassword: state.getUser.signInPassword
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		loginUser: (user, pass) => dispatch(setUser(user,pass)),
		emailFieldChange: (event) => dispatch(setEmailField(event.target.value)),
		passwordFieldChange: (event) => dispatch(setPasswordField(event.target.value)),
		logout: () => dispatch(logoutUser())
	}
}

class Signin extends React.Component {

	//ensures that no userdata remains when switching login/register routes
	componentDidMount() {
		this.props.logout();
	}

	//submits user login when pressing enter
	onKeySubmit = (event) => {
		const { loginUser, signInEmail, signInPassword } = this.props;
		if (event.key === "Enter") {
			loginUser(signInEmail, signInPassword);
		}
	}

	render() {
		const { onRouteChange, loginUser, signInEmail, signInPassword } = this.props;
		return (
			<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
					        onChange={this.props.emailFieldChange} 
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
					        onChange={this.props.passwordFieldChange} 
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
					      onClick={() => loginUser(signInEmail, signInPassword)} 
					      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
					      type="submit" 
					      value="Sign in" 
					  />
				    </div>
				    <div className="lh-copy mt3">
				      <p onClick={() => onRouteChange("register")}
					      href="#0" 
					      className="f6 link dim black db pointer"
					  >
					  	Register
					  </p>
				    </div>
				  </div>
				</main>
			</article>
		);	
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);