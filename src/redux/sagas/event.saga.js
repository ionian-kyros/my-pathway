import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

/*
  This picks up component dispatches for events. 
  
      Reminder - Definitions:
      A Test is a collection of questions
      An Event is a day/time where a specific test can be taken
      An Exam is an instance of one student assigned to that event; taking that test
  
  Since events/exams are tightly linked, 
  it may make more sense to some to store some of these in the exam saga instead
*/

function* eventSaga() {
  yield takeLatest('FETCH_EVENT', fetchEvent);//fetches all the info for a single Event. 
  yield takeLatest('FETCH_ALL_EVENTS', fetchAllEvents);//fetches ALL Events in DB. 
  yield takeLatest('ADD_EVENT', addEvent);//posts a new event to the db.
  yield takeLatest('DELETE_EVENT', deleteEvent);//deletes a event from the db.
  yield takeLatest('UPDATE_EVENT_SETTINGS', updateEventSettings);//updates any/all of the columns in the event table in the db.
  yield takeLatest('SEARCH_FOR_STUDENTS', searchForStudents)
  yield takeLatest('REGISTER_STUDENT_TO_EVENT', registerStudentToEvent)  
  yield takeLatest('UNREGISTER_STUDENT_TO_EVENT', unregisterStudentToEvent)    
  yield takeLatest('FETCH_EVENT_EXAMS', getEventExams);//return all exams associated with the event.
  yield takeLatest('FETCH_EVENT_EXAMS_HELP', getEventExamsHelp);//return only help and id for all exams associated with the event.
 }

 // worker Saga: will be fired on "UNREGISTER_STUDENT_TO_EVENT" actions
function* unregisterStudentToEvent(action){
  const ap = action.payload;
  //ap.exam_id, ap.event_id
  try {
    yield axios.delete(`/api/exam/${ap.exam_id}`);  
    yield put({ type:'FETCH_EVENT_EXAMS', payload: {event_id: ap.event_id} });

  } catch (error) {
    console.log('POST student registration to exam failed', error);
  }
}

// worker Saga: will be fired on "REGISTER_STUDENT_TO_EVENT" actions
function* registerStudentToEvent(action){
  const ap = action.payload;
  //ap.student_id, ap.proctor_id, ap.event_id, ap.search_text
  try {
    yield axios.post('/api/exam', {student_id: ap.student_id, proctor_id: ap.proctor_id, event_id: ap.event_id} );  
    yield put({ type:'SEARCH_FOR_STUDENTS', payload: {search_text: ap.search_text, event_id: ap.event_id} });
    yield put({ type:'FETCH_EVENT_EXAMS', payload: {event_id: ap.event_id} });
  } catch (error) {
    console.log('POST student registration to exam failed', error);
  }
}

 // worker Saga: will be fired on "SEARCH_FOR_STUDENTS" actions
 function* searchForStudents(action) {
  //runs as part of registering students to an event - when they are searched for
  const ap = action.payload;
  //ap.search_text 
  //ap.event_id
  try {  
    const search = yield axios.get('/api/exam/search',
        {params: {search_text: ap.search_text, event_id: ap.event_id} });
    yield put({ type: 'SET_SEARCHED_STUDENTS', payload: search.data });
    } 
    catch (error) {
      console.log('student search request failed', error);
    }     
  };

// worker Saga: will be fired on "UPDATE_EVENT_SETTINGS" actions
function* updateEventSettings(action){
  const ap = action.payload;
  //ap.event is the event object to update, 
  //including event_name, test_id, proctor_id, event_date, event_time
  //event_end_time, url, last_modified_by, and id
  try {
    yield axios.put(`/api/event/${ap.event.id}`, ap.event);
    yield put({ type: 'SET-UPDATE_SELECTED_EVENT', payload: ap.event });
  } catch (error) {
    console.log('update event failed', error);
  }
}

// worker Saga: will be fired on "DELETE_EVENT" actions
function* deleteEvent(action){
  const ap = action.payload;
  //ap.event_id 
  try {
    yield axios.delete(`/api/event/${ap.event_id}`);
    yield put({ type: 'UNSET_SELECTED_EVENT' });
    yield put({ type: 'FETCH_ALL_EVENTS' }); 
  } catch (error) {
    console.log('DELETE event failed', error);
  }
}

// worker Saga: will be fired on "ADD_EVENT" actions
function* addEvent(action){
  const ap = action.payload;
  //ap.event is the event object to update, 
  //including event_name, test_id, proctor_id, event_date, event_time
  //event_end_time, url, last_modified_by
  let event = ap.event;  //first declare event obj with all the event data from ap. 
  try {
    const postedEvent = yield axios.post('/api/event', ap.event );  //now add to that event object the id & dates that were created when it was posted to DB
    event = {...event, id: postedEvent.data.id, create_date: postedEvent.data.create_date, last_modified_date: postedEvent.data.last_modified_date }
    console.log('event in add event after post:', event);
    yield put({ type: 'FETCH_EVENT', payload: {event_id: event.id} }); 

  } catch (error) {
    console.log('POST event failed', error);
  }
}

// worker Saga: will be fired on "FETCH_EVENT" actions
function* fetchEvent(action) {
  const ap = action.payload;
  //ap.event_id is the event id to fetch
  console.log('fetch event ap.event_id:', ap.event_id);
  try {
    const response = yield axios.get('/api/event/selected', { params: {event_id: ap.event_id} });
    yield put({ type: 'SET_SELECTED_EVENT', payload: response.data });
  } catch (error) {
    console.log('get event request failed', error);
  }
}

// worker Saga: will be fired on "FETCH_EVENT_EXAMS_HELP" actions
function* getEventExamsHelp(action) {
  //see ExamTable for more info about examsHelp/examHelp
  const ap = action.payload;
  //ap.event_id is the event id to fetch
  try {
    const response = yield axios.get('/api/event/examsHelp', { params: {event_id: ap.event_id} });
    yield put({ type: 'SET_EVENT_EXAMS_HELP', payload: response.data });
  } catch (error) {
    console.log('getEventExamsHelp request failed', error);
  }
}

// worker Saga: will be fired on "FETCH_EVENT_EXAMS" actions
function* getEventExams(action) {
  //for getting all the exams attached to an event
  const ap = action.payload;
  //ap.event_id is the event id to fetch
  try {
    const response = yield axios.get('/api/event/exams', { params: {event_id: ap.event_id} });
    yield put({ type: 'SET_EVENT_EXAMS', payload: response.data });
  } catch (error) {
    console.log('getEventExams request failed', error);
  }
}

// worker Saga: will be fired on "FETCH_ALL_EVENTS" actions
function* fetchAllEvents() {
  try {
    const response = yield axios.get('/api/event/all');
    const events = response.data;   
    yield put({ type: 'SET_ALL_EVENTS', payload: events });
  } catch (error) {
    console.log('get all events request failed', error);
  }
}

export default eventSaga;
