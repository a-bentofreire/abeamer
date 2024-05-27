// 

// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
//                               Compiler Dependent
// ------------------------------------------------------------------------

/** compiler dependent signed integer, usually 16 bits */
declare type short = number;

/** compiler dependent unsigned integer, usually 16 bits */
declare type ushort = number;

/** compiler dependent signed integer, usually 32 bits */
declare type int = number;

/** compiler dependent unsigned integer, usually 32 bits */
declare type uint = number;

/** compiler dependent signed integer, usually 64 bits */
declare type long = number;

// ------------------------------------------------------------------------
//                               Compiler Independent
// ------------------------------------------------------------------------

/** 8-bit unsigned integer same as byte */
declare type uint8 = number;

/** 8-bit unsigned integer same uint8 */
declare type byte = uint8;

/** 16-bit unsigned integer */
declare type uint16 = number;

/** 32-bit signed integer */
declare type int32 = number;

/** 64-bit signed integer, same as long64 */
declare type int64 = number;

/** 64-bit signed integer, same as int64 */
declare type long64 = int64;