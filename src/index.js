import React, { Component } from 'react';
import { render } from 'react-dom';
import Ap from './app';
// import './style.css';
import { getSurvey, getMyAnswers, getStatus } from './service'

// async function  getData() {
//   const data = await getSurvey();
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      quiz: [],
      myAnswers:[],
      status:{}
    };
  }

 
  componentDidMount() {
    getSurvey().then(res => {
      console.log(res.data);
      var arr = { quiz: [] };
      for (var i = 0; i < res.data.length; i++) {
        arr.quiz.push({ id:res.data[i].id, category:res.data[i].category,question: res.data[i].question, options: res.data[i].question_type.options, answer: 1 });
      }
      console.log(arr.quiz);
      this.setState({ quiz: arr.quiz });
    });
    getMyAnswers().then(result => {
      let myAnswers = [];
      for (var i = 0; i < result.data.length; i++) {
        myAnswers.push({ id:result.data[i].question_id, answer: result.data[i].answer, objectId:result.data[i].id,
        category: result.data[i].category });
      }
      this.setState({ myAnswers: myAnswers });
    });

    getStatus().then(result => {
      this.setState({ status: result.data });
    });

  }

  render() {
    return (
      <div>
        <Ap quiz={this.state.quiz} answers={this.state.myAnswers} status={this.state.status} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
