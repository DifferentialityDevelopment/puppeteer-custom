/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="node" />
import { EventEmitter } from './EventEmitter.js';
import { CDPSession } from './Connection.js';
import { Frame } from './FrameManager.js';
import { Keyboard, Mouse, Touchscreen, MouseButton } from './Input.js';
import { Tracing } from './Tracing.js';
import { Coverage } from './Coverage.js';
import { WebWorker } from './WebWorker.js';
import { Browser, BrowserContext } from './Browser.js';
import { Target } from './Target.js';
import { JSHandle, ElementHandle } from './JSHandle.js';
import { Viewport } from './PuppeteerViewport.js';
import { Credentials } from './NetworkManager.js';
import { HTTPRequest } from './HTTPRequest.js';
import { HTTPResponse } from './HTTPResponse.js';
import { Accessibility } from './Accessibility.js';
import { FileChooser } from './FileChooser.js';
import { PuppeteerLifeCycleEvent } from './LifecycleWatcher.js';
import { Protocol } from 'devtools-protocol';
import { SerializableOrJSHandle, EvaluateHandleFn, WrapElementHandle, EvaluateFn, EvaluateFnReturnType, UnwrapPromiseLike } from './EvalTypes.js';
/**
 * @public
 */
export interface Metrics {
    Timestamp?: number;
    Documents?: number;
    Frames?: number;
    JSEventListeners?: number;
    Nodes?: number;
    LayoutCount?: number;
    RecalcStyleCount?: number;
    LayoutDuration?: number;
    RecalcStyleDuration?: number;
    ScriptDuration?: number;
    TaskDuration?: number;
    JSHeapUsedSize?: number;
    JSHeapTotalSize?: number;
}
/**
 * @public
 */
export interface WaitTimeoutOptions {
    /**
     * Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to
     * disable the timeout.
     *
     * @remarks
     * The default value can be changed by using the
     * {@link Page.setDefaultTimeout} method.
     */
    timeout?: number;
}
/**
 * @public
 */
export interface WaitForOptions {
    /**
     * Maximum wait time in milliseconds, defaults to 30 seconds, pass `0` to
     * disable the timeout.
     *
     * @remarks
     * The default value can be changed by using the
     * {@link Page.setDefaultTimeout} or {@link Page.setDefaultNavigationTimeout}
     * methods.
     */
    timeout?: number;
    waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[];
}
/**
 * @public
 */
export interface GeolocationOptions {
    /**
     * Latitude between -90 and 90.
     */
    longitude: number;
    /**
     * Longitude between -180 and 180.
     */
    latitude: number;
    /**
     * Optional non-negative accuracy value.
     */
    accuracy?: number;
}
interface MediaFeature {
    name: string;
    value: string;
}
interface ScreenshotClip {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface ScreenshotOptions {
    type?: 'png' | 'jpeg';
    path?: string;
    fullPage?: boolean;
    clip?: ScreenshotClip;
    quality?: number;
    omitBackground?: boolean;
    encoding?: string;
}
interface PDFMargin {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
}
interface PDFOptions {
    scale?: number;
    displayHeaderFooter?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    printBackground?: boolean;
    landscape?: boolean;
    pageRanges?: string;
    format?: string;
    width?: string | number;
    height?: string | number;
    preferCSSPageSize?: boolean;
    margin?: PDFMargin;
    path?: string;
}
declare type VisionDeficiency = 'none' | 'achromatopsia' | 'blurredVision' | 'deuteranopia' | 'protanopia' | 'tritanopia';
/**
 * All the events that a page instance may emit.
 *
 * @public
 */
export declare const enum PageEmittedEvents {
    /** Emitted when the page closes. */
    Close = "close",
    /**
     * Emitted when JavaScript within the page calls one of console API methods,
     * e.g. `console.log` or `console.dir`. Also emitted if the page throws an
     * error or a warning.
     *
     * @remarks
     *
     * A `console` event provides a {@link ConsoleMessage} representing the
     * console message that was logged.
     *
     * @example
     * An example of handling `console` event:
     * ```js
     * page.on('console', msg => {
     *   for (let i = 0; i < msg.args().length; ++i)
     *    console.log(`${i}: ${msg.args()[i]}`);
     *  });
     *  page.evaluate(() => console.log('hello', 5, {foo: 'bar'}));
     * ```
     */
    Console = "console",
    /**
     * Emitted when a JavaScript dialog appears, such as `alert`, `prompt`,
     * `confirm` or `beforeunload`. Puppeteer can respond to the dialog via
     * {@link Dialog.accept} or {@link Dialog.dismiss}.
     */
    Dialog = "dialog",
    /**
     * Emitted when the JavaScript
     * {@link https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded | DOMContentLoaded } event is dispatched.
     */
    DOMContentLoaded = "domcontentloaded",
    /**
     * Emitted when the page crashes. Will contain an `Error`.
     */
    Error = "error",
    /** Emitted when a frame is attached. Will contain a {@link Frame}. */
    FrameAttached = "frameattached",
    /** Emitted when a frame is detached. Will contain a {@link Frame}. */
    FrameDetached = "framedetached",
    /** Emitted when a frame is navigated to a new URL. Will contain a {@link Frame}. */
    FrameNavigated = "framenavigated",
    /**
     * Emitted when the JavaScript
     * {@link https://developer.mozilla.org/en-US/docs/Web/Events/load | load}
     * event is dispatched.
     */
    Load = "load",
    /**
     * Emitted when the JavaScript code makes a call to `console.timeStamp`. For
     * the list of metrics see {@link Page.metrics | page.metrics}.
     *
     * @remarks
     * Contains an object with two properties:
     * - `title`: the title passed to `console.timeStamp`
     * - `metrics`: objec containing metrics as key/value pairs. The values will
     *   be `number`s.
     */
    Metrics = "metrics",
    /**
     * Emitted when an uncaught exception happens within the page.
     * Contains an `Error`.
     */
    PageError = "pageerror",
    /**
     * Emitted when the page opens a new tab or window.
     *
     * Contains a {@link Page} corresponding to the popup window.
     *
     * @example
     *
     * ```js
     * const [popup] = await Promise.all([
     *   new Promise(resolve => page.once('popup', resolve)),
     *   page.click('a[target=_blank]'),
     * ]);
     * ```
     *
     * ```js
     * const [popup] = await Promise.all([
     *   new Promise(resolve => page.once('popup', resolve)),
     *   page.evaluate(() => window.open('https://example.com')),
     * ]);
     * ```
     */
    Popup = "popup",
    /**
     * Emitted when a page issues a request and contains a {@link HTTPRequest}.
     *
     * @remarks
     * The object is readonly. See {@Page.setRequestInterception} for intercepting
     * and mutating requests.
     */
    Request = "request",
    /**
     * Emitted when a request fails, for example by timing out.
     *
     * Contains a {@link HTTPRequest}.
     *
     * @remarks
     *
     * NOTE: HTTP Error responses, such as 404 or 503, are still successful
     * responses from HTTP standpoint, so request will complete with
     * `requestfinished` event and not with `requestfailed`.
     */
    RequestFailed = "requestfailed",
    /**
     * Emitted when a request finishes successfully. Contains a {@link HTTPRequest}.
     */
    RequestFinished = "requestfinished",
    /**
     * Emitted when a response is received. Contains a {@link HTTPResponse}.
     */
    Response = "response",
    /**
     * Emitted when a dedicated
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API | WebWorker}
     * is spawned by the page.
     */
    WorkerCreated = "workercreated",
    /**
     * Emitted when a dedicated
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API | WebWorker}
     * is destroyed by the page.
     */
    WorkerDestroyed = "workerdestroyed"
}
/**
 * Page provides methods to interact with a single tab or
 * {@link https://developer.chrome.com/extensions/background_pages | extension background page} in Chromium.
 *
 * @remarks
 *
 * One Browser instance might have multiple Page instances.
 *
 * @example
 * This example creates a page, navigates it to a URL, and then * saves a screenshot:
 * ```js
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   await page.screenshot({path: 'screenshot.png'});
 *   await browser.close();
 * })();
 * ```
 *
 * The Page class extends from Puppeteer's {@link EventEmitter} class and will
 * emit various events which are documented in the {@link PageEmittedEvents} enum.
 *
 * @example
 * This example logs a message for a single page `load` event:
 * ```js
 * page.once('load', () => console.log('Page loaded!'));
 * ```
 *
 * To unsubscribe from events use the `off` method:
 *
 * ```js
 * function logRequest(interceptedRequest) {
 *   console.log('A request was made:', interceptedRequest.url());
 * }
 * page.on('request', logRequest);
 * // Sometime later...
 * page.off('request', logRequest);
 * ```
 * @public
 */
export declare class Page extends EventEmitter {
    /**
     * @internal
     */
    static create(client: CDPSession, target: Target, ignoreHTTPSErrors: boolean, defaultViewport: Viewport | null): Promise<Page>;
    private _closed;
    private _client;
    private _target;
    private _keyboard;
    private _mouse;
    private _timeoutSettings;
    private _touchscreen;
    private _accessibility;
    private _frameManager;
    private _emulationManager;
    private _tracing;
    private _pageBindings;
    private _coverage;
    private _javascriptEnabled;
    private _viewport;
    private _screenshotTaskQueue;
    private _workers;
    private _fileChooserInterceptors;
    private _disconnectPromise?;
    /**
     * @internal
     */
    constructor(client: CDPSession, target: Target, ignoreHTTPSErrors: boolean);
    private _initialize;
    private _onFileChooser;
    /**
     * @returns `true` if the page has JavaScript enabled, `false` otherwise.
     */
    isJavaScriptEnabled(): boolean;
    /**
     * @param options - Optional waiting parameters
     * @returns Resolves after a page requests a file picker.
     */
    waitForFileChooser(options?: WaitTimeoutOptions): Promise<FileChooser>;
    /**
     * Sets the page's geolocation.
     *
     * @remarks
     * Consider using {@link BrowserContext.overridePermissions} to grant
     * permissions for the page to read its geolocation.
     *
     * @example
     * ```js
     * await page.setGeolocation({latitude: 59.95, longitude: 30.31667});
     * ```
     */
    setGeolocation(options: GeolocationOptions): Promise<void>;
    /**
     * @returns A target this page was created from.
     */
    target(): Target;
    /**
     * @returns The browser this page belongs to.
     */
    browser(): Browser;
    /**
     * @returns The browser context that the page belongs to
     */
    browserContext(): BrowserContext;
    private _onTargetCrashed;
    private _onLogEntryAdded;
    /**
     * @returns The page's main frame.
     */
    mainFrame(): Frame;
    get keyboard(): Keyboard;
    get touchscreen(): Touchscreen;
    get coverage(): Coverage;
    get tracing(): Tracing;
    get accessibility(): Accessibility;
    /**
     * @returns An array of all frames attached to the page.
     */
    frames(): Frame[];
    /**
     * @returns all of the dedicated
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API | WebWorkers}
     * associated with the page.
     */
    workers(): WebWorker[];
    /**
     * @param value - Whether to enable request interception.
     *
     * @remarks
     * Activating request interception enables {@link HTTPRequest.abort},
     * {@link HTTPRequest.continue} and {@link HTTPRequest.respond} methods.  This
     * provides the capability to modify network requests that are made by a page.
     *
     * Once request interception is enabled, every request will stall unless it's
     * continued, responded or aborted.
     *
     * **NOTE** Enabling request interception disables page caching.
     *
     * @example
     * An example of a naïve request interceptor that aborts all image requests:
     * ```js
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.setRequestInterception(true);
     *   page.on('request', interceptedRequest => {
     *     if (interceptedRequest.url().endsWith('.png') ||
     *         interceptedRequest.url().endsWith('.jpg'))
     *       interceptedRequest.abort();
     *     else
     *       interceptedRequest.continue();
     *     });
     *   await page.goto('https://example.com');
     *   await browser.close();
     * })();
     * ```
     */
    setRequestInterception(value: boolean): Promise<void>;
    /**
     * @param enabled - When `true`, enables offline mode for the page.
     */
    setOfflineMode(enabled: boolean): Promise<void>;
    /**
     * @param timeout - Maximum navigation time in milliseconds.
     */
    setDefaultNavigationTimeout(timeout: number): void;
    /**
     * @param timeout - Maximum time in milliseconds.
     */
    setDefaultTimeout(timeout: number): void;
    /**
     * Runs `document.querySelector` within the page. If no element matches the
     * selector, the return value resolves to `null`.
     *
     * @remarks
     * Shortcut for {@link Frame.$ | Page.mainFrame().$(selector) }.
     *
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query page for.
     */
    $(selector: string): Promise<ElementHandle | null>;
    /**
     * @remarks
     *
     * The only difference between {@link Page.evaluate | page.evaluate} and
     * `page.evaluateHandle` is that `evaluateHandle` will return the value
     * wrapped in an in-page object.
     *
     * If the function passed to `page.evaluteHandle` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     * ```
     * const aHandle = await page.evaluateHandle('document')
     * ```
     *
     * @example
     * {@link JSHandle} instances can be passed as arguments to the `pageFunction`:
     * ```
     * const aHandle = await page.evaluateHandle(() => document.body);
     * const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
     * console.log(await resultHandle.jsonValue());
     * await resultHandle.dispose();
     * ```
     *
     * Most of the time this function returns a {@link JSHandle},
     * but if `pageFunction` returns a reference to an element,
     * you instead get an {@link ElementHandle} back:
     *
     * @example
     * ```
     * const button = await page.evaluateHandle(() => document.querySelector('button'));
     * // can call `click` because `button` is an `ElementHandle`
     * await button.click();
     * ```
     *
     * The TypeScript definitions assume that `evaluateHandle` returns
     *  a `JSHandle`, but if you know it's going to return an
     * `ElementHandle`, pass it as the generic argument:
     *
     * ```
     * const button = await page.evaluateHandle<ElementHandle>(...);
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     */
    evaluateHandle<HandlerType extends JSHandle = JSHandle>(pageFunction: EvaluateHandleFn, ...args: SerializableOrJSHandle[]): Promise<HandlerType>;
    queryObjects(prototypeHandle: JSHandle): Promise<JSHandle>;
    /**
     * This method runs `document.querySelector` within the page and passes the
     * result as the first argument to the `pageFunction`.
     *
     * @remarks
     *
     * If no element is found matching `selector`, the method will throw an error.
     *
     * If `pageFunction` returns a promise `$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```
     * const searchValue = await page.$eval('#search', el => el.value);
     * const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
     * const html = await page.$eval('.main-container', el => el.outerHTML);
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```
     * // if you don't provide HTMLInputElement here, TS will error
     * // as `value` is not on `Element`
     * const searchValue = await page.$eval('#search', (el: HTMLInputElement) => el.value);
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$eval`:
     *
     * @example
     *
     * ```
     * // The compiler can infer the return type in this case, but if it can't
     * // or if you want to be more explicit, provide it as the generic type.
     * const searchValue = await page.$eval<string>(
     *  '#search', (el: HTMLInputElement) => el.value
     * );
     * ```
     *
     * @param selector - the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query for
     * @param pageFunction - the function to be evaluated in the page context.
     * Will be passed the result of `document.querySelector(selector)` as its
     * first argument.
     * @param args - any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    $eval<ReturnType>(selector: string, pageFunction: (element: Element, ...args: unknown[]) => ReturnType | Promise<ReturnType>, ...args: SerializableOrJSHandle[]): Promise<WrapElementHandle<ReturnType>>;
    /**
     * This method runs `Array.from(document.querySelectorAll(selector))` within
     * the page and passes the result as the first argument to the `pageFunction`.
     *
     * @remarks
     *
     * If `pageFunction` returns a promise `$$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```
     * // get the amount of divs on the page
     * const divCount = await page.$$eval('div', divs => divs.length);
     *
     * // get the text content of all the `.options` elements:
     * const options = await page.$$eval('div > span.options', options => {
     *   return options.map(option => option.textContent)
     * });
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element[]`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```
     * // if you don't provide HTMLInputElement here, TS will error
     * // as `value` is not on `Element`
     * await page.$$eval('input', (elements: HTMLInputElement[]) => {
     *   return elements.map(e => e.value);
     * });
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$$eval`:
     *
     * @example
     *
     * ```
     * // The compiler can infer the return type in this case, but if it can't
     * // or if you want to be more explicit, provide it as the generic type.
     * const allInputValues = await page.$$eval<string[]>(
     *  'input', (elements: HTMLInputElement[]) => elements.map(e => e.textContent)
     * );
     * ```
     *
     * @param selector the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query for
     * @param pageFunction the function to be evaluated in the page context. Will
     * be passed the result of `Array.from(document.querySelectorAll(selector))`
     * as its first argument.
     * @param args any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    $$eval<ReturnType>(selector: string, pageFunction: (elements: Element[], ...args: unknown[]) => ReturnType | Promise<ReturnType>, ...args: SerializableOrJSHandle[]): Promise<WrapElementHandle<ReturnType>>;
    $$(selector: string): Promise<ElementHandle[]>;
    $x(expression: string): Promise<ElementHandle[]>;
    /**
     * If no URLs are specified, this method returns cookies for the current page
     * URL. If URLs are specified, only cookies for those URLs are returned.
     */
    cookies(...urls: string[]): Promise<Protocol.Network.Cookie[]>;
    deleteCookie(...cookies: Protocol.Network.DeleteCookiesRequest[]): Promise<void>;
    setCookie(...cookies: Protocol.Network.CookieParam[]): Promise<void>;
    addScriptTag(options: {
        url?: string;
        path?: string;
        content?: string;
        type?: string;
    }): Promise<ElementHandle>;
    addStyleTag(options: {
        url?: string;
        path?: string;
        content?: string;
    }): Promise<ElementHandle>;
    exposeFunction(name: string, puppeteerFunction: Function): Promise<void>;
    authenticate(credentials: Credentials): Promise<void>;
    setExtraHTTPHeaders(headers: Record<string, string>): Promise<void>;
    setUserAgent(userAgent: string): Promise<void>;
    metrics(): Promise<Metrics>;
    private _emitMetrics;
    private _buildMetricsObject;
    private _handleException;
    private _onConsoleAPI;
    private _onBindingCalled;
    private _addConsoleMessage;
    private _onDialog;
    url(): string;
    content(): Promise<string>;
    setContent(html: string, options?: WaitForOptions): Promise<void>;
    goto(url: string, options?: WaitForOptions & {
        referer?: string;
    }): Promise<HTTPResponse>;
    reload(options?: WaitForOptions): Promise<HTTPResponse | null>;
    waitForNavigation(options?: WaitForOptions): Promise<HTTPResponse | null>;
    private _sessionClosePromise;
    waitForRequest(urlOrPredicate: string | Function, options?: {
        timeout?: number;
    }): Promise<HTTPRequest>;
    waitForResponse(urlOrPredicate: string | Function, options?: {
        timeout?: number;
    }): Promise<HTTPResponse>;
    goBack(options?: WaitForOptions): Promise<HTTPResponse | null>;
    goForward(options?: WaitForOptions): Promise<HTTPResponse | null>;
    private _go;
    bringToFront(): Promise<void>;
    emulate(options: {
        viewport: Viewport;
        userAgent: string;
    }): Promise<void>;
    setJavaScriptEnabled(enabled: boolean): Promise<void>;
    setBypassCSP(enabled: boolean): Promise<void>;
    emulateMediaType(type?: string): Promise<void>;
    emulateMediaFeatures(features?: MediaFeature[]): Promise<void>;
    emulateTimezone(timezoneId?: string): Promise<void>;
    emulateVisionDeficiency(type?: VisionDeficiency): Promise<void>;
    setViewport(viewport: Viewport): Promise<void>;
    viewport(): Viewport | null;
    /**
     * @remarks
     *
     * Evaluates a function in the page's context and returns the result.
     *
     * If the function passed to `page.evaluteHandle` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * @example
     *
     * ```js
     * const result = await frame.evaluate(() => {
     *   return Promise.resolve(8 * 7);
     * });
     * console.log(result); // prints "56"
     * ```
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     * ```
     * const aHandle = await page.evaluate('1 + 2');
     * ```
     *
     * To get the best TypeScript experience, you should pass in as the
     * generic the type of `pageFunction`:
     *
     * ```
     * const aHandle = await page.evaluate<() => number>(() => 2);
     * ```
     *
     * @example
     *
     * {@link ElementHandle} instances (including {@link JSHandle}s) can be passed
     * as arguments to the `pageFunction`:
     *
     * ```
     * const bodyHandle = await page.$('body');
     * const html = await page.evaluate(body => body.innerHTML, bodyHandle);
     * await bodyHandle.dispose();
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     *
     * @returns the return value of `pageFunction`.
     */
    evaluate<T extends EvaluateFn>(pageFunction: T, ...args: SerializableOrJSHandle[]): Promise<UnwrapPromiseLike<EvaluateFnReturnType<T>>>;
    evaluateOnNewDocument(pageFunction: Function | string, ...args: unknown[]): Promise<void>;
    setCacheEnabled(enabled?: boolean): Promise<void>;
    screenshot(options?: ScreenshotOptions): Promise<Buffer | string | void>;
    private _screenshotTask;
    pdf(options?: PDFOptions): Promise<Buffer>;
    title(): Promise<string>;
    close(options?: {
        runBeforeUnload?: boolean;
    }): Promise<void>;
    isClosed(): boolean;
    get mouse(): Mouse;
    click(selector: string, options?: {
        delay?: number;
        button?: MouseButton;
        clickCount?: number;
    }): Promise<void>;
    focus(selector: string): Promise<void>;
    hover(selector: string): Promise<void>;
    select(selector: string, ...values: string[]): Promise<string[]>;
    tap(selector: string): Promise<void>;
    type(selector: string, text: string, options?: {
        delay: number;
    }): Promise<void>;
    waitFor(selectorOrFunctionOrTimeout: string | number | Function, options?: {
        visible?: boolean;
        hidden?: boolean;
        timeout?: number;
        polling?: string | number;
    }, ...args: SerializableOrJSHandle[]): Promise<JSHandle>;
    waitForSelector(selector: string, options?: {
        visible?: boolean;
        hidden?: boolean;
        timeout?: number;
    }): Promise<ElementHandle | null>;
    waitForXPath(xpath: string, options?: {
        visible?: boolean;
        hidden?: boolean;
        timeout?: number;
    }): Promise<ElementHandle | null>;
    waitForFunction(pageFunction: Function | string, options?: {
        timeout?: number;
        polling?: string | number;
    }, ...args: SerializableOrJSHandle[]): Promise<JSHandle>;
}
export {};
//# sourceMappingURL=Page.d.ts.map