import React from 'react';
import { View, StyleSheet } from 'react-native';
import WheelPicker from './WheelPicker';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  wheelPicker: {
    height: 150,
    width: null,
    flex: 1,
  },
});

class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.selectedDate = this.props.initDate ? new Date(this.props.initDate) : new Date();
    const time12format = hourTo12Format(this.selectedDate.getHours());
    this.hours = this.props.hours ? this.props.hours : getHoursArray();
    this.minutes = this.props.minutes ? this.props.minutes : getFiveMinutesArray();
    this.initHourInex = time12format[0] - 1;
    this.initMinuteInex = Math.round(this.selectedDate.getMinutes() / 5);
    this.initAmInex = time12format[1] === 'AM' ? 0 : 1;
    this.wheelPickerStyle =
      this.props.style && this.props.style.height
        ? [styles.wheelPicker, { height: this.props.style.height }]
        : styles.wheelPicker;
    this.visibleItemCount = this.props.visibleItemCount ? this.props.visibleItemCount : 6;
    console.log(
      'Height:',
      this.wheelPickerStyle,
      'items:',
      this.visibleItemCount,
      'styles:',
      styles,
    );
  }

  onHourSelected = event => {
    const time12format = hourTo12Format(this.selectedDate.getHours());
    const newTime12Format = `${event.data} ${time12format[1]}`;
    const selectedHour24format = hourTo24Format(newTime12Format);
    this.selectedDate.setHours(selectedHour24format);
    this.onTimeSelected();
  };

  onMinuteSelected = event => {
    this.selectedDate.setMinutes(event.data);
    this.onTimeSelected();
  };

  onAmSelected = event => {
    const time12format = hourTo12Format(this.selectedDate.getHours());
    const newTime12Format = `${time12format[0]} ${event.data}`;
    const selectedHour24format = hourTo24Format(newTime12Format);
    this.selectedDate.setHours(selectedHour24format);
    this.onTimeSelected();
  };

  onTimeSelected = () => {
    if (this.props.onTimeSelected) {
      this.props.onTimeSelected(this.selectedDate);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <WheelPicker
          style={this.wheelPickerStyle}
          isAtmospheric
          isCyclic
          isCurved
          visibleItemCount={this.visibleItemCount}
          data={this.hours}
          selectedItemTextColor={'black'}
          onItemSelected={this.onHourSelected}
          selectedItemPosition={this.initHourInex}
        />
        <WheelPicker
          style={this.wheelPickerStyle}
          isAtmospheric
          isCyclic
          isCurved
          visibleItemCount={this.visibleItemCount}
          data={this.minutes}
          selectedItemTextColor={'black'}
          onItemSelected={this.onMinuteSelected}
          selectedItemPosition={this.initMinuteInex}
        />
        <WheelPicker
          style={this.wheelPickerStyle}
          isAtmospheric
          isCurved
          visibleItemCount={this.visibleItemCount}
          data={getAmArray()}
          selectedItemTextColor={'black'}
          onItemSelected={this.onAmSelected}
          selectedItemPosition={this.initAmInex}
        />
      </View>
    );
  }
}

TimePicker.propTypes = {
  initDate: React.PropTypes.string,
  onTimeSelected: React.PropTypes.func,
  hours: React.PropTypes.array,
  minutes: React.PropTypes.array,
  visibleItemCount: React.PropTypes.number,
};

// it takes in format '12 AM' and return 24 format
function hourTo24Format(hour) {
  return parseInt(moment(hour, ['h A']).format('H'), 10);
}

// it takes in format 23 and return [11,'PM'] format
function hourTo12Format(hour) {
  const currDate = new Date();
  currDate.setHours(hour);
  return dateTo12Hour(currDate.toISOString());
}

const dateTo12Hour = dateString => {
  const localDate = new Date(dateString);
  let hour = localDate.getHours();
  if (hour === 12) {
    return ['12', 'PM'];
  }
  if (hour === 0) {
    return ['12', 'AM'];
  }
  const afterMidday = hour % 12 === hour;
  hour = afterMidday ? hour : hour % 12;
  const amPm = afterMidday ? 'AM' : 'PM';
  return [hour.toString(), amPm];
};

function getHoursArray() {
  const arr = [];
  for (let i = 1; i < 13; i++) {
    arr.push(i);
  }
  return arr;
}

function getFiveMinutesArray() {
  const arr = [];
  arr.push('00');
  arr.push('05');
  for (let i = 10; i < 60; i += 5) {
    arr.push(`${i}`);
  }
  return arr;
}

function getAmArray() {
  const arr = [];
  arr.push('AM');
  arr.push('PM');
  return arr;
}
module.exports = TimePicker;
