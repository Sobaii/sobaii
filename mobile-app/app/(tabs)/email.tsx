import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Constants from 'expo-constants';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { retrieveInboxes } from '@/lib/auth-service/callWrapper';
import { InboxItem } from '@/lib/stubs/auth-service/auth_service_pb';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function EmailScreen() {
    const { user } = useUser();
    const [inboxItemsList, setInboxItemsList] = useState<InboxItem.AsObject[]>([])

    useEffect(() => {
        async function handleRetrieveInboxes(userId: string) {
            const data = await retrieveInboxes(userId)
            if (!data) { return }
            setInboxItemsList(data.itemsList)
        }
        if (!user?.id) { return }
        handleRetrieveInboxes(user.id)
    }, [user])

    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme === 'dark');
    return (
        <ThemedView style={styles.viewContainer}>
            <View style={styles.headerContainer}>
                <ThemedText type='defaultSemiBold'>My Inboxes</ThemedText>
            </View>
            <ScrollView style={{ ...styles.viewContainer, padding: 32 }}>
                {inboxItemsList.map((inboxItem, key) => (
                    <View key={key} style={styles.itemContainer}>
                        <Ionicons name="logo-google" size={48} style={{ ...styles.itemDescription, marginRight: 10 }} />
                        <View style={{ flexDirection: 'column', width: '80%' }}>
                            <ThemedText numberOfLines={1} style={{ fontWeight: '500' }}>{inboxItem.emailAddress}</ThemedText>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                <Ionicons name='mail-outline' size={18} style={styles.itemDescription} />
                                <ThemedText style={{ fontSize: 12 }}>
                                    Connect
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </ThemedView>
    );
}

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        viewContainer: {
            paddingTop: Constants.statusBarHeight,
            flex: 1,
        },
        headerContainer: {
            padding: Constants.statusBarHeight / 2,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: c.border
        },
        itemContainer: {
            backgroundColor: c.secondary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 50
        },
        itemDescription: {
            color: c.text,
            fontWeight: '500'
        }
    });

    return styles
}
