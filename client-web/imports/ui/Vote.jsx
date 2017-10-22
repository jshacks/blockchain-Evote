import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import cryptoWS from './../cryptoWS.http';

export default class Vote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage        : 'not_started',
      publicKey    : null,
      electionName : 'Name',
      choices      : [],
      validChoices : 0
    };

    this.evaluateChoices.bind(this);
  }

  updatePublic(publicKey) {
    this.setState({
      publicKey : publicKey
    });
  };

  getChoices(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      stage        : 'vote',
      choices      : [{
        id    : 1,
        image : 'http://hubrif.com/pub/images/profiles/avatar-mini.jpg',
        name  : 'Choice 1'
      }, {
        id    : 2,
        image : 'http://hubrif.com/pub/images/profiles/avatar-mini.jpg',
        name  : 'Choice 2'
      }, {
        id    : 3,
        image : 'http://hubrif.com/pub/images/profiles/avatar-mini.jpg',
        name  : 'Choice 3'
      }, {
        id    : 4,
        image : 'http://hubrif.com/pub/images/profiles/avatar-mini.jpg',
        name  : 'Choice 4'
      }, {
        id    : 5,
        image : 'http://hubrif.com/pub/images/profiles/avatar-mini.jpg',
        name  : 'Choice 5'
      }],
      validChoices : 1
    });
  };

  evaluateChoices(id) {
    const newChoices = [...this.state.choices];
    var checked      = newChoices.filter((choice) => {
      return !!choice.checked;
    }).length;

    newChoices.forEach((choice) => {
      choice.disabled = choice.id !== id && !choice.checked && this.state.validChoices <= checked;
    });

    this.setState({
      choices : newChoices
    });
  };

  updateChoice(id) {
    const newChoices = [...this.state.choices];
    var choice       = newChoices.filter((choice) => choice.id == id)[0];

    choice.checked = !choice.checked;
    this.setState({
      choices : newChoices
    })
  }

  submitVote(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      stage : 'done'
    })
  }

  render() {
    const PageStyle          = {
      marginTop : '100px',
      textAlign : 'center'
    };
    const KeyStyle           = {
      marginBottom : '50px'
    };
    const ElectionTitleStyle = {
      marginBottom : '30px'
    };
    const ChoiceEntryStyle   = {
      position     : 'relative',
      marginBottom : '15px'
    };
    const ChoiceStyle        = {
      width   : '100%',
      padding : 0,
      cursor  : 'pointer'
    };

    var choicesList = this.state.choices.map((choice, index) => {
      return (
        <div key={index} style={ChoiceEntryStyle}>
          <label htmlFor={index} className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
            <input type="checkbox"
                   id={index}
                   className="mdl-checkbox__input"
                   defaultValue={index}
                   defaultChecked={choice.checked}
                   disabled={choice.disabled}
                   onChange={(e) => {
                     this.updateChoice(choice.id);
                     this.evaluateChoices(choice.id);
                   }} />
            <span className="mdl-checkbox__label">{choice.name}</span>
          </label>
        </div>
      )
    });

    return (
      <div id="vote" style={PageStyle}>
        {this.state.stage === 'not_started' && (
          <form>
            <label>
              <input type="text"
                     required
                     defaultValue={this.state.publicKey}
                     onChange={(e) => {
                       this.updatePublic(e.target.value);
                     }} />
              <div className="label-text">Public Key</div>
            </label>
            <button onClick={(e) => {
              this.getChoices(e);
            }}>
              Get Choices
            </button>
          </form>
        )}

        {this.state.stage === 'vote' && (
          <form>
            <div className="data" style={ElectionTitleStyle}>{this.state.electionName}</div>
            <div>{choicesList}</div>
            <button type="submit" onClick={(e) => {
              this.submitVote(e);
            }}>Vote
            </button>
          </form>
        )}

        {this.state.stage === 'done' && (
          <div className="data">Your vote has been submitted!</div>
        )}
      </div>
    );
  }
}