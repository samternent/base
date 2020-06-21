# Simon’s Sweet Shop Challenge

https://sss.samternent.vercel.app/

## Code Strcuture

### Frontend
The frontend is built in [Svelte](https://svelte.dev/blog/svelte-3-rethinking-reactivity).

This was chosen for performance and simplicity. The frontend code is kept under the src directory.

#### Development
```javascript
npm npm app-watch // start dev server
```

### Core
Logic is written in Typescript and tested using [AVA](https://github.com/avajs/ava).

This directory can be access through the frontend using the alias `@core`.

#### Development
```javascript
npm npm core-test // run tests
npm npm core-watch. // Watcher for development
npm npm core-test-watch // tests with watcher
```



## Background

Simon’s Sweet Shop (SSS) is a confectionery wholesalerthat sells sweets in a
variety of pack sizes. They currently have 5 different size packs - 250, 500,
1000, 2000 and 5000. Their customers can order any amount of sweets they
wish but they will only ever be sold full packs. They recently changed their pack
sizes and may change them again in future depending on demand.

## Requirements

Build a solution that will enable SSS to send out packs of sweets with as little
wastage as possible for any given order size. In orderto achieve this, the
following rules should be followed.

1. Only whole packs can be sent. Packs cannot be broken open.
2. Within the constraints of Rule 1 above, send out no more Sweets than
necessary to fulfil the order.
3. Within the constraints of Rules 1 & 2 above, send out as few packs as
possible to fulfil each order.
The solution should also be flexible enough to add orremove pack sizes as well
as change current pack sizes with minimal adjustments to the program.
