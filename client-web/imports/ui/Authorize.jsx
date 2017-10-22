import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import cryptoWS from './../cryptoWS.http';

export default class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth_number : null,
      keys        : {}
    };
  }

  updateAuthNo(auth_number) {
    this.setState({
      auth_number : auth_number
    });
  }

  submitAuthNo(e) {
    e.preventDefault();
    e.stopPropagation();

    axios
      .get(cryptoWS.credentials, {
        token : this.state.auth_number
      })
      .then((response) => {
        this.setState({
          keys : {
            public  : response.data.publicKey || '1cc38cbc-bc1e-4186-8e62-1a2e4b3697c7',
            private : response.data.privateKey || '3c654525-51f5-4fe1-8141-bc76b89b9431'
          }
        });
      })
      .catch((error) => {
        this.setState({
          keysError : error.data
        });
      });
  }

  render() {
    const PageStyle = {
      marginTop : '100px',
      textAlign : 'center'
    };
    const KeyStyle  = {
      marginBottom : '50px'
    };

    return (
      <div id="authorize" style={PageStyle}>
        {
          !(this.state.keys.public && this.state.keys.private)
            ? (
              <form>
                <label>
                  <input type="text"
                         required
                         defaultValue={this.state.auth_number}
                         onChange={(e) => {
                           this.updateAuthNo(e.target.value);
                         }} />
                  <div className="label-text">Token</div>
                </label>
                <button onClick={(e) => {
                  this.submitAuthNo(e);
                }}>
                  Get credentials
                </button>
              </form>
            )
            : (
              <div>
                <div style={KeyStyle}>
                  <div className="title">Public key</div>
                  <div className="data">
                    {this.state.keys.public}
                  </div>
                </div>
                <div style={KeyStyle}>
                  <div className="title">Private key</div>
                  <div className="data">
                    {this.state.keys.private}
                  </div>
                </div>
                <div>
                  <Link to="/vote">
                    <button>Vote</button>
                  </Link>
                </div>
              </div>
            )

        }
      </div>
    );
  }
}