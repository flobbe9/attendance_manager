import { CustomExceptionFormat } from '../abstract/CustomExceptionFormat';
import { CustomExceptionFormatService } from './CustomExceptionFormatService';
import { logApiResponse } from './logUtils';
import { isNumberFalsy, sleep } from "./utils";


/**
 * Call ```fetchAny``` with given params.
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @param debug if ```true```, a response with a bad status code will be logged. Default is ```true```
 * @returns response as json
 */
export default async function fetchJson(url: string, method = "get", body?: any, headers?: HeadersInit, debug = true): Promise<CustomExceptionFormat | any> {

    const response = await fetchAny(url, method, body, headers, debug);

    // case: failed to fetch, already streamed to json
    if (!isHttpStatusCodeAlright(response.status)) {
        // case: actually did not stream response to json just yet 
        if (!debug)
            return await (response as Response).json();

        return response;
    }

    return await (response as Response).json();
}


/**
 * Sends an http request using given url, method and body. Will only log fetch errors.<p>
 * 
 * Fetch errors will be returned as {@link CustomExceptionFormat}.<p>
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @param debug if true, a response with a bad status code will be read to ```.json()``` and logged. Default is true
 * @returns a promise with the response or an {@link CustomExceptionFormat} object in it
 */
export async function fetchAny(url: string, method = "get", body?: any, headers?: HeadersInit, debug = true): Promise<Response | CustomExceptionFormat> {
    
    // set headers
    const fetchConfig: RequestInit = {
        method: method,
        headers: getFetchHeaders(headers),
        credentials: "include"
    }

    // case: request has body
    if (body) 
        fetchConfig.body = JSON.stringify(body);

    let response: Response | CustomExceptionFormat | undefined = undefined;
    try {
        response = await fetch(url, fetchConfig);

    // case: network error
    } catch(e) {
        await sleep(1000);

        try {
            // try again
            response = await fetch(url, fetchConfig);

        } catch (e) {
            return handleFetchError(e, url);
        }
    }

    return response;
}


/**
 * Fetch content from givn url and call ```URL.createObjectURL(response.blob())``` on it.
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @returns a Promise with a url object containing the blob, that can be downloaded with an ```<a></a>``` tag. If error, return
 *          {@link CustomExceptionFormat} object
 */
export async function fetchAnyReturnBlobUrl(url: string, method = "get", body?: object, headers?: HeadersInit): Promise<string | CustomExceptionFormat> {

    const response = await fetchAny(url, method, body, headers);

    // case: request failed
    if (!isHttpStatusCodeAlright(response.status))
        return response as CustomExceptionFormat;

    const blob = await (response as Response).blob();

    // case: falsy blob
    if (!blob) {
        const error = CustomExceptionFormatService.getInstance(
            406, // not acceptable
            "Failed to get blob from response."
        );

        logApiResponse(error);

        return error;
    }

    return URL.createObjectURL(blob);
}


/**
 * Create a hidden ```<a href="url" download></a>``` element, click it and remove it from the dom afterwards. Optionally handle
 * given url with {@link fetchAnyReturnBlobUrl} first.
 * Create a hidden ```<a href="url" download></a>``` element, click it and remove it from the dom afterwards. Optionally handle
 * given url with {@link fetchAnyReturnBlobUrl} first.
 * 
 * @param url to make the download request to
 * @param fileName name of file to use for download. If empty, the response header will be searched for a filename
 * @param fetchBlob if true, the given url will be handled by {@link fetchAnyReturnBlobUrl} method first, before beeing passed to ```<a></a>``` tag. 
 *                  In that case, the fileName param should be passed as well or no fileName will be specified at all.
 *                  If false, the given url will be passed directly to ```<a></a>``` tag. Http method should be "get" in that case.
 *                  Default is true
 * @param method http method to use for fetch. Default is "get"
 * @param body to send with the request
 * @param headers json object with strings as keys and values
 * @returns error response as {@link CustomExceptionFormat} if ```fetchBlob``` or nothing if all went well 
 */
export async function downloadFileByUrl(url: string, 
                                        fileName?: string, 
                                        fetchBlob = true,
                                        method = "get", 
                                        body?: object, 
                                        headers = {"Content-Type": "application/octet-stream"} 
                                        ): Promise<CustomExceptionFormat | void> {

    // case: fetch blob first
    if (fetchBlob) {
        const response = await fetchAnyReturnBlobUrl(url, method, body, headers);

        // case: successfully generated url from blob
        if (typeof response === "string")
            url = response;
        else
            return response;
    }

    // create link
    const linkElement = document.createElement('a');

    // add props
    linkElement.href = url;
    if (fileName)
        linkElement.download = fileName;

    // add props
    linkElement.href = url;
    if (fileName)
        linkElement.download = fileName;
    linkElement.style.display = 'none';

    // append
    document.body.appendChild(linkElement);
  
    // trigger link
    linkElement.click();
  
    // remove
    document.body.removeChild(linkElement);
}


/**
 * @param statusCode http status code to check
 * @returns true if status code is informational (1xx), successful (2xx) or redirectional (3xx), else false
 */
export function isHttpStatusCodeAlright(statusCode: number): boolean {

    return statusCode <= 399;
}


/**
 * @param response to check if is error
 * @returns ```true``` if given response is truthy, has a ```status``` field and that ```status``` field is not "alright" (see {@link isHttpStatusCodeAlright})
 */
export function isResponseError(response: any): response is CustomExceptionFormat {

    return response && !isNumberFalsy(response.status) && !isHttpStatusCodeAlright(response.status);
}


/**
 * Set content type to "application/json" if not present.
 * 
 * @param headers json object with strings as keys and values
 * @returns ```headers``` object with necessary props set 
 */
function getFetchHeaders(headers?: HeadersInit): HeadersInit {

    const contentType = {"Content-Type": "application/json"};

    if (!headers)
        headers = {};

    // content type
    if (!headers["Content-Type"])
        Object.assign(headers, contentType);

    return headers!;
}


/**
 * Possibly log error and clear sensitive data from cache.
 * 
 * @param errorResponse that has a bad status code
 * @param debug indicates whether to log the error
 */
async function handleResponseError(errorResponse: CustomExceptionFormat, debug: boolean): Promise<void> {

    if (!errorResponse)
        return;

    if (debug)
        logApiResponse(errorResponse);
}


/**
 * Formats given fetch error as {@link CustomExceptionFormat}, log and return it.
 * 
 * @param e fetch error that was thrown 
 * @param url that fetch() used
 * @returns {@link CustomExceptionFormat} using most values from given error
 */
function handleFetchError(e: Error, url: string): CustomExceptionFormat {

    const error = CustomExceptionFormatService.getInstance(503, e.message);

    logApiResponse(error);

    return error;
}