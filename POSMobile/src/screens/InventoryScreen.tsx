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
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
}

const InventoryScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    barcode: '',
  });
  const theme = useTheme();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts([
      { id: 1, name: 'Kola', price: 1.50, stock: 50, category: 'İçki', barcode: '123456789' },
      { id: 2, name: 'Çips', price: 2.00, stock: 30, category: 'Qida', barcode: '987654321' },
      { id: 3, name: 'Su', price: 0.80, stock: 100, category: 'İçki', barcode: '456789123' },
      { id: 4, name: 'Çörək', price: 1.20, stock: 25, category: 'Qida', barcode: '789123456' },
      { id: 5, name: 'Süd', price: 2.50, stock: 40, category: 'Süd məhsulları', barcode: '321654987' },
    ]);
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      Alert.alert('Xəta', 'Bütün sahələri doldurun');
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      barcode: newProduct.barcode,
    };

    setProducts([...products, product]);
    setShowAddModal(false);
    setNewProduct({ name: '', price: '', stock: '', category: '', barcode: '' });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.productCard}>
      <Card.Content>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Title style={styles.productName}>{item.name}</Title>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productPrice}>{item.price.toFixed(2)} AZN</Text>
          </View>
          <View style={styles.productStock}>
            <Text style={[
              styles.stockText,
              { color: item.stock < 10 ? theme.colors.error : theme.colors.success }
            ]}>
              Stok: {item.stock}
            </Text>
            {item.barcode && (
              <Text style={styles.barcodeText}>Barkod: {item.barcode}</Text>
            )}
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
              label="Məhsul axtar..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              mode="outlined"
              left={<TextInput.Icon icon="magnify" />}
            />
          </Card.Content>
        </Card>

        {/* Products List */}
        <Card style={styles.productsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Məhsullar ({filteredProducts.length})</Title>
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
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

      {/* Add Product Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Yeni Məhsul</Title>
              
              <TextInput
                label="Məhsul Adı"
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Qiymət (AZN)"
                value={newProduct.price}
                onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="Stok"
                value={newProduct.stock}
                onChangeText={(text) => setNewProduct({...newProduct, stock: text})}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <TextInput
                label="Kateqoriya"
                value={newProduct.category}
                onChangeText={(text) => setNewProduct({...newProduct, category: text})}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Barkod (İstəyə görə)"
                value={newProduct.barcode}
                onChangeText={(text) => setNewProduct({...newProduct, barcode: text})}
                mode="outlined"
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
                  onPress={addProduct}
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
  productsCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productCard: {
    marginBottom: 10,
    borderRadius: 10,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 5,
  },
  productStock: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  barcodeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
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

export default InventoryScreen;
