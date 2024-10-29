---
title: Datetime Functions
group: Plugins
category: Pages
---
## Description
  
  
This plugin has the following datetime functions:  
  
`now` - returns the current date/time to be used by the other datetime functions.  
  
`date` - returns a specific date/time to be used by the other functions.  
  The input can be the following:  
 - a textual formated date or date/time. e.g. `date('1974-04-25 12:20:10')`.  
     for the supported formats, read [Mozilla Date Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).  
 - 3 numerical values, representing `year,month,day`. e.g. `date(1985,6,12)`.  
 - 6 numerical values, representing date and time. e.g. `date(1755,11,1,9,40,0)`.  
  
`formatDateTime` - returns a formatted version of the datetime.  
  The input is:  
  - format. this follows the rules of [momentjs](https://momentjs.com/docs/#/displaying/).  
         The supported tokens are:  
    - `YY` - 2-digits year.  
    - `YYYY` - 4-digits year.  
    - `M` - month.  
    - `MM` - zero-pad month. e.g. `02`.  
    - `MMM` - 3-char month name.  
    - `MMMM` - long month name.  
    - `d` - day of the week.  
    - `ddd` - 3-char day of the week.  
    - `dddd` - long day of the week.  
    - `D` - day of the month.  
    - `DD` - zero-pad day of the month.  
    - `H` - hour (0-23).  
    - `HH` - zero-pad hour (00-23).  
    - `h` - hour (1-12).  
    - `hh` - zero-pad hour (01-12).  
    - `m` - minute.  
    - `mm` - zero-pad minute.  
    - `s` - second.  
    - `ss` - zero-pad second.  
    - `A` - AM PM.  
    - `a` - am pm.  
  - datetime. A value created by `now` or by `date`.  
  - optional locale. Used to decode month, AM/PM, and weekday names.  
  
`year` - returns the 4-digit year of the datetime.  
  The datetime is a value created by `now` or by `date`.  
  
`shortYear` - returns the 2-digit year of the datetime.  
  The datetime is a value created by `now` or by `date`.  
  
`month` - returns the month of the datetime.  
  The datetime is a value created by `now` or by `date`.  
  
`day` - returns the day of the datetime.  
  The datetime is a value created by `now` or by `date`.  
  
`hour` - returns the hour of the datetime.  
  The datetime is a value created by `now` or by `date`.  
  
`minute` - returns the minute of the datetime.  
  The datetime is a value created by `now` or by `date`.  
  
`second` - returns the second of the datetime.  
  The datetime is a value created by `now` or by `date`.