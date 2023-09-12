import { useState, useEffect, createRef, useContext} from 'react';
//import moment from 'moment';
import FullCalendar from "@fullcalendar/react";
import Tooltip from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from '@fullcalendar/interaction';
import ModeSelector from './ModeSelector';
import CampaignResource from './CampaignResource';

import { PHASES_COLORS } from './utils';
import { INITIAL_EVENTS, createEventId } from '../app/event-utils';
import './calendar.css';
import { ReactReduxContext } from 'react-redux'


const getResources = (campaigns:any, mode:any) =>
  campaigns.map(
    (campaign:any) => ({
      ...campaign,
      children: (
        mode !== 'year'
        ? [{
            id: `sub-${campaign.id}`,
            name: 'Steps',
            type: 'steps',
          }]
        : null
      )
    })
  );

const getEvents = (campaigns : any) => campaigns.map(
  ({ id, name: campaignName, from: campaignFrom, to: campaignTo, members, steps } :any) => steps.map(({ id: eventId, name, from, to, phase } : any) => ({
    resourceId: `sub-${id}`,
    start: new Date(from),
    end: new Date(to),
    allDay: true,
    color: "white",
    //color: 'white',
    type: 'step',
    campaignId: id,
    name,
    phase,
    eventId,
  })).concat([{
    resourceId: id,
    start: new Date(campaignFrom),
    end: new Date(campaignTo),
    allDay: true,
    color: '#2C3E50',
    //color: 'white',
    type: 'campaign',
    name: campaignName,
    owner: members[0],
    integrator: members[1],
    campaignId: id,
  }])
).flat();

const StepEvent = ({ name, phase } : any) => {
  return (
    <div title={`${name} (${phase})`}>
      { name }
    </div>
  );
};

const Avatar = ({ image, label} : any) => {

  return (
    <div
      title={label}
      style={{
        backgroundSize: 'cover',
        width: '20px',
        height: '20px',
        backgroundPosition: 'top center',
        borderRadius: '50%',
        marginRight: '5px',
        backgroundImage: `url(${image})`
      }}
    />
  )
};
interface CampaignEventProps {
  name: string,
  owner: any,
  integrator: any,
  children?: React.ReactNode;
};

const CampaignEvent: React.FC<CampaignEventProps> = ( {  name, owner, integrator }: CampaignEventProps ) => {
  return (
    <div style={{
      height: 50,
      padding: 5,
    }}>
      <div style={{ fontWeight: 600 }}>
        { name }
      </div>
      <div style={{
        display: 'flex',
        marginTop: 5,
      }}>
        <Avatar image={owner.picture} label={`${owner.name} (Owner)`} />
        <Avatar image={integrator.picture} label={`${integrator.name} (Integrator)`} />
      </div>
    </div>
  );
};

interface EventProps {
  event: any,
  children?: React.ReactNode;
};
const Event: React.FC<EventProps> = ( {  event }: EventProps ) => {
  const { type, name, phase, owner, integrator } = event.extendedProps;
  const style = (
    type === 'campaign'
    ? {}
    : {
      borderRadius: "32px",
      border: `3px solid gray`,
      width: '100%',
      color: 'white',
      padding: 5,
    }
  );
  return (
    <div className="fc-event-title fc-sticky" style={style}>
      { type === 'campaign' && (
        <CampaignEvent {...{name, owner, integrator}} />
      )}
      { type === 'step' && (
        <StepEvent {...{name, phase}} />
      )}
    </div>
  );
};

const computeDurations = (mode: any) => {
  switch(mode) {
    case 'week':
      return {
        slotDuration: { days: 1 },
        slotLabelFormat: [{ month: 'long' }, { day: '2-digit' }],
        duration: { weeks: 1 },
      } || {};
    case '2weeks':
      return {
        slotDuration: { days: 1 },
        slotLabelFormat: [{ month: 'long' }, { day: '2-digit' }],
        duration: { weeks: 2 },
      } || {};
    case 'month':
      return {
        slotDuration: { days: 1 },
        slotLabelFormat: [{ day: '2-digit' }],
        duration: { months: 1 },
      } || {};
    case 'year':
      return {
        slotDuration: { months: 1 },
        slotLabelFormat: [{ month: 'short' }, { day: '2-digit' }],
        duration: { years: 1 },
      } || {};
    default: return {} || {};
  }
};

const formatEventColor = (punctuality:string) => {
  const colorMapper = {
    "onTime": '#0000FF',
    "tooEarly": '#FF0000',
    "tooLate": '#FF0000',
  };
  return punctuality ? <>colorMapper[punctuality]</> : <>colorMapper[`onTime`]</>;
};

interface CalProps {
  campaigns: [],
  events: [],
  eventClick: any,
  children?: React.ReactNode;
};

interface ResourceProvider {
  id: string,
  name: string,
  type: string,
  children:any[]
};

const handleEventChange = (calendarRef:any, isResize:any) => ({ event, oldEvent, revert } : any) => {
  const { type, campaignId } = event.extendedProps;
  if (isResize && type === 'campaign') return revert();
  if (type === 'campaign') {
    // Campaign has been moved, compute diff and update each steps
    const diff = event.start.getTime() - oldEvent.start.getTime();
    calendarRef.current.getApi()
      .getEvents()
      .filter((currentEvent : any) => {
        const { type: currEventType, campaignId: currEventCampaignId } = currentEvent.extendedProps;
        return currEventType === 'step' && currEventCampaignId === campaignId;
      })
      .forEach((campaignEvent: any) => {
        const start = campaignEvent.start;
        const end = campaignEvent.end;
        campaignEvent.setDates(
          new Date(start.getTime() + diff),
          new Date(end.getTime() + diff),
        );
      });
  } else if (type === 'step') {
    // Step has been resized or move, update the campaign dates
    const campaignEvent = calendarRef.current.getApi().getEvents().find(({ extendedProps: evt }:any) => evt.type === 'campaign' && evt.campaignId === campaignId);
    const { first, last } = calendarRef.current.getApi()
      .getEvents()
      .filter((currentEvent: any) => {
        const { type: currEventType, campaignId: currEventCampaignId } = currentEvent.extendedProps;
        return currEventType === 'step' && currEventCampaignId === campaignId;
      })
      .reduce(
        (acc: any, evt:any) => {
          return {
            first: (acc.first === null || acc.first.start.getTime() > evt.start.getTime() ? evt : acc.first),
            last: (acc.last === null || acc.last.end.getTime() < evt.end.getTime() ? evt : acc.last),
          }
        },
        { first: null, last: null }
      );
    campaignEvent.setDates(first.start, last.end);
  }
};

const eventRender:any = (calendarRef : any, isResize:any) => ({ info }: any) => {
  const tooltip = new Tooltip(info.el, {
    title: info.event.extendedProps.description,
    placement: 'top',
    trigger: 'hover',
    container: 'body'
  });
}

const Calendar: React.FC<any> =  ({ campaigns:campaigns, events:events}: CalProps, props:any) => {
  const [mode, setMode] = useState('day');
  const [resources, setResources] = useState<ResourceProvider[]>([]);
  // const [events, setEvents] = useState([]);
  const calendarRef:any = createRef();

  useEffect(() => {
    //const aRes = getResources(campaigns, mode);
    const aRes = [
      {
        id: "camp-1",
        name: "First campaign",
        type: "Hematology",
        children: [
          {
            id: "sub-camp-1",
            name: "Steps",
            type: "steps",
          },
        ],
      },
      {
        id: "camp-2",
        name: "Second campaign",
        type: "Hematology",
        children: [
          {
            id: "sub-camp-2",
            name: "Steps",
            type: "steps",
          },
        ],
      },
      {
        id: "camp-3",
        name: "Third campaign",
        type: "Hematology",
        children: [
          {
            id: "sub-camp-3",
            name: "Steps",
            type: "steps",
          },
        ],
      },
    ];
    //setResources(getResources(campaigns, mode));
    setResources(aRes);
  }, [campaigns, mode]);

  const formattedEvents = [
    {
      resourceId: `camp-1`,
      start: new Date(),
      end: Date() + 1,
      allDay: false,
      color: '#FF0000',
      type: 'step',
      name: "Event 1",  
      eventId: 0 },    
    {
    resourceId: `sub-camp-1`,
    start: Date(),
    end: Date() + 1,
    allDay: false,
    color: '#2C3E50',
    type: 'step',
    name: "Event 2",  
    eventId: 1 }];

  const { duration, slotDuration, slotLabelFormat }: any  = computeDurations(mode);
    
  return (
    <>
      <div>
      <ModeSelector current={mode} onChange={setMode} />
      <FullCalendar
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        ref={calendarRef}
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        initialView="resourceTimeline"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        contentHeight="100vh"
        stickyHeaderDates={true}
        stickyFooterScrollbar={true}
        resourceAreaHeaderContent="Campaigns"
        resourcesInitiallyExpanded={false}
        resourceOrder="from"
        slotDuration={slotDuration}
        slotLabelFormat={slotLabelFormat}
        duration={duration}
        resources={resources}
        events={formattedEvents}
        resourceLabelContent={CampaignResource}
        eventContent={Event}
        editable={mode !== 'year'}
        eventResourceEditable={false}
        eventClick={handleDateSelect(calendarRef, true, props)}
        eventResize={handleEventChange(calendarRef, true)}
        eventDrop={handleEventChange(calendarRef, false)}
        eventClassNames="my-classname"
      />
      </div>      
    </>
  );
};

const handleDateSelect = (calendarRef : any, isResize:any, props:any) => (addInfo: any) => {
  const cc = props;
  props.createEvent(addInfo.event.toPlainObject())
    .catch(() => {
      //reportNetworkError();
      addInfo.revert();
    })
};

export default Calendar;
