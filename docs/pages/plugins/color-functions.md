---
title: Color Functions
group: Plugins
category: Pages
---
## Description
  
  
This plugin has the following color functions:  
  
- `rgb` - returns the 6 characters lowercase hexadecimal of R, G, B.  
 The input can be a numerical array or 3 numerical parameters.  
 Each input parameter goes from [0, 255].  
_example_: `'#' + rgb(50, 30, 10)`  
_example_: `'#' + rgb([255, 255, 0])`  
- `rgba` - returns the 8 characters lowercase hexadecimal of R, G, B, A.  
 The input can be a numerical array or 4 numerical parameters.  
 R,G,B goes from [0, 255], and A goes from 0 to 1.  
_example_: `'#' + rgb(50, 30, 10, 0.1)`  
_example_: `'#' + rgb([255, 255, 0, 0.3])`  
- `hsl` - returns the 6 characters lowercase hexadecimal of H, S, L.  
 The input can be a numerical array or 3 numerical parameters.  
 Each input parameter goes from [0, 1].  
_example_: `'#' + hsl(0.5, 0.2, 0.6)`  
_example_: `'#' + hsl([0.5, 0.2, 0.6])`  
- `hsla` - returns the 8 characters lowercase hexadecimal of H, S, L, A.  
 The input can be a numerical array or 4 numerical parameters.  
 H, S, L, A goes from [0, 1].  
_example_: `'#' + hsl(0.5, 0.2, 0.6, 0.1)`  
_example_: `'#' + hsl([0.5, 0.2, 0.6, 0.3])`  
- `hsl2Rgb` - returns a numerical array representing [R, G, B].  
 The input can be a numerical array or 3 numerical parameters.  
 Each input parameter goes from [0, 1].  
_example_: `hsl2Rgb(0.5, 0.2, 0.6)`  
_example_: `hsl2Rgb([0.5, 0.2, 0.6])`  
- `rgb2Hsl` - returns a numerical array representing [H, S, L].  
 The input can be a numerical array or 3 numerical parameters.  
 Each input parameter goes from [0, 255].  
_example_: `hsl2Rgb(50, 30, 10)`  
_example_: `hsl2Rgb([50, 30, 10])`  
 _see_: [animate-colors](/gallery/latest/#animate-colors).  