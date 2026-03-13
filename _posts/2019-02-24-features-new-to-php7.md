---
layout: post
title: 'Features New to PHP7'
date: 2019-02-24 07:13:31 -0600
modified_date: 2020-10-02 21:09:53 -0500
description: 'A few new PHP7 features that would be useful for frontend developers.'
categories: ['Notes']
tags: ['php', 'php7', 'phpcs', 'wordpress']
---

These notes are from a LinkedIn Learning Course that can be found here: [https://www.linkedin.com/learning/php-7-new-features](https://www.linkedin.com/learning/php-7-new-features)

## Scalar Type Declarations

Three Techniques:

- None: returns as-is
- Coercive: coerces value before returning it
- Strict: raises error if type does not match

### None

```php
function sum($a, $b) {
    echo $a . " " . gettype($a) . " + ";
    echo $b . " " . gettype($b) . " = ";
    $result = $a + $b;
    echo $result . "" . gettype($result);
}

sum(2, 3);
// 2 integer + 3 integer = 5 integer
sum("2", "3");
// 2 string + 3 string = 5 integer
sum(2.0, 3.0);
// 2 double + 3 double = 5 double
```

### Coercive

```php
function sum(int $a,int $b) {
    echo $a . " " . gettype($a) . " + ";
    echo $b . " " . gettype($b) . " = ";
    $result = $a + $b;
    echo $result . "" . gettype($result);
}

sum(2, 3);
// 2 integer + 3 integer = 5 integer
sum("2", "3");
// 2 integer + 3 integer = 5 integer
sum(2.0, 3.0);
// 2 integer + 3 integer = 5 integer
```

### Strict

```php
declare(strict_types=1);

function sum(int $a,int $b) {
    echo $a . " " . gettype($a) . " + ";
    echo $b . " " . gettype($b) . " = ";
    $result = $a + $b;
    echo $result . "" . gettype($result);
}

sum(2, 3);
// 2 integer + 3 integer = 5 integer
sum("2", "3");
// TypeError: Argument must be of the type integer, string given
sum(2.0, 3.0);
// TypeError: Argument must be of the type integer, float given
```

### Types

- array
- bool
- float
- int
- string

## Return Type Declarations

Three Techniques:

- None: returns as-is
- Coercive: coerces value before returning it
- Strict: raises error if type does not match

### None

```php
function sum($a, $b) {
    return $a + $b;
}

echo gettype(sum(2, 3));
// integer
echo gettype(sum("2", "3"));
// integer
echo gettype(sum(2.0, 3.0));
// double
```

### Coercive

```php
function sum($a, $b): int {
    return $a + $b;
}

echo gettype(sum(2, 3));
// integer
echo gettype(sum("2", "3"));
// integer
echo gettype(sum(2.0, 3.0));
// integer
```

### Strict

```php
declare(strict_types=1);

function sum($a, $b): int {
    return $a + $b;
}

echo gettype(sum(2, 3));
// integer
echo gettype(sum("2", "3"));
// integer
echo gettype(sum(2.0, 3.0));
// TypeError: Return value must be of the type integer, float returned
```

## Combined Comparison Operator

Also known as:

> spaceship operator

Comparison Operators

```
==, ===
!=, !==
<, <=
>, >=
```

Combined Comparison Operator

- <=>

```php
$swatch_price <=> $rolex_price
```

- Returns -1 when left side is less than right side.
- Returns 0 when both sides are equal.
- Returns 1 when left side is greater then right side.

Example 1:

Switch case.

```php
$a = 100;
$b = 200;

switch($a <=> $b) {
    case -1:
        echo '$a is less than $b'; break;
    case 0:
        echo '$a is equal to $b'; break;
    case 1:
        echo '$a is greater than $b'; break;
}
```

Example 2:

Sort array by price.

```php
$watches = array(
    array('brand': 'Swatch', 'price': 50.0),
    array('brand': 'Timex', 'price': 5.0),
    array('brand': 'Rolex', 'price': 500.0)
);

// Sort by price, in ascending order
function sort_by_price($watch1, $watch2) {
    return $watch1['price'] <=> $watch2['price'];
}

usort($watch, 'sort_by_price');
```

When watch1 before watch2 ascending order.

When watch1 after watch2 descending order.

- [usort docs](http://php.net/manual/en/function.usort.php)
- [Comparison Operators](http://php.net/manual/en/language.operators.comparison.php)

## Null Coalescing Operator

What it looks like: ??

Returns first value that exists and is not NULL

Example 1:

```php
$value = $user_value ?? $default_value;
```

Same as:

```php
if (isset($user_value)) {
    $value = $user_value;
} else {
    $value = $default_value;
}
```

Examples:

```php
echo $page_title ?? 'My Cool PHP App';

$username = $_POST['username'] ?? 'guest';

$value = $a ?? $b ?? $c ?? $d ?? $default;
```
