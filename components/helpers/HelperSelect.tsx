import HelperProps from "@/abstract/HelperProps";
import { HelperSelectStyles } from "@/assets/styles/HelperSelectStyles";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyles } from "@/hooks/useAnimatedStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, BackHandler, StyleProp, Text, useAnimatedValue, ViewProps, ViewStyle } from "react-native";
import HelperButton from "./HelperButton";
import HelperText from "./HelperText";
import { log, logError } from "@/utils/logUtils";
import { useBackHandler } from "@/hooks/useBackHandler";
import { DynamicStyles } from "@/abstract/DynamicStyles";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    options: string[],
    /** Needs to be a set if ```multiselect``` is ```true```, else may be both */
    selectedOptions: Set<string> | string | undefined,
    /** Needs to have a set as arg if ```multiselect``` is ```true```, else may be both */
    setSelectedOptions: (options: Set<string> | string | undefined) => void,
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
export default function HelperSelect({
    options,
    selectedOptions,
    setSelectedOptions,
    optionsContainerHeight = 200,
    optionsContainerScroll = true,
    multiselect = false,
    noSelectionLabel = "No selection",
    ...props
}: Props) {

    const [optionElements, setOptionElements] = useState<JSX.Element[]>([]);
    const [areOptionsVisible, setAreOptionsVisible] = useState(false);
    const [selectionButtonValue, setSelectionButtonValue] = useState("");
    
    const componentName = "HelperSelect";
    const { children, ...otherProps } = useDefaultProps(props, componentName, HelperSelectStyles.component);
    
    const animatedOptionsContainerHeightValue = useAnimatedValue(0);
    const { animatedStyle: animatedOptionsContainerHeight, animate: slideOptionsContainer } = useAnimatedStyles(
        [0, optionsContainerHeight], 
        [0, optionsContainerHeight], 
        animatedOptionsContainerHeightValue
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
    function handleOptionPress(pressedOption: string): void {

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
                    <HelperText dynamicStyles={HelperSelectStyles.optionButtonText}>{option}</HelperText>
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
            
            return options
                .filter(option => isOptionSelected(option))
                .reduce((prev, cur) => `${prev}, ${cur}`);
        }
    
        return selectedOptions;
    }


    function isOptionSelected(optionValue: string): boolean {

        return selectedOptions instanceof Set ? selectedOptions.has(optionValue) : selectedOptions === optionValue;
    }


    return (
        <HelperView {...otherProps}>
            {children}

            <HelperButton 
                dynamicStyles={HelperSelectStyles.selectionButton}
                onTouchStart={() => setAreOptionsVisible(!areOptionsVisible)}
            >
                <Text style={{...HelperSelectStyles.selectionButtonValue.default, opacity: selectionButtonValue === noSelectionLabel ? 0.5 : 1}}>
                    {selectionButtonValue}
                </Text>
                <FontAwesome name="chevron-down" style={HelperSelectStyles.selectionButtonValue.default} />
            </HelperButton>

            <HelperView style={{position: "relative"}}>
                <Animated.ScrollView 
                    style={{
                        ...HelperSelectStyles.optionsContainer,
                        height: animatedOptionsContainerHeight,
                        position: optionsContainerScroll ? "static" : "absolute",
                    }}
                >
                    {optionElements}
                </Animated.ScrollView>
            </HelperView>
        </HelperView>
    )
}