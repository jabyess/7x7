# 7x7 Grid Game

A vanilla js browser game inspired by some random android app by the same name I
found years ago.

## Why

I remember playing it on android and thinking "I could probably build this" when
I was first starting out my programming career. So I started on it and have
(mostly not) worked on it over the past few years.

## About

The only rules I gave myself were to write everything in vanilla JS. No
bundlers, only browser-safe ES6. I did have one allowance to use Sass, which I use gulp to compile.

## Rules
Every turn, random squares appear in random locations. Select a square and move it to the desired location. If you can arrange 4 or more squares adjacently, they disappear. Bonus multiplier for removing >4 at a time.

A square may only be moved if there's a clear path to the new location (but this doesn't work yet).

## Todo:

* Build a better match data structure - probably use Set() for duplicate removal
* Implement pathfinding algorithm to ensure moves are valid and invalid
  * Only moves with a clear path should be considered valid
* Levels
  * Number of squares that appear every turn should increase
  * Every few levels (3 or 4), a new color is added
* Dynamic grid size
* CSS / styling
