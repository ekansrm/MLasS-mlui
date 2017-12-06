import React, {Component} from 'react';
import { Grid, Jumbotron } from 'react-bootstrap';
import Websocket from 'react-websocket';
import FixedDataTable from 'fixed-data-table';



const {Table, Column, Cell} = FixedDataTable;

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {(data[rowIndex])[col]}
  </Cell>
);

const ColorCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {colorizeBackground((data[rowIndex])[col])}
  </Cell>
);

function colorizeBackground(diffValue){
  if(diffValue < 0) return <span className='diff-red'>{diffValue}</span>;
  return <span className='diff-green'>{diffValue}</span>;
}

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



  constructor(props) {
    super(props);
    this.state = {stocks: []};
  }

  handleData(data) {
    this.setState({
      stocks:data
    });
    console.log(data);
    const results = JSON.parse(data);
    let newStocks = this.state.stocks.splice(0);
    results.forEach((result) => {
      const stockIndex = newStocks.findIndex((stock) => {
        return stock.id === result.id;
      });
      if(stockIndex !== -1){
        const stock = newStocks[stockIndex];
        const diff = parseFloat(result.l) - parseFloat(stock.l);
        const newStock = Object.assign({'diff': diff}, result);
        newStocks[stockIndex] = newStock;
      }else{
        const newStockWithZeroDiff = Object.assign({'diff': 0}, result);
        newStocks.push(newStockWithZeroDiff);
      }
    });
    this.setState({stocks: newStocks});
  }


  render() {
    return <Jumbotron>
      <Grid>
        <h1>About MLasS</h1>
        <p>{ this.state.content }</p>
        <div>
          <Table
            rowsCount={this.state.stocks.length}
            rowHeight={50}
            headerHeight={50}
            width={1100}
            height={500}
            {...this.props}>
            <Column
              header={<Cell>Id</Cell>}
              cell={<TextCell data={this.state.stocks} col="id" />}
              fixed={false}
              width={200}
            />
            <Column
              header={<Cell>Ticker</Cell>}
              cell={<TextCell data={this.state.stocks} col="t" />}
              fixed={false}
              width={200}
            />
            <Column
              header={<Cell>Exchange</Cell>}
              cell={<TextCell data={this.state.stocks} col="e" />}
              fixed={false}
              width={200}
            />
            <Column
              header={<Cell>Price</Cell>}
              cell={<TextCell data={this.state.stocks} col="l" />}
              fixed={false}
              width={200}
            />
            <Column
              header={<Cell>Diff</Cell>}
              cell={<ColorCell data={this.state.stocks} col="diff" />}
              fixed={false}
              width={300}
            />
          </Table>
          <Websocket url='ws://localhost:9000/stocks/websocket' onMessage={this.handleData.bind(this)}  reconnect={true}/>
        </div>
      </Grid>
    </Jumbotron>
  }

  componentDidMount(){
    this.getDate()
  }
}

export default About;

