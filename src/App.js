import React, { Component } from 'react';
import { connect } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import { setInputField, setBox, setRoute, logoutUser } from "./actions";
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
    route: state.getRoute.route
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    inputFieldChange: (event) => dispatch(setInputField(event.target.value)),
    calculateFace: (data) => dispatch(setBox(data)),
    newRoute: (route) => dispatch(setRoute(route)),
    logout: () => dispatch(logoutUser())
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

//defines the initial state of the app
const initialState = {
  imageUrl: "",
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  //calculates position of faceboxes and returns them as objects in an array
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions;
    const image = document.querySelector("#inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return clarifaiFace.map(face => {
      return {
        leftCol: face.region_info.bounding_box.left_col * width,
        topRow: face.region_info.bounding_box.top_row * height,
        rightCol: width - (face.region_info.bounding_box.right_col * width),
        bottomRow: height - (face.region_info.bounding_box.bottom_row * height)
      }
    })
  }

  //enters logged on user's data into app state
  loadUser = (data) => {
    this.setState({
      user: {
        name: data.name,
        id: data.id,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  //enters calculated faceboxes into state
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  //onChange event handler for inputs, enters value into state
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onKeySubmit = (event) => {
    if (event.key === "Enter") {
      this.onButtonSubmit();
    }
  }

  onButtonSubmit = () => {
    const { inputField } = this.props;
    this.setState({imageUrl: inputField});
    //submits image URL to backend
    fetch(`${process.env.REACT_APP_URL}/imageurl`, {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        input: inputField
      })
    }) //backend makes API call and sends a response
    .then(response => response.json())
    .then(response => {
      //increments user search count if response is valid
      if (response.outputs[0].data.regions) { 
        fetch(`${process.env.REACT_APP_URL}/image`, {
          method: "put",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: this.props.user.id,
            name: this.props.user.name,
            url: inputField,
            faceCount: response.outputs[0].data.regions.length + Number(this.props.user.entries)
          })
        })
          .then(res => res.json())
          .then(entries => {
            if (entries) {
              //this.setState(Object.assign(this.props.user, {entries: Number(entries)}))
            }
          })
          .catch(err => console.log(err));
        //draws facebox on image
        this.displayFaceBox(this.props.calculateFace(response))
      }
    })
    .catch(err => console.log("Something went wrong"));
  }

  //method for changing route
  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  //function returns pagecontent based on current route state
  pageContent() {
    const { imageUrl } = this.state;
    const { inputFieldChange, box, route, user } = this.props;
    if (route === "home") {
      return (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm 
            onInputChange={inputFieldChange} 
            onButtonSubmit={this.onButtonSubmit}
            onKeySubmit={this.onKeySubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      )
    } else if (route === "signin" || route === "signout") {
      return <Signin />
    } else if (route === "register") {
      return <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
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
