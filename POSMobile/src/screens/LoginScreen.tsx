import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Xəta', 'İstifadəçi adı və şifrə daxil edin');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Demo credentials
      if (username === 'admin' && password === 'admin') {
        navigation.replace('Main');
      } else if (username === 'demo' && password === 'demo') {
        navigation.replace('Main');
      } else {
        Alert.alert('Xəta', 'Yanlış istifadəçi adı və ya şifrə');
      }
    }, 1000);
  };

  const handleQuickLogin = (type: 'admin' | 'demo') => {
    setUsername(type);
    setPassword(type);
    handleLogin();
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            {/* Logo and Title */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="business" size={60} color="white" />
              </View>
              <Title style={styles.title}>POS Sistem</Title>
              <Paragraph style={styles.subtitle}>
                Kassa və Satış İdarəetməsi
              </Paragraph>
            </View>

            {/* Login Form */}
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Giriş</Title>
                
                <TextInput
                  label="İstifadəçi Adı"
                  value={username}
                  onChangeText={setUsername}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="account" />}
                  autoCapitalize="none"
                />

                <TextInput
                  label="Şifrə"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  style={styles.loginButton}
                  contentStyle={styles.loginButtonContent}
                >
                  Giriş Et
                </Button>

                {/* Quick Login Buttons */}
                <View style={styles.quickLoginContainer}>
                  <Text style={styles.quickLoginText}>Sürətli Giriş:</Text>
                  <View style={styles.quickLoginButtons}>
                    <Button
                      mode="outlined"
                      onPress={() => handleQuickLogin('admin')}
                      style={styles.quickButton}
                      compact
                    >
                      Admin
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleQuickLogin('demo')}
                      style={styles.quickButton}
                      compact
                    >
                      Demo
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Əsas Funksiyalar:</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="cart" size={20} color={theme.colors.primary} />
                  <Text style={styles.featureText}>Satış İdarəetməsi</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="cube" size={20} color={theme.colors.primary} />
                  <Text style={styles.featureText}>Anbar İdarəetməsi</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="people" size={20} color={theme.colors.primary} />
                  <Text style={styles.featureText}>Müştəri İdarəetməsi</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="bar-chart" size={20} color={theme.colors.primary} />
                  <Text style={styles.featureText}>Hesabatlar</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
    elevation: 8,
    borderRadius: 15,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 10,
    elevation: 4,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  quickLoginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  quickLoginText: {
    marginBottom: 10,
    fontSize: 14,
    color: '#666',
  },
  quickLoginButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickButton: {
    minWidth: 80,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  featuresList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  featureText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default LoginScreen;
