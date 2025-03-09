import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { useColorScheme, StyleSheet, TextInput, Text, TouchableOpacity, View } from "react-native"
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import Toast from 'react-native-root-toast';

export default function AccountDetailsScreen() {

    const { user } = useUser();
    const fName = user?.firstName ?? ''
    const lName = user?.lastName ?? ''

    const [firstName, setFirstName] = useState<string | undefined>(user?.firstName ?? '');
    const [lastName, setLastName] = useState<string | undefined>(user?.lastName ?? '');
    const [primaryEmail, setPrimaryEmail] = useState('')

    const handleUpdateName = async () => {
        if (!user) {
            return
        }
        // TODO more name checking guards
        if (firstName === '' || lastName === '') {
            Toast.show('Name cannot be blank.', {
                duration: Toast.durations.SHORT,
                position: Constants.statusBarHeight + 20
            });
            return
        }
        try {
            await user.update({
                firstName: firstName,
                lastName: lastName,
            });
            Toast.show('Name successfully updated.', {
                duration: Toast.durations.SHORT,
                position: Constants.statusBarHeight + 20
            });
        } catch (error) {
            console.error(error);
        }
    };

    const colorScheme = useColorScheme()
    const styles = getStyles(colorScheme === 'dark')

    return (
        <>
            <Stack.Screen options={{ title: 'Identity Configuration' }} />
            <ThemedView style={styles.viewContainer}>
                <TextInput
                    placeholder="First Name"
                    placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                    value={firstName}
                    onChangeText={setFirstName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Last Name"
                    placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                    value={lastName}
                    onChangeText={setLastName}
                    style={styles.input}
                />
                <TouchableOpacity
                    onPress={handleUpdateName}
                    style={styles.button}
                >
                    <Text style={styles.actionText}>
                        Update Name
                    </Text>
                </TouchableOpacity>
            </ThemedView>
        </>
    )
}

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        viewContainer: {
            paddingTop: Constants.statusBarHeight,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        input: {
            width: '80%',
            margin: 10,
            borderWidth: 1,
            paddingLeft: 15,
            padding: 10,
            borderRadius: 5,
            borderColor: c.border,
            color: c.text
        },
        button: {
            width: '80%',
            backgroundColor: c.secondary,
            borderRadius: 50,
            marginVertical: 10,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'center'
        },
        divider: {
            height: 1,
            width: '60%',
            backgroundColor: c.border,
            marginVertical: 30,
        },
        actionText: {
            color: c.text,
            fontWeight: '500'
        }
    });

    return styles;
};