const headMasterObj = {"Burkhard Jonck": 0, "Jörn Walting": 1};
type HeadMasterType = typeof headMasterObj;

/**
 * Optinal in any examination lesson.
 * 
 *  @since 0.0.1
 */
export type Headmaster = keyof HeadMasterType;
export const HEADMASTERS: Headmaster[] = Object.keys(headMasterObj) as Headmaster[]; 