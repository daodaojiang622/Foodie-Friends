import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ThemeContext } from '../Components/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱格式正则表达式
  
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match. Please try again.');
      return;
    }
  
    if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      Alert.alert('Empty Fields', 'All fields are required. Please complete the form.');
      return;
    }
  
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Your password should be at least 8 characters long.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User registered:', user);
      Alert.alert('Registration Successful', 'Your account has been created successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Registration Error', error.message);
    }
  };
  

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value.length < 8) {
      setPasswordStrength('Weak');
    } else if (value.length >= 8 && value.length < 12) {
      setPasswordStrength('Moderate');
    } else {
      setPasswordStrength('Strong');
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
        onChangeText={handlePasswordChange}
      />
      <Text style={[styles.passwordStrength, { color: theme.textColor }]}>
        Password Strength: {passwordStrength}
      </Text>

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
  passwordStrength: {
    marginBottom: 16,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 16,
    alignItems: 'center',
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
