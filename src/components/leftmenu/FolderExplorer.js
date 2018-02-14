import '../../assets/css/FolderExplorer.css';

import React, { Component } from 'react';
import moment from 'moment';
import {Icon, Checkbox} from 'antd';

import {connect} from 'react-redux';

class FolderExplorer extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    let folderList = this.props.folderList;
    let folderDomList = [];
    for(let i = 0; i < folderList.length; i++){
      let folderObj = folderList[i];
      folderDomList.push(
        <FolderItem onClick={this.props.folderItemOnClick}
          selected={folderObj.selected} disable={folderObj.disable}
          showCheckbox={this.props.folderEditMode}
          key={i} folderName={folderObj.folderName}
          folderId={folderObj.folderId} />
      );
    }
    let folderBtnBarIconClass = 'folderBtnBarIcon';
    if(this.props.folderEditMode){
        folderBtnBarIconClass += ' folderBtnBarIcon_selected';
    }
    return (
      <div className={this.props.className}>
        <div className='folderSearch'>
          <input className='folderSearchField'/>
          <Icon className='folderSearchIcon' type="search" />
        </div>
        <div className='folderListContainer'>
          <div className='folderList'>
            {folderDomList}
          </div>
        </div>
        <div className='folderBtnBar'>
          <Icon onClick={this.props.toggleEditMode} className={folderBtnBarIconClass} type="edit" />
          <Icon className='folderBtnBarIcon' type="folder-add" />
          <Icon className='folderBtnBarIcon' type="delete" />
        </div>
      </div>
    )
  }
}

class FolderItem extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    let folderIcon;
    let folderItemContainer = 'folderItemContainer';

    if(this.props.selected){
      folderItemContainer += ' folderItemContainer_open';
      folderIcon = (<Icon className='folderItemIcon' type="folder-open" />);
    }else{
      folderIcon = (<Icon className='folderItemIcon' type="folder" />);
    }

    let checkBoxClass = '';
    if(this.props.showCheckbox){
      checkBoxClass += 'folderItemCheckbox_show'
    }else {
      checkBoxClass += 'folderItemCheckbox_hide'
    }
    return (
      <div className={folderItemContainer} onClick={() =>{
          if(!this.props.disable){
            this.props.onClick(this.props.folderId);
          }
        }}>
        <div className={checkBoxClass}>
          <input type='checkbox' chekced={this.props.checked} />
        </div>
        {folderIcon}
        <div className='folderItemName'>{this.props.folderName}</div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    folderEditMode : state.folder.folderEditMode
  };
};

const mapDispatchToProps= (dispatch) => {
  return {
    toggleEditMode : () => {
      dispatch({
        type : 'toggle_folder_editmode'
      });
    },
    folderItemOnClick : (folderId) => {
      dispatch({
        type : 'select_folder_loading',
        folderId : folderId
      })
      dispatch((dispatch) => {
        setTimeout(() => {
          dispatch({
            type : 'select_folder_done',
            folderId : folderId
          });
        }, 1000);
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FolderExplorer);
