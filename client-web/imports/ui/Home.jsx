import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Home extends Component {
  render() {
    const PageStyle = {
      marginTop : '100px',
      textAlign : 'center'
    };
    const LinkButton = {
      marginBottom: '15px'
    };
    const Title = {
      marginBottom: '15px'
    };

    return (
      <div id="home" style={PageStyle}>
        <div className="data" style={Title}>VoteChain</div>
        <div style={LinkButton}>
          <Link to="/authorize">
            <button>Authorize</button>
          </Link>
        </div>
        <div style={LinkButton}>
          <Link to="/vote">
            <button>Vote</button>
          </Link>
        </div>
      </div>
    );
  }
}