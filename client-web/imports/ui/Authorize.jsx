import React, {Component} from 'react';
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
      .get(cryptoWS.test, {
        token : this.state.auth_number
      })
      .then((response) => {
        this.setState({
          keys : {
            public  : response.data.pubKey || 'pubKey',
            private : response.data.prvKey || 'prvKey'
          }
        });
      })
      .catch((error) => {

      });
  }

  render() {
    return (
      <div>
        {
          this.state.keys.public && this.state.keys.private
            ? <div>
              <div>Public key: {this.state.keys.public}</div>
              <div>Private key: {this.state.keys.private}</div>
            </div>
            : <form>
              <label>
                <input type="text"
                       placeholder="copy paste token here"
                       defaultValue={this.state.auth_number}
                       onChange={(e) => {this.updateAuthNo(e.target.value);}} />
              </label>
              <button onClick={(e) => {this.submitAuthNo(e);}}>
                Get credentials
              </button>
            </form>
        }
      </div>
    );
  }
}