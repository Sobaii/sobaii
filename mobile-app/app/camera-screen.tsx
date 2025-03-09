import React, { useEffect, useRef, useState } from 'react';
import { useExpenseStore } from '@/lib/store';
import { Text, StyleSheet, TouchableOpacity, Modal, useColorScheme, View, ActivityIndicator } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { extractFileData } from '@/lib/ocr-service/callWrapper';
import { MimeType } from '@/lib/stubs/ocr-service-dev/ocr_service_pb';
import Toast from 'react-native-root-toast';
import { useUser } from '@clerk/clerk-expo';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

export default function CameraExample() {
    const { user } = useUser();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const {
        fileSelection,
        setFileSelection,
        insertExpense
    } = useExpenseStore((state) => ({
        fileSelection: state.fileSelection,
        setFileSelection: state.setFileSelection,
        insertExpense: state.insertExpense
    }))

    useEffect(() => {
        (async () => {
            requestPermission()
        })();
    }, []);

    const handleFileUpload = async () => {
        if (!fileSelection || !user) {
            return
        }
        let blob: Blob = new Blob()
        setIsUploading(true)

        try {
            const photo = await cameraRef.current?.takePictureAsync({ base64: true })
            if (!photo) {
                // handle picture capture error
                setIsUploading(false)
                setFileSelection(null)
                router.back()
                return
            }
            const response = await fetch(photo.uri);
            blob = await response.blob();
        } catch (error) {
            setIsUploading(false)
            setFileSelection(null)
            router.back()
            return
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);

            // Perform extractFileData
            if (!fileSelection.folderSelected) {
                setIsUploading(false)
                setFileSelection(null)
                router.back()
                return
            }
            try {
                const data = await extractFileData(user.emailAddresses[0].emailAddress, fileSelection.folderSelected, uint8Array, MimeType.IMAGE_PNG);
                if (!data?.file) {
                    setIsUploading(false)
                    setFileSelection(null)
                    router.back()
                    return
                }
                Toast.show('File data successfully extracted.', {
                    duration: Toast.durations.SHORT,
                    position: Constants.statusBarHeight + 20
                });
                insertExpense(data.file)

            } catch (error) {
                console.error('Error extracting file data:', error);
            }
            setIsUploading(false)
            setFileSelection(null)
            router.back()
        };

        reader.readAsArrayBuffer(blob);
    }

    const colorScheme = useColorScheme();
    const c = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = getStyles(colorScheme === 'dark');

    if (!permission) {
        return (
            <ThemedView style={styles.screenContainer}>
                <Text>Loading Camera...</Text>
            </ThemedView>
        );
    } else if (!permission.granted) {
        return (
            <ThemedView style={styles.screenContainer}>
                <Text>No access to camera</Text>
            </ThemedView>
        );
    } else {
        return (
            <ThemedView style={styles.screenContainer}>
                <CameraView ref={cameraRef} style={styles.camera}>
                    <ThemedView style={styles.navContainer}>
                        <TouchableOpacity onPress={() => {
                            if (!fileSelection) {
                                console.error('state error')
                                return
                            }
                            setFileSelection({ ...fileSelection, isSelectingFolder: true, folderSelected: undefined })
                            router.back()
                        }}>
                            <Ionicons name="arrow-back-outline" size={64} color={'#fff'} />
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedView style={styles.actionContainer}>
                        <TouchableOpacity onPress={() => {
                            handleFileUpload()
                        }}>
                            <Ionicons name="radio-button-on-outline" size={96} color={'#fff'} />
                        </TouchableOpacity>
                    </ThemedView>
                </CameraView>
                <Modal
                    transparent={true}
                    animationType='slide'
                    visible={isUploading}
                >
                    <View style={styles.modalContainer}>
                        <ThemedView style={{
                            ...styles.modalView, flex: 1, alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12
                        }}>
                            <ActivityIndicator size={'large'} color={c.text} />
                            <ThemedText type='defaultSemiBold'>Uploading photo</ThemedText>
                        </ThemedView>
                    </View>
                </Modal>
            </ThemedView>
        );
    }
}

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        screenContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        camera: {
            flex: 1,
        },
        actionContainer: {
            position: 'absolute',
            bottom: Constants.statusBarHeight,
            alignSelf: 'center',
            backgroundColor: 'transparent'
        },
        navContainer: {
            position: 'absolute',
            top: Constants.statusBarHeight,
            alignSelf: 'flex-start',
            backgroundColor: 'transparent'
        },
        modalContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalView: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '60%',
            backgroundColor: c.background,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 18,
            shadowColor: c.text,
            elevation: 6,
        },
    });

    return styles
}
