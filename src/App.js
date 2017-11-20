import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase'
import { Form, Button, FormControl, FormGroup, Col, ControlLabel, Modal } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Make sure to import the default stylesheet
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { calendarevents:[], messages: [], show: false, eventtitle: 'event_date', eventstart: 'start', eventend: 'end', testDate: 'test' }; // <- set up react state
  }

  componentWillMount(){
    /* Create reference to events in Firebase Database */

    let eventsRef = firebase.database().ref('events').orderByKey().limitToLast(100);
    eventsRef.on('child_added', snapshot => {
      /* Update React state when event is added at Firebase Database */
      var startdateParts = snapshot.val().start.split(", ");
      var startdatePart = startdateParts[0].split("/")
      var starttimePart = startdateParts[1].split(":")

      var enddateParts = snapshot.val().end.split(", ");
      var enddatePart = enddateParts[0].split("/")
      var endtimePart = enddateParts[1].split(":")

      let calendarevent = { 
        title: snapshot.val().title,
        start: new Date(
          parseInt(startdatePart[2],10),
          parseInt(startdatePart[1],10)-1,
          parseInt(startdatePart[0],10),
          parseInt(starttimePart[0],10),
          parseInt(starttimePart[1],10),
          parseInt(starttimePart[2],10)
        ),
        end: new Date(
          parseInt(enddatePart[2],10),
          parseInt(enddatePart[1],10)-1,
          parseInt(enddatePart[0],10),
          parseInt(endtimePart[0],10),
          parseInt(endtimePart[1],10),
          parseInt(endtimePart[2],10)
          ),
      };

      this.setState({ 
        calendarevents: [calendarevent].concat(this.state.calendarevents)
      });
      console.log(this.state.calendarevents);
    })
  }

  addEvent(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */

    var textTitle = document.getElementById('title');
    var textDescription = document.getElementById('description');
    var startTime = this.state.eventstart
    var endTime = this.state.eventend

    var data = {
      title : textTitle.value,
      description : textDescription.value,
      start : this.state.eventstart,
      end : this.state.eventend
    }
    firebase.database().ref('events').push( data );
    this.setState({ show: false });
  }
  render() {
    let close = () => this.setState({ show: false });
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Calendar App</h1>
        </header>
        <p></p>
        <Col sm={12}>
        <BigCalendar
          selectable
          events={this.state.calendarevents}
          defaultView='week'
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={(slotInfo) => this.setState({ show: true, eventstart: slotInfo.start.toLocaleString(), eventend: slotInfo.end.toLocaleString()})}
        />
        <Col sm={12}>

        </Col>
        </Col>

        <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Add Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Test Dte: {this.state.testdate}</p>
            <p> Start Time: {this.state.eventstart}</p>
            <p>End Time: {this.state.eventend}</p>
            <Form horizontal onSubmit={this.addEvent.bind(this)}>
              <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  Name:
                </Col>
                <Col sm={8}>
                  <FormControl 
                    type="text"
                    value={this.state.value}
                    placeholder="Event Title"
                    id="title"
                    onChange={this.handleChange}
                    ref={ el => this.inputEl = el } 
                  />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={2}>
                  UID:
                </Col>
                <Col sm={8}>
                  <FormControl 
                    type="text"
                    value={this.state.value}
                    placeholder="Enter Description"
                    id="description"
                    onChange={this.handleChange}
                    ref={ el => this.inputEl2 = el } 
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={2} sm={8}>
                          <Button type="submit">
                    Save
                  </Button>
                </Col>
              </FormGroup>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;
