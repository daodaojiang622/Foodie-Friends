// SignUpScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ThemeContext } from '../Components/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      Alert.alert('Error', 'No field should be empty');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User registered:', user);
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.label, { color: theme.textColor }]}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={[styles.label, { color: theme.textColor }]}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={[styles.label, { color: theme.textColor }]}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Register" onPress={handleRegister} color={theme.buttonColor} />
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.loginButton}>
        <Text style={styles.link}>Already Registered? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
  loginButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: 'blue',
    fontSize: 16,
  },
});
