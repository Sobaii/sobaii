import { View, Text, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Modal, TextInput, Keyboard } from "react-native";
import { router, Stack } from "expo-router";
import { useExpenseStore } from "@/lib/store";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ExpenseField, ExpenseItem } from "@/lib/stubs/ocr-service-dev/ocr_service_pb";
import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { deleteExpense, modifyExpenseField } from "@/lib/ocr-service/callWrapper";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-root-toast";
import Constants from "expo-constants";

export default function ExpenseManagerScreen() {
    const { user } = useUser();
    const {
        expenses,
        selectedExpense,
        setExpenses,
        updateSelectedExpense
    } = useExpenseStore((state) => ({
        expenses: state.expenses,
        selectedExpense: state.selectedExpense,
        setExpenses: state.setExpenses,
        updateSelectedExpense: state.updateSelectedExpense
    }));
    const [isOnExpenseOptions, setIsOnExpenseOptions] = useState(false)
    const [isModifyingExpense, setIsModifyingExpense] = useState(false)
    const [selectedExpenseField, setSelectedExpenseField] = useState<{
        objectFieldType: string,
        expenseFieldType: string
    }>({
        objectFieldType: '',
        expenseFieldType: ''
    })
    const [selectedExpenseValue, setSelectedExpensevalue] = useState('')

    const colorScheme = useColorScheme();
    const c = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = getStyles(colorScheme === 'dark');

    if (!selectedExpense?.data) {
        return (
            <View style={styles.emptyContainer}>
                <Text>No Expense Selected</Text>
            </View>
        );
    }

    const handleSubmitModifications = async () => {
        Keyboard.dismiss()
        if (!selectedExpense.data || !user?.id) {
            return
        }

        const data = await modifyExpenseField(user.id, selectedExpense.data.expenseId, selectedExpenseField.expenseFieldType, selectedExpenseValue)

        if (!data) {
            Toast.show('Something went wrong.', {
                duration: Toast.durations.SHORT,
                position: Constants.statusBarHeight + 20
            });
            return
        }

        const modifiedExpense: ExpenseItem.AsObject = {
            ...selectedExpense, data: {
                ...selectedExpense.data,
                [selectedExpenseField.objectFieldType]: {
                    fieldType: data.fieldType,
                    text: data.fieldText,
                    confidence: data.confidence
                } as ExpenseField.AsObject
            }
        }

        const updatedExpenses: ExpenseItem.AsObject[] = expenses.map(expense => {
            if (expense.data?.expenseId === selectedExpense.data?.expenseId) {
                return modifiedExpense
            }
            return expense
        })
        setExpenses(updatedExpenses)
        updateSelectedExpense(modifiedExpense)

        Toast.show(data.actionDescription, {
            duration: Toast.durations.SHORT,
            position: Constants.statusBarHeight + 20
        });
    }

    const handleDeleteExpense = async () => {

        if (!selectedExpense.data?.expenseId || !user?.id) {
            return
        }
        const data = await deleteExpense(user.id, selectedExpense.data.expenseId)
        if (!data) {
            Toast.show('Something went wrong.', {
                duration: Toast.durations.SHORT,
                position: Constants.statusBarHeight + 20
            });
            return
        }

        const updatedExpenses: ExpenseItem.AsObject[] = expenses.filter((expense) => expense.data?.expenseId !== data.expenseId)

        setExpenses(updatedExpenses)
        setIsOnExpenseOptions(false)
        router.back()
        updateSelectedExpense(undefined)

        Toast.show(data.actionDescription, {
            duration: Toast.durations.SHORT,
            position: Constants.statusBarHeight + 20
        });
    }

    return (
        <>
            <Stack.Screen options={{ title: 'Expense Manager' }} />
            <ScrollView style={styles.container}>
                {Object.entries(selectedExpense.data)
                    .map(([key, value]) => {
                        const expenseValue = value as ExpenseField.AsObject
                        return (
                            expenseValue?.text && (
                                <View key={key} style={{ ...styles.cardContainer, marginBottom: 6 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedExpenseField({
                                                objectFieldType: key,
                                                expenseFieldType: expenseValue.fieldType
                                            })
                                            setSelectedExpensevalue(expenseValue.text)
                                            setIsModifyingExpense(true)
                                        }}
                                        style={styles.info}
                                    >
                                        <ThemedText style={{ fontSize: 12 }}>{key}</ThemedText>
                                        <Ionicons name="create-outline" size={24} style={styles.actionText} />
                                    </TouchableOpacity>
                                    <ThemedText>{expenseValue.text}</ThemedText>
                                    <View style={{ ...styles.badge, alignSelf: 'flex-start' }}>
                                        <ThemedText style={{ fontSize: 12 }}>
                                            Confidence: {Math.round((expenseValue.confidence + Number.EPSILON) * 100) / 100}%
                                        </ThemedText>
                                    </View>
                                </View>
                            )
                        )
                    })}

            </ScrollView>
            <Modal
                transparent={true}
                animationType="slide"
                visible={isModifyingExpense}
                onRequestClose={() => {
                    setIsModifyingExpense(false);
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
                            <ThemedText type="defaultSemiBold">
                                Modify expense field
                            </ThemedText>
                            <TouchableOpacity onPress={() => setIsModifyingExpense(false)}>
                                <Ionicons name='chevron-down-circle-outline' size={24} style={styles.actionText} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={selectedExpenseValue}
                            onChangeText={setSelectedExpensevalue}
                        />
                        <TouchableOpacity style={{ ...styles.secondaryActionContainer, backgroundColor: c.text }} onPress={handleSubmitModifications}>
                            <Text style={{ color: c.background, fontWeight: '500' }}>Submit modifications</Text>
                        </TouchableOpacity>
                    </ThemedView>
                </View>
            </Modal>
            <Modal
                transparent={true}
                animationType="slide"
                visible={isOnExpenseOptions}
                onRequestClose={() => {
                    setIsOnExpenseOptions(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <ThemedView style={{ ...styles.modalView, height: '30%' }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12
                        }}>
                            <ThemedText type="defaultSemiBold">
                                Expense options
                            </ThemedText>
                            <TouchableOpacity onPress={() => setIsOnExpenseOptions(false)}>
                                <Ionicons name='chevron-down-circle-outline' size={24} style={styles.actionText} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
                            <TouchableOpacity style={{ ...styles.secondaryActionContainer, backgroundColor: c.text }}>
                                <Text style={{ color: c.background, fontWeight: '500' }}>Export as CSV</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.secondaryActionContainer, backgroundColor: c.destructive }} onPress={handleDeleteExpense}>
                                <Text style={{ color: c.background, fontWeight: '500' }}>Delete expense</Text>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
            <ThemedView style={styles.floatingContainer}>
                <TouchableOpacity
                    onPress={() => setIsOnExpenseOptions(true)}
                    style={styles.floatingButton}
                >
                    <Ionicons name="options-outline" size={32} style={styles.actionText} />
                </TouchableOpacity>
            </ThemedView>
        </>
    );
}

const getStyles = (isDark: boolean) => {
    const c = isDark ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            flex: 1,
            gap: 12,
            padding: 6
        },
        cardContainer: {
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: c.border,
            gap: 12
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
        info: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: c.secondary,
            paddingHorizontal: 12,
            borderRadius: 50,
        },
        actionText: {
            color: c.text,
            fontWeight: '500'
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
            borderWidth: 1,
            paddingLeft: 15,
            padding: 10,
            borderRadius: 5,
            borderColor: c.border,
            color: c.text,
            marginBottom: 12
        },
        secondaryActionContainer: {
            backgroundColor: c.secondary,
            borderRadius: 50,
            paddingVertical: 12,
            paddingHorizontal: 24,
            flexDirection: 'row',
            justifyContent: 'center'
        },
    });

    return styles;
};
