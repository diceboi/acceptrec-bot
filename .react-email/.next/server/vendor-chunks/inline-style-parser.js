"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/inline-style-parser";
exports.ids = ["vendor-chunks/inline-style-parser"];
exports.modules = {

/***/ "(rsc)/../node_modules/inline-style-parser/index.js":
/*!****************************************************!*\
  !*** ../node_modules/inline-style-parser/index.js ***!
  \****************************************************/
/***/ ((module) => {

eval("// http://www.w3.org/TR/CSS21/grammar.html\n// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027\n\nvar COMMENT_REGEX = /\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\//g;\nvar NEWLINE_REGEX = /\\n/g;\nvar WHITESPACE_REGEX = /^\\s*/;\n// declaration\nvar PROPERTY_REGEX = /^(\\*?[-#/*\\\\\\w]+(\\[[0-9a-z_-]+\\])?)\\s*/;\nvar COLON_REGEX = /^:\\s*/;\nvar VALUE_REGEX = /^((?:'(?:\\\\'|.)*?'|\"(?:\\\\\"|.)*?\"|\\([^)]*?\\)|[^};])+)/;\nvar SEMICOLON_REGEX = /^[;\\s]*/;\n// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill\nvar TRIM_REGEX = /^\\s+|\\s+$/g;\n// strings\nvar NEWLINE = \"\\n\";\nvar FORWARD_SLASH = \"/\";\nvar ASTERISK = \"*\";\nvar EMPTY_STRING = \"\";\n// types\nvar TYPE_COMMENT = \"comment\";\nvar TYPE_DECLARATION = \"declaration\";\n/**\n * @param {String} style\n * @param {Object} [options]\n * @return {Object[]}\n * @throws {TypeError}\n * @throws {Error}\n */ module.exports = function(style, options) {\n    if (typeof style !== \"string\") {\n        throw new TypeError(\"First argument must be a string\");\n    }\n    if (!style) return [];\n    options = options || {};\n    /**\n   * Positional.\n   */ var lineno = 1;\n    var column = 1;\n    /**\n   * Update lineno and column based on `str`.\n   *\n   * @param {String} str\n   */ function updatePosition(str) {\n        var lines = str.match(NEWLINE_REGEX);\n        if (lines) lineno += lines.length;\n        var i = str.lastIndexOf(NEWLINE);\n        column = ~i ? str.length - i : column + str.length;\n    }\n    /**\n   * Mark position and patch `node.position`.\n   *\n   * @return {Function}\n   */ function position() {\n        var start = {\n            line: lineno,\n            column: column\n        };\n        return function(node) {\n            node.position = new Position(start);\n            whitespace();\n            return node;\n        };\n    }\n    /**\n   * Store position information for a node.\n   *\n   * @constructor\n   * @property {Object} start\n   * @property {Object} end\n   * @property {undefined|String} source\n   */ function Position(start) {\n        this.start = start;\n        this.end = {\n            line: lineno,\n            column: column\n        };\n        this.source = options.source;\n    }\n    /**\n   * Non-enumerable source string.\n   */ Position.prototype.content = style;\n    var errorsList = [];\n    /**\n   * Error `msg`.\n   *\n   * @param {String} msg\n   * @throws {Error}\n   */ function error(msg) {\n        var err = new Error(options.source + \":\" + lineno + \":\" + column + \": \" + msg);\n        err.reason = msg;\n        err.filename = options.source;\n        err.line = lineno;\n        err.column = column;\n        err.source = style;\n        if (options.silent) {\n            errorsList.push(err);\n        } else {\n            throw err;\n        }\n    }\n    /**\n   * Match `re` and return captures.\n   *\n   * @param {RegExp} re\n   * @return {undefined|Array}\n   */ function match(re) {\n        var m = re.exec(style);\n        if (!m) return;\n        var str = m[0];\n        updatePosition(str);\n        style = style.slice(str.length);\n        return m;\n    }\n    /**\n   * Parse whitespace.\n   */ function whitespace() {\n        match(WHITESPACE_REGEX);\n    }\n    /**\n   * Parse comments.\n   *\n   * @param {Object[]} [rules]\n   * @return {Object[]}\n   */ function comments(rules) {\n        var c;\n        rules = rules || [];\n        while(c = comment()){\n            if (c !== false) {\n                rules.push(c);\n            }\n        }\n        return rules;\n    }\n    /**\n   * Parse comment.\n   *\n   * @return {Object}\n   * @throws {Error}\n   */ function comment() {\n        var pos = position();\n        if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;\n        var i = 2;\n        while(EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))){\n            ++i;\n        }\n        i += 2;\n        if (EMPTY_STRING === style.charAt(i - 1)) {\n            return error(\"End of comment missing\");\n        }\n        var str = style.slice(2, i - 2);\n        column += 2;\n        updatePosition(str);\n        style = style.slice(i);\n        column += 2;\n        return pos({\n            type: TYPE_COMMENT,\n            comment: str\n        });\n    }\n    /**\n   * Parse declaration.\n   *\n   * @return {Object}\n   * @throws {Error}\n   */ function declaration() {\n        var pos = position();\n        // prop\n        var prop = match(PROPERTY_REGEX);\n        if (!prop) return;\n        comment();\n        // :\n        if (!match(COLON_REGEX)) return error(\"property missing ':'\");\n        // val\n        var val = match(VALUE_REGEX);\n        var ret = pos({\n            type: TYPE_DECLARATION,\n            property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),\n            value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING\n        });\n        // ;\n        match(SEMICOLON_REGEX);\n        return ret;\n    }\n    /**\n   * Parse declarations.\n   *\n   * @return {Object[]}\n   */ function declarations() {\n        var decls = [];\n        comments(decls);\n        // declarations\n        var decl;\n        while(decl = declaration()){\n            if (decl !== false) {\n                decls.push(decl);\n                comments(decls);\n            }\n        }\n        return decls;\n    }\n    whitespace();\n    return declarations();\n};\n/**\n * Trim `str`.\n *\n * @param {String} str\n * @return {String}\n */ function trim(str) {\n    return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wYXJzZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUEsMENBQTBDO0FBQzFDLHlFQUF5RTs7QUFDekUsSUFBSUEsZ0JBQWdCO0FBRXBCLElBQUlDLGdCQUFnQjtBQUNwQixJQUFJQyxtQkFBbUI7QUFFdkIsY0FBYztBQUNkLElBQUlDLGlCQUFpQjtBQUNyQixJQUFJQyxjQUFjO0FBQ2xCLElBQUlDLGNBQWM7QUFDbEIsSUFBSUMsa0JBQWtCO0FBRXRCLGtHQUFrRztBQUNsRyxJQUFJQyxhQUFhO0FBRWpCLFVBQVU7QUFDVixJQUFJQyxVQUFVO0FBQ2QsSUFBSUMsZ0JBQWdCO0FBQ3BCLElBQUlDLFdBQVc7QUFDZixJQUFJQyxlQUFlO0FBRW5CLFFBQVE7QUFDUixJQUFJQyxlQUFlO0FBQ25CLElBQUlDLG1CQUFtQjtBQUV2Qjs7Ozs7O0NBTUMsR0FDREMsT0FBT0MsT0FBTyxHQUFHLFNBQVNDLEtBQUssRUFBRUMsT0FBTztJQUN0QyxJQUFJLE9BQU9ELFVBQVUsVUFBVTtRQUM3QixNQUFNLElBQUlFLFVBQVU7SUFDdEI7SUFFQSxJQUFJLENBQUNGLE9BQU8sT0FBTyxFQUFFO0lBRXJCQyxVQUFVQSxXQUFXLENBQUM7SUFFdEI7O0dBRUMsR0FDRCxJQUFJRSxTQUFTO0lBQ2IsSUFBSUMsU0FBUztJQUViOzs7O0dBSUMsR0FDRCxTQUFTQyxlQUFlQyxHQUFHO1FBQ3pCLElBQUlDLFFBQVFELElBQUlFLEtBQUssQ0FBQ3ZCO1FBQ3RCLElBQUlzQixPQUFPSixVQUFVSSxNQUFNRSxNQUFNO1FBQ2pDLElBQUlDLElBQUlKLElBQUlLLFdBQVcsQ0FBQ25CO1FBQ3hCWSxTQUFTLENBQUNNLElBQUlKLElBQUlHLE1BQU0sR0FBR0MsSUFBSU4sU0FBU0UsSUFBSUcsTUFBTTtJQUNwRDtJQUVBOzs7O0dBSUMsR0FDRCxTQUFTRztRQUNQLElBQUlDLFFBQVE7WUFBRUMsTUFBTVg7WUFBUUMsUUFBUUE7UUFBTztR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TU4sSUFBSTtZQUNaRSxNQUFNNUM7WUFDTmlELFVBQVVDLEtBQUtKLElBQUksQ0FBQyxFQUFFLENBQUNLLE9BQU8sQ0FBQ2hFLGVBQWVXO1lBQzlDc0QsT0FBT0wsTUFDSEcsS0FBS0gsR0FBRyxDQUFDLEVBQUUsQ0FBQ0ksT0FBTyxDQUFDaEUsZUFBZVcsaUJBQ25DQTtRQUNOO1FBRUEsSUFBSTtRQUNKYSxNQUFNbEI7UUFFTixPQUFPdUQ7SUFDVDtJQUVBOzs7O0dBSUMsR0FDRCxTQUFTSztRQUNQLElBQUlDLFFBQVEsRUFBRTtRQUVkaEIsU0FBU2dCO1FBRVQsZUFBZTtRQUNmLElBQUlDO1FBQ0osTUFBUUEsT0FBT1YsY0FBZ0I7WUFDN0IsSUFBSVUsU0FBUyxPQUFPO2dCQUNsQkQsTUFBTXJCLElBQUksQ0FBQ3NCO2dCQUNYakIsU0FBU2dCO1lBQ1g7UUFDRjtRQUVBLE9BQU9BO0lBQ1Q7SUFFQWxDO0lBQ0EsT0FBT2lDO0FBQ1Q7QUFFQTs7Ozs7Q0FLQyxHQUNELFNBQVNILEtBQUt6QyxHQUFHO0lBQ2YsT0FBT0EsTUFBTUEsSUFBSTBDLE9BQU8sQ0FBQ3pELFlBQVlJLGdCQUFnQkE7QUFDdkQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1lbWFpbC1jbGllbnQvLi4vbm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wYXJzZXIvaW5kZXguanM/NWM4ZiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyMS9ncmFtbWFyLmh0bWxcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9jc3MtcGFyc2UvcHVsbC80OSNpc3N1ZWNvbW1lbnQtMzAwODgwMjdcbnZhciBDT01NRU5UX1JFR0VYID0gL1xcL1xcKlteKl0qXFwqKyhbXi8qXVteKl0qXFwqKykqXFwvL2c7XG5cbnZhciBORVdMSU5FX1JFR0VYID0gL1xcbi9nO1xudmFyIFdISVRFU1BBQ0VfUkVHRVggPSAvXlxccyovO1xuXG4vLyBkZWNsYXJhdGlvblxudmFyIFBST1BFUlRZX1JFR0VYID0gL14oXFwqP1stIy8qXFxcXFxcd10rKFxcW1swLTlhLXpfLV0rXFxdKT8pXFxzKi87XG52YXIgQ09MT05fUkVHRVggPSAvXjpcXHMqLztcbnZhciBWQUxVRV9SRUdFWCA9IC9eKCg/OicoPzpcXFxcJ3wuKSo/J3xcIig/OlxcXFxcInwuKSo/XCJ8XFwoW14pXSo/XFwpfFtefTtdKSspLztcbnZhciBTRU1JQ09MT05fUkVHRVggPSAvXls7XFxzXSovO1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvVHJpbSNQb2x5ZmlsbFxudmFyIFRSSU1fUkVHRVggPSAvXlxccyt8XFxzKyQvZztcblxuLy8gc3RyaW5nc1xudmFyIE5FV0xJTkUgPSAnXFxuJztcbnZhciBGT1JXQVJEX1NMQVNIID0gJy8nO1xudmFyIEFTVEVSSVNLID0gJyonO1xudmFyIEVNUFRZX1NUUklORyA9ICcnO1xuXG4vLyB0eXBlc1xudmFyIFRZUEVfQ09NTUVOVCA9ICdjb21tZW50JztcbnZhciBUWVBFX0RFQ0xBUkFUSU9OID0gJ2RlY2xhcmF0aW9uJztcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3R5bGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEByZXR1cm4ge09iamVjdFtdfVxuICogQHRocm93cyB7VHlwZUVycm9yfVxuICogQHRocm93cyB7RXJyb3J9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3R5bGUsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBzdHlsZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBpZiAoIXN0eWxlKSByZXR1cm4gW107XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uYWwuXG4gICAqL1xuICB2YXIgbGluZW5vID0gMTtcbiAgdmFyIGNvbHVtbiA9IDE7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBsaW5lbm8gYW5kIGNvbHVtbiBiYXNlZCBvbiBgc3RyYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oc3RyKSB7XG4gICAgdmFyIGxpbmVzID0gc3RyLm1hdGNoKE5FV0xJTkVfUkVHRVgpO1xuICAgIGlmIChsaW5lcykgbGluZW5vICs9IGxpbmVzLmxlbmd0aDtcbiAgICB2YXIgaSA9IHN0ci5sYXN0SW5kZXhPZihORVdMSU5FKTtcbiAgICBjb2x1bW4gPSB+aSA/IHN0ci5sZW5ndGggLSBpIDogY29sdW1uICsgc3RyLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIHBvc2l0aW9uIGFuZCBwYXRjaCBgbm9kZS5wb3NpdGlvbmAuXG4gICAqXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gcG9zaXRpb24oKSB7XG4gICAgdmFyIHN0YXJ0ID0geyBsaW5lOiBsaW5lbm8sIGNvbHVtbjogY29sdW1uIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIG5vZGUucG9zaXRpb24gPSBuZXcgUG9zaXRpb24oc3RhcnQpO1xuICAgICAgd2hpdGVzcGFjZSgpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSBwb3NpdGlvbiBpbmZvcm1hdGlvbiBmb3IgYSBub2RlLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IHN0YXJ0XG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBlbmRcbiAgICogQHByb3BlcnR5IHt1bmRlZmluZWR8U3RyaW5nfSBzb3VyY2VcbiAgICovXG4gIGZ1bmN0aW9uIFBvc2l0aW9uKHN0YXJ0KSB7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0geyBsaW5lOiBsaW5lbm8sIGNvbHVtbjogY29sdW1uIH07XG4gICAgdGhpcy5zb3VyY2UgPSBvcHRpb25zLnNvdXJjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb24tZW51bWVyYWJsZSBzb3VyY2Ugc3RyaW5nLlxuICAgKi9cbiAgUG9zaXRpb24ucHJvdG90eXBlLmNvbnRlbnQgPSBzdHlsZTtcblxuICB2YXIgZXJyb3JzTGlzdCA9IFtdO1xuXG4gIC8qKlxuICAgKiBFcnJvciBgbXNnYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZ1xuICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICovXG4gIGZ1bmN0aW9uIGVycm9yKG1zZykge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXG4gICAgICBvcHRpb25zLnNvdXJjZSArICc6JyArIGxpbmVubyArICc6JyArIGNvbHVtbiArICc6ICcgKyBtc2dcbiAgICApO1xuICAgIGVyci5yZWFzb24gPSBtc2c7XG4gICAgZXJyLmZpbGVuYW1lID0gb3B0aW9ucy5zb3VyY2U7XG4gICAgZXJyLmxpbmUgPSBsaW5lbm87XG4gICAgZXJyLmNvbHVtbiA9IGNvbHVtbjtcbiAgICBlcnIuc291cmNlID0gc3R5bGU7XG5cbiAgICBpZiAob3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgIGVycm9yc0xpc3QucHVzaChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoIGByZWAgYW5kIHJldHVybiBjYXB0dXJlcy5cbiAgICpcbiAgICogQHBhcmFtIHtSZWdFeHB9IHJlXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZHxBcnJheX1cbiAgICovXG4gIGZ1bmN0aW9uIG1hdGNoKHJlKSB7XG4gICAgdmFyIG0gPSByZS5leGVjKHN0eWxlKTtcbiAgICBpZiAoIW0pIHJldHVybjtcbiAgICB2YXIgc3RyID0gbVswXTtcbiAgICB1cGRhdGVQb3NpdGlvbihzdHIpO1xuICAgIHN0eWxlID0gc3R5bGUuc2xpY2Uoc3RyLmxlbmd0aCk7XG4gICAgcmV0dXJuIG07XG4gIH1cblxuICAvKipcbiAgICogUGFyc2Ugd2hpdGVzcGFjZS5cbiAgICovXG4gIGZ1bmN0aW9uIHdoaXRlc3BhY2UoKSB7XG4gICAgbWF0Y2goV0hJVEVTUEFDRV9SRUdFWCk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgY29tbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IFtydWxlc11cbiAgICogQHJldHVybiB7T2JqZWN0W119XG4gICAqL1xuICBmdW5jdGlvbiBjb21tZW50cyhydWxlcykge1xuICAgIHZhciBjO1xuICAgIHJ1bGVzID0gcnVsZXMgfHwgW107XG4gICAgd2hpbGUgKChjID0gY29tbWVudCgpKSkge1xuICAgICAgaWYgKGMgIT09IGZhbHNlKSB7XG4gICAgICAgIHJ1bGVzLnB1c2goYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydWxlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBjb21tZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqIEB0aHJvd3Mge0Vycm9yfVxuICAgKi9cbiAgZnVuY3Rpb24gY29tbWVudCgpIHtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24oKTtcbiAgICBpZiAoRk9SV0FSRF9TTEFTSCAhPSBzdHlsZS5jaGFyQXQoMCkgfHwgQVNURVJJU0sgIT0gc3R5bGUuY2hhckF0KDEpKSByZXR1cm47XG5cbiAgICB2YXIgaSA9IDI7XG4gICAgd2hpbGUgKFxuICAgICAgRU1QVFlfU1RSSU5HICE9IHN0eWxlLmNoYXJBdChpKSAmJlxuICAgICAgKEFTVEVSSVNLICE9IHN0eWxlLmNoYXJBdChpKSB8fCBGT1JXQVJEX1NMQVNIICE9IHN0eWxlLmNoYXJBdChpICsgMSkpXG4gICAgKSB7XG4gICAgICArK2k7XG4gICAgfVxuICAgIGkgKz0gMjtcblxuICAgIGlmIChFTVBUWV9TVFJJTkcgPT09IHN0eWxlLmNoYXJBdChpIC0gMSkpIHtcbiAgICAgIHJldHVybiBlcnJvcignRW5kIG9mIGNvbW1lbnQgbWlzc2luZycpO1xuICAgIH1cblxuICAgIHZhciBzdHIgPSBzdHlsZS5zbGljZSgyLCBpIC0gMik7XG4gICAgY29sdW1uICs9IDI7XG4gICAgdXBkYXRlUG9zaXRpb24oc3RyKTtcbiAgICBzdHlsZSA9IHN0eWxlLnNsaWNlKGkpO1xuICAgIGNvbHVtbiArPSAyO1xuXG4gICAgcmV0dXJuIHBvcyh7XG4gICAgICB0eXBlOiBUWVBFX0NPTU1FTlQsXG4gICAgICBjb21tZW50OiBzdHJcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBkZWNsYXJhdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKiBAdGhyb3dzIHtFcnJvcn1cbiAgICovXG4gIGZ1bmN0aW9uIGRlY2xhcmF0aW9uKCkge1xuICAgIHZhciBwb3MgPSBwb3NpdGlvbigpO1xuXG4gICAgLy8gcHJvcFxuICAgIHZhciBwcm9wID0gbWF0Y2goUFJPUEVSVFlfUkVHRVgpO1xuICAgIGlmICghcHJvcCkgcmV0dXJuO1xuICAgIGNvbW1lbnQoKTtcblxuICAgIC8vIDpcbiAgICBpZiAoIW1hdGNoKENPTE9OX1JFR0VYKSkgcmV0dXJuIGVycm9yKFwicHJvcGVydHkgbWlzc2luZyAnOidcIik7XG5cbiAgICAvLyB2YWxcbiAgICB2YXIgdmFsID0gbWF0Y2goVkFMVUVfUkVHRVgpO1xuXG4gICAgdmFyIHJldCA9IHBvcyh7XG4gICAgICB0eXBlOiBUWVBFX0RFQ0xBUkFUSU9OLFxuICAgICAgcHJvcGVydHk6IHRyaW0ocHJvcFswXS5yZXBsYWNlKENPTU1FTlRfUkVHRVgsIEVNUFRZX1NUUklORykpLFxuICAgICAgdmFsdWU6IHZhbFxuICAgICAgICA/IHRyaW0odmFsWzBdLnJlcGxhY2UoQ09NTUVOVF9SRUdFWCwgRU1QVFlfU1RSSU5HKSlcbiAgICAgICAgOiBFTVBUWV9TVFJJTkdcbiAgICB9KTtcblxuICAgIC8vIDtcbiAgICBtYXRjaChTRU1JQ09MT05fUkVHRVgpO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBkZWNsYXJhdGlvbnMuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdFtdfVxuICAgKi9cbiAgZnVuY3Rpb24gZGVjbGFyYXRpb25zKCkge1xuICAgIHZhciBkZWNscyA9IFtdO1xuXG4gICAgY29tbWVudHMoZGVjbHMpO1xuXG4gICAgLy8gZGVjbGFyYXRpb25zXG4gICAgdmFyIGRlY2w7XG4gICAgd2hpbGUgKChkZWNsID0gZGVjbGFyYXRpb24oKSkpIHtcbiAgICAgIGlmIChkZWNsICE9PSBmYWxzZSkge1xuICAgICAgICBkZWNscy5wdXNoKGRlY2wpO1xuICAgICAgICBjb21tZW50cyhkZWNscyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY2xzO1xuICB9XG5cbiAgd2hpdGVzcGFjZSgpO1xuICByZXR1cm4gZGVjbGFyYXRpb25zKCk7XG59O1xuXG4vKipcbiAqIFRyaW0gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyID8gc3RyLnJlcGxhY2UoVFJJTV9SRUdFWCwgRU1QVFlfU1RSSU5HKSA6IEVNUFRZX1NUUklORztcbn1cbiJdLCJuYW1lcyI6WyJDT01NRU5UX1JFR0VYIiwiTkVXTElORV9SRUdFWCIsIldISVRFU1BBQ0VfUkVHRVgiLCJQUk9QRVJUWV9SRUdFWCIsIkNPTE9OX1JFR0VYIiwiVkFMVUVfUkVHRVgiLCJTRU1JQ09MT05fUkVHRVgiLCJUUklNX1JFR0VYIiwiTkVXTElORSIsIkZPUldBUkRfU0xBU0giLCJBU1RFUklTSyIsIkVNUFRZX1NUUklORyIsIlRZUEVfQ09NTUVOVCIsIlRZUEVfREVDTEFSQVRJT04iLCJtb2R1bGUiLCJleHBvcnRzIiwic3R5bGUiLCJvcHRpb25zIiwiVHlwZUVycm9yIiwibGluZW5vIiwiY29sdW1uIiwidXBkYXRlUG9zaXRpb24iLCJzdHIiLCJsaW5lcyIsIm1hdGNoIiwibGVuZ3RoIiwiaSIsImxhc3RJbmRleE9mIiwicG9zaXRpb24iLCJzdGFydCIsImxpbmUiLCJub2RlIiwiUG9zaXRpb24iLCJ3aGl0ZXNwYWNlIiwiZW5kIiwic291cmNlIiwicHJvdG90eXBlIiwiY29udGVudCIsImVycm9yc0xpc3QiLCJlcnJvciIsIm1zZyIsImVyciIsIkVycm9yIiwicmVhc29uIiwiZmlsZW5hbWUiLCJzaWxlbnQiLCJwdXNoIiwicmUiLCJtIiwiZXhlYyIsInNsaWNlIiwiY29tbWVudHMiLCJydWxlcyIsImMiLCJjb21tZW50IiwicG9zIiwiY2hhckF0IiwidHlwZSIsImRlY2xhcmF0aW9uIiwicHJvcCIsInZhbCIsInJldCIsInByb3BlcnR5IiwidHJpbSIsInJlcGxhY2UiLCJ2YWx1ZSIsImRlY2xhcmF0aW9ucyIsImRlY2xzIiwiZGVjbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/inline-style-parser/index.js\n");

/***/ })

};
;