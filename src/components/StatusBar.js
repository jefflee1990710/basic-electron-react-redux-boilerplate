import '../assets/css/StatusBar.css';
import React, { Component } from 'react';
import {connect} from 'react-redux';

import RdButton from './btn/RdButton';
import { Button, Radio, Icon, Progress } from 'antd';
import {ipcRenderer} from 'electron';

class StatusBar extends React.Component {
  render() {
    const size = 3;
    return (
      <div className='statusBar'>
        <RdButton disable={false} onClick={this.props.userLogout}><Icon type="poweroff" /></RdButton>
        <RdButton onClick={this.openImportDialog.bind(this)} disable={false}><Icon type="cloud-upload" /></RdButton>
        <RdButton disable={false}><Icon type="user" /></RdButton>
      </div>
    );
  }

  openImportDialog(){
    ipcRenderer.send('openImportDialog');
  }
}



const mapStateToProps = (state) => {
  return {
    logined : state.auth.logined
  };
};

const mapDispatchToProps= (dispatch) => {
  return {
    userLogout : () => {
      dispatch({
        type : 'user_logout'
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);
