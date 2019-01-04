import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Search extends Component {
  render() {
    return (
      <div>
        <h1>Search Page</h1>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }
}
