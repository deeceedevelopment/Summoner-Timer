import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";

import Search from "./search";
import Match from "./match";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputSummonerName: "",
      activeGameFound: false,
      redirectToMatch: false
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
          //ROOM CREATED, ID OF ROOM FOUND IN RESPONSE.DATA.PAYLOAD.ROOMID
          //REDIRECT TO MATCH COMPONENT
          //<Redirect to={{pathname: '/match', state: response.data.payload}} />
          console.log(response.data.payload);
          this.setState({ redirectToMatch: true });
          // this.setState({
          //   activeGameFound: true,
          //   activeGameData: response.data.payload
          // });
        } else {
          console.log(response.data.error);
        }
      })
      .catch(error => {
        console.log("Error found:");
        console.log(error);
      });
  }

  //extract from main app component, move into search && match component
  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Route exact path="/" component={Search} />
            <Route path="/match/:id" component={Match} />
          </div>
        </div>
      </Router>
    );
  }
  // render() {
  //   return (
  //     <Router>
  //       <div className="App">
  //         <div className="container">
  //           <form onSubmit={this.onFormSubmit.bind(this)} className="mt-5 pb-5">
  //             <div className="form-group">
  //               <label htmlFor="summonerName">Enter Summoner Name:</label>
  //               <input
  //                 onChange={this.onInputChange.bind(this)}
  //                 value={this.state.inputSummonerName}
  //                 type="text"
  //                 className="form-control"
  //                 id="summonerName"
  //                 placeholder="example: SKT T1 Faker"
  //               />
  //             </div>
  //             <button type="submit" className="btn btn-success">
  //               Search
  //             </button>
  //           </form>
  //         </div>

  //         <Route path="/match/:id" component={Match} />
  //         <Route path="/about" component={Match} />
  //       </div>
  //     </Router>
  //   );
  // }
}

export default App;
