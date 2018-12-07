import React from 'react';
import DisplayComic from './DisplayComic.js';
import axios from 'axios';

function random (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class Comics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: true,
      loading: true,
      comic: {},
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    var index = random(10, 2000);
    this.retrieveComic(index);
  }

  retrieveComic(id) {
    let self = this;
    axios.get('https://xkcd.now.sh/' + id, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => {
      self.setState({
        initLoading: false,
        loading: false,
        comic: response.data
      });
    }).catch((error) => alert(error));
  }

  handleClick() {
    this.setState({
      loading:  true
    });
    var index = random(10, 2000);
    this.retrieveComic(index);
  }

  render() {
    const button = this.state.loading ? (
      <button className="btn btn-primary btn-block" disabled="disabled">Loading...</button>
    ) : (
      <button onClick={() => this.handleClick()} className="btn btn-primary btn-block">Next Comic</button>
    )
    const content = this.state.initLoading ? (
      <div>
        <div>Loading...</div>
      </div>
    ) : (
      <div>
        <DisplayComic comic={this.state.comic} />
        {button}
      </div>
    );

    return (
      <div>
        <h2 class="mb-5">Comics</h2>
        <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          {content}
        </div>
      </div>
    );
  }
}

export default Comics;
