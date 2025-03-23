import { AnimatedStyleProp } from './AnimatedStyleProp';
import DefaultProps from './DefaultProps';
import { DynamicStyles } from './DynamicStyles';


/**
 * Props for helper components. Extends {@link DefaultProps}.
 * 
 * @type ```StyleType``` to pass as generic type to ```StyleProp<>```
 * @since 0.0.1
 */
export default interface HelperProps<StyleType> extends DefaultProps<StyleType> {

    /** To apply _focus style etc */
    dynamicStyles?: DynamicStyles<StyleType>,
    /** Styles with transition effect. Needs ```dynamicStyles``` to be present */
    animatedStyles?: AnimatedStyleProp<StyleType>[],
    /** If ```false``` (not falsy), this component wont be rendered at all, meaning it cant even be faded in or similar. Default is ```true``` */
    rendered?: boolean,
    /** Called with useffect on render */
    onRender?: () => void,
}