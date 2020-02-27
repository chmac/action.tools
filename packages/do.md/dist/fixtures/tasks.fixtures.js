"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var u = require("unist-builder");
exports.makeTask = function (title) {
    return u("listItem", { checked: false, spread: false }, [
        u("paragraph", [
            u("text", {
                value: title
            })
        ])
    ]);
};
exports.task = u("listItem", { checked: false, spread: false }, [
    u("paragraph", [
        u("text", {
            value: "This is an example text #FKG296 with a @context and a second #tag"
        })
    ])
]);
exports.listItemWithNullChecked = u("listItem", { checked: null, spread: false }, [
    u("paragraph", [
        u("text", {
            value: "This is an example text #FKG296 with a @context and a second #tag"
        })
    ])
]);
exports.listItemWithoutChecked = u("listItem", { spread: false }, [
    u("paragraph", [
        u("text", {
            value: "This is an example text #FKG296 with a @context and a second #tag"
        })
    ])
]);
exports.taskWithKeys = u("listItem", { checked: false, spread: false }, [
    u("paragraph", [
        u("text", {
            value: "This is an example text #FKG296 with a @context and a second " +
                "#tag with a created:2020-02-15 date and a finished:2020-02-17 date"
        })
    ])
]);
exports.tree = u("root", [
    u("list", { ordered: false, spread: false, start: null }, [
        u("listeItem", { checked: false, spread: false }, [
            u("paragraph", [
                u("text", { value: "This is a task which is unchecked #Gf6a8R" })
            ])
        ]),
        u("listeItem", { checked: false, spread: false }, [
            u("paragraph", [
                u("text", { value: "This is another task also unchecked #IcL6qn" })
            ])
        ]),
        u("listeItem", { checked: null, spread: false }, [
            u("paragraph", [
                u("text", { value: "This is another task also unchecked #IcL6qn" })
            ])
        ])
    ]),
    u("heading", { depth: 1 }, [u("text", { value: "First Heading" })]),
    u("heading", { depth: 2 }, [u("text", { value: "Second Level 2 Heading" })]),
    u("paragraph", [
        u("text", {
            value: "This is a paragraph which contains a whole chunk of text"
        })
    ]),
    u("paragraph", [
        u("text", {
            value: "Followed by a paragraph of text"
        })
    ]),
    u("list", { ordered: false, spread: false, start: null }, [
        // Top level task
        u("listeItem", { checked: false, spread: false }, [
            u("paragraph", [
                u("text", { value: "This is a top level task #xAgxB9" })
            ]),
            // Nested list
            u("list", { ordered: false, spread: false, start: null }, [
                u("listeItem", { checked: false, spread: false }, [
                    u("paragraph", [u("text", { value: "This is a child task #JkmkMh" })])
                ]),
                u("listeItem", { checked: false, spread: false }, [
                    u("paragraph", [u("text", { value: "Second child task #PWfUG1" })])
                ]),
                u("listeItem", { checked: null, spread: false }, [
                    u("paragraph", [
                        u("text", { value: "Third child level task #eHaqOJ" })
                    ])
                ])
            ])
        ]),
        u("listeItem", { checked: true, spread: false }, [
            u("paragraph", [
                u("text", { value: "Back to a top level completed task #FVK0TU" })
            ])
        ]),
        u("listeItem", { checked: null, spread: false }, [
            u("paragraph", [u("text", { value: "Final top level task #lJNUwz" })])
        ])
    ])
]);
