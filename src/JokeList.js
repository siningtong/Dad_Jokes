import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import uuid from "uuid/v4";
import "./JokeList.css";
const URL = " https://icanhazdadjoke.com/";
class JokeList extends Component {
  static defaultProps = { numJokesToget: 10 };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]")
    };
    this.seenJokes = new Set(this.state.jokes.map(j => j.text));
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }
  async getJokes() {
    try {
      let jokes = [];
      while (jokes.length < this.props.numJokesToget) {
        let res = await axios.get(URL, {
          headers: { Accept: "application/json" }
        });
        let newJoke = res.data.joke;
        if (!this.seenJokes.has(newJoke)) {
          jokes.push({ id: uuid(), text: newJoke, votes: 0 });
        } else {
          console.log("Found a duplicate one");
          console.log(newJoke);
        }
      }
      this.setState(
        prev => ({ jokes: [...prev.jokes, ...jokes], loading: false }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  handleVote(id, delta) {
    this.setState(
      prev => ({
        jokes: prev.jokes.map(j =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        )
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  handleClick() {
    this.setState({ loading: true }, this.getJokes);
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      );
    }
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span>Jokes
          </h1>
          <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            New Jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map(j => (
            <Joke
              key={j.id}
              text={j.text}
              votes={j.votes}
              upvote={() => this.handleVote(j.id, 1)}
              downvote={() => this.handleVote(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
