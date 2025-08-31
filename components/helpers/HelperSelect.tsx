import { combineDynamicStyles } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { HelperSelectStyles } from "@/assets/styles/HelperSelectStyles";
import HelperStyles from "@/assets/styles/helperStyles";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useBackHandler } from "@/hooks/useBackHandler";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { NO_SELECTION_LABEL } from "@/utils/constants";
import { logError } from "@/utils/logUtils";
import { FontAwesome } from "@expo/vector-icons";
import React, { JSX, useEffect, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, ViewProps, ViewStyle } from "react-native";
import { useClickOutside } from "react-native-click-outside";
import { Divider } from "react-native-paper";
import HelperButton, { HelperButtonProps } from "./HelperButton";
import HelperReactChildren from "./HelperReactChildren";
import HelperScrollView from "./HelperScrollView";
import HelperText from "./HelperText";
import { BORDER_RADIUS } from "@/utils/styleConstants";

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
    selectionButtonProps?: HelperButtonProps,
    optionButtonProps?: HelperButtonProps
}

/**
 * @since 0.0.1
 */
export default function HelperSelect<OptionType>({
        options,
        selectedOptions,
        setSelectedOptions,
        optionsContainerScroll = true,
        multiselect = false,
        noSelectionLabel = NO_SELECTION_LABEL,
        disabledCondition,
        selectionButtonProps = {},
        optionButtonProps = {},
        ...props
    }: Props<OptionType>
) {
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

    const componentRef = useClickOutside(handleGlobalScreenTouch);
    
    const componentName = "HelperSelect";
    const { children, ...otherProps } = useDefaultProps(props, componentName, HelperSelectStyles.component);

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
    function handleOptionPress(event: GestureResponderEvent, pressedOption: OptionType): void {
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

        if (optionButtonProps.onPress)
            optionButtonProps.onPress(event);
    
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
                const isLastOption = i === options.length - 1;
                
                function handleTouchStart(event: GestureResponderEvent): void {
                    setOptionsButtonTouched(true);

                    if (optionButtonProps.onTouchStart)
                        optionButtonProps.onTouchStart(event);
                }

                function handleTouchEnd(event: GestureResponderEvent): void {
                    setOptionsButtonTouched(false);

                    if (optionButtonProps.onTouchEnd)
                        optionButtonProps.onTouchEnd(event);
                }

                return (
                    <HelperButton 
                        {...optionButtonProps}
                        dynamicStyle={combineDynamicStyles(HelperSelectStyles.optionButton, optionButtonProps.dynamicStyle)}
                        style={{
                            borderBottomWidth: option === noSelectionLabel ? .5 : 0,
                            borderColor: "gray",
                            borderBottomStartRadius: isLastOption ? BORDER_RADIUS : undefined,
                            borderBottomEndRadius: isLastOption ? BORDER_RADIUS : undefined,
                            ...isOptionSelected(option) && !multiselect ? HelperSelectStyles.selectedOptionButton.default : {},
                            ...(optionButtonProps.style ?? {} as object)
                        }} 
                        containerStyles={combineDynamicStyles({default: {...HelperStyles.fullWidth}}, optionButtonProps.containerStyles)}
                        disabled={disabled}
                        key={i}
                        onTouchStart={handleTouchStart}
                        onPress={(e) => handleOptionPress(e, option)}
                        onTouchEnd={handleTouchEnd}
                    >
                        <HelperText 
                            numberOfLines={1}
                            dynamicStyle={HelperSelectStyles.optionButtonText}
                        >
                            {option as string}
                        </HelperText>

                        {isOptionSelected(option) && multiselect && <FontAwesome name="check" style={HelperSelectStyles.optionButtonText.default} />}
                    </HelperButton>
                );
            });

        // separate last option visually
        optionElements.push((
            <Divider key={options.length} />
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

    function handleTouchStart(event: GestureResponderEvent): void {
        setSelectionButtonTouched(true);

        if (selectionButtonProps.onTouchStart)
            selectionButtonProps.onTouchStart(event);
    }

    function handleTouchEnd(event: GestureResponderEvent): void {
        setSelectionButtonTouched(false);

        if (selectionButtonProps.onTouchEnd)
            selectionButtonProps.onTouchEnd(event);
    }

    function handlePress(event: GestureResponderEvent): void {
        setAreOptionsVisible(!areOptionsVisible);

        if (selectionButtonProps.onPress)
            selectionButtonProps.onPress(event);
    }

    return (
        <HelperView ref={componentRef} {...otherProps}>
            <HelperReactChildren>
                {children}
            </HelperReactChildren>

            <HelperButton 
                {...selectionButtonProps}
                style={{
                    ...selectionButtonProps.style as object,
                    borderBottomLeftRadius: areOptionsVisible ? 0 : HelperSelectStyles.selectionButton.default.borderBottomLeftRadius,
                    borderBottomRightRadius: areOptionsVisible ? 0 : HelperSelectStyles.selectionButton.default.borderBottomRightRadius,
                }}
                dynamicStyle={combineDynamicStyles(HelperSelectStyles.selectionButton, selectionButtonProps.dynamicStyle)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onPress={handlePress}
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
}