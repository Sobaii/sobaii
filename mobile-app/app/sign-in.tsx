import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, useColorScheme, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Colors } from '@/constants/Colors';
import OauthButton from '@/components/auth/OauthButton';

export default function SignIn() {

    const { signIn, setActive, isLoaded } = useSignIn();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = useCallback(async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignIn = await signIn.create({
                identifier: email,
                password,
            });

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId });
                router.replace('/');
            } else {
                // See https://clerk.com/docs/custom-flows/error-handling 
                // for more info on error handling
                console.error(JSON.stringify(completeSignIn, null, 2));
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    }, [isLoaded, email, password])

    const colorScheme = useColorScheme()
    const styles = getStyles(colorScheme === "dark")

    return (
        <ThemedView style={styles.viewContainer}>
            <ThemedText type="title" style={{ marginVertical: 30 }}>Sobaii</ThemedText>
            <TextInput
                style={styles.input}
                value={email}
                placeholder='Email'
                placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                onChangeText={setEmail}
            />
            <TextInput
                secureTextEntry
                style={styles.input}
                value={password}
                placeholder='Password'
                placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                onChangeText={setPassword}
            />
            <TouchableOpacity onPress={handleSignIn} style={styles.button}>
                <Text style={styles.authText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.divider} />
            <OauthButton />
            <TouchableOpacity onPress={() => router.replace('/sign-up')} style={{ marginVertical: 10 }}>
                <Text style={{ ...styles.authText, textDecorationLine: 'underline' }}>
                    New user? Sign up instead
                </Text>
            </TouchableOpacity>
        </ThemedView>
    );
}

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.dark : Colors.light

    const styles = StyleSheet.create({
        viewContainer: {
            paddingTop: Constants.statusBarHeight,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
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
        destructiveButton: {
            width: '80%',
            backgroundColor: c.destructive,
            borderRadius: 50,
            marginVertical: 10,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'center'
        },
        destructiveText: {
            color: c.secondary,
            fontWeight: '500'
        },
        divider: {
            height: 1,
            width: '60%',
            backgroundColor: c.border,
            marginVertical: 30,
        },
        authText: {
            color: c.text,
            fontWeight: '500'
        }
    });
    return styles
}
