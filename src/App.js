import './App.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import {Button, InputLabel, MenuItem, Select, Typography} from "@mui/material";

import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {MultiInputDateTimeRangeField} from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import {SingleInputDateTimeRangeField} from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';


const locations = [
  {label: 'Minsk', id: 37},
  {label: 'Pinsk', id: 1},
]

function App() {
  const [from, setFrom] = useState(locations[0].id);
  const [to, setTo] = useState(locations[1].id);

  const [fromDate, setFromDate] = useState(moment());
  const [tillDate, setTillDate] = useState(moment().add(1, 'hour'));

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      console.log("Notifications are supported");
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (message) => {
    console.log('notification');
    console.log(Notification.permission)
    new Notification(message);
  }

  const subscription = () => {
    axios.get('https://7588.by/api/client/directions/schedule', {
      params: {
        point_from_id: from,
        point_to_id: to,
        date: fromDate.format('DD.MM.YYYY'),//'27.10.2023',
        direction_id: to
      }
    }).then(res => res.data).then(items => {
      // const count = parseInt(item.count);
      // const date = moment(item.departure_time).format()

      console.log(items);
    })
  }

  const onClickHandler = () => {
    console.log('subscription');
    if (Notification.permission !== 'granted') {
      alert('Please, allow push notifications.');
      return;
    } else {
      showNotification('You are subscribed.');
      subscription();
    }
  }

  return (
    <div className="App">
      <Typography variant='h4'>Direction</Typography>
      <div className='directions'>
        <div className='direction'>
          <InputLabel id="demo-simple-select-label">From</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={from}
            onChange={setFrom}
            fullWidth
          >
            {locations.map(location => <MenuItem value={location.id}>{location.label}</MenuItem>)}
          </Select>
        </div>
        <div className='direction'>
          <InputLabel id="demo-simple-select-label">To</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={to}
            onChange={setTo}
            fullWidth
          >
            {locations.map(location => <MenuItem value={location.id}>{location.label}</MenuItem>)}
          </Select>
        </div>
      </div>

      <Typography variant='h4'>Time range</Typography>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DemoContainer
          components={[
            'MultiInputDateTimeRangeField',
            'SingleInputDateTimeRangeField',
          ]}
        >
          <MultiInputDateTimeRangeField
            slotProps={{
              textField: ({position}) => ({
                label: position === 'start' ? 'From' : 'Till',
              }),
            }}
            format='DD.MM.YYYY h:mm:ss a'
            value={[fromDate, tillDate]}
            onChange={([from, till]) => {
              setFromDate(from);
              setTillDate(till);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>

      <Button className='btn' variant="outlined" fullWidth onClick={onClickHandler}>Subscribe</Button>
    </div>
  );
}

export default App;
