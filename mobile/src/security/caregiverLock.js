import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

const PIN_KEY = "caregiver_pin_v1";
const BIOMETRIC_KEY = "caregiver_biometric_enabled_v1";

export async function getCaregiverSettings() {
  const [pin, biometricRaw] = await Promise.all([
    SecureStore.getItemAsync(PIN_KEY),
    SecureStore.getItemAsync(BIOMETRIC_KEY)
  ]);

  return {
    hasPin: Boolean(pin),
    biometricEnabled: biometricRaw === "1"
  };
}

export async function setCaregiverPin(pin) {
  if (!pin) {
    await SecureStore.deleteItemAsync(PIN_KEY);
    return;
  }
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function setBiometricEnabled(enabled) {
  await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? "1" : "0");
}

export async function isBiometricAvailable() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && enrolled;
}

export async function authenticateCaregiver(reason = "Confirm as caregiver") {
  const { hasPin, biometricEnabled } = await getCaregiverSettings();

  if (!hasPin && !biometricEnabled) {
    // Nothing configured, treat as unlocked for this demo.
    return { success: true };
  }

  // Prefer biometrics when enabled & available.
  if (biometricEnabled && (await isBiometricAvailable())) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason
    });
    return { success: result.success };
  }

  // For simplicity in this demo, if only PIN is set we'll just warn;
  // keeping a full PIN entry screen is beyond current scope.
  return {
    success: false,
    reason: "PIN is set but PIN unlock UI is not implemented in this demo."
  };
}

