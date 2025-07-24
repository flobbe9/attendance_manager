import HelperProps from "@/abstract/HelperProps";
import { HelperSelectStyles } from "@/assets/styles/HelperSelectStyles";
import HelperStyles from "@/assets/styles/helperStyles";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useBackHandler } from "@/hooks/useBackHandler";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { NO_SELECTION_LABEL } from "@/utils/constants";
import { logDebug, logError } from "@/utils/logUtils";
import { FontAwesome } from "@expo/vector-icons";
import React, { forwardRef, JSX, Ref, useContext, useEffect, useState } from "react";
import { LayoutChangeEvent, Text, View, ViewProps, ViewStyle } from "react-native";
import { GlobalContext } from "../context/GlobalContextProvider";
import HelperButton from "./HelperButton";
import HelperReactChildren from "./HelperReactChildren";
import HelperScrollView from "./HelperScrollView";
import HelperText from "./HelperText";
import { combineDynamicStyles, DynamicStyle } from "@/abstract/DynamicStyle";
import DropShadow from 'react-native-drop-shadow';
import { Divider } from "react-native-paper";

interface Props<OptionType> extends HelperProps<ViewStyle>, ViewProps {
    options: OptionType[],
    /** Needs to be a set if ```multiselect``` is ```true```, else may be both */
    selectedOptions: Set<OptionType> | OptionType | undefined,
    /** Needs to have a set as arg if ```multiselect``` is ```true```, else may be both */
    setSelectedOptions: (options: Set<OptionType> | OptionType | undefined) => void,
    /** 
     * If ```false```, the optionsContainer wont be scrollable view which makes `position: absolute` possible. 
     * Use this if all options fit into the container height and if you want the container not to push down 
     * the rest of the layout.
     * 
     * Default is ```true```
     */
    optionsContainerScroll?: boolean,
    /** Default is ```false``` */
    multiselect?: boolean,
    /** Default is {@link NO_SELECTION_LABEL} */
    noSelectionLabel?: string,
    /** Applied to every select option. If returns `true`, disable the select option. */
    disabledCondition?: (optionValue: OptionType) => boolean,
    selectionButtonStyles?: DynamicStyle<ViewStyle>,
    optionButtonStyles?: DynamicStyle<ViewStyle>
}

/**
 * @since 0.0.1
 */
export default forwardRef(function HelperSelect<OptionType>({
        options,
        selectedOptions,
        setSelectedOptions,
        optionsContainerScroll = true,
        multiselect = false,
        noSelectionLabel = NO_SELECTION_LABEL,
        disabledCondition,
        selectionButtonStyles = {},
        optionButtonStyles = {},
        ...props
    }: Props<OptionType>,
    ref: Ref<View>
) {
    const { globalScreenTouch } = useContext(GlobalContext);

    const [optionElements, setOptionElements] = useState<JSX.Element[]>([]);
    const [areOptionsVisible, setAreOptionsVisible] = useState(false);
    const [selectionButtonValue, setSelectionButtonValue] = useState("");

    // for "touch" outside hide
    const [isSelectionButtonTouched, setSelectionButtonTouched] = useState(false);
    const [isOptionsButtonTouched, setOptionsButtonTouched] = useState(false);

    // set on layout change by setting height to undefined and opacity to 0
    const [expandedOptionsContainerHeight, setExpandedOptionsContainerHeight] = useState<number>(0);

    const animationDuration = 100;
    const { animatedStyle: animatedOptionsContainerHeight, animate: slideOptionsContainer } = useAnimatedStyle(
        [0, expandedOptionsContainerHeight], 
        [0, expandedOptionsContainerHeight], 
        {
            duration: animationDuration,
            animationDeps: null
        }
    );
    
    const componentName = "HelperSelect";
    const { children, ...otherProps } = useDefaultProps(props, componentName, HelperSelectStyles.component);

    useEffect(() => {
        handleGlobalScreenTouch();
    }, [globalScreenTouch])

    useEffect(() => {
        setSelectionButtonValue(getSelectionButtonValue());

        updateOptionElements();

    }, [selectedOptions, setSelectedOptions]);

    useEffect(() => {
        slideOptionsContainer(!areOptionsVisible);

    }, [areOptionsVisible]);

    useBackHandler(() => {
        setAreOptionsVisible(false); 
        // only pop the screen if options werer not visible before
        return areOptionsVisible;

    }, [areOptionsVisible]);

    /**
     * Update `optionElements` state and possibly reinitialize options container height
     */
    function updateOptionElements(): void {
        setTimeout(() => {
            const newOptionElements = mapOptions();
            setOptionElements(newOptionElements);

            // case: num options has changed, trigger reinitialize height
            if (newOptionElements.length !== optionElements.length)
                setExpandedOptionsContainerHeight(0);
        }, animationDuration);
    }

    /**
     * Update ```selectedOptions``` state and possibly hide optionsContainer.
     * 
     * @param pressedOption 
     */
    function handleOptionPress(pressedOption: OptionType): void {
        if (multiselect) {
            if (!(selectedOptions instanceof Set)) {
                logError("'selectedOptions' needs to be a Set if 'multiselect' is true");
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

        if (noSelectionLabel && !multiselect)
            options = [(noSelectionLabel as OptionType), ...options];

        const optionElements: JSX.Element[] = options
            .map((option, i) => {
                const disabled = disabledCondition && option !== noSelectionLabel ? disabledCondition(option) : false;
                return (
                    <HelperButton 
                        dynamicStyle={combineDynamicStyles(HelperSelectStyles.optionButton, optionButtonStyles)}
                        style={{
                            ...isOptionSelected(option) && !multiselect ? HelperSelectStyles.selectedOptionButton.default : {}                            
                        }} 
                        containerStyles={{default: {...HelperStyles.fullWidth}}}
                        disabled={disabled}
                        key={i}
                        onTouchStart={() => setOptionsButtonTouched(true)}
                        onPress={() => handleOptionPress(option)}
                        onTouchEnd={() => setOptionsButtonTouched(false)}
                    >
                        <HelperText 
                            numberOfLines={1}
                            dynamicStyle={HelperSelectStyles.optionButtonText}
                            style={{opacity: option === noSelectionLabel ? 0.5 : 1}}
                        >
                            {option as string}
                        </HelperText>

                        {isOptionSelected(option) && multiselect && <FontAwesome name="check" style={HelperSelectStyles.optionButtonText.default} />}
                    </HelperButton>
                );
            });

        // separate last option visually
        optionElements.push((
            <Divider />
        ))

        return optionElements;
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
        return selectedOptions instanceof Set ? selectedOptions.has(optionValue) : getSelectionButtonValue() === optionValue;
    }

    /**
     * Hide drop down on "touch outside".
     */
    function handleGlobalScreenTouch(): void {
        // let buttons handle drop down hide themselves
        if (isSelectionButtonTouched || isOptionsButtonTouched)
            return;

        setAreOptionsVisible(false);
    }

    function initializeExpandedOptionsContainerHeight(e: LayoutChangeEvent): void {
        if (!isExapandedOptionsContainerHeightInitialized())
            setExpandedOptionsContainerHeight(e.nativeEvent.layout.height)
    }

    function isExapandedOptionsContainerHeightInitialized(): boolean {
        return expandedOptionsContainerHeight !== 0;
    }

    return (
        <HelperView ref={ref} {...otherProps}>
            <HelperReactChildren>
                {children}
            </HelperReactChildren>

            <HelperButton 
                dynamicStyle={combineDynamicStyles(HelperSelectStyles.selectionButton, selectionButtonStyles)}
                onTouchStart={() => setSelectionButtonTouched(true)}
                onTouchEnd={() => setSelectionButtonTouched(false)}
                onPress={() => setAreOptionsVisible(!areOptionsVisible)}
            >
                <HelperText 
                    numberOfLines={1}
                    dynamicStyle={HelperSelectStyles.selectionButtonValue} 
                    style={{opacity: selectionButtonValue === noSelectionLabel ? 0.5 : 1}}
                >
                    {selectionButtonValue}
                </HelperText>
                <FontAwesome name="chevron-down" style={HelperSelectStyles.selectionButtonValue.default} />
            </HelperButton>

            <HelperView>
                <HelperScrollView 
                    dynamicStyle={HelperSelectStyles.optionsContainer}
                    style={{
                        height: isExapandedOptionsContainerHeightInitialized() ? animatedOptionsContainerHeight : undefined,
                        opacity: isExapandedOptionsContainerHeightInitialized() ? 1 : 0, 
                        position: optionsContainerScroll ? "static" : "absolute",
                    }}
                    onLayout={initializeExpandedOptionsContainerHeight}
                >
                    {optionElements}
                </HelperScrollView>
            </HelperView>
        </HelperView>
    )
})