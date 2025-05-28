import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";

const { height } = Dimensions.get("window");

// Define the types for the props
type ScreenProps = {
    onProceed?: () => void; // For the WelcomeScreen
    onSwitch?: () => void;  // For LoginScreen and SignUpScreen
};

const Profile: React.FC = () => {
    const [screen, setScreen] = useState<"welcome" | "login" | "signup">("welcome");

    return (
        <View style={styles.background}>
            {/* Always show WelcomeScreen */}
            <WelcomeScreen onProceed={() => setScreen("login")} />
            {/* Conditionally show Login or SignUp Popup */}
            {screen !== "welcome" && (
                <BlurView intensity={50} style={styles.welcomeBlur} tint="light">
            {screen === "login" && <LoginScreen onSwitch={() => setScreen("signup")} />}
            {screen === "signup" && <SignUpScreen onSwitch={() => setScreen("login")} />}
            </BlurView>
                )}
        </View>

);
};

const WelcomeScreen: React.FC<ScreenProps> = ({ onProceed }) => (
    <BlurView intensity={50} style={styles.welcomeBlur} tint="light">
        <View style={styles.centered}>
            <Text style={styles.welcomeTitle}>TravelEase</Text>
            <Image
                source={{
                    uri: "https://www.planetware.com/wpimages/2019/12/hong-kong-in-pictures-beautiful-places-to-photograph-junk.jpg",
                }}
                style={styles.roundedImage}
            />
            <Text style={styles.welcomeSubtitle}>Travel around the world 🌍</Text>
            <Text style={styles.welcomeSubtitle}>Design your Journey With Us</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={onProceed}>
                <Text style={styles.buttonText}>Explore</Text>
            </TouchableOpacity>
        </View>
    </BlurView>
);

const LoginScreen: React.FC<ScreenProps> = ({ onSwitch }) => (
    <View style={styles.popup}>
        <View style={styles.formCard}>
            <Text style={styles.title}>TravelEase</Text>
            <Text style={styles.subtitle}>Your Adventure Awaits</Text>
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ccc" />
            <TouchableOpacity>
                <Text style={styles.switchText}>Forgot Password? Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>or</Text>
            <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: "https://img.icons8.com/color/512/google-logo.png" }}
                        style={styles.socialIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: "https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png" }}
                        style={styles.socialIcon}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onSwitch}>
                <Text style={styles.switchText}>Don't Have An Account? Sign Up Now!</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const SignUpScreen: React.FC<ScreenProps> = ({ onSwitch }) => (
    <View style={styles.popup}>
    <View style={styles.formCard}>
        <Text style={styles.title}>Sign Up to Start Your Adventure</Text>
        <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#ccc" />
        <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#ccc" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ccc" secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#ccc" secureTextEntry />
        <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwitch}>
            <Text style={styles.switchText}>Already have an account? Login</Text>
        </TouchableOpacity>
        
    </View>
    </View>
);

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: -1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    roundedImage: {
        marginTop: 45,
        width: 350,
        height: 445,
        borderRadius: 54,
        marginBottom: 50,
    },
    welcomeTitle: {
        position: "absolute",
        top: 128,
        fontSize: 40,
        fontWeight: "bold",
        color: "#888",
        textAlign: "center",
        zIndex: 1,
    },
    welcomeSubtitle: {
        width: 350,
        fontSize: 22,
        paddingLeft: 12,
        color: "#666",
        marginBottom: 20,
        textAlign: "left",
    },
    exploreButton: {
        backgroundColor: "#007BFF",
        width: 350,
        paddingVertical: 22,
        paddingHorizontal: 28,
        borderRadius: 28,
        marginTop: 18,

    },

    formCard: {
        backgroundColor: "#fff",
        padding: 22,
        borderRadius: 15,
        width: 400,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    subtitle:{
      fontSize: 20,
    },
    input: {
        width: "100%",
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
    },
    continueButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 30,
        width: "100%",
        alignItems: "center",
        marginVertical: 20,
    },
    orText: {
        marginVertical: 15,
        fontSize: 18,
        color: "#999",
    },
    socialButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "82%",
        marginBottom: 20,
    },
    socialIcon: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    socialButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 8,
        backgroundColor: "#f1f1f1",
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    switchText: {
        color: "#007BFF",
        fontSize: 14,
        marginTop: 10,
        textAlign: "center",
    },
    popup: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "65%", // Adjust height as needed
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    welcomeBlur: {
        ...StyleSheet.absoluteFillObject, // Ensures the blur covers the full screen
        zIndex: -1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Profile;