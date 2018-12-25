import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  componentDidMount() {}

  onFormSubmit(e) {
    e.preventDefault();
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
        <div className="container">
          <form onSubmit={this.onFormSubmit.bind(this)} className="mt-5 pb-5">
            <div className="form-group">
              <label htmlFor="summonerName">Summoner Name</label>
              <input
                type="text"
                className="form-control"
                id="summonerName"
                placeholder="Summoner Name..."
              />
            </div>
            <button type="submit" className="btn btn-success">
              Search
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
