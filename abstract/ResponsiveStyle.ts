import { TextStyle, ViewStyle } from "react-native";
import { PartialRecord } from "./PartialRecord";
import { useResponsiveStyles } from '@/hooks/useResponsiveStyles';


/**
 * @since 0.0.1
 * @see useResponsiveStyles
 */
export type ResponsiveStyle = PartialRecord<any, ViewStyle & TextStyle>;