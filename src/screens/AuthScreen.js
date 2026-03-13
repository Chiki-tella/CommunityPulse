import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, DISTRICTS } from '../constants/theme';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [district, setDistrict] = useState('Gasabo');
  const [department, setDepartment] = useState('Infrastructure');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name, role, district, role === 'official' ? department : '');
        Alert.alert('Success', 'Account created! Please verify your email before logging in.');
        setIsLogin(true); // switch to login after sign up
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🏘️</Text>
          <Text style={styles.title}>CommunityPulse</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back!' : 'Join your community'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Account Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Citizen" value="citizen" />
                    <Picker.Item label="Official" value="official" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Your District</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={district}
                    onValueChange={(itemValue) => setDistrict(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Gasabo" value="Gasabo" />
                    <Picker.Item label="Kicukiro" value="Kicukiro" />
                    <Picker.Item label="Nyarugenge" value="Nyarugenge" />
                  </Picker>
                </View>
              </View>

              {role === 'official' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Department</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={department}
                      onValueChange={(itemValue) => setDepartment(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Infrastructure" value="Infrastructure" />
                      <Picker.Item label="Water & Sanitation" value="Water" />
                      <Picker.Item label="Electricity" value="Electricity" />
                      <Picker.Item label="Public Health" value="Health" />
                      <Picker.Item label="Security" value="Security" />
                    </Picker>
                  </View>
                </View>
              )}
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.switchTextBold}>
                {isLogin ? 'Sign Up' : 'Login'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    fontSize: 60,
    marginBottom: 16
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textLight
  },
  form: {
    width: '100%'
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '500'
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: SIZES.md,
    color: COLORS.text
  },
  pickerContainer: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%'
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: 'bold'
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  switchText: {
    fontSize: SIZES.md,
    color: COLORS.textLight
  },
  switchTextBold: {
    color: COLORS.primary,
    fontWeight: 'bold'
  }
});
