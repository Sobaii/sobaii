import { Modal, StyleSheet, TouchableOpacity, useColorScheme, Text, View, ScrollView, ActivityIndicator, TextInput, Image, Keyboard } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import * as WebBrowser from 'expo-web-browser'
import * as DocumentPicker from 'expo-document-picker';
import Constants from 'expo-constants';
import { useExpenseStore } from '@/lib/store';
import { computeAvgExpenseConfidence } from '@/lib/utils';
import { Link, router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { createFolder, extractFileData, retrieveExpenses, retrieveFolders, sortExpensesByFieldSimilarity } from '@/lib/ocr-service/callWrapper';
import { MimeType } from '@/lib/stubs/ocr-service-dev/ocr_service_pb';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import Toast from 'react-native-root-toast';

export default function ExpensesScreen() {
    const { user } = useUser();

    const {
        expenses,
        setExpenses,
        insertExpense,
        updateSelectedExpense,
        fileSelection,
        expensesFiltration,
        setFileSelection,
        setExpensesFiltration,
        folders,
        setFolders,
        updateFolders
    } = useExpenseStore((state) => ({
        expenses: state.expenses,
        setExpenses: state.setExpenses,
        insertExpense: state.insertExpense,
        updateSelectedExpense: state.updateSelectedExpense,
        fileSelection: state.fileSelection,
        expensesFiltration: state.expensesFiltration,
        setExpensesFiltration: state.setExpensesFiltration,
        setFileSelection: state.setFileSelection,
        folders: state.folders,
        setFolders: state.setFolders,
        updateFolders: state.updateFolders
    }));

    const [isUploading, setIsUploading] = useState(false)
    const [newFolderCreation, setNewFolderCreation] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [fieldSearchInput, setFieldSearchInput] = useState('');

    const handleCreateFolder = async () => {
        Keyboard.dismiss()
        if (!user?.firstName || !user.lastName || !user.id) {
            return
        }
        try {
            setIsUploading(true)
            const data = await createFolder(user.id, folderName)

            if (!data) {
                Toast.show('Something went wrong.', {
                    duration: Toast.durations.SHORT,
                    position: Constants.statusBarHeight + 20
                });
                setIsUploading(false)
                return
            }
            Toast.show(data.actionDescription, {
                duration: Toast.durations.SHORT,
                position: Constants.statusBarHeight + 20
            });

            if (!data.folderCreated) {
                setIsUploading(false)
                return
            }

            updateFolders(data.folderName)
            setIsUploading(false)
            setNewFolderCreation(false)
        } catch (error) {
            setIsUploading(false)
            console.error('Error creating folder:', error);
        }
    }

    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, [])

    useEffect(() => {

        const handleFileUpload = async () => {
            if (!fileSelection || !user?.id) { return }
            const res = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/jpeg", "image/png"] });
            if (res.canceled) {
                setFileSelection({ ...fileSelection, isSelectingFolder: true, folderSelected: undefined })
                return;
            }

            let mime: MimeType
            switch (res.assets[0].mimeType) {
                case "application/pdf":
                    mime = MimeType.APPLICATION_PDF
                    break
                case "image/jpeg":
                    mime = MimeType.IMAGE_JPEG
                    break
                case "image/png":
                    mime = MimeType.IMAGE_PNG
                    break
                default:
                    return
            }

            try {
                setIsUploading(true)
                // Read the file content as Uint8Array using FileReader
                const response = await fetch(res.assets[0].uri);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onloadend = async () => {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // Perform extractFileData
                    if (!fileSelection.folderSelected) { return }
                    try {
                        const data = await extractFileData(user.id, fileSelection.folderSelected, uint8Array, mime);
                        if (!data?.file) {
                            return
                        }
                        Toast.show('File data successfully extracted.', {
                            duration: Toast.durations.SHORT,
                            position: Constants.statusBarHeight + 20
                        });

                        setIsUploading(false)
                        console.log(data.file)
                        insertExpense(data.file)

                    } catch (error) {
                        setIsUploading(false)
                        console.error('Error extracting file data:', error);
                    }
                };

                reader.readAsArrayBuffer(blob);
            } catch (error) {
                setIsUploading(false)
                console.error('Error reading file:', error);
            }
        };

        console.log(fileSelection)
        if (!fileSelection?.folderSelected) {
            return
        }
        if (fileSelection.fileOrigin === 'camera') {
            router.push('/camera-screen')
        }
        if (fileSelection.fileOrigin === 'files') {
            handleFileUpload()
        }

    }, [fileSelection])

    useEffect(() => {
        async function handleRetrieveFolders(userId: string) {
            const data = await retrieveFolders(userId);
            if (!data) { return }
            setFolders(data)
        }
        async function handleRetrieveExpenses(userId: string) {
            const data = await retrieveExpenses(userId);
            if (!data?.expenses) {
                Toast.show('Error retrieving expenses.', {
                    duration: Toast.durations.SHORT,
                    position: Constants.statusBarHeight + 20
                });
                return;
            }
            setExpenses(data.expenses?.infoList);
        }
        if (!user?.id) {
            return
        }
        handleRetrieveFolders(user.id);
        handleRetrieveExpenses(user.id);
    }, [user?.id]);

    useEffect(() => {
        async function handleFieldSearch(userId: string, fieldType: string, query: string) {
            const data = await sortExpensesByFieldSimilarity(userId, fieldType, query)
            if (!data?.expenses) {
                Toast.show('Error retrieving expenses.', {
                    duration: Toast.durations.SHORT,
                    position: Constants.statusBarHeight + 20
                });
                return;
            }
            setExpenses(data.expenses?.infoList);
        }
        async function handleRetrieveExpenses(userId: string) {
            const data = await retrieveExpenses(userId);
            if (!data?.expenses) {
                Toast.show('Error retrieving expenses.', {
                    duration: Toast.durations.SHORT,
                    position: Constants.statusBarHeight + 20
                });
                return;
            }
            setExpenses(data.expenses?.infoList);
        }
        const delayDebounceFn = setTimeout(() => {
            if (!user?.id) {
                return
            }
            if (fieldSearchInput) {
                handleFieldSearch(user.id, "VENDOR_NAME", fieldSearchInput)
            } else {
                handleRetrieveExpenses(user.id);
            }
            setExpensesFiltration({ ...expensesFiltration, isFilterActive: (fieldSearchInput) ? true : false })
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [fieldSearchInput])

    const colorScheme = useColorScheme();
    const c = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = getStyles(colorScheme === 'dark');

    return (
        <ThemedView style={styles.viewContainer}>
            <View style={styles.headerContainer}>
                <ThemedText type='defaultSemiBold'>My Expenses</ThemedText>
            </View>
            {expenses.length !== 0 ? (
                <ScrollView style={styles.scrollContainer}>
                    {expenses.filter((expense) => expense.data).map((expense, key) => (
                        <View key={key} style={{ ...styles.itemContainer, marginBottom: 6 }}>
                            <View style={styles.imageContainer}>

                                {/**render expense snapshot here */}
                                {expense.data!.previewUrl !== "" ? (
                                    <Image style={{ width: 120, height: 168, zIndex: 1 }} source={{
                                        uri: expense.data!.previewUrl
                                    }} />
                                ) : null}
                                <Ionicons name="document-text-outline" size={72} style={{ ...styles.actionText, color: c.background, position: 'absolute', zIndex: 0 }} />

                                <Link href="/expense-manager-screen" asChild>
                                    <TouchableOpacity
                                        onPress={() => updateSelectedExpense(expense)}
                                        style={{
                                            ...styles.floatingButton,
                                            position: 'absolute',
                                            left: 12,
                                            top: 12,
                                            zIndex: 2
                                        }}
                                    >
                                        <Ionicons name="open-outline" size={24} style={styles.actionText} />
                                    </TouchableOpacity>
                                </Link>
                                <TouchableOpacity
                                    onPress={async () => {
                                        await WebBrowser.openBrowserAsync(expense.data!.objectUrl);
                                    }}
                                    style={{
                                        ...styles.floatingButton,
                                        position: 'absolute',
                                        left: 12,
                                        bottom: 12,
                                        zIndex: 2
                                    }}
                                >
                                    <Ionicons name="cloud-download-outline" size={24} style={styles.actionText} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ padding: 12, paddingLeft: 0, flexDirection: 'column', justifyContent: 'space-between' }}>
                                <View>
                                    <ThemedText numberOfLines={1} style={{ fontSize: 12 }}>{expense.data!.vendorName?.text}</ThemedText>
                                    <ThemedText>{expense.data!.total?.text}</ThemedText>
                                </View>
                                <View style={{ gap: 6 }}>
                                    <View style={{ ...styles.badge, alignSelf: 'flex-start' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="folder-outline" size={16} style={{ ...styles.actionText, marginRight: 6 }} />
                                            <ThemedText style={{ fontSize: 12 }}>
                                                {expense.folderName}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={{ ...styles.badge, alignSelf: 'flex-start' }}>
                                        <ThemedText style={{ fontSize: 12 }}>Confidence: {computeAvgExpenseConfidence(expense)}%</ThemedText>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                position: 'absolute',
                                right: 12,
                                top: 12
                            }}>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <ThemedView style={styles.emptyViewContainer}>
                    <View>
                        <Ionicons name="file-tray-outline" size={72} style={{ ...styles.actionText, alignSelf: 'center' }} />
                        <ThemedText type='defaultSemiBold'>Start by uploading an expense.</ThemedText>
                    </View>
                </ThemedView>
            )}
            <ThemedView style={styles.floatingContainer}>
                {!isUploading ? (
                    <>
                        <TouchableOpacity
                            style={styles.floatingButton}
                            onPress={() => setFileSelection({
                                isSelectingFolder: true,
                                fileOrigin: 'camera'
                            })}
                        >
                            <Ionicons name="camera-outline" size={32} style={styles.actionText} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setFileSelection({
                                isSelectingFolder: true,
                                fileOrigin: 'files'
                            })}
                            style={styles.floatingButton}
                        >
                            <Ionicons name="phone-portrait-outline" size={32} style={styles.actionText} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.floatingButton}>
                        <ActivityIndicator size="small" color={c.text} style={{ padding: 6 }} />
                    </View>
                )}
                <TouchableOpacity
                    style={{ ...styles.floatingButton, backgroundColor: (expensesFiltration.isFilterActive) ? c.primary : c.secondary }}
                    onPress={() => { setExpensesFiltration({ ...expensesFiltration, isFilterOptionsOpen: true }) }}
                >
                    <Ionicons name="filter-outline" size={32} style={{ ...styles.actionText, color: (expensesFiltration.isFilterActive) ? c.background : c.text }} />
                </TouchableOpacity>
            </ThemedView>
            {fileSelection ? (
                <>
                    <Modal
                        transparent={true}
                        animationType='slide'
                        visible={fileSelection.isSelectingFolder}
                        onRequestClose={() => {
                            setFileSelection(null);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <ThemedView style={styles.modalView}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 12
                                }}>
                                    <ThemedText type='defaultSemiBold'>
                                        Select a folder to store the expense
                                    </ThemedText>
                                    <TouchableOpacity
                                        onPress={() => setFileSelection(null)}>
                                        <Ionicons name='chevron-down-circle-outline' size={24} style={styles.actionText} />
                                    </TouchableOpacity>
                                </View>
                                {folders.length !== 0 ? (
                                    <>
                                        <ScrollView style={styles.scrollContainer}>
                                            {folders.map((folderName, key) => (
                                                <TouchableOpacity
                                                    key={key}
                                                    onPress={async () => {
                                                        setFileSelection({ ...fileSelection, isSelectingFolder: false, folderSelected: folderName })
                                                    }}
                                                    style={{ ...styles.itemContainer, marginBottom: 6, padding: 12, alignItems: 'center' }}
                                                >
                                                    <Ionicons name="folder-outline" size={24} color={c.text} />
                                                    <Text numberOfLines={1} style={{ color: c.text, fontWeight: '500' }}>{folderName}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        <View style={styles.floatingContainer}>
                                            <TouchableOpacity onPress={() => setNewFolderCreation(true)} style={styles.floatingButton}>
                                                <Ionicons name="add-outline" size={32} style={styles.actionText} />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 12,
                                    }}>
                                        <Ionicons name="folder-outline" size={72} style={{ color: c.border }} />
                                        <TouchableOpacity onPress={() => setNewFolderCreation(true)} style={styles.primaryActionContainer}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name="folder-outline" size={24} style={{ color: c.text, marginRight: 10 }} />
                                                <Text style={{ color: c.text, fontWeight: '500' }}>Create new folder</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ThemedView>
                        </View>
                    </Modal>
                </>
            ) : null}
            <Modal
                transparent={true}
                animationType='slide'
                visible={newFolderCreation}
                onRequestClose={() => {
                    setNewFolderCreation(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <ThemedView style={{ ...styles.modalView, height: "60%" }}>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12,
                        }}>
                            <ThemedText type='defaultSemiBold'>Specify folder name</ThemedText>
                            <TextInput
                                placeholder='Folder name must be unique'
                                placeholderTextColor={colorScheme === "dark" ? '#FFF' : '#6b7280'}
                                value={folderName}
                                onChangeText={setFolderName}
                                style={styles.input}
                            />
                            {isUploading ? (
                                <View style={{ ...styles.secondaryActionContainer, backgroundColor: c.text }}>
                                    <ActivityIndicator color={c.background} style={{ marginRight: 12 }} />
                                    <Text style={{ color: c.background, fontWeight: '500' }}>Creating folder...</Text>
                                </View>
                            ) : (
                                <>
                                    <TouchableOpacity style={{ ...styles.secondaryActionContainer, backgroundColor: c.text }} onPress={handleCreateFolder}>
                                        <Text style={{ color: c.background, fontWeight: '500' }}>Create new folder</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.secondaryActionContainer} onPress={() => setNewFolderCreation(false)}>
                                        <Text style={{ color: c.text, fontWeight: '500' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </ThemedView>
                </View>
            </Modal>
            <Modal
                transparent={true}
                statusBarTranslucent={true}
                animationType='slide'
                visible={expensesFiltration.isFilterOptionsOpen}
                onRequestClose={() => {
                    setExpensesFiltration({ ...expensesFiltration, isFilterOptionsOpen: true })
                }}
            >
                <View style={styles.modalContainer}>
                    <ThemedView style={styles.modalView}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12
                        }}>
                            {/** will be an option to toggle between sorting and filtering expenses */}
                            <ThemedText type='defaultSemiBold'>
                                Sort expenses
                            </ThemedText>
                            <TouchableOpacity
                                onPress={() => setExpensesFiltration({ ...expensesFiltration, isFilterOptionsOpen: false })}>
                                <Ionicons name='chevron-down-circle-outline' size={24} style={styles.actionText} />
                            </TouchableOpacity>
                        </View>
                        <ThemedText>
                            By expense field similarity
                        </ThemedText>
                        <TextInput
                            value={fieldSearchInput}
                            onChangeText={setFieldSearchInput}
                            style={styles.input}
                        />
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
}

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        viewContainer: {
            paddingTop: Constants.statusBarHeight,
            flex: 1
        },
        headerContainer: {
            padding: Constants.statusBarHeight / 2,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: c.border
        },
        scrollContainer: {
            flex: 1,
            gap: 12,
            padding: 6
        },
        itemContainer: {
            borderRadius: 5,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: c.border,
            flexDirection: 'row',
            gap: 12
        },
        imageContainer: {
            backgroundColor: c.secondary,
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 168,
        },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: c.secondary,
            paddingHorizontal: 12,
            borderRadius: 50,
        },
        floatingContainer: {
            backgroundColor: 'transparent',
            position: "absolute",
            right: Constants.statusBarHeight,
            bottom: Constants.statusBarHeight,
            zIndex: 100,
            gap: Constants.statusBarHeight
        },
        floatingButton: {
            backgroundColor: c.secondary,
            borderRadius: 50,
            padding: 12,
            shadowColor: "#000000",
            elevation: 3,
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
        primaryActionContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: c.border
        },
        secondaryActionContainer: {
            backgroundColor: c.secondary,
            borderRadius: 50,
            paddingVertical: 12,
            paddingHorizontal: 24,
            flexDirection: 'row',
            justifyContent: 'center'
        },
        actionText: {
            color: c.text,
        },
        emptyViewContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    return styles;
};
