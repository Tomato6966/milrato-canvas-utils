# milrato-canvas-utils
Canvas Util Functions and whole Builders

```js
const { songInfoCard } = require("milrato-canvas-utils");

const songCardUtil = new songInfoCard();

songCardUtil.generate({
    thumbnail: "https://i.ytimg.com/vi/YVkUvmDQ3HY/mqdefault.jpg",
    title: "Without me!", 
    author: "Eminem", 
    duration: "03:40",
    source: "sp",
})
```