---
title: Animation Direction
group: Library
category: Pages
---
## Description
  
ABeamer implements the animation direction in a similar way of the
CSS `animation-direction` property.  
Currently is supported: `normal`, `reverse`, `alternate`, `alternate-reverse`  
  
The value is defined per property.  
Both textual and numeric values are supported.  
  
Use `iterationCount` to repeat the cycle.  
To ensure that `normal` and `reverse` finish their cycles at the same time,
the `reverse` repeats the same value at the beginning of the next cycle.  
  
_see_: [animate-loop](/gallery/latest/#animate-loop).  