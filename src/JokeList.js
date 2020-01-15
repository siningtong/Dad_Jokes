import React, { Component } from "react";
import axios from "axios";
import "./JokeList.css";
const URL = " https://icanhazdadjoke.com/";
class JokeList extends Component {
  static defaultProps = { numJokesToget: 10 };
  constructor(props) {
    super(props);
    this.state = { jokes: [] };
  }
  async componentDidMount() {
    let jokes = [];
    while (jokes.length < this.props.numJokesToget) {
      let res = await axios.get(URL, {
        headers: { Accept: "application/json" }
      });
      jokes.push({ joke: res.data.joke, votes: 0 });
    }
    this.setState({ jokes: jokes });
  }
  render() {
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span>Jokes
          </h1>
          <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
          <button className="JokeList-getmore">New Jokes</button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map(j => (
            <div>
              {j.joke}-{j.votes}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
