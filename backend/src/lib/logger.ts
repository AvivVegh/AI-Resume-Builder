import { injectable } from 'inversify';
import { cloneDeep } from 'lodash';
import 'reflect-metadata';
import { RequestContext } from './request-context';

export enum LoggerLevelsEnum {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

type LoggerMessage = string | Error;

type LoggerTimer = {
  [action: string]: {
    startTime: number;
    endTime?: number;
    [key: string]: any;
  };
};

export const LoggerType = Symbol.for('Logger');

@injectable()
export class Logger {
  private _context: any;

  private _timers: LoggerTimer = {};

  public set context(reqContext: any) {
    this._context = reqContext;
  }

  public getContext(): RequestContext {
    return this.clone(this._context.get());
  }

  public isDebugEnabled(): boolean {
    if (this._context) {
      return process.env.DEBUG_LOG === 'true' || this._context.get()['debug-log-enabled'] === 'true';
    }
  }

  /**
   * Log a debug message to the console
   * @param msg Message
   * @param params Related parameters
   */
  public debug(msg: LoggerMessage, params?: any): void {
    this.log(LoggerLevelsEnum.DEBUG, msg, params);
  }

  /**
   * Log info message to the console
   * @param msg Message
   * @param params Related parameters
   */
  public info(msg: LoggerMessage, params?: any): void {
    this.log(LoggerLevelsEnum.INFO, msg, params);
  }

  /**
   * Log a warning message to the console
   * @param msg Message
   * @param params Related parameters
   */
  public warn(msg: LoggerMessage, params?: any): void {
    this.log(LoggerLevelsEnum.WARN, msg, params);
  }

  /**
   * Log an error to the console, providing a stack trace if passed a valid Error instance
   * @param msg Error instance
   * @param params Related parameters
   */
  public error(msg: LoggerMessage, params?: any): void {
    this.log(LoggerLevelsEnum.ERROR, msg, params);
    // Provide stack trace if available
    if (msg instanceof Error) {
      console.error(msg?.stack || 'Stack trace unavailable');
    }
  }

  /**
   * Log a message with an associated error to the console
   * @param msg String instance
   * @param error Error to be logged
   * @param params Related parameters
   */
  public withError(msg: string, error: any, params?: any): void {
    this.log(LoggerLevelsEnum.ERROR, msg, params, {
      errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
  }

  /**
   * Start a timer to measure the duration of an action
   * @param action Action that is being timed
   * @param params Related parameters
   * @returns Action label
   */
  public time(action: string, params?: any): string {
    if (
      // Not a valid action label
      action.length === 0
    ) {
      this.error('Please provide a descriptive, unique action label');
    } else if (!this._timers[action]) {
      this._timers[action] = { ...params, startTime: this.now() };
      this.info(action, { ...params });
    } else {
      this.debug(`Timer already exists`, { action });
    }
    return action;
  }

  /**
   * Log time elapsed since start of specified timer
   * @param action Action that is being timed
   * @param params Related parameters
   * @returns Time elapsed in seconds
   */
  public timeLog(action: string, params?: any): number {
    if (this._timers[action]) {
      const { startTime, params: initialParams } = this._timers[action];
      const timeElapsed = this.now() - startTime;
      this.info(action, { ...initialParams, ...params, startTime, timeElapsed });
      // Divide by 1000 to convert from ms to s
      return timeElapsed / 1000;
    } else {
      this.debug(`Timer does not exist`, { action });
      return -1;
    }
  }

  /**
   * Log time taken to execute an action and stop the timer
   * @param action Action that is being timed
   * @param time Time to execute action
   * @param params Related parameters
   */
  public timeEnd(action: string, params?: any): void {
    if (this._timers[action]) {
      const { startTime, params: initialParams } = this._timers[action];
      const endTime = this.now();
      const timeElapsed = endTime - startTime;
      delete this._timers[action];
      this.info(action, { ...initialParams, ...params, startTime, endTime, timeElapsed });
    } else {
      this.debug(`Timer does not exist`, { action });
    }
  }

  private log(level: LoggerLevelsEnum, message: LoggerMessage, params?: any, spreadParams?: any): void {
    const logCtx = this._context ? this._context : new RequestContext();
    const logMsg = {
      ...cloneDeep(logCtx),
      ...spreadParams,
      level,
      message,
      params,
    };

    const logString = JSON.stringify(logMsg);

    switch (level) {
      case LoggerLevelsEnum.ERROR:
        console.error(logString);
        break;

      case LoggerLevelsEnum.DEBUG:
        console.debug(logString);
        break;

      case LoggerLevelsEnum.WARN:
        console.warn(logString);
        break;

      case LoggerLevelsEnum.INFO:
        console.info(logString);
        break;

      default:
        console.log(logString);
        break;
    }
  }

  private clone(ob: any): any {
    const cloneObj: any = {};

    for (const attribute in ob) {
      if (typeof ob[attribute] === 'object') {
        cloneObj[attribute] = this.clone(ob[attribute]);
      } else {
        cloneObj[attribute] = ob[attribute];
      }
    }

    return cloneObj;
  }

  private now(): number {
    return Date.now();
  }
}
