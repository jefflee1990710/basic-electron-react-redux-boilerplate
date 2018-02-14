import '../../assets/css/LoginButton.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class LoginButton extends React.PureComponent {
  constructor(props){
    super(props);
  }

  render(){
    let style = {};
    let className = 'loginButton';
    if(this.props.disable){
      className = 'loginButton_disable';
    }
    return (
      <div onClick={() => {
        if(this.props.onClick){
          this.props.onClick();
        }
      }} className={className}>
        {this.props.children}
      </div>
    )
  }
}

export default LoginButton;
