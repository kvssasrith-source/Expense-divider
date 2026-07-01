import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function AddExpenseScreen({ navigation }: any) {
  const { friends, addExpense, currency } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<string | null>(null);
  
  const [participants, setParticipants] = useState<string[]>(friends.map(f => f.id));

  const toggleParticipant = (id: string) => {
    if (participants.includes(id)) {
      setParticipants(participants.filter(p => p !== id));
    } else {
      setParticipants([...participants, id]);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !amount.trim() || !paidBy) {
      Alert.alert('Hold up', 'Please fill in all details and select who paid.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }
    if (participants.length === 0) {
      Alert.alert('No Participants', 'Please select at least one person.');
      return;
    }

    addExpense(title.trim(), numAmount, paidBy, participants);
    navigation.goBack();
  };

  if (friends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="skull" size={80} color="#333" />
        <Text style={styles.emptyTitle}>NO CREW DETECTED</Text>
        <Text style={styles.emptySub}>ADD SOME FRIENDS FIRST.</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>WHAT FOR?</Text>
          <TextInput 
            style={styles.input} 
            placeholder="PIZZA, GAS..." 
            placeholderTextColor="#555"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>HOW MUCH? ({currency})</Text>
          <TextInput 
            style={[styles.input, styles.amountInput]} 
            placeholder="0.00" 
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>WHO PAID?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {friends.map(friend => {
              const isSelected = paidBy === friend.id;
              return (
                <TouchableOpacity 
                  key={friend.id} 
                  style={[styles.chip, isSelected && { backgroundColor: '#FFEA00', borderColor: '#FFEA00' }]}
                  onPress={() => setPaidBy(friend.id)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{friend.name.toUpperCase()}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>WHO'S SPLITTING?</Text>
          <View style={styles.wrapContainer}>
            {friends.map(friend => {
              const isSelected = participants.includes(friend.id);
              return (
                <TouchableOpacity 
                  key={friend.id} 
                  style={[styles.chip, isSelected && { backgroundColor: '#00FFCC', borderColor: '#00FFCC' }]}
                  onPress={() => toggleParticipant(friend.id)}
                >
                  {isSelected && <Ionicons name="checkmark" size={16} color="#000" style={{marginRight: 5}}/>}
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{friend.name.toUpperCase()}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>SAVE EXPENSE</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#090909',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 20,
    color: '#FF0055',
    letterSpacing: 1,
  },
  emptySub: {
    fontSize: 16,
    color: '#666',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    letterSpacing: 2,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00FFCC',
    marginBottom: 12,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: '#141414',
    padding: 20,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    borderWidth: 2,
    borderColor: '#333',
  },
  amountInput: {
    fontSize: 32,
    color: '#FFEA00',
  },
  chipRow: {
    flexDirection: 'row',
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#141414',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#888',
    letterSpacing: 1,
  },
  chipTextSelected: {
    color: '#000',
  },
  saveBtn: {
    backgroundColor: '#FF0055',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  }
});
