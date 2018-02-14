import '../../assets/css/RdButton.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class RdToggle extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      checked : props.checked
    }
  }

  onClick(){
    let newChecked = !this.state.checked;
    this.setState({
      checked : newChecked
    });
    this.props.onChange(newChecked);
  }

  render(){
    let children;
    let style;
    if(this.state.checked){
      children = this.props.checkedChildren;
      style = {
        backgroundColor : '#47b3ef',
        transition : '0.15s all ease-in'
      }
    }else{
      children = this.props.unCheckedChildren;
      style = {
        transition : '0.15s all ease-in'
      }
    }
    return (
      <div onClick={this.onClick.bind(this)} className='rdButton' style={style}>
        {children}
      </div>
    )
  }

}

export default RdToggle;
