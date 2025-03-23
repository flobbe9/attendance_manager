import { DynamicStyles } from "@/abstract/DynamicStyles";
import { Entity } from "@/abstract/entities/User";
import { HomeStyles } from "@/assets/styles/HomeStyles";
import { entityTable } from "@/backend/DbSchema";
import { useDao } from "@/backend/useDao";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { eq, ilike } from "drizzle-orm";
import { useRef } from "react";
import { Button, Text, TextInput, View, ViewStyle } from "react-native";



const Styles: DynamicStyles<ViewStyle> = {
    default: {

    },
    touchStart: {
        backgroundColor: "red"
    }
}

export default function Home(props) {

    const { dao, drizzleDb } = useDao<Entity, typeof entityTable>();

    const textInputRef = useRef<TextInput>(null);

    async function handleInsert(): Promise<void> {

        const input = (textInputRef.current!);
        // console.log(input.blur);

        // await dao.insertValues(entityTable, {
        //     id: 0,
        //     created: undefined,
        //     updated: undefined,
        //     name: "the name",
        // });

        // const result = await dao.select().from(entityTable).where(eq(entityTable.name, 'the name'));
        // console.log(result);
        // console.log(process.env.NODE_ENV);
    }

    const { ...otherProps } = useDefaultProps(props, "Home", Styles);

    return (
        <View {...otherProps}>
            <Text style={{...HomeStyles}}>
                Home
            </Text>

            <TextInput ref={textInputRef} />

            <Button
                title="Insert"
                onPress={handleInsert}
            />
        </View>
    )
}