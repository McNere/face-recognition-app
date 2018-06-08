import React, { Component } from 'react';
import { connect } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import { setInputField, setBox, setRoute, logoutUser, findFace } from "./actions";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Scoreboard from "./components/Scoreboard/Scoreboard";
import './App.css';

const mapStateToProps = (state) => {
  return {
    inputField: state.changeInput.inputField,
    box: state.changeBox.box,
    user: state.getUser.user,
    route: state.getRoute.route,
    imageUrl: state.changeBox.imageUrl
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    inputFieldChange: (event) => dispatch(setInputField(event.target.value)),
    calculateFace: (data) => dispatch(setBox(data)),
    newRoute: (route) => dispatch(setRoute(route)),
    logout: () => dispatch(logoutUser()),
    onButtonSubmit: (id, name, entries, input) => dispatch(findFace(id, name, entries, input))
  }
}

//configuration of animated background
const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {

  onKeySubmit = (event) => {
    const { onButtonSubmit, user, inputField } = this.props;
    if (event.keyCode === 13) {
      onButtonSubmit(user.id, user.name, user.entries, inputField);
    }
  }

  //function returns pagecontent based on current route state
  pageContent() {
    const { inputFieldChange, box, route, user, inputField, imageUrl } = this.props;
    if (route === "home") {
      return (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm 
            onInputChange={inputFieldChange} 
            onButtonSubmit={this.props.onButtonSubmit}
            onKeySubmit={this.onKeySubmit}
            user={user}
            input={inputField}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      )
    } else if (route === "signin" || route === "signout") {
      return <Signin />
    } else if (route === "register") {
      return <Register />
    } else if (route === "score") {
      return <Scoreboard />
    }
  }

  render() {
    return (
      <div className="App">
        <Particles 
              className="particles"
              params={particlesOptions}
        />
        <Navigation 
          onRouteChange={this.props.newRoute}
          isSignedIn={this.props.user}
          logout={this.props.logout}
        />
      {/*conditional rendering of components based on current route*/}
        { this.pageContent() }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
