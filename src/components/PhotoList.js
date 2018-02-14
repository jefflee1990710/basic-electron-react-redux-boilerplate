import '../assets/css/PhotoList.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import Lightbox from "react-image-lightbox";
import { Button, List, Icon, Card, Badge, Switch } from 'antd';
import {ipcRenderer} from 'electron';

import RdButton from './btn/RdButton';
import RdViewButton from './btn/RdViewButton';
import RdToggle from './btn/RdToggle';
import FullPageLoading from './FullPageLoading';

class PhotoList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      blockWidth : 0
    }
  }

  componentDidMount(){
    this._handleWindowResize();
    window.addEventListener('resize', this._handleWindowResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleWindowResize.bind(this));
  }

  _handleWindowResize(){
    let photoListWrapper = this.refs.photoListWrapper;
    let blockMargin = this.props.blockMargin;

    let wrapperWidth = photoListWrapper.clientWidth;
    let wrapperHeight = photoListWrapper.clientHeight;

    // let blockWidth = Math.floor((wrapperWidth / numBlockPerRow)) - blockMargin * 2;
    let blockWidth = this.props.blockWidth;
    let numBlockPerRow = Math.floor(wrapperWidth / (blockWidth + blockMargin * 2));
    let spaceLeft = (wrapperWidth - (numBlockPerRow * (blockWidth + blockMargin * 2)));
    if(spaceLeft > 10){
      let diff = Math.floor(spaceLeft / numBlockPerRow);
      blockWidth += diff;
    }

    this.setState({
      blockWidth : blockWidth
    });

  }

  render() {
    let blocks = [];
    for(let i = 0; i < this.props.photoList.length; i ++){
      let blockObj = this.props.photoList[i];
      blocks.push(<Block key={i} pointer={i}
          onClick={this.props.blockOnClick} onClickViewBtn={this.props.blockOnClickViewBtn}
          name={blockObj.name} blockMargin={this.props.blockMargin} selected={blockObj.selected}
          width={this.state.blockWidth} height={this.state.blockWidth}
          imgWidth={blockObj.imgWidth} imgHeight={blockObj.imgHeight} imgUrl={blockObj.imgUrl} imgThumbnail={blockObj.imgThumbnail}
          url={blockObj.url} editMode={this.props.editMode}
        />);
    }
    return (
      <div className='photoListContainer'>
        <div className='photoListHeader' style={{paddingLeft : this.props.blockMargin, paddingRight : this.props.blockMargin}}>
          <RdToggle checked={this.props.editMode} onChange={this.props.toggleEditMode} unCheckedChildren={<Icon type="eye" />} checkedChildren={<Icon type="select" />} />
          <RdButton disable={!this.props.editMode} onClick={this.props.uncheckAll}><Icon type="appstore-o" /></RdButton>
          <RdButton disable={!this.props.editMode} onClick={this.props.checkAll}><Icon type="appstore" /></RdButton>
          <RdButton disable={!this.props.editMode} onClick={this.props.uncheckAll}><Icon type="cloud-download" /></RdButton>
          <RdButton disable={!this.props.editMode} onClick={this.props.uncheckAll}><Icon type="delete" /></RdButton>
          <RdButton disable={false} onClick={this.props.uncheckAll}><Icon type="reload" /></RdButton>
        </div>
        <div ref='photoListWrapper' className='photoListWrapper'>
          <div className='blocksWrapper'>
            {blocks}
          </div>
          {this.props.photoListLoading && <FullPageLoading style={{position : 'absolute'}} />}
        </div>
        {
          this.props.isOpen && (
            <Lightbox
              mainSrc={this.props.photoList[this.props.photoIndex].imgUrl}
              nextSrc={this.props.photoList[(this.props.photoIndex + 1) % this.props.photoList.length].imgUrl}
              prevSrc={this.props.photoList[(this.props.photoIndex + this.props.photoList.length - 1) % this.props.photoList.length].imgUrl}
              onCloseRequest={this.props.closeLightbox}
              onMovePrevRequest={() => {
                this.props.gotoLightboxIndex((this.props.photoIndex + this.props.photoList.length - 1) % this.props.photoList.length);
              }}
              onMoveNextRequest={() => {
                this.props.gotoLightboxIndex((this.props.photoIndex + 1) % this.props.photoList.length);
              }}
            />
          )
        }
      </div>
    );
  }

}

class Block extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      mouseover : false
    }
  }

  mouseOver(){
    this.setState({
      mouseover : true
    })
  }

  mouseOut(){
    this.setState({
      mouseover : false
    })
  }

  render(){
    let blockClazz = '';
    let overlay = <div></div>;
    if(this.state.mouseover && !this.props.selected){
      blockClazz += ' block_mouseon';
    }
    if(this.state.mouseover && !this.props.editMode){
      overlay = (
        <div className='blockOverlay'>
          <RdViewButton className='blockOverlayBtn' onClick={() => {
            this.props.onClickViewBtn(this.props.pointer);
          }}>
            View
          </RdViewButton>
        </div>
      )
    }
    let draggable = false;
    if(this.props.editMode){
      if(this.props.selected){
        draggable = true;
        blockClazz += ' block_editmode_selected';
      }else{
        blockClazz += ' block_editmode_normal';
      }
    }else{
      blockClazz += ' block_normal';
    }
    return (
      <div className={`block ${blockClazz}`}  onClick={() => {
        if(this.props.editMode) {this.props.onClick(this.props.pointer)};
      }} onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)} style={
        {
          width : this.props.width,
          height : this.props.height,
          margin : this.props.blockMargin
        }
      }>
        <img className='blockImg' src={this.props.imgThumbnail} style={{maxWidth : '100%', maxHeight : '100%', margin : 'auto'}} />
        <div className='blockTxt' style={{width : '100%', lineHeight : '20px', height : '20px', textAlign : 'center', fontSize : '13px'}}>{this.props.name}</div>
        {overlay}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    logined : state.auth.logined,
    photoList : state.photolist.photoList,
    editMode : state.photolist.editMode,
    photoIndex: state.photolist.photoIndex,
    isOpen: state.photolist.isOpen,
    photoListLoading : state.photolist.photoListLoading
  };
};

const mapDispatchToProps= (dispatch) => {
  return {
    userLogout : () => {
      dispatch({
        type : 'user_logout'
      });
    },
    blockOnClick : (index) => {
      dispatch({
        type : 'block_on_click',
        index : index
      });
    },
    blockOnClickViewBtn : (index) => {
      dispatch({
        type : 'block_on_click_view_btn',
        index : index
      });
    },
    uncheckAll : () => {
      dispatch({
        type : 'block_uncheck_all'
      });
    },
    checkAll : () => {
      dispatch({
        type : 'block_check_all'
      });
    },
    toggleEditMode : (checked) => {
      dispatch({
        type : 'block_toggle_edit_mode'
      });
    },
    gotoLightboxIndex : (index) => {
      dispatch({
        type : 'goto_lightbox_index',
        index : index
      });
    },
    closeLightbox : () => {
      dispatch({
        type : 'close_lightbox'
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoList);
