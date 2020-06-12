# Brainstorming

What about making the tasks limited to a single list?

- No more headings
- Guaranteed to be hierarchical
- All non leaf nodes are "categories" or "projects"

Potentially the list items could be consistently on two lines

- [ ] An example task description  
       `after:2020-01-01` `by:2020-02-01` `repeat:every1month` `created:2020-01-01`
  - Children could be notes attached to the parent
  - [ ] Child tasks could also be allowable
  - A parent without a task is a heading
    - [ ] So maybe not all non leafs are tasks
      - How much additional info could we realistically have on a node?
      - Is this a concern to be worth contemplation?
- Work
  - Immediate
    - [ ] Do something
    - [ ] Do something else
  - Big project
    - [ ] Make a plan
  - Next big project

We could potentially automatically add a "define next action" task to the
"Next big project" item above.

## Considerations

- What would a filtered list look like?
- How would we distinguish between "empty" nodes and nodes whose tasks have been filtered out?
  - Maybe by only running the "next action" job on the whole source file.
