import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/AuthContext";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { MedicinesScreen } from "./src/screens/MedicinesScreen";
import { ScheduleScreen } from "./src/screens/ScheduleScreen";
import { MedicineFormScreen } from "./src/screens/MedicineFormScreen";
import { AlertsScreen } from "./src/screens/AlertsScreen";
import { RefillsScreen } from "./src/screens/RefillsScreen";
import { SafetyScreen } from "./src/screens/SafetyScreen";
import { VoiceOfflineScreen } from "./src/screens/VoiceOfflineScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Login" }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Sign up" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Medicine Companion" }}
            />
            <Stack.Screen
              name="Medicines"
              component={MedicinesScreen}
              options={{ title: "My Medicines" }}
            />
            <Stack.Screen
              name="AddMedicine"
              component={MedicineFormScreen}
              options={{ title: "Add medicine" }}
            />
            <Stack.Screen
              name="Schedule"
              component={ScheduleScreen}
              options={{ title: "AI Schedule" }}
            />
            <Stack.Screen
              name="Alerts"
              component={AlertsScreen}
              options={{ title: "Missed‑dose alerts" }}
            />
            <Stack.Screen
              name="Refills"
              component={RefillsScreen}
              options={{ title: "Refill reminders" }}
            />
            <Stack.Screen
              name="Safety"
              component={SafetyScreen}
              options={{ title: "Safety & caregiver lock" }}
            />
            <Stack.Screen
              name="VoiceOffline"
              component={VoiceOfflineScreen}
              options={{ title: "Voice & offline" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

