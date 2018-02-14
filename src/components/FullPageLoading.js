import '../assets/css/FullPageLoading.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

class FullPageLoading extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className='loaderWrapper' style={this.props.style}>
        <div className='loaderRow'>
          <div className="loader">Loading...</div>
        </div>
      </div>
    )
  }

}

export default FullPageLoading;
