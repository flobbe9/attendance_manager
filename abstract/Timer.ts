/**
 * @since 0.0.1
 */
export class Timer {
    /** In ms */
    duration: number;

    private startTime: Date;

    constructor(duration: number) {
        this.duration = duration;
    }

    /**
     * Start the timer by setting the ```startTime``` to the current time. Dont set the ```startTime``` if timer is running already.
     * 
     * @returns ```this```
     */
    start(): Timer {

        if (this.started()) {
            console.warn("Timer started already. Call reset() first to start it again.");
            return this;
        }
            
        this.startTime = new Date();

        return this;
    }


    /**
     * @returns ```true``` if ```start()``` has been called. Does not indicate whether the timer is done or not
     */
    started(): boolean {

        return !!this.startTime;
    }


    /**
     * Reset the ```startTime``` and therefore interrupt timer. May be called while timer is running.
     * 
     * @returns ```this```
     */
    reset(): Timer {

        this.startTime = undefined;

        return this;
    }


    /**
     * @returns ```true``` if the timer has been started and has been running for at least ```duration```
     */
    done(): boolean {

        // case: no started yet
        if (!this.startTime) {
            console.warn("Timer is not running. Call start() first.");
            return false;
        }

        return new Date().getTime() - this.startTime.getTime() >= this.duration;
    }
}