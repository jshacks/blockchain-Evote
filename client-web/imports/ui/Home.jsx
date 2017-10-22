import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Home extends Component {
  render() {
    const PageStyle = {
      marginTop : '100px',
      textAlign : 'center'
    };

    return (
      <div id="home" style={PageStyle}>
        <Link to="/authorize">
          <button>Authorize</button>
        </Link>
        <Link to="/vote">
          <button>Vote</button>
        </Link>
      </div>
    );
  }
}