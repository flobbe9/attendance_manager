import { AttendanceEntity } from "@/backend/DbSchema";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import { Stack } from "expo-router";
import { createContext, useContext } from "react";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";


/**
 * @since 0.0.1
 */
export default function layout() {
    
    const { currentAttendanceEntity, setCurrentAttendanceEntity } = useContext(GlobalAttendanceContext);

    const context = {
        updateCurrentAttendanceEntity
    }


    function updateCurrentAttendanceEntity<T extends ValueOf<AttendanceEntity>>(prop: keyof AttendanceEntity, value: T): void {
        
        setCurrentAttendanceEntity({
            ...currentAttendanceEntity,
            [prop]: value
        })
    }


    return (      
        <AttendanceContext.Provider value={context}>
            <Stack screenOptions={{
                headerShown: true,
            }}>
                <Stack.Screen 
                    name="index" 
                    options={{
                        title: "Unterrichtsbesuch"
                    }} 
                    />
            </Stack>
        </AttendanceContext.Provider>
    );
}


export const AttendanceContext = createContext({
    updateCurrentAttendanceEntity: <T extends ValueOf<AttendanceEntity>>(prop: keyof AttendanceEntity, value: T): void => {}
});