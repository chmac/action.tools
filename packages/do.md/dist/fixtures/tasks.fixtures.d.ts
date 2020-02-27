import { Task } from "../types";
export declare const makeTask: (title: string) => Task;
export declare const task: {
    type: "listItem";
    children: {
        type: "paragraph";
        children: ({
            type: "text";
        } & {
            value: string;
        })[];
    }[];
} & {
    checked: boolean;
    spread: boolean;
};
export declare const listItemWithNullChecked: {
    type: "listItem";
    children: {
        type: "paragraph";
        children: ({
            type: "text";
        } & {
            value: string;
        })[];
    }[];
} & {
    checked: null;
    spread: boolean;
};
export declare const listItemWithoutChecked: {
    type: "listItem";
    children: {
        type: "paragraph";
        children: ({
            type: "text";
        } & {
            value: string;
        })[];
    }[];
} & {
    spread: boolean;
};
export declare const taskWithKeys: {
    type: "listItem";
    children: {
        type: "paragraph";
        children: ({
            type: "text";
        } & {
            value: string;
        })[];
    }[];
} & {
    checked: boolean;
    spread: boolean;
};
export declare const tree: {
    type: "root";
    children: (({
        type: "heading";
        children: ({
            type: "text";
        } & {
            value: string;
        })[];
    } & {
        depth: number;
    }) | {
        type: "paragraph";
        children: ({
            type: "text";
        } & {
            value: string;
        })[];
    } | ({
        type: "list";
        children: (({
            type: "listeItem";
            children: ({
                type: "paragraph";
                children: ({
                    type: "text";
                } & {
                    value: string;
                })[];
            } | ({
                type: "list";
                children: (({
                    type: "listeItem";
                    children: {
                        type: "paragraph";
                        children: ({
                            type: "text";
                        } & {
                            value: string;
                        })[];
                    }[];
                } & {
                    checked: boolean;
                    spread: boolean;
                }) | ({
                    type: "listeItem";
                    children: {
                        type: "paragraph";
                        children: ({
                            type: "text";
                        } & {
                            value: string;
                        })[];
                    }[];
                } & {
                    checked: null;
                    spread: boolean;
                }))[];
            } & {
                ordered: boolean;
                spread: boolean;
                start: null;
            }))[];
        } & {
            checked: boolean;
            spread: boolean;
        }) | ({
            type: "listeItem";
            children: {
                type: "paragraph";
                children: ({
                    type: "text";
                } & {
                    value: string;
                })[];
            }[];
        } & {
            checked: null;
            spread: boolean;
        }))[];
    } & {
        ordered: boolean;
        spread: boolean;
        start: null;
    }))[];
};
