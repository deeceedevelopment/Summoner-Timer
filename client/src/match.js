import React, { Component } from "react";
import firebase from "firebase";

export default class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      championData: []
    };
  }

  componentDidMount() {
    var config = {
      apiKey: "AIzaSyCPLzpMbh-HBKlJ6i3PhvibqmfWyN-kLig",
      authDomain: "my-first-deploy-277b2.firebaseapp.com",
      databaseURL: "https://my-first-deploy-277b2.firebaseio.com",
      projectId: "my-first-deploy-277b2",
      storageBucket: "my-first-deploy-277b2.appspot.com",
      messagingSenderId: "999687630820"
    };
    firebase.initializeApp(config);

    const roomId = this.props.match.params.id;
    this.setState({ roomId: roomId }, params => {
      this.initalizeFirebase()
        .then(response => {
          console.log(response);
          //Store data in state to build UI

          const champions = response.map(champion => {
            return {
              championId: champion.championId,
              championImageURL: champion.imageURL,
              spell1ImageURL: champion.spell1ImgUrl,
              spell1Duration: 300,
              spell1Remaining: null,
              spell1Active: false,
              spell2ImageUrl: champion.spell2ImgUrl,
              spell2Duration: 300,
              spell2Remaining: null,
              spell2Active: false
            };
          });
          this.setState({ championData: champions });
        })
        .catch(error => {
          console.log(error);
        });
    }); //use firebase once() method to initalize component state

    // firebase
    //   .database()
    //   .ref(`rooms/${roomId}`)
    //   .once("value")
    //   .then(dataSnapshot => {
    //     console.log(dataSnapshot.val());
    //   });
    //use firebase on() method to implement listeners for changes in the database
    firebase
      .database()
      .ref(`rooms/${roomId}`)
      .on("child_changed", (snapshot, prevChildKey) => {
        const newValue = snapshot.val();
        console.log(newValue);
      });
  }

  initalizeFirebase() {
    const roomId = this.state.roomId;
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`rooms/${roomId}`)
        .once("value")
        .then(dataSnapshot => {
          //console.log(dataSnapshot.val());
          resolve(dataSnapshot.val());
        });
    });
  }

  onSpellClick() {
    console.log("Spell clicked.");
  }

  render() {
    const championComponents = this.state.championData.map(champion => {
      return (
        <div key={champion.championId}>
          <img src={champion.championImageURL} />
          <img
            onClick={this.onSpellClick.bind(this)}
            src={champion.spell1ImageURL}
          />
          <img
            onClick={this.onSpellClick.bind(this)}
            src={champion.spell2ImageUrl}
          />
        </div>
      );
    });
    return (
      <div>
        <h1>Match Component</h1>
        {championComponents}
      </div>
    );
  }
}
