import React, { Component } from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux'
import { Button, Radio, Icon, Alert } from 'antd';
import StatusBar from './StatusBar';
import LeftMenu from './leftmenu/LeftMenu';
import PhotoList from './PhotoList';
import LoginButton from './btn/LoginButton';
import FullPageLoading from './FullPageLoading';
import request from 'request';
import api from '../api';
import {ipcRenderer} from 'electron'

class App extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(!this.props.logined){
      let jwtToken = ipcRenderer.sendSync('readJwtToken');
      if(jwtToken){
        console.log('jwtToken found! ', jwtToken);
        this.props.jwtTokenLogin(jwtToken);
      }else{
        console.log('Cannot find jwtToken in ~/.rawduck, login required!');
      }
    }
  }
  render() {
    let logined = this.props.logined;
    let loginLoading = this.props.loginLoading;
    let loginFailMessage = this.props.loginFailMessage;
    return (
        <div style={{width : '100%', height : '100%'}}>
          {loginLoading && <FullPageLoading style={{position : 'fixed'}} />}
          {loginFailMessage && (
            <div style={{position : 'fixed', width : '100%', marginTop : 10}}>
              <Alert banner={true}
                style={{margin : 'auto', width : 400}}
                message={loginFailMessage}
                type="info" showIcon />
            </div>
          )}
          {!logined && (
            <div id='loginContainer'>
              <div id='loginColumn'>
                <div id='loginBox'>
                  <div id='loginTitle'>
                    <center style={{fontSize : 35}}>
                      RAW<span style={{color : '#47b3ef'}}>DUCK</span>
                    </center>
                  </div>
                  <div className='loginFieldContainer'>
                    <input className='loginInput' ref='email' placeholder='Email Address' type='email'/>
                  </div>
                  <div className='loginFieldContainer'>
                    <input className='loginInput' ref='password' placeholder='Password' type='password'/>
                  </div>
                  <div id='loginBtnContainer'>
                    <LoginButton onClick={() => {
                      let email = this.refs.email.value;
                      let password = this.refs.password.value;
                      this.props.userLogin(email, password);
                    }}>Login</LoginButton>
                    <LoginButton>Register</LoginButton>
                  </div>
                </div>
              </div>
            </div>
          )}
          {logined && (
            <div id='mainContainer'>
              <div id='main'>
                <div id='mainLeft'>
                  <LeftMenu />
                </div>
                <div id='mainRight'>
                  <PhotoList blockWidth={150} blockMargin={2}/>
                </div>
              </div>
              <div id='bottom'>
                <StatusBar />
              </div>
            </div>
          )}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logined : state.auth.logined,
    loginLoading : state.auth.loginLoading,
    loginFailMessage : state.auth.loginFailMessage,
    jwtToken : state.auth.jwtToken
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    jwtTokenLogin : (jwtToken) => {
      loadFolders(dispatch, jwtToken);
      dispatch({
        type : 'user_login_done',
        jwtToken : jwtToken
      });
    },
    userLogin : (email, password) => {
      dispatch({
        type : 'user_login_loading'
      });
      dispatch((dispatch) => {
        console.log('Cant find jwtToken locally, login via API...');
        request.post({
          uri : api.userLogin,
          method : 'POST',
          body : {
            email : email,
            password : password
          }, 
          json : true
        }, (err, response) => {
          console.log(err, response);
          let respBody = response.body;
          if(respBody.code === 'login_success'){
            ipcRenderer.sendSync('writeJwtToken', respBody.jwtToken);
            loadFolders(dispatch, respBody.jwtToken);
            dispatch({
              type : 'user_login_done',
              jwtToken : respBody.jwtToken
            });
          }else{
            dispatch({
              type : 'user_login_fail',
              errorCode : respBody.code
            });
          }
        })
      });
    }
  }
}

const loadFolders = (dispatch, jwtToken) => {
  console.log('Loading folder list....');
      dispatch({
        type : 'load_folder_loading'
      });
      let params = {
        uri : api.userFolders,
        method : 'POST',
        body : {
          jwtToken : jwtToken
        },
        json : true
      };
      request(params, (err, resp) => {
        if(err){
          reject(err);
          dispatch({
            type : 'load_folder_fail',
            errorCode : err.toString()
          });
        }else{
          dispatch({
            type : 'load_folder_done',
            folders : resp.body.folders
          });
        }
      })
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
