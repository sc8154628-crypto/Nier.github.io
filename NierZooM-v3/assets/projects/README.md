# Project Detail Media

Each numbered folder belongs to one work in the carousel. Put its detail images
or videos in that folder. Then add their relative paths to the matching `items`
array in `src/data/project-galleries.js`.

Example:

```js
"web-greattop": {
  folder: "assets/projects/01-greattop",
  items: [
    "assets/projects/01-greattop/01.webp",
    "assets/projects/01-greattop/02.webp"
  ]
}
```

For a video item, use `{ src: "assets/projects/03-hikariro/01.mp4", type: "video", poster: "assets/projects/03-hikariro/01.webp" }`.
