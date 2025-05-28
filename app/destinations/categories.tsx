import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

// Define types
type Place = {
  id: string;
  name: string;
  category: string;
  image: any;
  description: string;
  rating: number;
};

export default function CategoriesPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedCategory = params.category as string || 'Landmarks';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);

  // Categories with icons
  const categories = [
    { name: 'Landmarks', icon: 'map-pin' },
    { name: 'Restaurants', icon: 'coffee' },
    { name: 'Shopping', icon: 'shopping-bag' },
    { name: 'Nature', icon: 'sun' },
    { name: 'Nightlife', icon: 'moon' },
    { name: 'Museums', icon: 'book-open' },
    { name: 'Adventure', icon: 'activity' },
    { name: 'Family-Friendly', icon: 'smile' },
    { name: 'Transportation', icon: 'truck' },
    { name: 'Events', icon: 'calendar' },
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
    },
    {
      id: '2',
      name: 'Tsim Sha Tsui',
      category: 'Shopping',
      image: require('../images/TsimShaTsui1.jpeg'),
      description: 'A major shopping district with luxury stores and boutiques.',
      rating: 4.5,
    },
    {
      id: '3',
      name: 'Big Buddha',
      category: 'Landmarks',
      image: require('../images/BigBuddha1.jpg'),
      description: 'A large bronze statue of Buddha Shakyamuni on Lantau Island.',
      rating: 4.7,
    },
    {
      id: '4',
      name: 'Ngong Ping 360 Cable Car',
      category: 'Adventure',
      image: require('../images/360CableCar1.jpg'),
      description: 'A scenic cable car ride offering panoramic views of Lantau Island.',
      rating: 4.6,
    },
    {
      id: '5',
      name: 'Temple Street Night Market',
      category: 'Shopping',
      image: require('../images/TempleStreet1.jpg'),
      description: 'A popular street market known for shopping, food, and fortune tellers.',
      rating: 4.3,
    },
    {
      id: '6',
      name: 'The Peak Tram',
      category: 'Transportation',
      image: require('../images/PeakTram1.jpg'),
      description: 'A funicular railway that takes you up to Victoria Peak.',
      rating: 4.4,
    },
    {
      id: '7',
      name: 'Hong Kong Disneyland',
      category: 'Family-Friendly',
      description: 'A magical theme park with attractions for all ages.',
      image: null,
      rating: 4.5,
    },
    {
      id: '8',
      name: 'Ocean Park',
      category: 'Family-Friendly',
      description: 'A marine mammal park, oceanarium, and animal theme park.',
      image: null,
      rating: 4.4,
    },
    {
      id: '9',
      name: 'Wong Tai Sin Temple',
      category: 'Landmarks',
      description: 'A famous shrine and major tourist attraction in Hong Kong.',
      image: null,
      rating: 4.6,
    },
    {
      id: '10',
      name: 'Lan Kwai Fong',
      category: 'Nightlife',
      description: 'A popular nightlife hot spot with bars and restaurants.',
      image: null,
      rating: 4.2,
    },
    {
      id: '11',
      name: 'Hong Kong Museum of History',
      category: 'Museums',
      description: 'A museum showcasing Hong Kong\'s history and culture.',
      image: null,
      rating: 4.5,
    },
    {
      id: '12',
      name: 'Hong Kong Park',
      category: 'Nature',
      description: 'A public park featuring an aviary, conservatory, and tai chi garden.',
      image: null,
      rating: 4.3,
    },
    {
      id: '13',
      name: 'Tim Ho Wan',
      category: 'Restaurants',
      description: 'Famous dim sum restaurant known for its affordable Michelin-starred food.',
      image: null,
      rating: 4.7,
    },
    {
      id: '14',
      name: 'Mong Kok Markets',
      category: 'Shopping',
      description: 'Various markets selling everything from electronics to clothing.',
      image: null,
      rating: 4.1,
    },
    {
      id: '15',
      name: 'Dragon\'s Back Hiking Trail',
      category: 'Nature',
      description: 'A popular hiking trail with stunning views of the coastline.',
      image: null,
      rating: 4.8,
    },
  ];

  // Filter places based on active category and search query
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
    
    setFilteredPlaces(results);
  }, [activeCategory, searchQuery]);

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
        <Text style={styles.placeCategory}>{item.category}</Text>
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
      
      {/* Search Bar */}
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
            Try changing your search or category filter
          </Text>
        </View>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 12,
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
  categoriesScroll: {
    maxHeight: 50,
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
    paddingBottom: 20,
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
});