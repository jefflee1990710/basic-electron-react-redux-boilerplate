import '../../assets/css/Calendar.css';

import React, { Component } from 'react';
import moment from 'moment';

class Calendar extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      date : moment(),
      navDate : moment(),
      heatMap : {}
    }
  }

  onChangeDate(date){
    this.updateMonthHeatMap({
      20180226 : 120,
      20180225 : 60,
      20180224 : 52,
      20180223 : 133,
      20180222 : 123,
      20180221 : 98,
      20180220 : 12
    });
    this.setState({
      date : date
    });
  }

  nextMonth(){
    this.setState({
      navDate : this.state.navDate.add(1, 'months')
    });
  }

  nextMonthChangeDate(date){
    this.updateMonthHeatMap({
      20180226 : 120,
      20180225 : 60,
      20180224 : 52,
      20180223 : 133,
      20180222 : 123,
      20180221 : 98,
      20180220 : 12
    });
    this.setState({
      date : date,
      navDate : this.state.navDate.add(1, 'months')
    });
  }

  prevMonth(){
    this.setState({
      navDate : this.state.navDate.subtract(1, 'months')
    });
  }

  prevMonthChangeDate(date){
    this.updateMonthHeatMap({
      20180226 : 120,
      20180225 : 60,
      20180224 : 52,
      20180223 : 133,
      20180222 : 123,
      20180221 : 98,
      20180220 : 12
    });
    this.setState({
      date : date,
      navDate : this.state.navDate.subtract(1, 'months')
    });
  }

  updateMonthHeatMap(heatMap){ // YYYYMMDD : numberOfPhoto
    let maxNumOfPhoto;
    let minNumOfPhoto;
    for(var key in heatMap){
      if(!maxNumOfPhoto) {maxNumOfPhoto = heatMap[key]}
      if(!minNumOfPhoto) {minNumOfPhoto = heatMap[key]}
      if(heatMap[key] > maxNumOfPhoto) {maxNumOfPhoto = heatMap[key]}
      if(heatMap[key] < minNumOfPhoto) {minNumOfPhoto = heatMap[key]}
    }
    let radiusStep = 7 / (maxNumOfPhoto - minNumOfPhoto);
    let gStep = 255 / (maxNumOfPhoto - minNumOfPhoto);
    let bStep = (255 - 45) / (maxNumOfPhoto - minNumOfPhoto);
    this.setState({
      heatMap : heatMap,
      maxNumOfPhoto : maxNumOfPhoto,
      minNumOfPhoto : minNumOfPhoto,
      radiusStep : radiusStep,
      gStep : gStep,
      bStep : bStep
    });
  }

  render() {
    let navDay = moment(this.state.navDate);
    let selectedDay = moment(this.state.date);
    let box = [];
    box.push(<div className='calendarDayBox calendarWeek' key='sun'>SUN</div>);
    box.push(<div className='calendarDayBox calendarWeek' key='mon'>MON</div>);
    box.push(<div className='calendarDayBox calendarWeek' key='tue'>TUE</div>);
    box.push(<div className='calendarDayBox calendarWeek' key='wed'>WED</div>);
    box.push(<div className='calendarDayBox calendarWeek' key='thu'>THU</div>);
    box.push(<div className='calendarDayBox calendarWeek' key='fri'>FRI</div>);
    box.push(<div className='calendarDayBox calendarWeek' key='sat'>SAT</div>);
    let a = navDay.clone().startOf('month');
    let b = navDay.clone().endOf('month');
    let offset = a.isoWeekday();
    if(offset === 7) offset = 0;
    for(var i = 0; i < offset;i ++){
      let className = 'calendarDayBox calendarDay calendarNotSameMonth';
      let m = a.clone().subtract(offset - i, 'days');
      box.push(<CalendarDayBox date={m.clone()} className={className}
        onChangeDate={this.prevMonthChangeDate.bind(this)} key={m.format('YYYYMMDD')} />);
    }
    for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
      let className = 'calendarDayBox calendarDay';
      if(m.format('YYYYMMDD') === selectedDay.format('YYYYMMDD')){
        className += ' calendarSelected';
      }
      let style = {};
      let radius = null;
      let rgb = null;
      for(var key in this.state.heatMap){
        if(m.format('YYYYMMDD') === key){
          let numOfPhoto = this.state.heatMap[key];
          radius = (numOfPhoto - this.state.minNumOfPhoto) * this.state.radiusStep;
          let g = 255 - parseInt((numOfPhoto - this.state.minNumOfPhoto) * this.state.gStep);
          let b = 255 - parseInt(45 + (numOfPhoto - this.state.minNumOfPhoto) * this.state.bStep);
          rgb = "rgb(255, " + g + ", " + b + ")";
        }
      }
      box.push(<CalendarDayBox indicatorRadius={radius} indicatorRgb={rgb} date={m.clone()} className={className} style={style}
        onChangeDate={this.onChangeDate.bind(this)} key={m.format('YYYYMMDD')} />);
    }
    offset = 7 - b.isoWeekday() - 1;
    if(offset < 0) {offset = 0};
    for(var i = 0; i < offset; i++){
      let className = 'calendarDayBox calendarDay calendarNotSameMonth';
      let m = b.clone().add(i + 1, 'days');
      box.push(<CalendarDayBox date={m.clone()} className={className}
        onChangeDate={this.nextMonthChangeDate.bind(this)} key={m.format('YYYYMMDD')} />);
    }
    return (
      <div className='calendarContainer'>
        <div className='calendarNav'>
          <div onClick={this.prevMonth.bind(this)}
            className='calendarNavBack'>&lt;</div>
          <div className='calendarCurrent'>{moment(this.state.navDate).format('MMMM YYYY')}</div>
          <div onClick={this.nextMonth.bind(this)}
            className='calendarNavForward'>&gt;</div>
        </div>
        <div className='calendarBody'>
          {box}
        </div>
        <div className='calendarBottom'></div>
        <div className='calendarPreview'></div>
      </div>
    );
  }
}

class CalendarDayBox extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    let indicatorRadius = this.props.indicatorRadius;
    let ind;
    if(indicatorRadius){
      ind = (
        <svg width={indicatorRadius} height={indicatorRadius} style={{position : 'absolute', left : 7- indicatorRadius/2, top : 7- indicatorRadius/2, opacity: 0.7}}>
          <rect x={0} y={0} width={indicatorRadius} height={indicatorRadius} fill={this.props.indicatorRgb}/>
        </svg>
      )
    }
    return (
      <div style={this.props.style} onClick={() => {
        this.props.onChangeDate(this.props.date);
      }} key={this.props.date.format('M DD')} className={this.props.className}>{ind}{this.props.date.format('DD')}</div>
    )
  }

}


export default Calendar;
