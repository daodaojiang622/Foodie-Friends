import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function ScreenHeader({ title }) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title });
  }, [title, navigation]);

  return null;
}
