import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

type SavedItem = {
    id: string;
    category: 'Plans' | 'Destinations' | 'Restaurants';
    title: string;
    description: string;
    image: string;
    price: number;
    rating: number;
    tags: string[];
};

type FilterOptions = {
    budget: number;
    rating: number | null;
    tags: string[];
};

export default function SavedPage() {
    const [activeTab, setActiveTab] = useState<'Plans' | 'Destinations' | 'Restaurants'>('Plans');
    const tabs: Array<'Plans' | 'Destinations' | 'Restaurants'> = [
        'Plans',
        'Destinations',
        'Restaurants',
    ];
    const [searchTerm, setSearchTerm] = useState('');
    
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
    
    // Available tags for filtering
    const availableTags = [
        'Ocean View', 'Luxury', 'Night View', 'Family Friendly', 'Hotel Dining', 
        'Romantic', 'Outdoor', 'Indoor', 'Historical', 'Cultural', 'Shopping', 
        'Food', 'Art', 'Photography', 'Hiking', 'Free Entry', 'Paid Entry'
    ];

    const [savedItems, setSavedItems] = useState<SavedItem[]>([
        {
            id: '1',
            category: 'Plans',
            title: 'Weekend Adventure in Lantau Island',
            description: 'Explore the Big Buddha, Ngong Ping Village, and hiking trails.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Tian_Tan_Buddha_02.jpg',
            price: 500,
            rating: 4.8,
            tags: ['Hiking', 'Cultural', 'Outdoor', 'Photography'],
        },
        {
            id: '2',
            category: 'Destinations',
            title: 'Victoria Peak',
            description: 'Enjoy panoramic views of Hong Kong from the Peak.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Victoria_Peak_Skyline_Hong_Kong.jpg',
            price: 150,
            rating: 4.9,
            tags: ['Night View', 'Photography', 'Outdoor', 'Paid Entry'],
        },
        {
            id: '3',
            category: 'Restaurants',
            title: 'Tim Ho Wan',
            description: 'World-famous dim sum at an affordable price.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Tim_Ho_Wan_dishes.jpg',
            price: 200,
            rating: 4.7,
            tags: ['Food', 'Indoor', 'Cultural'],
        },
        {
            id: '4',
            category: 'Destinations',
            title: 'Star Ferry',
            description: 'Experience the iconic ferry ride across Victoria Harbour.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Star_Ferry_Hong_Kong.jpg',
            price: 10,
            rating: 4.5,
            tags: ['Ocean View', 'Transportation', 'Photography'],
        },
        {
            id: '5',
            category: 'Restaurants',
            title: 'Mak\'s Noodle',
            description: 'Authentic wonton noodles in Central.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Mak%27s_Noodle_HK.jpg',
            price: 100,
            rating: 4.3,
            tags: ['Food', 'Indoor', 'Cultural'],
        },
    ]);

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

    // Filter saved items based on all criteria
    const filteredItems = savedItems.filter((item) => {
        // Filter by tab
        const matchesTab = item.category === activeTab;
        
        // Filter by search term
        const matchesSearch = searchTerm
            ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        
        // Filter by budget
        const matchesBudget = filterOptions.budget >= 1000 || item.price <= filterOptions.budget;
        
        // Filter by rating
        let matchesRating = true;
        if (filterOptions.rating !== null) {
            if (filterOptions.rating === 1) {
                matchesRating = item.rating < 2;
            } else if (filterOptions.rating === 5) {
                matchesRating = item.rating > 4;
            } else {
                matchesRating = Math.floor(item.rating) === filterOptions.rating;
            }
        }
        
        // Filter by tags
        const matchesTags = filterOptions.tags.length === 0 || 
            filterOptions.tags.some(tag => item.tags.includes(tag));
        
        return matchesTab && matchesSearch && matchesBudget && matchesRating && matchesTags;
    });

    const renderItem = ({ item }: { item: SavedItem }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
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
                <Text style={styles.priceText}>
                    {item.price === 0 ? 'Free' : `HK$${item.price}`}
                </Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>View More</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="trash-2" size={20} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saved</Text>
                <View style={styles.searchRow}>
                    <TextInput
                        placeholder={`Search ${activeTab.toLowerCase()}`}
                        style={styles.searchInput}
                        placeholderTextColor="#aaa"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
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
                        <Feather 
                            name="sliders" 
                            size={20} 
                            color={(filterOptions.budget < 1000 || filterOptions.rating !== null || filterOptions.tags.length > 0) ? "#fff" : "#fff"} 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Saved Items */}
            <View style={styles.listContainer}>
                {filteredItems.length > 0 ? (
                    <FlatList
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Feather name="bookmark" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>
                            No saved {activeTab.toLowerCase()} found.
                        </Text>
                        <Text style={styles.emptySubText}>
                            Try changing your filters or search term.
                        </Text>
                    </View>
                )}
            </View>
            
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
                                    { value: 1, label: '< 2 stars' },
                                    { value: 2, label: '2 stars' },
                                    { value: 3, label: '3 stars' },
                                    { value: 4, label: '4 stars' },
                                    { value: 5, label: '> 4 stars' }
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
    },
    header: {
        padding: 20,
        backgroundColor: '#6C63FF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        marginTop: 40,
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 40,
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#333',
        marginRight: 10,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeFilterButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#6C63FF',
    },
    tabText: {
        fontSize: 14,
        color: '#888',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    cardContent: {
        flex: 1,
        padding: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666',
    },
    priceText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6C63FF',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewMore: {
        fontSize: 14,
        color: '#6C63FF',
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#aaa',
        marginTop: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 5,
        textAlign: 'center',
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