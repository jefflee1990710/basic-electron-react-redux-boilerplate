import '../../assets/css/RdButton.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class RdButton extends React.PureComponent {
  constructor(props){
    super(props);
  }

  render(){
    let style = {};
    let className = 'rdButton';
    if(this.props.disable){
      className = 'rdButton_disable';
    }
    className += ' ' + this.props.className;
    return (
      <div style={this.props.style} onClick={() => {
        if(this.props.onClick){
          this.props.onClick();
        }
      }} className={className}>
        {this.props.children}
      </div>
    )
  }
}

export default RdButton;
