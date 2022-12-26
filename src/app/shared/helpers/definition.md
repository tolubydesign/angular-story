## Definition of folder and purpose

### [Helper Functions](https://guides.emberjs.com/release/components/helper-functions/)

"_Helper functions are JavaScript functions that you can call from your template. \
Ember's template syntax limits what you can express to keep the structure of your application clear at a glance. When you need to compute something using JavaScript, you can use helper functions. It's possible to create your own helpers or just use the built-in ones._"

---

### [ What's the differences between helpers and utils? #808 ](https://github.com/erikras/react-redux-universal-hot-example/issues/808)

"_Looks to me like /utils is a place where you can place small snippets you can use throughout the application. Small functions to build bigger things with._"

"_/helpers is more of a place where you store code architectural snippets in my view. Things essential for bootstrapping components and developer ergonomics._"


_I've run into this "issue" too while trying to structure a project. Here's how it fits me better:_

    index.js is the point of entry. It requires the modules in /modules

    /modules contains the getAll.js and getById.js modules

    /libs holds the individual steps a given module calls

    /utils has very short and specific functions used throughout functions in /libs

---

