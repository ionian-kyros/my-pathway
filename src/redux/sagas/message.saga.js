import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* messageSaga() {
  yield takeLatest('CREATE_MESSAGE_SESSION', createMessage);
}

// worker Saga: will be fired on "FETCH_QUIZ" actions
function* createMessage(info) {
 
  try {
    // console.log("createMessage Saga");
    const response = yield axios({
      method: 'POST',
      url: '/api/message',
      data: info.payload
    });
    
    yield put({ type: 'SET_ACTIVE_MESSAGE_SESSION', payload: response.data });

  } catch (error) {
    console.log('message get request failed', error);
  }
}

export default messageSaga;