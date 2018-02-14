import '../../assets/css/RdViewButton.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class RdViewButton extends React.PureComponent {
  constructor(props){
    super(props);
  }

  render(){
    let style = {};
    let className = 'rdViewButton';
    if(this.props.disable){
      className = 'rdViewButton_disable';
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

export default RdViewButton;
