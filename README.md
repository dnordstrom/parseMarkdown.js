# parseMarkdown.js

A tiny Markdown parser based completely on Mathieu Henri's [mmd.js](https://github.com/p01/mmd.js), with somewhat clarified code, and added syntax (such as underbar emphasis) and features (such as escapable characters). If you consider using it, I recommend first having a look at Mathieu's original source to see if it suits you better.

The feature set is limited—it is merely meant as a small solution ready to be plugged in anywhere as a simple JavaScript function.

For complete Markdown support, I recommend [marked](https://github.com/chjj/marked) (at about 1200 lines of code, while parseMarkdown.js is about 100 lines).