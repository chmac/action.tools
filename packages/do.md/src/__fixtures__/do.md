- [ ] New top task in inbox
- [ ] Items in the inbox need to be filed
- [ ] They can gather here but then will go south
- [ ] Choose a + or a @ for people
- [ ] Decide where # tags come into this
- [ ] Extra task, far future `after:2021-01-01`

# Work

This is the general project that handles work related matters.

## General

Work stuff which doens't below in any specific sub project

- [ ] Uncompleted task at first +Generous @home #foo #bar  
       `after:2020-04-01` `by:2020-05-07` `created:2020-02-05`
  - child comment  
    this is another line in the same comment
  - [ ] A sub task @home @email +Callum +Tom

## Sequential

These tasks can be completed in order.

- [ ] Here's a series of jobs
  1. [ ] This is our first task @email
  2. [ ] This can only be completed after the first
- [x] While a second series can be done in parallel
  1. [ ] Sub two three
  2. [ ] Again after before

# Tech

What tasks do we actually want to get done on this package?

- [x] Support weekly repeats every 3 weeks
- [ ] Node script to apply recursion
- [ ] Browser based version
  - [x] Connect to git backend
  - [x] Load data from a markdown file
  - [ ] Allow filtering
    - [x] Tags
    - [ ] Dates
  - [ ] Show time until task deadline
  - [ ] Ability to add tasks in the middle of the file
  - [ ] Better error handling in git
  - [ ] Surface pending changes count when offline
  - [ ] Read author / email from settings
  - [ ] Poll git for changes
    - [ ] Show time since last fetch
  - [ ] Allow reordering of tasks
- [ ] Option to specify dates relatively like `after:tomorrow`
- [ ] Repeat tasks with only an `after:` date
- [ ] Add a formatting step to git pipeline
- [ ] Rename `after:` to ... ? `start` or `from`?

# Examples

Some tasks which repeat so we can mess around with that.

- [ ] First repetition task `by:2020-02-05` `repeat:after3days`
- [ ] A deadline repeating task
      `after:2020-04-01` `by:2020-05-07` `repeat:after3months`
- [x] A deadline repeating task `after:2020-01-01` `by:2020-02-07`
      `repeat:after3months` `finished:2020-02-05`
