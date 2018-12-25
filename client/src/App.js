import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  componentDidMount() {
    axios
      .get("api/activematch")
      .then(response => {
        console.log("Response:");
        console.log(response);
      })
      .catch(error => {
        console.log("Error found:");
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Starting point for application.</h1>
      </div>
    );
  }
}

export default App;
