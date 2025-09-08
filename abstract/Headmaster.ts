const headMasterObj = {"Burkhard Jonck": 0, "Jörn Walting": 1};
/**
 * Optinal in any examination lesson.
 * 
 *  @since 0.0.1
 */
export type Headmaster = keyof typeof headMasterObj;
export const HEADMASTERS: Headmaster[] = Object.keys(headMasterObj) as Headmaster[]; 