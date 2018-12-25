import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputSummonerName: ""
    };
  }

  onInputChange(e) {
    const input = e.target.value;
    this.setState({ inputSummonerName: input });
  }

  onFormSubmit(e) {
    e.preventDefault();
    axios
      .get(`api/summoner/${this.state.inputSummonerName}`)
      .then(response => {
        if (response.data.success) {
          console.log(response.data.payload);
        } else {
          console.log(response.data.error);
        }
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
              <label htmlFor="summonerName">Enter Summoner Name:</label>
              <input
                onChange={this.onInputChange.bind(this)}
                value={this.state.inputSummonerName}
                type="text"
                className="form-control"
                id="summonerName"
                placeholder="example: SKT T1 Faker"
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
