import React from 'react';
import axios from 'axios';

function shuffle ([...a]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Status(props) {
  let incorrectHtml = '';
  if (props.displayPreviousAnswer) {
    incorrectHtml = '<div class="text-left">';
    for (let i = 0; i < props.answers.length; i++) {
      incorrectHtml += props.answers[i] + '<br/>';
    }
    incorrectHtml += '</div>';
  }
  const incorrectStatus = props.displayPreviousAnswer && incorrectHtml != '' ? (<p className="lead" dangerouslySetInnerHTML={{__html: incorrectHtml}} />) : (null);

  return (
    <div>
      <p className="lead">Correct: {props.correct}</p>
      <p className="lead">Incorrect: {props.incorrect}</p>
      <p className="lead">({props.index + 1} of {props.questions.length})</p>
      {incorrectStatus}
    </div>
  );
}

function DisplayQuestion(props) {
  return (
    <p className="lead" dangerouslySetInnerHTML={{__html: props.q.question}} />
  );
}

function DisplayAnswers(props) {
  let choices = [];
  for (let i = 0; i < props.answers.incorrect_answers.length; i++) {
    choices.push(<button key={i} onClick={() => props.handleClick(props.index, props.answers.incorrect_answers)} className="btn btn-primary btn-block" dangerouslySetInnerHTML={{ __html: props.answers.incorrect_answers[i] }}></button>);
  }
  choices.push(<button key="3" onClick={() => props.handleClick(props.index, props.answers.correct_answer)} className="btn btn-primary btn-block" dangerouslySetInnerHTML={{ __html: props.answers.correct_answer }}></button>);
  choices = shuffle(choices);
  return (
    <div>
      {choices}
    </div>
  );
}

function Question(props) {
  let q = props.questions[props.index];
  return (
    <div>
      <DisplayQuestion q={q} />
      <DisplayAnswers answers={q} index={props.index} handleClick={props.handleClick} />
      <Status index={props.index} questions={props.questions} correct={props.correct} incorrect={props.incorrect} answers={props.answers} displayPreviousAnswer={props.displayPreviousAnswer} />
    </div>
  );
}

function Results(props) {
  let message = 'You need some practice';

  if (props.correct < 4) {
    message = 'You need some practice';
  } else if (props.correct > 3 && props.correct < 7) {
    message = 'Good job';
  } else if (props.correct > 6) {
    message = 'Woah';
  }

  return (
    <div>
      <p className="lead">Correct: {props.correct}</p>
      <p className="lead">Incorrect: {props.incorrect}</p>
      <p className="lead">{message}</p>
      <hr/>
      <button onClick={() => props.reset()} className="btn btn-primary btn-block">Try Again?</button>
    </div>
  )
}

class Trivia extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: -1, trivia: [], correct: 0, incorrect: 0, answers: [], displayPreviousAnswer: true };
    this.handleClick = this.handleClick.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    let self = this;
    axios.get('https://opentdb.com/api.php?amount=10').then((response) => {
      self.setState({
        trivia: response.data.results,
        index: 0
      });
    }).catch((error) => console.log(error));
  }

  componentWillMount() {
    document.body.className = 'bg';
  }

  componentWillUnmount() {
    document.body.className = '';
  }

  handleClick(index, answer) {
    const previousQuestion = this.state.trivia[index];

    if (this.state.trivia[index].correct_answer == answer) {
      let correct = this.state.answers.concat('<span class="text-success">' + previousQuestion.question + ' ' + previousQuestion.correct_answer + '</span>');
      this.setState({
        index: this.state.index + 1,
        correct: this.state.correct + 1,
        answers: correct
      });
    } else {
      let incorrect = this.state.answers.concat('<span class="text-danger">' + previousQuestion.question + ' ' + previousQuestion.correct_answer + '</span>');
      this.setState({
        index: this.state.index + 1,
        incorrect: this.state.incorrect + 1,
        answers: incorrect
      });
    }
  }

  handleTitleClick() {
    this.setState({
      displayPreviousAnswer: !this.state.displayPreviousAnswer
    });
  }

  reset() {
    this.setState({ index: -1 });
    let self = this;
    axios.get('https://opentdb.com/api.php?amount=10').then((response) => {
      self.setState({
        trivia: response.data.results,
        index: 0,
        correct: 0,
        incorrect: 0,
        answers: []
      });
    }).catch((error) => console.log('error', error));
  }

  render() {
    const loading = this.state.index === -1 ? (<div>Loading...</div>) : (null);
    const isStarted = this.state.index > -1 && (this.state.index + 1) <= this.state.trivia.length;
    const result = this.state.index >= this.state.trivia.length ? (<Results correct={this.state.correct} incorrect={this.state.incorrect} reset={this.reset} />) : (null);
    const button = isStarted ? (<Question index={this.state.index} questions={this.state.trivia} handleClick={this.handleClick}  correct={this.state.correct} incorrect={this.state.incorrect} answers={this.state.answers} displayPreviousAnswer={this.state.displayPreviousAnswer} />) : (null);

    return (
      <div>
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <h1 className="display-4" onClick={() => this.handleTitleClick()}>Powered by <i className="fab fa-react"></i></h1>
          {loading}
          {button}
          {result}
        </div>
      </div>
    );
  }
}

export default Trivia
