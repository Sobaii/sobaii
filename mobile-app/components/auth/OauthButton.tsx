import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { router } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking"
import { Colors } from "@/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        // Warm up the android browser to improve UX
        // https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

const OauthButton = () => {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow({ redirectUrl: Linking.createURL("/", { scheme: "myapp" }) });

            if (createdSessionId) {
                await setActive!({ session: createdSessionId });
                router.replace('/');
            } else {
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    }, []);

    const colorScheme = useColorScheme()
    const styles = getStyles(colorScheme === "dark")

    return (
        <TouchableOpacity style={styles.authButton} onPress={onPress}>
            <Ionicons name="logo-google" size={18} style={styles.authText} />
            <Text style={styles.authText}>Sign in with Google</Text>
        </TouchableOpacity>
    );
};
export default OauthButton;

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.light : Colors.dark

    const styles = StyleSheet.create({
        authButton: {
            width: '80%',
            backgroundColor: c.background,
            borderRadius: 50,
            marginVertical: 10,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
        },
        authText: {
            color: c.text,
            fontWeight: '500'
        }
    });
    return styles
}
