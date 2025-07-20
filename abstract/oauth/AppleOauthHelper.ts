import {appJson, AUTH_APPLE_REDIRECT_URL} from "@/utils/constants";
import {logDebug, logError} from "@/utils/logUtils";
import {appleAuthAndroid} from "@invertase/react-native-apple-authentication";
import {jwtDecode} from "jwt-decode";
import {v4 as uuid} from "uuid";
import {AbstractOauthHelper} from "./AbstractOauthHelper";
import {OauthUser} from "./OauthUser";

/**
 * Login button example:
 * ```
 *  <AppleButton
 *      cornerRadius={BORDER_RADIUS}
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={() => testt()}
        leftView={(
            <Image
                style={{
                    alignSelf: 'center',
                    width: 14,
                    height: 14,
                    marginRight: 7,
                    resizeMode: 'contain',
                }}
                source={appleLogoWhite}
            />
        )}
    />
 * ```
 * @since latest
 * @see https://github.com/invertase/react-native-apple-authentication (apple sign in)
 * @see https://developer.android.com/identity/sign-in/credential-manager-siwg (google sign in)
 */
export class AppleOauthHelper extends AbstractOauthHelper {
    public async login(): Promise<number> {
        const rawNonce = uuid();
        const csrfToken = uuid();

        try {
            logDebug("client_id", appJson.ios.bundleIdentifier);
            logDebug("redirectUri", AUTH_APPLE_REDIRECT_URL);
            logDebug("scope", appleAuthAndroid.Scope.EMAIL);
            logDebug("csrf", csrfToken);
            logDebug("responseType", "all");
            logDebug("nonce", rawNonce);

            appleAuthAndroid.configure({
                clientId: appJson.ios.bundleIdentifier,
                redirectUri: AUTH_APPLE_REDIRECT_URL,
                scope: appleAuthAndroid.Scope.ALL,
                responseType: appleAuthAndroid.ResponseType.ALL,
                nonce: rawNonce,
                state: csrfToken,
            });

            logDebug("signing in with apple...");
            const response = await appleAuthAndroid.signIn();
            logDebug("response", response);
            if (response) {
                const code = response.code; // c5a5709e95bbd40079da8bc80091ed125.0.mrxtx.60d9zPXERZnmFhOzbaFQ5A
                const idToken = response.id_token; // eyJraWQiOiJVYUlJRlkyZlc0IiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiZGUuYXR0ZW5kYW5jZS1tYW5hZ2VyIiwiZXhwIjoxNzUyODUwMDIyLCJpYXQiOjE3NTI3NjM2MjIsInN1YiI6IjAwMTczNy4xMDNmMzA2Njk5ZTk0Yzk3OWJjMTNmM2I5MzQ5YzNjZi4xNDQ3Iiwibm9uY2UiOiJmYmExNjA5MzRhZjJlOTNmZDIzMDVmNzA4MThiZWQyZThlNjA5OTVmMmE0NWJhYjA3MDBlYzg1MjFkNWMyZWUzIiwiY19oYXNoIjoiWjJkTHdFLTQ0X2l4b1ZDa25YUmhrZyIsImVtYWlsIjoiZmxvcmluLnNjaGlrYXJza2lAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF1dGhfdGltZSI6MTc1Mjc2MzYyMiwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.TE1x1uHwz2TSDx5RufcpBemr72O4Plguv41Tp8fj2ckPouHpteW9X4PUXnyxSxnNc_mxe2hjT6mjzeBxmtaSo1WKIfV55QunsYQPajI6WrOfryPwmXK_Uhyfe2V-CkAMyXWNHA_nwjtI1INdUPz_Trku7VZRb5ocdLx4oBWPZ1mwOgNaoXnMUcaGV8eDaJvkOCo0rAvh7MnsFYe414WLjvt1s2je0ctflVZK_V00sawieFo4D1PoxocEqcOPiSpGtG_kphxOAlve0bcEscDia0u7QnvGx4inCbev5L1YXoDAEQ_KCLO2mBBkvA-EFiOEHMwoPOpi1RxOw1wEAa14xg
                const user = response.user; // Present when user first logs in using appleId
                const state = response.state; // c2b66836-0895-4bba-afb3-b1e284907485cv
                // TODO: match csrf token for security?
                // or the nonce, see docs
                logDebug("Got auth code", code);
                logDebug("Got id token", idToken, "parsed", jwtDecode(idToken));
                logDebug("Got user", user ?? jwtDecode(idToken)["email"]);
                logDebug("Got csrf", state, "matches", csrfToken === state);
                logDebug("Got nonce", rawNonce, "matches", response.nonce === rawNonce);
            }

            // TODO: log trace
        } catch (error) {
            if (error && error.message) {
                logError("error", error.message);
                switch (error.message) {
                    case appleAuthAndroid.Error.NOT_CONFIGURED:
                        logError("appleAuthAndroid not configured yet.");
                        break;
                    case appleAuthAndroid.Error.SIGNIN_FAILED:
                        logError("Apple signin failed.");
                        break;
                    case appleAuthAndroid.Error.SIGNIN_CANCELLED:
                        logError("User cancelled Apple signin.");
                        break;
                    default:
                        logError(error.message);
                        break;
                }
            }
        }

        // TODO
        return 200;
    }

    public logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public isAvailable(): boolean {
        // TODO
        return appleAuthAndroid.isSupported;
        // Sign In with Apple requires Android 4.4 (API 19) or higher.
    }

    public getCurrentUser(): Promise<OauthUser> {
        throw new Error("Method not implemented.");
    }
}
