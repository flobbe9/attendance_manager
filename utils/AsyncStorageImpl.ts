// import { AbstractStorage } from "@/abstract/AbstractStorage";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Callback } from "@react-native-async-storage/async-storage/lib/typescript/types";

// /**
//  * Persists across app launches.
//  * 
//  * Be careful with authentication requirements, see docs.
//  * 
//  * @since latest
//  * @see https://react-native-async-storage.github.io/async-storage/
//  */
// export class AsyncStorageImpl extends AbstractStorage<Callback> {
//     protected isKeyValid(key: string): boolean {
//         return true;
//     }
    
//     protected isValueValid(value: string): boolean {
//         return true;
//     }

//     protected getImpl(key: string, options?: Callback): Promise<string | null> {
//         return AsyncStorage.getItem(key, options);
//     }

//     protected setImpl(key: string, value: string, options?: Callback): Promise<void> {
//         return AsyncStorage.setItem(key, value, options);
//     }

//     protected deleteImpl(key: string, options?: Callback): Promise<void> {
//         return AsyncStorage.removeItem(key, options);
//     }
// }