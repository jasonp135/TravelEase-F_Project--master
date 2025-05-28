import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const DestinationDetail = () => {
    const { id } = useLocalSearchParams(); // Retrieve the id from the route
    const router = useRouter(); // Initialize the router for navigation

    const destinations = {
        "1": {
            name: "Victoria Peak",
            description: "Experience the breathtaking views of Hong Kong's skyline.",
            image: require("../images/VictoriaPeak1.jpeg"),
        },
        "2": {
            name: "Tsim Sha Tsui",
            description: "A vibrant district with shopping, dining, and cultural attractions.",
            image: require("../images/TsimShaTsui1.jpeg"),
        },
        "3": {
            name: "Big Buddha",
            description: "Visit the iconic Big Buddha statue and its serene surroundings.",
            image: require("../images/BigBuddha1.jpg"),
        },
    };

    const destination = destinations[id as keyof typeof destinations];

    if (!destination) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Destination not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <ScrollView>
                <Image source={destination.image} style={styles.image} />
                <Text style={styles.title}>{destination.name}</Text>
                <Text style={styles.description}>{destination.description}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 16,
    },
    backButton: {
        marginTop: 50,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
        alignSelf: "flex-start",
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
    },
    image: {
        width: "100%",
        height: 288,
        borderRadius: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
    },
    errorText: {
        fontSize: 18,
        color: "#ff4d4f",
    },
});

export default DestinationDetail;