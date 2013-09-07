angular-i18n-properties (Pre-release 0.6.0-SNAPSHOT)
=======================

# Not for production use (yet)

Internationalization (i18n) for Angular.js using the common Java .properties resource bundle file format.

The goal of the project is to solve a general problem, not satisfy a specific scenario.

### Quick Introduction

#### [View the Demo](http://jmdobry.github.io/angular-i18n-properties/demo/)

```javascript
// put quick intro demo code here
```

### Table of Contents
1. [Demo](http://jmdobry.github.io/angular-i18n-properties/demo/)
1. [Features](#features)
1. [Status](#status)
1. [Download](#download)
1. [Install](#installation)
1. [Usage](#usage)
1. [Roadmap](#roadmap)
1. [Changelog](#changelog)
1. [Contributing](#contributing)
1. [License](#license)

<a name='features'></a>
## Features

_put list of features here_

<a name='status'></a>
## Status
| Version | Branch  | Build status                                                                                                                                                              | Test Coverage |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 0.4.0-SNAPSHOT   | [master](https://github.com/jmdobry/angular-i18n-properties)  | [![Build Status](https://travis-ci.org/jmdobry/angular-i18n-properties.png?branch=master)](https://travis-ci.org/jmdobry/angular-i18n-properties) | [Test Coverage](http://jmdobry.github.io/angular-i18n-properties/coverage/) |
| 0.4.0-SNAPSHOT   | [develop](https://github.com/jmdobry/angular-i18n-properties/tree/develop) | [![Build Status](https://travis-ci.org/jmdobry/angular-i18n-properties.png?branch=develop)](https://travis-ci.org/jmdobry/angular-i18n-properties) | |
| 0.4.0-SNAPSHOT   | [all](https://drone.io/github.com/jmdobry/angular-i18n-properties) | [![Build Status](https://drone.io/github.com/jmdobry/angular-i18n-properties/status.png)](https://drone.io/github.com/jmdobry/angular-i18n-properties/latest)

<a name='download'></a>
## Download

#### Latest Stable Version
| Type          | File | Size |
| ------------- | ----------------- | ------------------- | ---- |
| Production    | [angular-i18n-properties-0.4.0-SNAPSHOT.min.js](https://raw.github.com/jmdobry/angular-i18n-properties/master/dist/angular-i18n-properties-0.4.0-SNAPSHOT.min.js) | 6 KB |
| Development   | [angular-i18n-properties-0.4.0-SNAPSHOT.js](https://raw.github.com/jmdobry/angular-i18n-properties/master/dist/angular-i18n-properties-0.4.0-SNAPSHOT.js) | 34 KB |

<a name='installation'></a>
## Installation

#### Install with bower
```javascript
bower install angular-i18n-properties
```

Include `src/angular-i18n-properties.js` on your web page after `angular.js`.

#### Manual install
Get angular-i18n-properties from the [Download](#download) section and include it on your web page after `angular.js`.

<a name='usage'></a>
## Usage

- [Load angular-i18n-properties](#load-angular-i18n-properties)
- [API Documentation](http://jmdobry.github.io/angular-i18n-properties/docs/)

<a name='load-angular-i18n-properties'></a>
#### Load angular-i18n-properties
Make sure angular-i18n-properties is included on your web page after `angular.js`.
```javascript
angular.module('myApp', ['jmdobry.angular-i18n-properties']);
```
See [angular-i18n-properties](http://jmdobry.github.io/angular-i18n-properties/docs/module-angular-i18n-properties.html)

### [API Documentation](http://jmdobry.github.io/angular-i18n-properties/docs/)

<a name='roadmap'></a>
## Roadmap

#### 0.4.0
- Core features complete.

#### 0.6.0
- Unit tests complete.

#### 0.8.0
- Demo and documentation complete

#### 1.0.0
- Stable 1.0.0 Release

<a name='changelog'></a>
## Changelog

_No changes to report_

<a name='contributing'></a>
## Contributing

#### Submitting Issues
1. Make sure you aren't submitting a duplicate issue.
2. Carefully describe how to reproduce the problem.
3. Expect prompt feedback.

#### Submitting Pull Requests

##### Basic Idea
- Checkout a new branch based on `develop` and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b BRANCH_NAME
    ````
  - Use one branch per fix/feature
  - Prefix your branch name with `feature-` or `fix-` appropriately.
- Make your changes
  - Make sure to provide a spec for unit tests
  - Run your tests with either `karma start` or `grunt test`
  - Make sure the tests pass
- Commit your changes
  - Please provide a git message which explains what you've done
  - Commit to the forked repository
- Make a pull request
  - Make sure you send the PR to the `develop` branch
  - Travis CI is watching you!

##### More details
Read the detailed [Contributing Guide](https://github.com/jmdobry/angular-i18n-properties/blob/master/CONTRIBUTING.md)

<a name='license'></a>
## License
[MIT License](https://github.com/jmdobry/angular-i18n-properties/blob/master/LICENSE)

Copyright (C) 2013 Jason Dobry

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.