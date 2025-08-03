import { OauthUser } from "./OauthUser";

/**
 * @since 0.2.2
 */
// TODO
// continue once google login is more clear
export abstract class AbstractOauthHelper {
    // provider
    // scopes
    constructor() {}

    public abstract login(): Promise<number>;

    public abstract logout(): Promise<void>;

    public abstract isAvailable(): boolean;

    public abstract getCurrentUser(): Promise<OauthUser>;
}
