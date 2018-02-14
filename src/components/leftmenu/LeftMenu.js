import React, { Component } from 'react';
import {connect} from 'react-redux';

import Calendar from './Calendar';
import FolderExplorer from './FolderExplorer';
import { Button, Radio, Icon, Progress } from 'antd';
import {ipcRenderer} from 'electron';

import '../../assets/css/LeftMenu.css';

class LeftMenu extends React.Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <div id='leftMenuContainer'>
        <div className='logoWrapper'>
          <center style={{margin : '10px', fontSize : 25}}>
            RAW<span style={{color : '#47b3ef'}}>DUCK</span>
          </center>
        </div>
        <div className='daypickerWrapper'></div>
        <FolderExplorer className='folderListWrapper'
          folderList={this.props.folderList}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    calendarDate : state.folder.calendarDate,
    folderList : state.folder.folderList
  };
};

const mapDispatchToProps= (dispatch) => {
  return {
    calenderOnChange : (date) => {
      dispatch({
        type : 'calendar_on_change',
        date : date
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu);
