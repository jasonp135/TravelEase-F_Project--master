import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type SavedItem = {
    id: string;
    category: 'Plans' | 'Destinations' | 'Restaurants';
    title: string;
    description: string;
    image: string;
};

export default function SavedPage() {
    const [activeTab, setActiveTab] = useState<'Plans' | 'Destinations' | 'Restaurants'>('Plans');
    const tabs: Array<'Plans' | 'Destinations' | 'Restaurants'> = [
        'Plans',
        'Destinations',
        'Restaurants',
    ];
    const [searchTerm, setSearchTerm] = useState(''); // Search term state
    const [savedItems, setSavedItems] = useState<SavedItem[]>([
        {
            id: '1',
            category: 'Plans',
            title: 'Weekend Adventure in Lantau Island',
            description: 'Explore the Big Buddha, Ngong Ping Village, and hiking trails.',
            image:
                'https://upload.wikimedia.org/wikipedia/commons/4/4f/Tian_Tan_Buddha_02.jpg',
        },
        {
            id: '2',
            category: 'Destinations',
            title: 'Victoria Peak',
            description: 'Enjoy panoramic views of Hong Kong from the Peak.',
            image:
                'https://upload.wikimedia.org/wikipedia/commons/3/3c/Victoria_Peak_Skyline_Hong_Kong.jpg',
        },
        {
            id: '3',
            category: 'Restaurants',
            title: 'Tim Ho Wan',
            description: 'World-famous dim sum at an affordable price.',
            image:
                'https://upload.wikimedia.org/wikipedia/commons/3/38/Tim_Ho_Wan_dishes.jpg',
        },
        {
            id: '4',
            category: 'Destinations',
            title: 'Star Ferry',
            description: 'Experience the iconic ferry ride across Victoria Harbour.',
            image:
                'https://upload.wikimedia.org/wikipedia/commons/4/48/Star_Ferry_Hong_Kong.jpg',
        },
        {
            id: '5',
            category: 'Restaurants',
            title: 'Mak’s Noodle',
            description: 'Authentic wonton noodles in Central.',
            image:
                'https://upload.wikimedia.org/wikipedia/commons/4/4e/Mak%27s_Noodle_HK.jpg',
        },
    ]);

    // Filter saved items based on the active tab and search term
    const filteredItems = savedItems.filter((item) => {
        const matchesTab = item.category === activeTab;
        const matchesSearch = searchTerm
            ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
            : true; // If no search term, show all items
        return matchesTab && matchesSearch;
    });

    const renderItem = ({ item }: { item: SavedItem }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
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
                <TextInput
                    placeholder={`Search ${activeTab.toLowerCase()}`}
                    style={styles.searchInput}
                    placeholderTextColor="#aaa"
                    value={searchTerm}
                    onChangeText={setSearchTerm} // Update the search term state
                />
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
                    </View>
                )}
            </View>
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
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 40,
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#333',
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
});