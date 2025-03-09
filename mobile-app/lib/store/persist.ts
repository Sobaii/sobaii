// import { createJSONStorage } from "zustand/middleware";
// import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';

// // Create a JSON storage wrapper around expo-secure-store
// export const secureStorage = createJSONStorage(() => ({
//     getItem: async (key: string) => {
//         const item = await getItemAsync(key);
//         return item !== null ? item : null;
//     },
//     setItem: async (key: string, value: string) => {
//         await setItemAsync(key, value);
//     },
//     removeItem: async (key: string) => {
//         await deleteItemAsync(key);
//     },
// }));