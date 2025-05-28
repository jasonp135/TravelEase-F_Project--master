import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList, Modal, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import Slider from '@react-native-community/slider';

// Define types
type Place = {
  id: string;
  name: string;
  category: string;
  image: any;
  description: string;
  rating: number;
  price: number;
  tags: string[];
};

type FilterOptions = {
  budget: number;
  rating: number | null;
  tags: string[];
};

export default function CategoriesPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedCategory = params.category as string || 'Landmarks';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  
  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    budget: 1000,
    rating: null,
    tags: [],
  });
  const [tempFilterOptions, setTempFilterOptions] = useState<FilterOptions>({
    budget: 1000,
    rating: null,
    tags: [],
  });

  // Categories with icons
  const categories = [
    { name: 'Landmarks', icon: 'map-pin' },
    { name: 'Restaurants', icon: 'coffee' },
    { name: 'Shopping', icon: 'shopping-bag' },
    { name: 'Nature', icon: 'sun' },
    { name: 'Nightlife', icon: 'moon' },
    { name: 'Museums', icon: 'book-open' },
    { name: 'Adventure', icon: 'activity' },
    { name: 'Transportation', icon: 'truck' },
    { name: 'Events', icon: 'calendar' },
  ];

  // Available tags for filtering
  const availableTags = [
    'Ocean View', 'Luxury', 'Night View', 'Family Friendly', 'Hotel Dining', 
    'Romantic', 'Outdoor', 'Indoor', 'Historical', 'Cultural', 'Shopping', 
    'Food', 'Art', 'Photography', 'Hiking', 'Free Entry', 'Paid Entry'
  ];

  // Sample places data with categories
  const places: Place[] = [
    {
      id: '1',
      name: 'Victoria Peak',
      category: 'Landmarks',
      image: require('../images/VictoriaPeak1.jpeg'),
      description: 'The highest point on Hong Kong Island, offering stunning views of the city skyline.',
      rating: 4.8,
      price: 150,
      tags: ['Night View', 'Photography', 'Outdoor', 'Paid Entry'],
    },
    {
      id: '2',
      name: 'Tsim Sha Tsui',
      category: 'Shopping',
      image: require('../images/TsimShaTsui1.jpeg'),
      description: 'A major shopping district with luxury stores and boutiques.',
      rating: 4.5,
      price: 500,
      tags: ['Luxury', 'Shopping', 'Food', 'Free Entry'],
    },
    {
      id: '3',
      name: 'Big Buddha',
      category: 'Landmarks',
      image: require('../images/BigBuddha1.jpg'),
      description: 'A large bronze statue of Buddha Shakyamuni on Lantau Island.',
      rating: 4.7,
      price: 200,
      tags: ['Cultural', 'Historical', 'Photography', 'Outdoor'],
    },
    {
      id: '4',
      name: 'Ngong Ping 360 Cable Car',
      category: 'Adventure',
      image: require('../images/360CableCar1.jpg'),
      description: 'A scenic cable car ride offering panoramic views of Lantau Island.',
      rating: 4.6,
      price: 300,
      tags: ['Photography', 'Outdoor', 'Paid Entry'],
    },
    {
      id: '5',
      name: 'Temple Street Night Market',
      category: 'Shopping',
      image: require('../images/TempleStreet1.jpg'),
      description: 'A popular street market known for shopping, food, and fortune tellers.',
      rating: 4.3,
      price: 100,
      tags: ['Night View', 'Shopping', 'Food', 'Cultural'],
    },
    {
      id: '6',
      name: 'The Peak Tram',
      category: 'Transportation',
      image: require('../images/PeakTram1.jpg'),
      description: 'A funicular railway that takes you up to Victoria Peak.',
      rating: 4.4,
      price: 120,
      tags: ['Paid Entry', 'Photography', 'Historical'],
    },
    {
      id: '7',
      name: 'Hong Kong Disneyland',
      category: 'Landmarks',
      description: 'A magical theme park with attractions for all ages.',
      image: null,
      rating: 4.5,
      price: 800,
      tags: ['Family Friendly', 'Paid Entry', 'Food', 'Indoor', 'Outdoor'],
    },
    {
      id: '8',
      name: 'Ocean Park',
      category: 'Landmarks',
      description: 'A marine mammal park, oceanarium, and animal theme park.',
      image: null,
      rating: 4.4,
      price: 600,
      tags: ['Family Friendly', 'Ocean View', 'Paid Entry', 'Outdoor'],
    },
    {
      id: '9',
      name: 'Wong Tai Sin Temple',
      category: 'Landmarks',
      description: 'A famous shrine and major tourist attraction in Hong Kong.',
      image: null,
      rating: 4.6,
      price: 10,
      tags: ['Cultural', 'Historical', 'Free Entry'],
    },
    {
      id: '10',
      name: 'Lan Kwai Fong',
      category: 'Nightlife',
      description: 'A popular nightlife hot spot with bars and restaurants.',
      image: null,
      rating: 4.2,
      price: 400,
      tags: ['Night View', 'Food', 'Luxury'],
    },
    {
      id: '11',
      name: 'Hong Kong Museum of History',
      category: 'Museums',
      description: 'A museum showcasing Hong Kong\'s history and culture.',
      image: null,
      rating: 4.5,
      price: 50,
      tags: ['Historical', 'Cultural', 'Indoor', 'Paid Entry'],
    },
    {
      id: '12',
      name: 'Hong Kong Park',
      category: 'Nature',
      description: 'A public park featuring an aviary, conservatory, and tai chi garden.',
      image: null,
      rating: 4.3,
      price: 0,
      tags: ['Outdoor', 'Free Entry', 'Photography'],
    },
    {
      id: '13',
      name: 'Tim Ho Wan',
      category: 'Restaurants',
      description: 'Famous dim sum restaurant known for its affordable Michelin-starred food.',
      image: null,
      rating: 4.7,
      price: 200,
      tags: ['Food', 'Indoor'],
    },
    {
      id: '14',
      name: 'Mong Kok Markets',
      category: 'Shopping',
      description: 'Various markets selling everything from electronics to clothing.',
      image: null,
      rating: 4.1,
      price: 100,
      tags: ['Shopping', 'Food', 'Free Entry'],
    },
    {
      id: '15',
      name: 'Dragon\'s Back Hiking Trail',
      category: 'Nature',
      description: 'A popular hiking trail with stunning views of the coastline.',
      image: null,
      rating: 4.8,
      price: 0,
      tags: ['Hiking', 'Ocean View', 'Outdoor', 'Photography', 'Free Entry'],
    },
  ];

  // Apply filters function
  const applyFilters = () => {
    setFilterOptions(tempFilterOptions);
    setShowFilterModal(false);
  };
  
  // Reset filters function
  const resetFilters = () => {
    const resetOptions = {
      budget: 1000,
      rating: null,
      tags: [],
    };
    setTempFilterOptions(resetOptions);
    setFilterOptions(resetOptions);
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setTempFilterOptions(prev => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  // Filter places based on active category, search query, and filter options
  useEffect(() => {
    let results = places;
    
    // Filter by category
    if (activeCategory !== 'All') {
      results = results.filter(place => place.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      results = results.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by budget
    if (filterOptions.budget < 1000) {
      results = results.filter(place => place.price <= filterOptions.budget);
    }
    
    // Filter by rating
    if (filterOptions.rating !== null) {
      if (filterOptions.rating === 1) {
        results = results.filter(place => place.rating < 2);
      } else if (filterOptions.rating === 5) {
        results = results.filter(place => place.rating > 4);
      } else {
        results = results.filter(place => 
          Math.floor(place.rating) === filterOptions.rating
        );
      }
    }
    
    // Filter by tags
    if (filterOptions.tags.length > 0) {
      results = results.filter(place => 
        filterOptions.tags.some(tag => place.tags.includes(tag))
      );
    }
    
    setFilteredPlaces(results);
  }, [activeCategory, searchQuery, filterOptions]);

  // Render place item
  const renderPlaceItem = ({ item }: { item: Place }) => (
    <TouchableOpacity 
      style={styles.placeCard}
      onPress={() => router.push(`/destinations/${item.id}`)}
    >
      <Image 
        source={item.image || { uri: 'https://via.placeholder.com/150?text=No+Image' }} 
        style={styles.placeImage} 
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        {/* <Text style={styles.placeCategory}>{item.category}</Text> */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Feather 
              key={star}
              name="star" 
              size={14} 
              color={star <= Math.floor(item.rating) ? "#FFD700" : "#D3D3D3"} 
            />
          ))}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {item.price === 0 ? 'Free' : `HK${item.price}`}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.placeDescription}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>
      
      {/* Search Bar and Filter Button */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search places..."
            placeholderTextColor="gray"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            (filterOptions.budget < 1000 || filterOptions.rating !== null || filterOptions.tags.length > 0) && 
            styles.activeFilterButton
          ]} 
          onPress={() => {
            setTempFilterOptions({...filterOptions});
            setShowFilterModal(true);
          }}
        >
          <Feather name="sliders" size={20} color={(filterOptions.budget < 1000 || filterOptions.rating !== null || filterOptions.tags.length > 0) ? "#fff" : "#333"} />
        </TouchableOpacity>
      </View>
      
      {/* Categories Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              activeCategory === category.name && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category.name)}
          >
            <Feather 
              name={category.icon as any} 
              size={16} 
              color={activeCategory === category.name ? "#fff" : "#333"} 
            />
            <Text 
              style={[
                styles.categoryButtonText,
                activeCategory === category.name && styles.activeCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
        </Text>
      </View>
      
      {/* Places List */}
      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces}
          renderItem={renderPlaceItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.placesList}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Feather name="search" size={50} color="#ccc" />
          <Text style={styles.noResultsText}>No places found</Text>
          <Text style={styles.noResultsSubText}>
            Try changing your search or filter options
          </Text>
        </View>
      )}
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {/* Budget Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Budget (HKD)</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1000}
                  step={50}
                  value={tempFilterOptions.budget}
                  onValueChange={(value) => setTempFilterOptions(prev => ({ ...prev, budget: value }))}
                  minimumTrackTintColor="#6C63FF"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#6C63FF"
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderValue}>HK${tempFilterOptions.budget}</Text>
                  <Text style={styles.sliderMaxValue}>
                    {tempFilterOptions.budget >= 1000 ? 'Any price' : ''}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Rating Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Rating</Text>
              <View style={styles.ratingOptions}>
                {[
                  { value: 1, label: 'below 2 stars' },
                  { value: 2, label: '2 stars' },
                  { value: 3, label: '3 stars' },
                  { value: 4, label: '3 stars above' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.ratingOption,
                      tempFilterOptions.rating === option.value && styles.activeRatingOption
                    ]}
                    onPress={() => setTempFilterOptions(prev => ({
                      ...prev,
                      rating: prev.rating === option.value ? null : option.value
                    }))}
                  >
                    <Text style={[
                      styles.ratingOptionText,
                      tempFilterOptions.rating === option.value && styles.activeRatingOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Tags Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Features & Tags</Text>
              <ScrollView style={styles.tagsContainer}>
                <View style={styles.tagsList}>
                  {availableTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagOption,
                        tempFilterOptions.tags.includes(tag) && styles.activeTagOption
                      ]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={[
                        styles.tagOptionText,
                        tempFilterOptions.tags.includes(tag) && styles.activeTagOptionText
                      ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 50,
  },
  header: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFilterButton: {
    backgroundColor: '#6C63FF',
  },
  categoriesScroll: {
    maxHeight: 70,
    height: 70,
    marginBottom: 22,
  },
  categoriesContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    height: 50,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryButton: {
    backgroundColor: '#6C63FF',
  },
  categoryButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  activeCategoryText: {
    color: '#fff',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
  },
  placesList: {
    paddingHorizontal: 20,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: 100,
    height: 100,
  },
  placeInfo: {
    flex: 1,
    padding: 12,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  placeCategory: {
    fontSize: 12,
    color: '#6C63FF',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    marginBottom: 6,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },
  placeDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  // Modal styles
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
  filterSection: {
    marginTop: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sliderContainer: {
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
  },
  sliderValue: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  sliderMaxValue: {
    fontSize: 14,
    color: '#666',
  },
  ratingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  ratingOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  activeRatingOption: {
    backgroundColor: '#6C63FF',
  },
  ratingOptionText: {
    fontSize: 14,
    color: '#333',
  },
  activeRatingOptionText: {
    color: '#fff',
  },
  tagsContainer: {
    maxHeight: 150,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  activeTagOption: {
    backgroundColor: '#6C63FF',
  },
  tagOptionText: {
    fontSize: 14,
    color: '#333',
  },
  activeTagOptionText: {
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
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#6C63FF',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});