import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Colors } from '@/constants/Colors';
import OauthButton from '@/components/auth/OauthButton';

export default function SignIn() {

    const { isLoaded, signUp, setActive } = useSignUp();
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')

    const handleSignUp = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                firstName: fname,
                lastName: lname,
                emailAddress: email,
                password: password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true)
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const handleVerifyEmail = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const colorScheme = useColorScheme()
    const styles = getStyles(colorScheme === "dark")

    return (
        <ThemedView style={styles.viewContainer}>
            {!pendingVerification ? (
                <>
                    <ThemedText type="title" style={{ marginVertical: 30 }}>Sobaii</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={fname}
                        placeholder='First Name'
                        placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                        onChangeText={setFname}
                    />
                    <TextInput
                        style={styles.input}
                        value={lname}
                        placeholder='Last Name'
                        placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                        onChangeText={setLname}
                    />
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
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        value={confirmPassword}
                        placeholder='Confirm Password'
                        placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                        <Text style={styles.authText}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />
                    <OauthButton />
                    <TouchableOpacity onPress={() => router.replace('/sign-in')} style={{ marginVertical: 10 }}>
                        <Text style={{ ...styles.authText, textDecorationLine: 'underline' }}>
                            Existing user? Sign in instead
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Ionicons name="mail-unread-outline" size={60} style={styles.authText} />
                    <ThemedText type='subtitle'>Verify your email</ThemedText>
                    <ThemedText type='default' style={{ width: '80%', textAlign: 'center', marginBottom: 30 }}>Enter the code we sent to your email address to verify your new account.</ThemedText>

                    <TextInput
                        value={code}
                        style={styles.input}
                        placeholder="Code..."
                        placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                        onChangeText={setCode}
                    />
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={handleVerifyEmail} style={styles.button}>
                        <Text style={styles.authText}>Verify Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPendingVerification(false)} style={styles.destructiveButton}>
                        <Text style={styles.destructiveText}>Cancel Sign up</Text>
                    </TouchableOpacity>
                </>
            )}
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
