import { appJson, AUTH_APPLE_REDIRECT_URL } from "@/utils/constants";
import { logDebug, logError } from "@/utils/logUtils";
import { appleAuthAndroid } from "@invertase/react-native-apple-authentication";
import { jwtDecode } from "jwt-decode";
import { v4 as uuid } from "uuid";
import { AbstractOauthHelper } from "./AbstractOauthHelper";
import { OauthUser } from "./OauthUser";

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
 * @since 0.2.2
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
                const code = response.code;
                const idToken = response.id_token;
                const user = response.user; // Present when user first logs in using appleId
                const state = response.state; //
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
