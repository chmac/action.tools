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
- `finished:YYYY-MM-DD` is the date when this task was completed.
- `snooze:YYYY-MM-DD` is a date when this task should be hidden until.
  - Snoozed dates are not quite the same as `before` dates.
  - A task might only be possible after the 1st of the month, and before the
    10th of the month, but might be snoozed on the 1st until the 4th.

All dates are in ISO format like `2020-02-29` and can optionally have a time
added. If a time is added the format is just `HH:MM` like `2020-02-29T14:27`.

## Recursion

Some tasks are repeated. They are often repeated on a schedule. This can be
based on either **the date of completion** or the **after** date, or the
**before** date. For simplicity we'll say that repetition will always affect
both the `after` and `before` dates.

- `repeat:everymon,tue,wed,thu,fri`
- `repeat:every1jan,apr,jul,oct`
- `repeat:every1,8,12jan,apr,jul,oct`
- `repeat:every3months`
- `repeat:every2days`
- `repeat:after3months`

There are 2 keywords `every` and `after`. The `every` keyword means that the
task repeats based on its `after` and `before` dates. The `after` keyword
means that the task repeats this period after its completion.

## Automation

We can automate some tasks. For example we could automate the replacement of
some dates. An example might be `after:+7d` which says the task must be
started after 7 days from now. We could automate the replacement of the `+7d`
with a date 7 days in the future.

- Relative date replacements
- Creating the next task iteration

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

# Tech

What tasks do we actually want to get done on this package?

- [x] Support weekly repeats every 3 weeks
- [ ] Node script to apply recursion
- [ ] Browser based version
  - [ ] Connect to git backend
  - [ ] Load data from a markdown file
  - [ ] Allow filtering
    - [ ] Tags
    - [ ] Dates

# Examples

Some tasks which repeat so we can mess around with that.

- [ ] First repetition task by:2020-02-05 repeat:after3days
- [ ] A deadline repeating task
      after:2020-04-01 by:2020-05-07 repeat:after3months
- [x] A deadline repeating task after:2020-01-01 by:2020-02-07
      repeat:after3months finished:2020-02-05
