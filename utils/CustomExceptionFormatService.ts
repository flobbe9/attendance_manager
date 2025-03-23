import { CustomExceptionFormat } from "@/abstract/CustomExceptionFormat";
import { logApiResponse } from "@/utils/logUtils";
import { getTimeStamp } from "@/utils/utils";


/**
 * @since 0.0.1
 */
export class CustomExceptionFormatService {
    
    /**
     * @param status 
     * @param message 
     * @returns instance using "now" as timestamp and the current ```window.location.pathname``` as path
     */
    public static getInstance(status: number, message: string): CustomExceptionFormat {

        return {
            // TODO: 
            status: status, 
            timestamp: getTimeStamp(),
            message: message,
            path: window.location.pathname
        }
    }
        

    /**
     * Will log instance. See {@link logApiResponse}.
     * 
     * @param status 
     * @param message 
     * @returns instance using "now" as timestamp and the current ```window.location.pathname``` as path
     */
    public static getInstanceAndLog(status: number, message: string): CustomExceptionFormat {

        const instance = {
            status: status, 
            timestamp: getTimeStamp(),
            message: message,
            path: window.location.pathname
        }

        logApiResponse(instance);

        return instance;
    }
}