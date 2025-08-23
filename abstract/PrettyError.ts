/**
 * For errors meant to be visible for users.
 *
 * @since 0.2.4
 */
export class PrettyError extends Error {
    public prettyMessage: string;
    /** Use http status codes here, useful for identifying errors. Defaults to 500 */
    public statusCode: number;

    constructor(message: string, prettyMessage: string, statusCode?: number) {
        super(message);
        this.prettyMessage = prettyMessage;
        this.statusCode = statusCode ?? 500;
    }

    /**
     * @param e to parse
     * @param prettyErrorMessage to use if `e` is not a `PrettyError`
     * @param statusCode
     * @returns new instance or unmodified `e` if is not an instance of `PrettyError`
     */
    static parseError(e: Error, prettyErrorMessage: string, statusCode?: number): PrettyError {
        if (!(e instanceof PrettyError)) {
            return new PrettyError(e.message, prettyErrorMessage, statusCode);
        } else {
            return e;
        }
    }
}
