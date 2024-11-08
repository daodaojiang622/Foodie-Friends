import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Padding, Font, BorderWidth, BorderRadius, Margin, Width } from '../../Utils/Style';
import moment from 'moment';

export default function TimeInput({ time, setTime }) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeTime = (event, selectedTime) => {
    const { type } = event;
    if (type === 'set' && selectedTime) {
      // 'set' means the user pressed the OK button
      const formattedTime = moment(selectedTime).format('hh:mm A');
      setTime(formattedTime);
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
          value={time}
          editable={false}
          placeholder="Select time"
          pointerEvents='none'
        />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time ? moment(time, 'hh:mm A').toDate() : new Date()}
          mode="time"
          display='compact'
          onChange={onChangeTime}
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
    width: 260,
  },
});