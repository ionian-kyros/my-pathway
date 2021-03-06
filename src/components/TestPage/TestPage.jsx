import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import TestCard from '../TestCard/TestCard';
import TestSettings from '../TestSettings/TestSettings';
import QuestionList from '../QuestionList/QuestionList';

//MUI Imports: 
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function TestPage(props) {
  //This is the page a proctor is brought to upon clicking "add test" or "edit test";
  //if we arrive here by clicking "add" a new test, props.new will be true (see app.jsx, routes).
  //if we arrive by clicking "edit" an existing test, props.new will be false.
  //isNew conditionally renders things
  const [isNew, setIsNew] = useState(props.new); 
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{width: '100%', typography: 'body1'}}> 
      <TabContext value={value} centered textColor="secondary" indicatorColor="secondary">
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} centered>
            <Tab label="Test Settings" value="1" /> 
            <Tab label="Test Questions" value="2" disabled={isNew} />  
            {/* if isNew = true, we haven't created the test yet, so disable the ability to add questions to it. */}
          </TabList>
        </Box>

        <TabPanel value="1">
          <TestSettings 
            isNew={isNew} 
            onClickCreate={ ()=>setIsNew(false) } 
          /> 
        </TabPanel>

        <TabPanel value="2">
          <QuestionList/> 
        </TabPanel>
        
      </TabContext>
    </Box>
  );
}

export default TestPage;
