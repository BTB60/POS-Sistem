import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  List,
  Switch,
  Button,
  Divider,
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const theme = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Çıxış',
      'Hesabdan çıxmaq istədiyinizə əminsiniz?',
      [
        {
          text: 'Ləğv Et',
          style: 'cancel',
        },
        {
          text: 'Çıxış',
          style: 'destructive',
          onPress: () => {
            // Handle logout
            Alert.alert('Uğurlu', 'Hesabdan çıxdınız');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Məlumatları Təmizlə',
      'Bütün məlumatlar silinəcək. Bu əməliyyat geri alına bilməz!',
      [
        {
          text: 'Ləğv Et',
          style: 'cancel',
        },
        {
          text: 'Təmizlə',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Uğurlu', 'Məlumatlar təmizləndi');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Tətbiq Tənzimləmələri</Title>
            
            <List.Item
              title="Qaranlıq Tema"
              description="Qaranlıq tema rejimini aktivləşdir"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Bildirişlər"
              description="Push bildirişləri al"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Avtomatik Backup"
              description="Məlumatları avtomatik yedəklə"
              left={(props) => <List.Icon {...props} icon="cloud-upload" />}
              right={() => (
                <Switch
                  value={autoBackup}
                  onValueChange={setAutoBackup}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Data Management */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Məlumat İdarəetməsi</Title>
            
            <List.Item
              title="Məlumatları İxrac Et"
              description="Bütün məlumatları fayl kimi yüklə"
              left={(props) => <List.Icon {...props} icon="download" />}
              onPress={() => Alert.alert('İxrac', 'Məlumatlar ixrac edildi')}
            />
            
            <Divider />
            
            <List.Item
              title="Məlumatları İdxal Et"
              description="Fayldan məlumatları yüklə"
              left={(props) => <List.Icon {...props} icon="upload" />}
              onPress={() => Alert.alert('İdxal', 'Məlumatlar idxal edildi')}
            />
            
            <Divider />
            
            <List.Item
              title="Məlumatları Təmizlə"
              description="Bütün məlumatları sil"
              left={(props) => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
              onPress={handleClearData}
            />
          </Card.Content>
        </Card>

        {/* About */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Haqqında</Title>
            
            <List.Item
              title="Versiya"
              description="v1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            
            <Divider />
            
            <List.Item
              title="Dəstək"
              description="Texniki dəstək üçün əlaqə"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={() => Alert.alert('Dəstək', 'support@possystem.az')}
            />
            
            <Divider />
            
            <List.Item
              title="Lisenziya"
              description="MIT Lisenziyası"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => Alert.alert('Lisenziya', 'MIT Lisenziyası')}
            />
          </Card.Content>
        </Card>

        {/* Logout */}
        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
              textColor="white"
              buttonColor={theme.colors.error}
            >
              Hesabdan Çıx
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 10,
  },
});

export default SettingsScreen;
