import { log } from "@/utils/logUtils";
import { sleep } from "@/utils/utils";
import { DependencyList, MutableRefObject, Ref, useEffect, useState } from "react";
import { View } from "react-native";


/**
 * Determines the location on screen, width, and height of the given view and
 * returns the values via an async callback. If successful, the callback will
 * be called with the following arguments:
 *
 *  - x
 *  - y
 *  - width
 *  - height
 *  - pageX
 *  - pageY
 *
 * Note that these measurements are not available until after the rendering
 * has been completed in native. If you need the measurements as soon as
 * possible, consider using the [`onLayout`
 * prop](docs/view.html#onlayout) instead.
 * 
 * @param ref
 * @param delay time to wait before measuring, e.g. wait for render. In ms. Default is 0
 * @param deps
 * @since 0.0.1
 */
export function useViewMeasure(ref: MutableRefObject<View>, delay = 0, deps: DependencyList = []): ViewMeasure {

    const [measureResult, setMeasureResult] = useState<ViewMeasure>({});


    useEffect(() => {
        measure();

    }, deps);


    async function measure(): Promise<void> {

        if (!ref || !ref.current)
            return;

        await sleep(delay);

        ref.current.measure((x, y, width, height, pageX, pageY) => {
            setMeasureResult({x, y, width, height, pageX, pageY});
        });
    }


    return measureResult;
}


export interface ViewMeasure {
    x?: number, 
    y?: number, 
    width?: number, 
    height?: number, 
    pageX?: number, 
    pageY?: number
}