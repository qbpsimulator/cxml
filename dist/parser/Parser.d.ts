/// <reference types="node" />
/// <reference types="bluebird" />
import * as stream from 'stream';
import * as Promise from 'bluebird';
import { Context } from '../xml/Context';
import { HandlerInstance } from './Rule';
export interface CxmlDate extends Date {
    cxmlTimezoneOffset: number;
}
export declare class Parser {
    attach<CustomHandler extends HandlerInstance>(handler: {
        new (): CustomHandler;
    }): void;
    parse<Output extends HandlerInstance>(stream: string | stream.Readable | NodeJS.ReadableStream, output: Output, context?: Context): Promise<Output>;
    _parse<Output extends HandlerInstance>(stream: string | stream.Readable | NodeJS.ReadableStream, output: Output, context: Context, resolve: (item: Output) => void, reject: (err: any) => void): void;
}
