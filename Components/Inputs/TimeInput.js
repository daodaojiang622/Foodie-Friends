import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Colors, Padding, Font, BorderWidth, BorderRadius, Margin, Width } from '../../Utils/Style';
import { ThemeContext } from '../ThemeContext';

export default function TimeInput({ time, setTime }) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [displayTime, setDisplayTime] = useState('');
  const { theme } = useContext(ThemeContext);

  // Update display time whenever the time prop changes or when component mounts
  useEffect(() => {
    updateDisplayTime();
  }, [time]);

  // Function to update the display time
  const updateDisplayTime = () => {
    if (time) {
      setDisplayTime(time);
    } else {
      // If no time is selected, show current time
      setDisplayTime(moment().format('hh:mm A'));
    }
  };

  const onChangeTime = (event, selectedTime) => {
    const { type } = event;
    if (type === 'set') {
      // 'set' means the user pressed the OK button
      const formattedTime = moment(selectedTime || new Date()).format('hh:mm A');
      setTime(formattedTime);
      setDisplayTime(formattedTime);
    }
    // Close the picker in both 'set' and 'dismissed' cases
    setShowTimePicker(false);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  return (
    <View>
      <Text style={styles.label}>Time*</Text>
      <TouchableOpacity onPress={toggleTimePicker} activeOpacity={0.8}>
        <TextInput
          style={styles.input}
          value={displayTime}
          editable={false}
          placeholder="Select time"
          pointerEvents="none"
        />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time ? moment(time, 'hh:mm A').toDate() : new Date()}
          mode="time"
          display='spinner'
          onChange={onChangeTime}
          textColor={theme.textColor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: Margin.small,
    color: "black",
  },
  input: {
    borderWidth: 2,
    borderColor: 'lightgray',
    padding: Padding.medium,
    borderRadius: BorderRadius.small,
    marginBottom: Margin.large,
    width: 350,
  },
});