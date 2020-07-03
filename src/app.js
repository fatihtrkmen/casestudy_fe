import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import LiveHelp from '@material-ui/icons/LiveHelp';
import Button from 'material-ui/Button';
import Radio from 'material-ui/Radio';
import TextField from 'material-ui/TextField';
import { saveSurvey,saveStatus } from './service';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    width: "60%",
 
    margin: "0 auto"
  }),
  button:{
    pointerEvents: "none",
    boxShadow: "none"
  },
  questionMeta:{
    marginLeft: 10,
    display: "inline"
  },
  footer:{
    marginTop: "40px"
  }
});

class PaperSheet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      quiz: props.quiz,
      category: 'hard_fact',
      categories: [],
      selectedValue: {},
      revealed: false,
      answers:[],
      answersByCategory:[],
      totalAnswered:0,
      savedCategories:[],
      status:[]
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ quiz: props.quiz });
    var category = [...new Set(props.quiz.map(iter => iter.category))];
    this.setState({categories: category});
  

    if(props.answers != null && props.answers != undefined && props.answers.length > 0)
    {
      let initialCategoryAnswers = props.answers.filter(iter => iter.category == this.state.category);
      this.setState({ answersByCategory: initialCategoryAnswers});  
      this.setState({answers: props.answers.filter(iter => iter.category != this.state.category)});

      this.setState({selectedValue:initialCategoryAnswers[0].answer});
      
      this.setState({totalAnswered: props.answers.length});
    }

    if(props.status != null && props.status.length > 0){
      this.setState({status: props.status});
    }
  }

  handleChange = event => {
    this.setState({ selectedValue: event.target.value });
    if(true)
    {
      let isExist = this.state.answersByCategory.length == 0 ? -1 : this.state.answersByCategory.findIndex(iter => iter.id == this.state.quiz[this.state.current].id);
      if(isExist > -1)
        this.state.answersByCategory[isExist].answer = event.target.value;
      else
      {
        var joined = this.state.answersByCategory.concat({
          id: this.state.quiz[this.state.current].id,
          answer: event.target.value,
          category: this.state.quiz[this.state.current].category
        });
        this.setState({ answersByCategory: joined });
        this.setState({totalAnswered: this.state.totalAnswered + 1});
      }

    }
  };

  handleChangeCategory = event => {
    let question = this.state.quiz;
    let questionsByCateqory = this.props.quiz.filter(iter => iter.category == event.target.value); 
    this.setState({quiz:questionsByCateqory})
    this.setState({ category: event.target.value });
    this.state.current = 0;
    

    let myConcatenatedAnswers =  this.state.answers.concat(this.state.answersByCategory);

    let answersByCateqory = [...new Set(myConcatenatedAnswers.filter(iter => iter.category == event.target.value))]; 
    this.setState({answersByCategory:answersByCateqory});

    this.setState({answers:[...new Set(myConcatenatedAnswers.filter(iter => iter.category != event.target.value))]});

    if(answersByCateqory.length > 0)
    this.setState({ selectedValue: answersByCateqory[0].answer });
  };

  moveNext = () => {
    this.clearBacks();

    let isNextExist = this.state.answersByCategory.length == 0 ? -1 : this.state.answersByCategory.findIndex(iter => iter.id == this.state.quiz[this.state.current+1].id);
    if(isNextExist > -1)
    this.setState({ selectedValue: this.state.answersByCategory[isNextExist].answer });

    this.setState({ current: this.state.current + 1 }); 
  }

  saveSurvey = () => {
    saveSurvey(this.state.answersByCategory).then(res => {
      this.setState({savedCategories: this.savedCategories.push(this.state.answersByCategory)})
    });

    saveStatus(this.state.category).then(res => {
    });
    window.location.reload(true);
  }

  movePrevious = () => {
    this.clearBacks();
    this.setState({ current: this.state.current - 1 });

    this.setState({ selectedValue: this.state.answersByCategory[this.state.current-1].answer });
  }

  clearBacks = () => {
    var question = this.props.quiz[this.state.current]
    for (var i = 0; i < question.options.length; i++) {
      this.refs[i.toString()].style.background = "white";
    }
  }

  revealCorrect = () => {
    var question = this.props.quiz[this.state.current]
    var answer = question.answer;
    this.clearBacks()
    if (this.state.selectedValue === answer) {
      this.refs[answer].style.background = "lightgreen";
    } else {
      this.refs[answer].style.background = "lightgreen";
      this.refs[this.state.selectedValue].style.background = "lightcoral";
    }
    this.setState({ revealed: true })
  }

  render() {
    if(this.props.quiz.length > 0 && this.state.quiz.length == this.props.quiz.length)
    {
      let questionsByCateqory = this.props.quiz.filter(iter => iter.category == this.state.category); 
      this.setState({quiz:questionsByCateqory})
    }

    var question = this.state.quiz[this.state.current];

    var curQuestion = this.state.current + 1;
    var size = this.state.quiz.length;
    var moveRight = this.state.current + 1 < this.state.quiz.length;
    var moveLeft = this.state.current == 0;
    return (
      <div>
        {
          this.state.quiz.length &&
          <div>
          <Paper className={this.props.classes.root} elevation={4}>
          <TextField
                fullWidth
                margin="dense"
                name="state"
                onChange={this.handleChangeCategory}
                style={{marginBottom:"8px"}}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={this.state.category}
                variant="outlined"
              >
                {this.state.categories.map(option => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </TextField>
          <Typography component="p">
            <Button variant="fab" color="primary" aria-label="add" className={this.props.classes.button}>
              <LiveHelp />
            </Button>
            <span className={this.props.classes.questionMeta}> Question # {curQuestion} / {size}</span>

          </Typography>

          <hr style={{ marginBottom: "20px" }} />
          <Typography variant="headline" component="h5">
            {question.question}
          </Typography>

          {question.options.map((opt, index) => (
            <div key={index} style={{ marginTop: "5px" }} ref={index.toString()}>
              <Radio
                checked={this.state.selectedValue === opt.toString()}
                onChange={this.handleChange}
                value={opt.toString()}
                name="radio-button-demo"
                aria-label="A"
              />
              {opt}
            </div>
          ))}
          <div className={this.props.classes.footer} style={{height:'50px'}}>

            
            {              (this.state.answersByCategory.length == this.state.quiz.length && this.state.status.filter(iter => iter.categoryName == this.state.category).length == 0) ? (<Button variant="raised" onClick={this.saveSurvey} color="secondary" style={{ float: "right" }}>Submit</Button>) :
              (<Button disabled variant="raised" color="secondary" style={{ float: "right" }}>Submit</Button>)}
            
            {              
              (moveRight) ? (<Button onClick={this.moveNext} variant="raised" color="primary" style={{ float: "right",marginRight: "30px" }}>
              Next
            </Button>) : (<Button onClick={this.moveNext} disabled variant="raised" color="primary" style={{ float: "right",marginRight: "30px" }}>
              Next
            </Button>)}

            {(moveLeft) ? (<Button onClick={this.movePrevious} disabled variant="raised" color="primary" style={{ float: "right", marginRight: "10px" }}>
              Previous
            </Button>) : (<Button onClick={this.movePrevious} variant="raised" color="primary" style={{ float: "right", marginRight: "10px" }}>
              Previous
            </Button>)}
            
            {              (this.state.answersByCategory.length == this.state.quiz.length) ?  <Typography variant="headline" component="h5">section completed</Typography> :
              <Typography variant="headline" component="h5"></Typography>}


          </div>
        </Paper>
        </div>
        }
      </div>
    );
  }
}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);