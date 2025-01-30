# 7x7 Grid Game

A vanilla js browser game inspired by some random android app by the same name I
found years ago.

## Why

I remember playing it on android and thinking "I could probably build this" when
I was first starting out my programming career. So I started on it and have
(mostly not) worked on it over the past few years until recently.

## About

The only rules I gave myself were to write everything in vanilla JS. No
bundlers, only browser-safe ES6. I did have one allowance to use Sass, which I use gulp to compile.

## Rules
Every turn, random colored squares appear in random (empty) locations. Select a square and move it to the desired location. If you can arrange 4 or more squares adjacently, they disappear. Bonus multiplier for removing >4 at a time.

A square may only be moved if there's a clear path to the new location.

As you accumulate points, the difficulty level increases (more squares appear every turn).

## Live version

http://jabyess.github.io/7x7/

## Execution

```
$ git clone https://github.com/jabyess/7x7
$ cd 7x7
```

Then load up `index.html` in your favorite static webserver. If you don't have one:

```
$ npm install -g http-server
$ http-server .
```

## To run gulp and compile sass to css
tested using node 12.22.12

- `npm install` 
- `npx gulp`


## Todo:

* Levels
  * ~~Number of squares that appear every turn should increase as levels progress~~
  * Every few levels (3 or 4), a new color is added
* Dynamic grid size??
* on successful move, don't make pieces disappear instantly, play some animation
* CSS / styling
* animations
* highlight valid move paths
