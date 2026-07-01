import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';
import { calculateBalances, simplifyDebts } from '../utils/simplifyDebts';
import { Ionicons } from '@expo/vector-icons';

export default function SettleUpScreen() {
  const { friends, expenses, resetExpenses, currency } = useContext(AppContext);
  
  const friendIds = friends.map(f => f.id);
  const balances = calculateBalances(expenses, friendIds);
  const optimalTransactions = simplifyDebts(balances);

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('NUKE ALL TRANSACTIONS?\n\nThis will delete all expenses and set everyone to zero. Friends will be kept. Are you absolutely sure?')) {
        resetExpenses();
      }
    } else {
      Alert.alert(
        'NUKE ALL TRANSACTIONS?',
        'This will delete all expenses and set everyone to zero. Friends will be kept. Are you absolutely sure?',
        [
          { text: 'CANCEL', style: 'cancel' },
          { text: 'NUKE IT', style: 'destructive', onPress: resetExpenses }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          OPTIMIZED SETTLEMENT PATH. NO REDUNDANT TRANSACTIONS.
        </Text>
      </View>

      {optimalTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="finger-print" size={80} color="#00FFCC" />
          <Text style={styles.emptyTitle}>ALL CLEAR</Text>
          <Text style={styles.emptyText}>NO OUTSTANDING DEBTS.</Text>
        </View>
      ) : (
        <FlatList
          data={optimalTransactions}
          keyExtractor={(_, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
          renderItem={({ item }) => {
            const debtor = friends.find(f => f.id === item.from);
            const creditor = friends.find(f => f.id === item.to);
            
            return (
              <View style={styles.transactionCard}>
                <View style={styles.userCol}>
                  <Text style={styles.name} numberOfLines={1}>{debtor?.name.toUpperCase()}</Text>
                </View>

                <View style={styles.arrowCol}>
                  <Text style={styles.amountText}>PAYS {currency}{item.amount.toFixed(2)}</Text>
                  <Ionicons name="arrow-forward" size={32} color="#00FFCC" />
                </View>

                <View style={styles.userCol}>
                  <Text style={styles.name} numberOfLines={1}>{creditor?.name.toUpperCase()}</Text>
                </View>
              </View>
            )
          }}
          ListFooterComponent={
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="warning" size={24} color="#000" style={{marginRight: 10}}/>
              <Text style={styles.resetBtnText}>RESET ALL TRANSACTIONS</Text>
            </TouchableOpacity>
          }
        />
      )}
      
      {optimalTransactions.length === 0 && expenses.length > 0 && (
        <TouchableOpacity style={[styles.resetBtn, { position: 'absolute', bottom: 120, left: 20, right: 20 }]} onPress={handleReset}>
          <Ionicons name="warning" size={24} color="#000" style={{marginRight: 10}}/>
          <Text style={styles.resetBtnText}>RESET ALL TRANSACTIONS</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#090909',
  },
  infoCard: {
    backgroundColor: '#FFEA00',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#000',
  },
  infoText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141414',
    padding: 24,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#333',
  },
  userCol: {
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  arrowCol: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF0055',
    marginBottom: 8,
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00FFCC',
    marginTop: 20,
    letterSpacing: 2,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
    letterSpacing: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF0055',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  resetBtnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  }
});
