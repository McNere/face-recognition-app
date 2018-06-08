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

  //submits image data when pressing enter
  onKeySubmit = (event) => {
    const { onButtonSubmit, user, inputField } = this.props;
    if (event.keyCode === 13) {
      onButtonSubmit(user.id, user.name, user.entries, inputField);
    }
  }

  //function returns page content based on current route
  pageContent() {
    const { 
      inputFieldChange,
      box,
      route,
      user,
      inputField,
      imageUrl
    } = this.props;

    //main page displayed after user has logged in
    switch (route) {
      case "home":
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

      case "register":
        return <Register />

      case "score":
        return <Scoreboard />

      default:
        return <Signin onRouteChange={this.props.newRoute}/>
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
        />
      {/*conditional rendering of components based on current route*/}
        { this.pageContent() }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
