export declare const addFsHttp: <T extends object>(opts: T) => T & {
    fs: any;
    http: any;
};
export declare const startup: () => Promise<void>;
export declare const getMarkdown: (filename: string) => Promise<string>;
export declare const setMarkdown: (markdown: string) => Promise<void>;
