import HelperProps from "@/abstract/HelperProps";
import { HelperSelectStyles } from "@/assets/styles/HelperSelectStyles";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyles } from "@/hooks/useAnimatedStyles";
import { useBackHandler } from "@/hooks/useBackHandler";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { logError } from "@/utils/logUtils";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, Text, ViewProps, ViewStyle } from "react-native";
import HelperButton from "./HelperButton";
import HelperText from "./HelperText";
import HelperScrollView from "./HelperScrollView";


interface Props<OptionType> extends HelperProps<ViewStyle>, ViewProps {
    options: OptionType[],
    /** Needs to be a set if ```multiselect``` is ```true```, else may be both */
    selectedOptions: Set<OptionType> | OptionType | undefined,
    /** Needs to have a set as arg if ```multiselect``` is ```true```, else may be both */
    setSelectedOptions: (options: Set<OptionType> | OptionType | undefined) => void,
    /** Default is 200 */
    optionsContainerHeight?: number,
    /** 
     * If ```false```, the optionsContainer wont be scrollable view which makes position absolute possible. 
     * Use this if all options fit into the container height and if you want the container not to push down 
     * the rest of the layout.
     * 
     * Default is ```true```
     */
    optionsContainerScroll?: boolean,
    /** Default is ```false``` */
    multiselect?: boolean,
    /** Default is "No selection" */
    noSelectionLabel?: string,
}


/**
 * @since 0.0.1
 */
export default function HelperSelect<OptionType>({
    options,
    selectedOptions,
    setSelectedOptions,
    optionsContainerHeight = 200,
    optionsContainerScroll = true,
    multiselect = false,
    noSelectionLabel = "No selection",
    ...props
}: Props<OptionType>) {

    const [optionElements, setOptionElements] = useState<JSX.Element[]>([]);
    const [areOptionsVisible, setAreOptionsVisible] = useState(false);
    const [selectionButtonValue, setSelectionButtonValue] = useState("");
    
    const componentName = "HelperSelect";
    const { children, ...otherProps } = useDefaultProps(props, componentName, HelperSelectStyles.component);
    
    const { animatedStyle: animatedOptionsContainerHeight, animate: slideOptionsContainer } = useAnimatedStyles(
        [0, optionsContainerHeight], 
        [0, optionsContainerHeight], 
    );


    useEffect(() => {
        setSelectionButtonValue(getSelectionButtonValue());
        setOptionElements(mapOptions());

    }, [selectedOptions]);


    useEffect(() => {
        slideOptionsContainer(!areOptionsVisible);

    }, [areOptionsVisible]);


    useBackHandler(() => {
        setAreOptionsVisible(false); 
        // only pop the screen if options werer not visible before
        return areOptionsVisible;

    }, [areOptionsVisible]);


    /**
     * Update ```selectedOptions``` state and possibly hide optionsContainer.
     * 
     * @param pressedOption 
     */
    function handleOptionPress(pressedOption: OptionType): void {

        if (multiselect) {
            if (!(selectedOptions instanceof Set)) {
                logError("'selectedOptions' needs to be a set if 'multiselect' is true");
                return;
            }
            let updatedSelectedOptions = new Set([...selectedOptions]);

            if (updatedSelectedOptions.has(pressedOption))
                updatedSelectedOptions.delete(pressedOption);
            else
                updatedSelectedOptions.add(pressedOption);

            setSelectedOptions(updatedSelectedOptions);
        
        } else {
            if (!(selectedOptions instanceof Set)) {
                selectedOptions = pressedOption;
                setSelectedOptions(pressedOption);
                
            } else {
                let updatedSelectedOptions = new Set([...selectedOptions]);

                if (!selectedOptions.has(pressedOption))
                    updatedSelectedOptions = new Set([pressedOption]); 

                setSelectedOptions(updatedSelectedOptions);
            }
        }
    
        setAreOptionsVisible(multiselect);
    }


    function mapOptions(): JSX.Element[] {

        if (!options)
            return [];

        return options
            .map((option, i) => 
                <HelperButton 
                    dynamicStyles={HelperSelectStyles.optionButton} 
                    containerStyles={{default: {width: "100%"}}}
                    onPress={() => handleOptionPress(option)}
                    key={i}
                >
                    <HelperText dynamicStyles={HelperSelectStyles.optionButtonText}>{option as string}</HelperText>
                    {isOptionSelected(option) && multiselect && <FontAwesome name="check" style={HelperSelectStyles.optionButtonText.default} />}
                </HelperButton>
            );
    }


    function getSelectionButtonValue(): string {

        if (!options || !selectedOptions)
            return noSelectionLabel;

        if (selectedOptions instanceof Set) {
            if (!selectedOptions.size)
                return noSelectionLabel;
            
            return (options as string[])
                .filter(option => isOptionSelected(option as OptionType))
                .reduce((prev, cur) => `${prev}, ${cur}`);
        }
    
        return selectedOptions as string;
    }


    function isOptionSelected(optionValue: OptionType): boolean {

        return selectedOptions instanceof Set ? selectedOptions.has(optionValue) : selectedOptions === optionValue;
    }


    return (
        <HelperView {...otherProps}>
            {children}

            <HelperButton 
                dynamicStyles={HelperSelectStyles.selectionButton}
                onTouchStart={() => setAreOptionsVisible(!areOptionsVisible)}
            >
                <HelperText dynamicStyles={HelperSelectStyles.selectionButtonValue} style={{opacity: selectionButtonValue === noSelectionLabel ? 0.5 : 1}}>
                    {selectionButtonValue}
                </HelperText>
                <FontAwesome name="chevron-down" style={HelperSelectStyles.selectionButtonValue.default} />
            </HelperButton>

            <HelperView style={{position: "relative"}}>
                <HelperScrollView 
                    dynamicStyles={HelperSelectStyles.optionsContainer}
                    style={{
                        height: animatedOptionsContainerHeight,
                        position: optionsContainerScroll ? "static" : "absolute",
                    }}
                >
                    {optionElements}
                </HelperScrollView>
            </HelperView>
        </HelperView>
    )
}