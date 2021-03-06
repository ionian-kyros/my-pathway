import { combineReducers } from 'redux';

//for aws s3 image stuff

const data = (state = '/images/profile_default.png', action) => {
  switch (action.type) {
    case 'SET_IMAGE_DATA':
      return action.payload.data;
    case 'UNSET_IMAGE_DATA':
      return '/images/profile_default.png'
    default:
      return state;
  }
};

const url = (state = '/images/profile_default.png', action) => {
  switch (action.type) {
    case 'SET_IMAGE_URL':
      return action.payload.url;
    case 'UNSET_IMAGE_URL':
      return '/images/profile_default.png'
    default:
      return state;
  }
};

const profilePicture = (state = '/images/profile_default.png', action) => {
  switch (action.type) {
    case 'SET_PROFILE_PICTURE':
      return action.payload;
    case 'UNSET_PROFILE_PICTURE':
      return '/images/profile_default.png'
    default:
      return state;
  }
};



export default combineReducers({
  data,
  url,
  profilePicture,
});
