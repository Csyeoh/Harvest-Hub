import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Signup = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for Harvest Hub</Text>
      <Text style={styles.text}>This is a placeholder signup screen.</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backButton}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Signup;
