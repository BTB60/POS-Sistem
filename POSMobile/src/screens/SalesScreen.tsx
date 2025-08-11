import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  Text,
  Chip,
  Divider,
  useTheme,
  FAB,
  Portal,
  Modal,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  barcode?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const SalesScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const theme = useTheme();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    // Simulate products data
    setProducts([
      { id: 1, name: 'Kola', price: 1.50, stock: 50, barcode: '123456789' },
      { id: 2, name: 'Çips', price: 2.00, stock: 30, barcode: '987654321' },
      { id: 3, name: 'Su', price: 0.80, stock: 100, barcode: '456789123' },
      { id: 4, name: 'Çörək', price: 1.20, stock: 25, barcode: '789123456' },
      { id: 5, name: 'Süd', price: 2.50, stock: 40, barcode: '321654987' },
    ]);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    const product = products.find(p => p.barcode === data);
    if (product) {
      addToCart(product);
    } else {
      Alert.alert('Xəta', 'Məhsul tapılmadı');
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Xəta', 'Səbət boşdur');
      return;
    }
    setShowCheckout(true);
  };

  const confirmSale = () => {
    Alert.alert(
      'Uğurlu!',
      `Satış tamamlandı!\nMəbləğ: ${getTotal().toFixed(2)} AZN\nÖdəniş: ${paymentMethod}`,
      [
        {
          text: 'Tamam',
          onPress: () => {
            setCart([]);
            setShowCheckout(false);
            setCustomerName('');
            setPaymentMethod('cash');
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Card style={styles.productCard} onPress={() => addToCart(item)}>
      <Card.Content>
        <View style={styles.productInfo}>
          <View style={styles.productDetails}>
            <Title style={styles.productName}>{item.name}</Title>
            <Text style={styles.productPrice}>{item.price.toFixed(2)} AZN</Text>
            <Text style={styles.productStock}>Stok: {item.stock}</Text>
          </View>
          <Button
            mode="contained"
            onPress={() => addToCart(item)}
            style={styles.addButton}
          >
            +
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Card style={styles.cartItem}>
      <Card.Content>
        <View style={styles.cartItemContent}>
          <View style={styles.cartItemInfo}>
            <Title style={styles.cartItemName}>{item.product.name}</Title>
            <Text style={styles.cartItemPrice}>
              {item.product.price.toFixed(2)} AZN x {item.quantity}
            </Text>
          </View>
          <View style={styles.cartItemActions}>
            <Button
              mode="outlined"
              onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
              style={styles.quantityButton}
            >
              -
            </Button>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Button
              mode="outlined"
              onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              +
            </Button>
            <Button
              mode="text"
              onPress={() => removeFromCart(item.product.id)}
              textColor={theme.colors.error}
            >
              <Ionicons name="trash" size={20} />
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Search and Scanner */}
        <Card style={styles.searchCard}>
          <Card.Content>
            <View style={styles.searchContainer}>
              <TextInput
                label="Məhsul axtar..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                mode="outlined"
                style={styles.searchInput}
                left={<TextInput.Icon icon="magnify" />}
              />
              <Button
                mode="contained"
                onPress={() => setShowScanner(true)}
                style={styles.scannerButton}
                icon="barcode-scan"
              >
                Barkod
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Products List */}
        <Card style={styles.productsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Məhsullar</Title>
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          </Card.Content>
        </Card>

        {/* Cart */}
        <Card style={styles.cartCard}>
          <Card.Content>
            <View style={styles.cartHeader}>
              <Title style={styles.sectionTitle}>Səbət</Title>
              <Text style={styles.cartCount}>({cart.length} məhsul)</Text>
            </View>
            {cart.length === 0 ? (
              <Text style={styles.emptyCart}>Səbət boşdur</Text>
            ) : (
              <>
                <FlatList
                  data={cart}
                  renderItem={renderCartItem}
                  keyExtractor={item => item.product.id.toString()}
                  scrollEnabled={false}
                />
                <Divider style={styles.divider} />
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Ümumi:</Text>
                  <Text style={styles.totalAmount}>{getTotal().toFixed(2)} AZN</Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB for Checkout */}
      {cart.length > 0 && (
        <FAB
          icon="check"
          label="Ödəniş"
          onPress={handleCheckout}
          style={styles.fab}
        />
      )}

      {/* Barcode Scanner Modal */}
      <Portal>
        <Modal
          visible={showScanner}
          onDismiss={() => setShowScanner(false)}
          contentContainerStyle={styles.scannerModal}
        >
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={styles.scanner}
            />
            <Button
              mode="contained"
              onPress={() => setShowScanner(false)}
              style={styles.closeScannerButton}
            >
              Bağla
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Checkout Modal */}
      <Portal>
        <Modal
          visible={showCheckout}
          onDismiss={() => setShowCheckout(false)}
          contentContainerStyle={styles.checkoutModal}
        >
          <Card>
            <Card.Content>
              <Title style={styles.checkoutTitle}>Ödəniş</Title>
              
              <TextInput
                label="Müştəri Adı"
                value={customerName}
                onChangeText={setCustomerName}
                mode="outlined"
                style={styles.checkoutInput}
              />

              <Text style={styles.paymentMethodLabel}>Ödəniş Növü:</Text>
              <View style={styles.paymentMethods}>
                <Chip
                  selected={paymentMethod === 'cash'}
                  onPress={() => setPaymentMethod('cash')}
                  style={styles.paymentChip}
                >
                  Nağd
                </Chip>
                <Chip
                  selected={paymentMethod === 'card'}
                  onPress={() => setPaymentMethod('card')}
                  style={styles.paymentChip}
                >
                  Kart
                </Chip>
                <Chip
                  selected={paymentMethod === 'transfer'}
                  onPress={() => setPaymentMethod('transfer')}
                  style={styles.paymentChip}
                >
                  Köçürmə
                </Chip>
              </View>

              <View style={styles.checkoutTotal}>
                <Text style={styles.checkoutTotalLabel}>Ümumi Məbləğ:</Text>
                <Text style={styles.checkoutTotalAmount}>{getTotal().toFixed(2)} AZN</Text>
              </View>

              <View style={styles.checkoutActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowCheckout(false)}
                  style={styles.checkoutButton}
                >
                  Ləğv Et
                </Button>
                <Button
                  mode="contained"
                  onPress={confirmSale}
                  style={styles.checkoutButton}
                >
                  Təsdiq Et
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
  },
  scannerButton: {
    minWidth: 100,
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
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productStock: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    borderRadius: 20,
  },
  cartCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cartCount: {
    marginLeft: 10,
    color: '#666',
  },
  emptyCart: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  cartItem: {
    marginBottom: 10,
    borderRadius: 10,
  },
  cartItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    minWidth: 40,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 15,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  scannerModal: {
    flex: 1,
    margin: 20,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 15,
    overflow: 'hidden',
  },
  scanner: {
    flex: 1,
  },
  closeScannerButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  checkoutModal: {
    margin: 20,
  },
  checkoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  checkoutInput: {
    marginBottom: 20,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  paymentChip: {
    marginRight: 10,
  },
  checkoutTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  checkoutTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  checkoutActions: {
    flexDirection: 'row',
    gap: 10,
  },
  checkoutButton: {
    flex: 1,
  },
});

export default SalesScreen;
