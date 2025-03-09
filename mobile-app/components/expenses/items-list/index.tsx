import { useExpenseStore } from "@/lib/store";
import { useColorScheme } from "react-native";

export default function ExpenseItemsList() {
    
    const expenses = useExpenseStore((state) => state.expenses);
    
    return (
        <>
        </>
    )
}