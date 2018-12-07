import React from 'react';

class DisplayComic extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto">
          <h1 className="display-4">{this.props.comic.safe_title}</h1>
          <img className="img-fluid" src={this.props.comic.img} alt={this.props.comic.alt} />
        </div>
      </div>
    );
  }
}

export default DisplayComic;
