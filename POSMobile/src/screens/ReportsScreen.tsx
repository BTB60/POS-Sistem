import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ReportsScreen: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 15420.50,
    todaySales: 1250.75,
    totalProducts: 156,
    totalCustomers: 89,
    lowStock: 12,
  });
  const theme = useTheme();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Stats already loaded in state
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
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="trending-up" size={24} color={theme.colors.success} />
                <Text style={styles.statLabel}>Bu Günkü Satış</Text>
              </View>
              <Title style={styles.statValue}>{stats.todaySales.toFixed(2)} AZN</Title>
              <Text style={styles.statChange}>+12.5% keçən gündən</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="cash" size={24} color={theme.colors.primary} />
                <Text style={styles.statLabel}>Ümumi Satış</Text>
              </View>
              <Title style={styles.statValue}>{stats.totalSales.toFixed(2)} AZN</Title>
              <Text style={styles.statChange}>Bu ay</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="cube" size={24} color={theme.colors.warning} />
                <Text style={styles.statLabel}>Məhsullar</Text>
              </View>
              <Title style={styles.statValue}>{stats.totalProducts}</Title>
              <Text style={styles.statChange}>{stats.lowStock} az qalıb</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Ionicons name="people" size={24} color={theme.colors.accent} />
                <Text style={styles.statLabel}>Müştərilər</Text>
              </View>
              <Title style={styles.statValue}>{stats.totalCustomers}</Title>
              <Text style={styles.statChange}>Aktiv müştərilər</Text>
            </Card.Content>
          </Card>
        </View>

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

        {/* Export Button */}
        <Card style={styles.exportCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Hesabat İxracı</Title>
            <Button
              mode="contained"
              icon="download"
              onPress={() => {}}
              style={styles.exportButton}
            >
              PDF İxrac Et
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
  chartCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  exportCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  exportButton: {
    marginTop: 10,
  },
});

export default ReportsScreen;
