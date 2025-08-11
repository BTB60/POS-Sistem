import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  Text,
  FAB,
  Portal,
  Modal,
  Chip,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalSpent: number;
  totalPurchases: number;
  status: 'active' | 'inactive';
}

const CustomersScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    setCustomers([
      { id: 1, name: 'Əli Məmmədov', phone: '+994501234567', email: 'ali@email.com', totalSpent: 1250.50, totalPurchases: 15, status: 'active' },
      { id: 2, name: 'Aysu Hüseynova', phone: '+994507654321', email: 'aysu@email.com', totalSpent: 890.25, totalPurchases: 8, status: 'active' },
      { id: 3, name: 'Vüsal Əliyev', phone: '+994509876543', email: 'vusal@email.com', totalSpent: 2100.75, totalPurchases: 22, status: 'active' },
    ]);
  };

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      Alert.alert('Xəta', 'Ad və telefon daxil edin');
      return;
    }

    const customer: Customer = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      totalSpent: 0,
      totalPurchases: 0,
      status: 'active',
    };

    setCustomers([...customers, customer]);
    setShowAddModal(false);
    setNewCustomer({ name: '', phone: '', email: '' });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const renderCustomer = ({ item }: { item: Customer }) => (
    <Card style={styles.customerCard}>
      <Card.Content>
        <View style={styles.customerHeader}>
          <View style={styles.customerInfo}>
            <Title style={styles.customerName}>{item.name}</Title>
            <Text style={styles.customerPhone}>{item.phone}</Text>
            {item.email && <Text style={styles.customerEmail}>{item.email}</Text>}
          </View>
          <Chip
            mode="outlined"
            style={[
              styles.statusChip,
              { backgroundColor: item.status === 'active' ? '#e8f5e8' : '#ffe8e8' }
            ]}
          >
            {item.status === 'active' ? 'Aktiv' : 'Qeyri-aktiv'}
          </Chip>
        </View>
        <View style={styles.customerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ümumi Xərclər</Text>
            <Text style={styles.statValue}>{item.totalSpent.toFixed(2)} AZN</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Alış Sayı</Text>
            <Text style={styles.statValue}>{item.totalPurchases}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Search */}
        <Card style={styles.searchCard}>
          <Card.Content>
            <TextInput
              label="Müştəri axtar..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              mode="outlined"
              left={<TextInput.Icon icon="magnify" />}
            />
          </Card.Content>
        </Card>

        {/* Customers List */}
        <Card style={styles.customersCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Müştərilər ({filteredCustomers.length})</Title>
            <FlatList
              data={filteredCustomers}
              renderItem={renderCustomer}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        onPress={() => setShowAddModal(true)}
        style={styles.fab}
      />

      {/* Add Customer Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Yeni Müştəri</Title>
              
              <TextInput
                label="Ad Soyad"
                value={newCustomer.name}
                onChangeText={(text) => setNewCustomer({...newCustomer, name: text})}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Telefon"
                value={newCustomer.phone}
                onChangeText={(text) => setNewCustomer({...newCustomer, phone: text})}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
              />

              <TextInput
                label="Email (İstəyə görə)"
                value={newCustomer.email}
                onChangeText={(text) => setNewCustomer({...newCustomer, email: text})}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
              />

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowAddModal(false)}
                  style={styles.modalButton}
                >
                  Ləğv Et
                </Button>
                <Button
                  mode="contained"
                  onPress={addCustomer}
                  style={styles.modalButton}
                >
                  Əlavə Et
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </View>
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
  searchCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  customersCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  customerCard: {
    marginBottom: 10,
    borderRadius: 10,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  customerEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusChip: {
    marginLeft: 10,
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
  },
});

export default CustomersScreen;
