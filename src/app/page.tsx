"use client"
import Image from 'next/image';
import {Button} from '../stories/Button';

import React, { useState, useEffect, createRef, useContext} from 'react';
//import moment from 'moment';
import 'leaflet/dist/leaflet.css';
import 'react-reflex/styles.css'

import ReflexContainer from "../components/reflex/ReflexContainer";

import {
ReflexSplitter,
ReflexElement,
ReflexHandle
} from 'react-reflex';

import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
} from '@fullcalendar/core'
import { INITIAL_EVENTS, createEventId } from './event-utils';
import campaigns from './campaigns.json';
import Calendar from "../components/Calendar";
import LeafletMap from "../components/LeafletMap";
import Resizable  from "../components/Resizable";
import dynamic from "next/dynamic";

import { connect } from 'react-redux';
import { createSelector } from "reselect";
import actionCreators from './actions/actions';
import { getHashValues } from './utils/utils';


import { Provider, ReactReduxContext } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import combineReducers from './reducer/reducer';
import { AnyCnameRecord } from 'dns';


let store = createStore(combineReducers, applyMiddleware(thunk));
let customContext = React.createContext(null);

const HandleElement = () => {
 
  return (
    <div>
      <ReflexHandle className="handle">
        Bottom Pane Header: I am a draggable handle! 
        Drag me to resize ...
      </ReflexHandle>
      <div className="pane-content">
        <label>
          Bottom Pane
        </label>  
      </div>
    </div>
  )
}



class ReflexBasicDemo
  extends React.Component {


    state = {
      weekendsVisible: true,
      currentEvents: []
    };


    render () {

    return (
      <Provider store={store} context={ReactReduxContext}>      
    <div style={{height:"100vh"}}>
       <ReflexContainer orientation="horizontal">
        <ReflexElement className="top-pane">                   
          <Calendar  store={store} context={ReactReduxContext} campaigns={campaigns} props={this.props}/>
        </ReflexElement>
        <ReflexSplitter propagate={true}/>
      <ReflexElement minSize={36}>
        <div style={{ height:"100%", display: 'flex', flexDirection: 'row' }}>
            <LeafletMap />
        </div>   
        </ReflexElement>  

      </ReflexContainer>
      </div>
      </Provider>
  )
  }

  
  handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }
  
  handleEvents = (events: EventApi[]) => {
    this.setState({
      currentEvents: events
    })
  }

}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </>
  )
  }

function Home(props:any) {

  return (
    <Provider store={store} context={ReactReduxContext}>      
      <div style={{height:"100vh"}}>
      <ReflexBasicDemo/>
    </div>
    </Provider>          
  );

};

function mapStateToProps() {
  const getEventArray = createSelector(
    (state: any) => state.eventsById,
    getHashValues
  )

  return (state: any) => {
    return {
      events: getEventArray(state),
      weekendsVisible: state.weekendsVisible
    }
  }
}

export default connect(mapStateToProps, actionCreators)(Home);