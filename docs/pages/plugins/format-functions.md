---
title: Format Functions
group: Plugins
category: Pages
---
## Description
  
This plugin has the following format functions:  
  
`numToStr` - converts a number (with grouping) to string. the input is value, optional locale.  
`nogrpToStr` - converts a number (no grouping) to string. the input is value, optional locale.  
`currToStr` - converts a number to currency string. the input is value, optional locale, optional currency name.  
  
 If no locale is defined the default locale is used.  
 For `currToStr`, the default currency is `USD`,
 to change this value it must define the locale.  
  
## Examples
```  
=numToStr(4000.45)
// returns "4,000.45"  
=nogrpToStr(4000.45)
// returns "4000.45"  
=currToStr(4000.45, 'pt-PT', 'EUR')
// returns "1 500,50 €"  
```  
  