- [ ] Items in the inbox need to be filed
- [ ] They can gather here but then will go south
- [ ] Choose a + or a @ for people
- [ ] Decide where # tags come into this

# Overview

This is a task system. It's a file format. Markdown.

There are @contexts. Probably people also like +Callum.

Then let's also consider #tags. Maybe #c_home for contexts? We can do tags
first and consider others later.

Numbered lists are dependency ordered. 1 must be completed before 2 can
begin, etc.

## Actions

Only some tasks can be worked on right now.

- The first uncompleted task in an ordered list.
- Any task which does not have uncompleted children.

## Data

Some data can be added to tasks. We use the format `key:value`.

- `after:YYYY-MM-DD` is a date (and optionally time) after which this task be
  started. The task cannot be started before this date.
- `by:YYYY-MM-DD` is the deadline for this task.
- `created:YYYY-MM-DD` is the date this task was created.
- `closed:YYYY-MM-DD` is the date when this task was completed.
- `snooze:YYYY-MM-DD` is a date when this task should be hidden until.
  - Snoozed dates are not quite the same as `by` dates.
  - A task might only be possible after the 1st of the month, and before the
    10th of the month, but might be snoozed on the 1st until the 4th.

All dates are in ISO format like `2020-02-29` and can optionally have a time
added. If a time is added the full ISO format must be used like
`2020-02-29T14:27:00+01:00`.

# Work

This is the general project that handles work related matters.

## General

Work stuff which doens't below in any specific sub project

- [ ] Uncompleted task at first +Generous @home #foo #bar
  - after:2020-04-01 by:2020-05-07 created:2020-02-05
  - child comment  
    this is another line in the same comment
  - [ ] A sub task @home @email +Callum +Tom

## Sequential

These tasks can be completed in order.

- [ ] Here's a series of jobs
  1. [ ] This is our first task @email
  1. [ ] This can only be completed after the first
- [ ] While a second series can be done in parallel
  1. [ ] Sub two three
  1. [ ] Again after before
