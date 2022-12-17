## Definition of folder and purpose

### [What Code Goes in the Lib/ Directory?](https://codeclimate.com/blog/what-code-goes-in-the-lib-directory/)

"_lib – Application specific libraries. Basically, any kind of custom code that doesn’t belong under controllers, models, or helpers. This directory is in the load path._"

---

### [4. Set up the Folder Structure Adding Some Library Files](https://web-engineering.info/book/WebApp1/ch08s04.html)
_Adding Some Library Files_

"_The MVC folder structure of our validation app extends the structure of the minimal app by adding a lib folder containing the generic code libraries browserShims.js, errorTypes.js and util.js._"


1. "_browserShims.js contains a definition of the string trim function for older browsers that don't support this function (which was only added to JavaScript in ES5, defined in 2009). More browser shims for other recently defined functions, such as querySelector and classList, could also be added to browserShims.js._"

2. "_util.js contains the definitions of a few utility functions such as isNonEmptyString(x) for testing if x is a non-empty string.

3. "_errorTypes.js defines classes for error (or exception) types corresponding to the basic types of property constraints discussed above: StringLengthConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation, IntervalConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation. In addition, a class NoConstraintViolation is defined for being able to return a validation result object in the case of no constraint violation._"
