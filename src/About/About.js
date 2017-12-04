import React, {Component} from 'react';
import { Grid, Jumbotron } from 'react-bootstrap';

class About extends Component{

  state = {
    page:1,
    content:null
  };

  getDate(){
    let URL='/about';
    let _this = this;
    fetch(URL)
      .then( (response)=>response.json() )
      .then( (data)=>{
        console.log(data);
        _this.setState({
          content:data.content
        })
      } )
      .catch( (err)=> {
        console.log(err);
        _this.setState({
          content: err
        })

      } )
  }

  render() {
    return <Jumbotron>
      <Grid>
        <h1>About MLasS</h1>
        <p>{ this.state.content }</p>
      </Grid>
    </Jumbotron>
  }

  componentDidMount(){
    this.getDate()
  }
}

export default About;

