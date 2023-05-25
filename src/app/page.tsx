"use client"
import React, { useState, props } from 'react';
import Image from 'next/image';
import {Button} from '../stories/Button';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // a plugin!
import resourcePlugin from '@fullcalendar/resource'; // a plugin!
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
    }


    render () {

    return (
/*      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
              <Calendar campaigns={campaigns} />

                </Resizable>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    noWrap={true}
                  />
                </MapContainer>                       
                </div>
*/
       <ReflexContainer orientation="horizontal">

        <ReflexElement className="top-pane">
          <Calendar campaigns={campaigns}/>
        </ReflexElement>
        <ReflexSplitter propagate={true}/>
      <ReflexElement minSize={36}>
        <div style={{ height:"100%", display: 'flex', flexDirection: 'row' }}>
            <LeafletMap />
        </div>   
        </ReflexElement>  

      </ReflexContainer>
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


export default function Home() {

  return (
    <div style={{height:"100vh"}}>
    <ReflexBasicDemo />
    </div>
  );

};