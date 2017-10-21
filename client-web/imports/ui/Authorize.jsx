import React, {Component} from 'react';
import { AuthorizeForm } from './AuthorizeForm'

export default class Authorize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth_number: null,
            keys: {}
        };
    }

    updateAuthNo(auth_number) {
        this.setState({
            auth_number: auth_number
        });
    }

    submitAuthNo(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            keys: {
                public: 'pubKey',
                private: 'prvKey'
            }
        })
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
                    Name:
                    <input type="text" 
                            defaultValue={this.state.auth_number} 
                            onChange={(e) => {
                                this.updateAuthNo(e.target.value);
                            }} />
                    </label>
                    <button onClick={(e) => {this.submitAuthNo(e);}}>Get token</button>
                </form>
            }
            </div>
    );
    }
}