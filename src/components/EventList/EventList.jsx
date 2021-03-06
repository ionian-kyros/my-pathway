import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import EventItem from '../EventItem/EventItem';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'; 
import '../EventList/EventList.css'; 
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


function EventList(props) {
  //This is a page that displays all event as EventItems

  const events = useSelector(store => store.event.all);
  const dispatch = useDispatch();
  let history = useHistory()


  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_EVENTS' }); 
    dispatch({ type: 'UNSET_EVENT_EXAMS_HELP' });
    dispatch({ type: 'UNSET_EVENT_EXAMS' });
  }, []);


  const setSelectedEvent = (event) => {
    dispatch({ type: 'SET_SELECTED_EVENT', payload: event });
    history.push('/event')
  }
  
  const unsetSelectedEvent = () => {
    dispatch({ type: 'UNSET_SELECTED_EVENT' });
  }

  return (
    <div>
      <div > 
        <Link to="/event-new">
          <IconButton className="iconBtn" color="primary" variant="contained" size="medium" onClick={unsetSelectedEvent}>
          <AddCircleOutlineIcon fontSize="small"></AddCircleOutlineIcon>
          &nbsp; ADD A NEW EVENT
          </IconButton>
        </Link>
        </div> 
      <br />
      <br />
      <h2 className="heading">EVENTS</h2>
      
      <Box display="flex"
      justifyContent="center">
      <TableContainer sx={{ minWidth: 500, maxWidth: 1000 }} component={Paper} >
      <Table sx={{ minWidth: 500, maxWidth: 1000 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>EVENT NAME</TableCell>
            <TableCell align="left">STATUS</TableCell>
            <TableCell align="left">DATE</TableCell>
            <TableCell align="left">START TIME</TableCell>
            <TableCell align="center">END TIME</TableCell>
            <TableCell align="center">ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {event.event_name}
              </TableCell>
              <TableCell align="left">{event.status}</TableCell>
              <TableCell align="left">{new Date(event.event_date_start).toLocaleDateString([], {month: 'long', year: 'numeric', day: 'numeric'})}</TableCell>
              <TableCell align="left">{new Date(event.event_date_start).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</TableCell>
              <TableCell align="left">{new Date(event.event_date_end).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</TableCell>
              <TableCell align="center">
                {event.status === 'UPCOMING'?
                <Button style={{backgroundColor: '#1E2A49'}} variant="contained" onClick={() => setSelectedEvent(event)} >View Event</Button>:
                <></>
                }
                {event.status === 'IN PROGRESS'?
                <Button style={{backgroundColor: '#1E2A49'}} variant="contained" onClick={() => setSelectedEvent(event)}>Enter Event</Button>:
                <></>
                }
                {event.status === 'COMPLETE'?
                <Button style={{backgroundColor: '#1E2A49'}} variant="contained" onClick={() => setSelectedEvent(event)}>View Results</Button>:
                <></>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  
</div>
  );
}

export default EventList;
