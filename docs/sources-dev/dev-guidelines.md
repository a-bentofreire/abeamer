<!--- @uuid: dd535f15-994e-479c-a280-e2ba94f22699 -->
<!--- @author: Alexandre Bento Freire -->
# Description

This document defines the coding, testing and documentation rules for developers
who wish to participate on the ABeamer development.  
It also applies for any plugin creator who wish to have a plugin marked as official.  

# Principles

The following list defines the fundamental design Principles that both code and documentation must follow:  
  
- D01. Any end-user with the basic knowledge of HTML+CSS must be able to create an animation in his local machine.
- D02. Except for user Code Handlers, everything animation command should be able to reproduced in a remote machine via `teleportation`.
- D03. An advanced end-user must be able to customize his animations by using Code Handlers.
- D04. An end-user must be able to use ABeamer without TypeScript nor SCSS.
- D05. ABeamer must have as complete as possible information regarding types and interfaces for any end-user who uses TypeScript.
- D06. Except for any specific gallery example, any developer **must** be able to any operation offline, including coding, testing, building and documenting.
- D07. The web browser library must have absolute minimum dependencies and these must be included in the installation.
- D08. Both the render server agent and command line can only require: `nodejs`, `ffmpeg` and a server such as `puppeteer`.

# Code Formating Rules

- F01. No tabs.
- F02. 2 space indenting.
- F03. Maximum 80 characters per line (not mandatory but it's advisable).
- F04. Single quotes except for "use strict" line and import/require lines.
- F05. 2 blank lines between each code group (function, interface, ...) except if it's a single code line.
- F06. 1 blank line between the function or method definition (name and parameters) and the code if the definition takes more than one line.
- F07. Sort members by context not alphabetically.
- F08. Group the code by section separated by the following section header:
```
<blank line>
// ------------------------------------------------------------------------
//                               <title>
// ------------------------------------------------------------------------
<blank line>
```
- F09. 1 blank line between the code and the section header, both before and after.
- F10. If a statement has to be split into multiple lines by a binary operator or a dot,
this one must be placed in the new line not in the end of the previous line.

# General Coding Rules

- G01. Every source file must have an UUID at the top, according 
to this format [uuid-licenses](https://github.com/a-bentofreire/uuid-licenses)
- G02. All source code must be done in TypeScript including gulp files.
- G03. All the source code of every TypeScript file must be enclosed inside a namespace including gulp files.
- G04. Code caveats must be signaled with a comment line starting with: // @WARN:
- G05. Todo comment lines must start with // @TODO:
- G06. JSDocs comments must not include information regarding the parameters 
except if there is any parameter that has very specific information.
- G07. All function and method parameters and all interface items must be strong typed.
- G08. Integer values must use the type: `int` or `uint`, as it is defined in [scalar types](https://github.com/a-bentofreire/scalartypes).
- G09. Don't use `null`, use only `undefined` for empty or non-value situations.

# Web Browser Library Coding Rules

- Every source file must use ABeamer namespace.
- Every id that isn't for end-user, it must start with underscore.
- If a function or method has 2 versions one for the end-user and another for internal use, usually with less strict checks, the second must start with `_internal`.
- Don't use `const enum` for end-user constants.
- Every class private property or method must have `protected` access.
- For long classes such as `_Story` and `_Scene`, use pointers to `_(name)Impl`.
- Every module must be marked as `end-user`, `internal` or `shared`.

<!--- @TODO: Describe the rules for documentation, testing, building -->
