import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ThemeContext } from '../Components/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);
      Alert.alert('Success', 'User logged in successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login Error', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email to reset your password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Password Reset Error', error.message);
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
      <Button title="Login" onPress={handleLogin} color={theme.buttonColor} />

      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
        <Text style={styles.link}>Forgot Password?</Text>
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
  forgotPasswordButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: 'blue',
    fontSize: 16,
  },
});
