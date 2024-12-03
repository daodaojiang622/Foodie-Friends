import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Font, Margin, Colors, Stylings} from '../../Utils/Style';
import { ThemeContext } from '../ThemeContext';

export default function DateInput({ date, setDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { theme } = useContext(ThemeContext);

  const onChangeDate = (event, selectedDate) => {
    const { type } = event;
    if (type === 'set' && selectedDate) {
      // 'set' means the user pressed the OK button
      setDate(selectedDate);
    }
    // Close the picker in both 'set' and 'dismissed' cases
    setShowDatePicker(false);
  };

  const toggleDatePicker = () => {
    if (!showDatePicker && !date) {
      setDate(new Date()); // Set to current date if no date is selected
    }
    setShowDatePicker(!showDatePicker);
  };

  return (
    <View>
      <Text style={[Stylings.label, { fontWeight: "normal" }]}>Date*</Text>
      <TouchableOpacity onPress={toggleDatePicker} activeOpacity={0.8}>
      <TextInput
        style={Stylings.input}
        value={date ? `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.toLocaleDateString('en-US', { day: '2-digit' })} ${date.getFullYear()}` : ''}
        editable={false}
        placeholder="Select date"
        pointerEvents='none'
      />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          style={{backgroundColor: theme.backgroundColor}}
          value={date || new Date()}
          mode="date"
          display='inline'
          onChange={onChangeDate}
        />
      )}
    </View>
  );
}