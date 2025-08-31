import { useHelperProps } from "@/hooks/useHelperProps";
import { Href, useRouter } from "expo-router";
import { GestureResponderEvent } from "react-native";
import HelperButton, { HelperButtonProps } from "./HelperButton";

interface Props extends HelperButtonProps {
    href: Href;
}

/**
 * `<HelperButton>` with a navigation call `onPress`.
 *
 * @since 0.2.5
 */
export function HelperLinkButton({ href, onPress, ...props }: Props) {
    const { navigate } = useRouter();

    const componentName = "HelperLinkButton";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    function handlePress(event: GestureResponderEvent): void {
        if (onPress) onPress(event);

        navigate(href);
    }

    return (
        <HelperButton onPress={handlePress} {...otherProps}>
            {children}
        </HelperButton>
    );
}
