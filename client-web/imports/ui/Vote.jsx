import React, {Component} from 'react';

export default class Vote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      choices      : this.getChoises(),
      validChoices : this.getValidChoices()
    };

    this.evaluateChoices.bind(this);
  }

  getChoises() {
    return [{
      id   : 1,
      name : 'Choice 1'
    }, {
      id   : 2,
      name : 'Choice 2'
    }, {
      id   : 3,
      name : 'Choice 3'
    }, {
      id   : 4,
      name : 'Choice 4'
    }, {
      id   : 5,
      name : 'Choice 5'
    }];
  };

  getValidChoices() {
    return 2;
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

    alert('vote submitted');
  }

  render() {
    var choicesList = this.state.choices.map((choice, index) => {
      return (<li key={index}>
        <label>
          <input type="checkbox"
                 defaultValue={index}
                 defaultChecked={choice.checked}
                 disabled={choice.disabled}
                 onChange={(e) => {
                   this.updateChoice(choice.id);
                   this.evaluateChoices(choice.id);
                 }}
          />
          {choice.name}
        </label>
      </li>)
    });

    return (
      <div>
        <form>
          <ul>{choicesList}</ul>
          <button type="submit" onClick={(e) => {this.submitVote(e);}}>Vote</button>
        </form>
      </div>
    );
  }
}