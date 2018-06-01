import React, { Component } from 'react';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import './App.css';

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

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    const { input } = this.state;
    this.setState({imageUrl: input, box: {}});
    //submits image URL to backend
    fetch(`https://quiet-spire-33283.herokuapp.com/imageurl`, {
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
        fetch(`https://quiet-spire-33283.herokuapp.com/image`, {
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

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { box, imageUrl, route, isSignedIn } = this.state;
    return (
      <div className="App">
        <Particles 
              className="particles"
              params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === "home" 
          ?  <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : ( 
            route === "signin" || route === "signout"
            ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            )
          }
      </div>
    );
  }
}

export default App;
