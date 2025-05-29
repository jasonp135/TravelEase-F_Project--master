import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define types
type ItineraryItem = {
  id: string;
  title: string;
  date: string; // Format: 'YYYY-MM-DD'
  time: string;
  location: string;
  category: string;
};

// Simple calendar implementation
const SimpleCalendar = ({ 
  onSelectDate, 
  selectedDate, 
  markedDates 
}: { 
  onSelectDate: (date: string) => void, 
  selectedDate: string,
  markedDates: {[key: string]: boolean}
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Generate days array
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Empty cells for days before the 1st
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <View style={calendarStyles.container}>
      <View style={calendarStyles.header}>
        <TouchableOpacity onPress={prevMonth}>
          <Feather name="chevron-left" size={24} color="#6C63FF" />
        </TouchableOpacity>
        <Text style={calendarStyles.monthText}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth}>
          <Feather name="chevron-right" size={24} color="#6C63FF" />
        </TouchableOpacity>
      </View>
      
      <View style={calendarStyles.daysHeader}>
        {dayNames.map((day, index) => (
          <Text key={index} style={calendarStyles.dayName}>
            {day}
          </Text>
        ))}
      </View>
      
      <View style={calendarStyles.daysGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={calendarStyles.emptyDay} />;
          }
          
          const dateString = formatDate(year, month, day);
          const isSelected = dateString === selectedDate;
          const isMarked = markedDates[dateString];
          
          return (
            <TouchableOpacity
              key={dateString}
              style={[
                calendarStyles.day,
                isSelected && calendarStyles.selectedDay,
                isToday(day) && calendarStyles.today
              ]}
              onPress={() => onSelectDate(dateString)}
            >
              <Text style={[
                calendarStyles.dayText,
                isSelected && calendarStyles.selectedDayText,
                isToday(day) && calendarStyles.todayText
              ]}>
                {day}
              </Text>
              {isMarked && <View style={calendarStyles.markedDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function ItineraryPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    title: '',
    time: '',
    location: '',
    category: 'Attraction'
  });
  
  // Sample itinerary data
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([
    {
      id: '1',
      title: 'Victoria Peak',
      date: '2024-05-30',
      time: '14:00',
      location: 'The Peak, Hong Kong Island',
      category: 'Attraction'
    },
    {
      id: '2',
      title: 'Lunch at Tim Ho Wan',
      date: '2024-05-30',
      time: '12:00',
      location: 'Olympic Station, Kowloon',
      category: 'Restaurant'
    },
    {
      id: '3',
      title: 'Star Ferry Ride',
      date: '2024-05-31',
      time: '18:00',
      location: 'Central Pier, Hong Kong Island',
      category: 'Transportation'
    }
  ]);

  // Create marked dates object
  const markedDates = itineraryItems.reduce((acc, item) => {
    acc[item.date] = true;
    return acc;
  }, {} as {[key: string]: boolean});

  // Get items for selected date
  const selectedDateItems = itineraryItems
    .filter(item => item.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Add new itinerary item
  const addItineraryItem = () => {
    if (!newItem.title || !selectedDate) return;
    
    const newItineraryItem: ItineraryItem = {
      id: Date.now().toString(),
      title: newItem.title,
      date: selectedDate,
      time: newItem.time || '12:00',
      location: newItem.location || '',
      category: newItem.category || 'Attraction'
    };
    
    setItineraryItems([...itineraryItems, newItineraryItem]);
    setNewItem({
      title: '',
      time: '',
      location: '',
      category: 'Attraction'
    });
    setShowAddModal(false);
  };

  // Delete itinerary item
  const deleteItineraryItem = (id: string) => {
    setItineraryItems(itineraryItems.filter(item => item.id !== id));
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate data fetching
    setTimeout(() => {
      // You would typically fetch fresh data here
      setRefreshing(false);
    }, 1000);
  };

  // Render itinerary item
  const renderItineraryItem = ({ item }: { item: ItineraryItem }) => {
    const categoryColors: {[key: string]: string} = {
      'Attraction': '#6C63FF',
      'Restaurant': '#FF6B6B',
      'Transportation': '#4CAF50',
      'Hotel': '#FFA000',
      'Shopping': '#00BCD4'
    };
    
    const color = categoryColors[item.category] || '#6C63FF';
    
    return (
      <View style={[styles.itineraryItem, { borderLeftColor: color }]}>
        <View style={styles.itemTimeContainer}>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.location ? (
            <Text style={styles.itemLocation}>
              <Feather name="map-pin" size={12} color="#666" /> {item.location}
            </Text>
          ) : null}
          <Text style={[styles.itemCategory, { color }]}>{item.category}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteItineraryItem(item.id)}
        >
          <Feather name="trash-2" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itinerary</Text>
        <Text style={styles.headerSubtitle}>Plan your Hong Kong adventure</Text>
      </View>
      
      {/* Refresh Button */}
      <View style={styles.refreshButtonContainer}>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Feather 
            name="refresh-cw" 
            size={18} 
            color="#fff" 
            style={refreshing ? styles.spinningIcon : undefined} 
          />
          <Text style={styles.refreshButtonText}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <SimpleCalendar 
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
          markedDates={markedDates}
        />
      </View>
      
      {/* Selected Date Section */}
      <View style={styles.selectedDateContainer}>
        <View style={styles.selectedDateHeader}>
          <Text style={styles.selectedDateTitle}>
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Select a date'}
          </Text>
          {selectedDate && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Feather name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Itinerary Items List */}
        {selectedDate ? (
          selectedDateItems.length > 0 ? (
            <FlatList
              data={selectedDateItems}
              renderItem={renderItineraryItem}
              keyExtractor={(item) => item.id}
              style={styles.itemsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="calendar" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>No plans for this day</Text>
              <Text style={styles.emptyStateSubtext}>Tap the + button to add activities</Text>
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>Select a date to view or add plans</Text>
          </View>
        )}
      </View>
      
      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Plan</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Title*</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Visit Victoria Peak"
                value={newItem.title}
                onChangeText={(text) => setNewItem({...newItem, title: text})}
              />
              
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 14:00"
                value={newItem.time}
                onChangeText={(text) => setNewItem({...newItem, time: text})}
              />
              
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., The Peak, Hong Kong Island"
                value={newItem.location}
                onChangeText={(text) => setNewItem({...newItem, location: text})}
              />
              
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {['Attraction', 'Restaurant', 'Transportation', 'Hotel', 'Shopping'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newItem.category === category && styles.selectedCategoryOption
                    ]}
                    onPress={() => setNewItem({...newItem, category})}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      newItem.category === category && styles.selectedCategoryOptionText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  !newItem.title && styles.disabledButton
                ]}
                onPress={addItineraryItem}
                disabled={!newItem.title}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Calendar styles
const calendarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emptyDay: {
    width: '14.28%',
    height: 40,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 1,
    borderColor: '#6C63FF',
    borderRadius: 20,
  },
  todayText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  markedDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6C63FF',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#6C63FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  refreshButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 12,
    marginRight: 22,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  spinningIcon: {
    transform: [{ rotate: '45deg' }],
  },
  calendarContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateContainer: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 15,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsList: {
    flex: 1,
  },
  itineraryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTimeContainer: {
    width: 50,
    marginRight: 10,
  },
  itemTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalForm: {
    marginTop: 15,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryOption: {
    backgroundColor: '#6C63FF',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryOptionText: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#6C63FF',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});