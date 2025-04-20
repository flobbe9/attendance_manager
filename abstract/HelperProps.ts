import { AnimatedDynamicStyle } from './AnimatedDynamicStyle';
import DefaultProps from './DefaultProps';
import { DynamicStyle } from './DynamicStyle';


/**
 * Props for helper components. Extends {@link DefaultProps}.
 * 
 * @type ```StyleType``` to pass as generic type to ```StyleProp<>```
 * @since 0.0.1
 */
export default interface HelperProps<StyleType> extends DefaultProps<StyleType> {

    /** To apply _focus style etc */
    dynamicStyle?: DynamicStyle<StyleType>,
    /** Styles with transition effect. Needs ```dynamicStyle``` to be present */
    animatedStyles?: AnimatedDynamicStyle<StyleType>[],
    /** If ```false``` (not falsy), this component wont be rendered at all, meaning it cant even be faded in or similar. Default is ```true``` */
    rendered?: boolean,
    /** Called with useffect on render */
    onRender?: () => void,
}