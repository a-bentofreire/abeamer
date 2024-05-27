
@ECHO OFF
setlocal enabledelayedexpansion
REM  

REM  ------------------------------------------------------------------------
REM  Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
REM  Licensed under the MIT License.
REM  ------------------------------------------------------------------------

REM  this script is designed only for testing abeamer cli in a bash enviroment
REM  using `abeamer serve` as a live server.
REM  e.g. live-render.cmd gallery\animate-colors

if  "%1" == "" (
  echo "usage: ./live-render.cmd [--gif] [PORT] (FOLDER)"
  goto :end
) 

set GEN_GIF=0
if "%1" == "--gif" (
  set GEN_GIF=1
) else (
  goto skipShift
)
shift
:skipShift

set PORT=%1
set /a IPORT=%PORT%
if %PORT% NEQ %IPORT% (
  set PORT=9000
  goto skipShift2
)
shift
:skipShift2
set FOLDER=%1
shift

REM set FOLDER=!FOLDER!
set DFOLDER=!FOLDER:\=/!
set URL=http://localhost:!PORT!/!DFOLDER!/
set CONFIG=./!DFOLDER!/abeamer.ini

echo PORT=!PORT!
echo FOLDER=!DFOLDER!
echo URL=!URL!
echo CONFIG=!CONFIG!

REM ------------------------------------------------------------------------------
REM This code is credited to 
REM https://stackoverflow.com/questions/761615/is-there-a-way-to-indicate-the-last-n-parameters-in-a-batch-file
set params=%1
:loop
shift
if [%1]==[] goto afterloop
set params=%params% %1
goto loop
:afterloop
REM ------------------------------------------------------------------------------

echo node cli\abeamer-cli.js render !params! --dp --url !URL! --config !CONFIG!
node cli\abeamer-cli.js render !params! --dp --url !URL! --config !CONFIG!

if %GEN_GIF% == 1 (
  node cli\abeamer-cli.js gif ./!DFOLDER!
)
:end