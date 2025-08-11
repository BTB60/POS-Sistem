import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  useTheme,
  Text,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStock: 0,
  });
  const theme = useTheme();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Simulate loading stats
    setStats({
      totalSales: 15420.50,
      todaySales: 1250.75,
      totalProducts: 156,
      totalCustomers: 89,
      lowStock: 12,
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'sales':
        navigation.navigate('Sales');
        break;
      case 'inventory':
        navigation.navigate('Inventory');
        break;
      case 'customers':
        navigation.navigate('Customers');
        break;
      case 'reports':
        navigation.navigate('Reports');
        break;
      default:
        Alert.alert('Info', 'Bu funksiya tezliklə əlavə ediləcək');
    }
  };

  const chartData = {
    labels: ['B.E', 'Ç.A', 'Ç', 'C.A', 'C', 'Ş', 'B'],
    datasets: [
      {
        data: [1200, 1350, 980, 1450, 1100, 1250, 1400],
        color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyun'],
    datasets: [
      {
        data: [45000, 52000, 48000, 61000, 55000, 68000],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>Xoş gəlmisiniz! 👋</Title>
            <Paragraph style={styles.welcomeText}>
              Bu günkü satışlarınızı və statistikalarınızı idarə edin
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="trending-up" size={24} color={theme.colors.success} />
                <Text style={styles.statLabel}>Bu Günkü Satış</Text>
              </View>
              <Title style={styles.statValue}>{stats.todaySales.toFixed(2)} AZN</Title>
              <Paragraph style={styles.statChange}>+12.5% keçən gündən</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="cash" size={24} color={theme.colors.primary} />
                <Text style={styles.statLabel}>Ümumi Satış</Text>
              </View>
              <Title style={styles.statValue}>{stats.totalSales.toFixed(2)} AZN</Title>
              <Paragraph style={styles.statChange}>Bu ay</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="cube" size={24} color={theme.colors.warning} />
                <Text style={styles.statLabel}>Məhsullar</Text>
              </View>
              <Title style={styles.statValue}>{stats.totalProducts}</Title>
              <Paragraph style={styles.statChange}>{stats.lowStock} az qalıb</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="people" size={24} color={theme.colors.accent} />
                <Text style={styles.statLabel}>Müştərilər</Text>
              </View>
              <Title style={styles.statValue}>{stats.totalCustomers}</Title>
              <Paragraph style={styles.statChange}>Aktiv müştərilər</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Sürətli Əməliyyatlar</Title>
            <View style={styles.actionsGrid}>
              <Button
                mode="contained"
                onPress={() => handleQuickAction('sales')}
                style={styles.actionButton}
                icon="cart"
              >
                Yeni Satış
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleQuickAction('inventory')}
                style={styles.actionButton}
                icon="cube"
              >
                Anbar
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleQuickAction('customers')}
                style={styles.actionButton}
                icon="people"
              >
                Müştərilər
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleQuickAction('reports')}
                style={styles.actionButton}
                icon="bar-chart"
              >
                Hesabatlar
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Weekly Sales Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Həftəlik Satışlar</Title>
            <LineChart
              data={chartData}
              width={width - 60}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: theme.colors.primary,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Aylıq Gəlir</Title>
            <BarChart
              data={barData}
              width={width - 60}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(118, 75, 162, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Son Fəaliyyətlər</Title>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                <Text style={styles.activityText}>Yeni satış tamamlandı - 125.50 AZN</Text>
                <Text style={styles.activityTime}>2 dəqiqə əvvəl</Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
                <Text style={styles.activityText}>5 yeni məhsul əlavə edildi</Text>
                <Text style={styles.activityTime}>15 dəqiqə əvvəl</Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="person-add" size={20} color={theme.colors.accent} />
                <Text style={styles.activityText}>Yeni müştəri qeydiyyatdan keçdi</Text>
                <Text style={styles.activityTime}>1 saat əvvəl</Text>
              </View>
            </View>
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
  welcomeCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statChange: {
    fontSize: 12,
    color: '#666',
  },
  actionsCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 10,
  },
  chartCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  activityCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  activityList: {
    gap: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default DashboardScreen;
