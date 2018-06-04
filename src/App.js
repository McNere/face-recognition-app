import React, { Component } from 'react';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Scoreboard from "./components/Scoreboard/Scoreboard";
import './App.css';

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
  input: "",
  imageUrl: "",
  box: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor() {
    super();
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
    const { input } = this.state;
    this.setState({imageUrl: input, box: {}});
    //submits image URL to backend
    fetch(`http://139.107.226.15:3000/imageurl`, {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        input: input
      })
    }) //backend makes API call and sends a response
    .then(response => response.json())
    .then(response => {
      //increments user search count if response is valid
      if (response.outputs[0].data.regions) { 
        fetch(`http://139.107.226.15:3000/image`, {
          method: "put",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: this.state.user.id,
            name: this.state.user.name,
            url: input,
            faceCount: response.outputs[0].data.regions.length + Number(this.state.user.entries)
          })
        })
          .then(res => res.json())
          .then(entries => {
            if (entries) {
              this.setState(Object.assign(this.state.user, {entries: Number(entries)}))
            }
          })
          .catch(err => console.log(err));
        //draws facebox on image
        this.displayFaceBox(this.calculateFaceLocation(response))
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
    const { route, box, imageUrl } = this.state;
    if (route === "home") {
      return (
        <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}
            onKeySubmit={this.onKeySubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      )
    } else if (route === "signin" || route === "signout") {
      return <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
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
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
      {/*conditional rendering of components based on current route*/}
        { this.pageContent() }
      </div>
    );
  }
}

export default App;
