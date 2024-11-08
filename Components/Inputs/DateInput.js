import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Padding, Font, BorderWidth, BorderRadius, Margin, Width } from '../../Utils/Style';

export default function DateInput({ label, date, setDate, theme }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // const onChangeDate = (event, selectedDate) => {
  //   setDate(selectedDate || date); // Fallback to existing date if none is selected
  // };

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
      <Text style={[styles.label, { color: theme.headerColor }]}>{label} *</Text>
      <TouchableOpacity onPress={toggleDatePicker} activeOpacity={0.8}>
      <TextInput
        style={styles.input}
        value={date ? `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.toLocaleDateString('en-US', { day: '2-digit' })} ${date.getFullYear()}` : ''}
        editable={false}
        placeholder="Select date"
        // onPressIn={toggleDatePicker}
        pointerEvents='none'
      />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display='inline'
          onChange={onChangeDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    label: {
        fontSize: Font.sizeMedium,
        marginBottom: Margin.small,
        color: Colors.primary,
    },
  input: {
        borderWidth: BorderWidth.thin,
        borderColor: Colors.inputBorder,
        padding: Padding.medium,
        borderRadius: BorderRadius.small,
        marginBottom: Margin.large,
        width: Width.large,
    },
});