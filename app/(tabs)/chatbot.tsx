import React, { useState, useEffect } from "react";
import Voice from "react-native-voice";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    GestureResponderEvent,
    RefreshControl,
} from "react-native";
// import LoadingOverlay from "../LoadingOverlay";
import useLoadingState from "../useLoadingState";
import { Ionicons } from "@expo/vector-icons";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
};

const chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Hi there! How can I assist you today?", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const [isVoiceMode, setIsVoiceMode] = useState(true); // Tracks whether it's in voice mode or keyboard mode
    const [refreshing, setRefreshing] = useState(false);
    const { isLoading, isError, errorMessage, startLoading, setError, reset } = useLoadingState();

    // Load initial data
    useEffect(() => {
        loadMessages();
    }, []);
    
    // Load messages function
    const loadMessages = async () => {
        try {
            startLoading();
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            reset();
        } catch (error) {
            setError('Failed to load messages');
        }
    };
    
    // Handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Simulate refreshing data
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessages([
                { id: "1", text: "Hi there! How can I assist you today?", sender: "bot" },
            ]);
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            setError('Failed to refresh');
        }
    };

    // Handle sending a message
    const handleSend = () => {
        if (input.trim() === "") return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Simulate loading state for response
        startLoading();
        
        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now().toString(),
                text: "Thank you for your message! Let me help you with that.",
                sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            reset();
        }, 1000);

        setInput("");
    };

    // Simulate voice message
    const handleVoiceMessage = (event: GestureResponderEvent) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: "🎤 Voice message sent (simulate speech recognition)",
            sender: "user",
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now().toString(),
                text: "I received your voice message! Let me help you with that.",
                sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }, 1000);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === "user";
        return (
            <View
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessage : styles.botMessage,
                ]}
            >
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat with Assistant</Text>
                <Text style={styles.headerTitle}>Let me guild your trip</Text>
            </View>

            {/* Chat Area */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.chatArea}
                contentContainerStyle={{ paddingBottom: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#6C63FF"]}
                        tintColor="#6C63FF"
                    />
                }
            />
            
            {/* Loading Overlay
            <LoadingOverlay 
                isLoading={isLoading && !refreshing} 
                isError={isError} 
                errorMessage={errorMessage}
                onRetry={loadMessages}
            /> */}

            {/* Input Area */}
            <View style={styles.inputContainer}>
                {/* Button to toggle between voice and keyboard */}
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setIsVoiceMode(!isVoiceMode)}
                >
                    <Ionicons
                        name={isVoiceMode ? "chatbubble-ellipses-outline" : "mic-outline"}
                        size={24}
                        color="#007bff"
                    />
                </TouchableOpacity>

                {/* Conditional rendering based on mode */}
                {isVoiceMode ? (
                    <TouchableOpacity
                        style={styles.voiceButton}
                        onPressIn={handleVoiceMessage}
                    >
                        <Text style={styles.voiceButtonText}>Hold to Talk</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type your message..."
                            placeholderTextColor="#999"
                            value={input}
                            onChangeText={setInput}
                        />
                        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                            <Ionicons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1b1b1d",
    },
    header: {
        marginTop: 50,
        flexDirection: "column",
        padding: 16,
        backgroundColor: "#1b1b1d",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 2,
        marginBottom: 8,
    },
    chatArea: {
        flex: 1,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingHorizontal: 16,
        backgroundColor: "#f9f9f9",
    },
    messageContainer: {
        marginTop: 8,
        maxWidth: "75%",
        padding: 12,
        borderRadius: 20,
        marginVertical: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#007bff",
        color: "#fff",
    },
    botMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#505051",
        color: "#333",
    },
    messageText: {
        fontSize: 16,
        color: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#eaeaea",
    },
    toggleButton: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#eaeaea",
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
        color: "#333",
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 50,
    },
    voiceButton: {
        flex: 1,
        height: 38,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#007bff",
        borderRadius: 12,
    },
    voiceButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default chatbot;