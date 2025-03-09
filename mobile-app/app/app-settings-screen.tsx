import { ThemedView } from "@/components/ThemedView";
import { useColorScheme, StyleSheet, Switch, View, Text, Appearance } from "react-native";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AppSettingsScreen() {

    const colorScheme = useColorScheme()
    const isDarkMode = colorScheme === "dark";
    const c = isDarkMode ? Colors.dark : Colors.light;
    const styles = getStyles(isDarkMode);

    return (
        <>
            <Stack.Screen options={{ title: 'App Settings' }} />
            <ThemedView style={styles.viewContainer}>
                <View style={styles.itemContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="moon-outline" size={24} style={{ ...styles.actionText, marginRight: 10 }} />
                        <Text style={styles.actionText}>Dark mode</Text>
                    </View>
                    <Switch
                        value={isDarkMode}
                        trackColor={{ false: c.primary, true: c.secondary }}
                        thumbColor={c.border}
                        onValueChange={() =>
                            Appearance.setColorScheme(isDarkMode ? "light" : "dark")
                        }
                    />
                </View>
            </ThemedView>
        </>
    )
}

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        viewContainer: {
            paddingTop: Constants.statusBarHeight,
            width: '80%',
            alignSelf: 'center'
        },
        itemContainer: {
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: c.border
        },
        actionText: {
            color: c.text,
            fontWeight: '500'
        }
    });

    return styles;
};
