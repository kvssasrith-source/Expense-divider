import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { calculateBalances } from '../utils/simplifyDebts';

export default function FriendsScreen() {
  const { friends, addFriend, removeFriend, expenses, currency } = useContext(AppContext);
  const [newName, setNewName] = useState('');

  const friendIds = friends.map(f => f.id);
  const balances = calculateBalances(expenses, friendIds);

  const handleAdd = () => {
    if (newName.trim()) {
      addFriend(newName.trim());
      setNewName('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.addSection}>
          <TextInput
            style={styles.input}
            placeholder="NEW MEMBER NAME..."
            placeholderTextColor="#555"
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add" size={32} color="#000" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const balance = balances[item.id] || 0;
            return (
              <View style={styles.friendCard}>
                <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                  <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{item.name.toUpperCase()}</Text>
                  <Text style={[
                    styles.balanceText,
                    { color: balance > 0.01 ? '#00FFCC' : balance < -0.01 ? '#FF0055' : '#666' }
                  ]}>
                    {balance > 0.01 ? `OWED ${currency}${balance.toFixed(2)}` : balance < -0.01 ? `OWES ${currency}${Math.abs(balance).toFixed(2)}` : 'SETTLED UP'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFriend(item.id)} style={styles.removeBtn}>
                  <Ionicons name="close" size={24} color="#FF0055" />
                </TouchableOpacity>
              </View>
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>NO CREW MEMBERS YET.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#090909',
  },
  addSection: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    backgroundColor: '#141414',
    borderWidth: 2,
    borderColor: '#333',
    color: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '900',
    marginRight: 15,
  },
  addButton: {
    backgroundColor: '#FFEA00', // Neon Yellow
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendCard: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#000',
  },
  avatarText: {
    color: '#000',
    fontSize: 28,
    fontWeight: '900',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  removeBtn: {
    padding: 10,
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    borderRadius: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#333',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  }
});
