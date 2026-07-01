import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Modal, Pressable, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { calculateBalances } from '../utils/simplifyDebts';

const CURRENCIES = [
  { label: 'USD ($)', symbol: '$' },
  { label: 'EURO (€)', symbol: '€' },
  { label: 'POUND (£)', symbol: '£' },
  { label: 'RUPEE (₹)', symbol: '₹' },
];

export default function HomeScreen({ navigation }: any) {
  const { friends, expenses, resetExpenses, currency, setCurrency } = useContext(AppContext);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const friendIds = friends.map(f => f.id);
  const balances = calculateBalances(expenses, friendIds);
  
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('NUKE ALL TRANSACTIONS?\n\nThis will delete all expenses. Are you absolutely sure?')) {
        resetExpenses();
        setMenuVisible(false);
      }
    } else {
      Alert.alert(
        'NUKE ALL TRANSACTIONS?',
        'This will delete all expenses. Are you absolutely sure?',
        [
          { text: 'CANCEL', style: 'cancel' },
          { text: 'NUKE IT', style: 'destructive', onPress: () => {
            resetExpenses();
            setMenuVisible(false);
          }}
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.dashboardTitle}>TOTAL SPENDING</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setMenuVisible(true)}>
          <Ionicons name="settings" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} animationType="fade" transparent={true} onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menuContainer}>
            <Text style={styles.menuTitle}>SETTINGS</Text>
            
            <Text style={styles.menuLabel}>CURRENCY</Text>
            <View style={styles.currencyRow}>
              {CURRENCIES.map(c => (
                <TouchableOpacity 
                  key={c.symbol} 
                  style={[styles.currencyChip, currency === c.symbol && styles.currencyChipActive]}
                  onPress={() => setCurrency(c.symbol)}
                >
                  <Text style={[styles.currencyText, currency === c.symbol && styles.currencyTextActive]}>{c.symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.menuResetBtn} onPress={handleReset}>
              <Ionicons name="warning" size={20} color="#000" style={{marginRight: 8}}/>
              <Text style={styles.menuResetText}>RESET ALL TRANSACTIONS</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.dashboardCard}>
        <View style={styles.glow} />
        <Text style={styles.dashboardAmount}>{currency}{totalExpenses.toFixed(2)}</Text>
        <View style={styles.dashboardRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{friends.length}</Text>
            <Text style={styles.statLabel}>MEMBERS</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{expenses.length}</Text>
            <Text style={styles.statLabel}>EXPENSES</Text>
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>ACTIVITY</Text>
      </View>

      {expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="flash-off" size={48} color="#333" style={{marginBottom: 10}}/>
          <Text style={styles.emptyText}>NO EXPENSES YET.</Text>
        </View>
      ) : (
        <FlatList
          data={[...expenses].reverse().slice(0, 10)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const payer = friends.find(f => f.id === item.paidBy);
            return (
              <View style={styles.expenseItem}>
                <View style={[styles.expenseIcon, { backgroundColor: payer?.avatarColor || '#FF0055' }]}>
                  <Ionicons name="receipt" size={24} color="#000" />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{item.title.toUpperCase()}</Text>
                  <Text style={styles.expensePayer}>PAID BY {payer?.name.toUpperCase() || 'UNKNOWN'}</Text>
                </View>
                <Text style={styles.expenseListAmount}>{currency}{item.amount.toFixed(2)}</Text>
              </View>
            )
          }}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Ionicons name="add" size={40} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#090909'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 10,
  },
  settingsBtn: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#141414',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    width: '85%',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00FFCC',
    letterSpacing: 2,
    marginBottom: 10,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  currencyChip: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090909',
  },
  currencyChipActive: {
    borderColor: '#00FFCC',
    backgroundColor: '#00FFCC',
  },
  currencyText: {
    color: '#888',
    fontSize: 22,
    fontWeight: '900',
  },
  currencyTextActive: {
    color: '#000',
  },
  menuResetBtn: {
    backgroundColor: '#FF0055',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuResetText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  dashboardCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    backgroundColor: '#FF0055',
    borderRadius: 75,
    opacity: 0.15,
  },
  dashboardTitle: {
    color: '#00FFCC',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  dashboardAmount: {
    color: '#FFF',
    fontSize: 54,
    fontWeight: '900',
    marginBottom: 15,
    letterSpacing: -1,
  },
  dashboardRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
  },
  divider: {
    width: 2,
    height: 30,
    backgroundColor: '#333',
    marginHorizontal: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFEA00',
    letterSpacing: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#333',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  expenseItem: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  expenseIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  expensePayer: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 1,
  },
  expenseListAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF0055',
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    backgroundColor: '#00FFCC',
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00FFCC',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  }
});
