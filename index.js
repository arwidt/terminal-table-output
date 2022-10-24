var _output = (function() {

    var _opts,
        _lineDelimiter = "{{line}}",

        _stripAnsi = function(string) {
            // https://github.com/chalk/ansi-regex/blob/main/index.js
            const pattern = [
                '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
                '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
            ].join('|');
            const regex = new RegExp(pattern, false ? undefined : 'g');

            // https://github.com/chalk/strip-ansi
            if (typeof string !== 'string') {
                throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
            }
        
            return string.replace(regex, '');
        },

        _charRegex = function() {
            // Base on https://github.com/Richienb/char-regex/blob/main/index.js

            // Unicode character classes
            const astralRange = '\\ud800-\\udfff';
            const comboMarksRange = '\\u0300-\\u036f';
            const comboHalfMarksRange = '\\ufe20-\\ufe2f';
            const comboSymbolsRange = '\\u20d0-\\u20ff';
            const comboMarksExtendedRange = '\\u1ab0-\\u1aff';
            const comboMarksSupplementRange = '\\u1dc0-\\u1dff';
            const comboRange = comboMarksRange + comboHalfMarksRange + comboSymbolsRange + comboMarksExtendedRange + comboMarksSupplementRange;
            const varRange = '\\ufe0e\\ufe0f';

            // Telugu characters
            const teluguVowels = '\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c14\\u0c60-\\u0c61';
            const teluguVowelsDiacritic = '\\u0c3e-\\u0c44\\u0c46-\\u0c48\\u0c4a-\\u0c4c\\u0c62-\\u0c63';
            const teluguConsonants = '\\u0c15-\\u0c28\\u0c2a-\\u0c39';
            const teluguConsonantsRare = '\\u0c58-\\u0c5a';
            const teluguModifiers = '\\u0c01-\\u0c03\\u0c4d\\u0c55\\u0c56';
            const teluguNumerals = '\\u0c66-\\u0c6f\\u0c78-\\u0c7e';
            const teluguSingle = `[${teluguVowels}(?:${teluguConsonants}(?!\\u0c4d))${teluguNumerals}${teluguConsonantsRare}]`;
            const teluguDouble = `[${teluguConsonants}${teluguConsonantsRare}][${teluguVowelsDiacritic}]|[${teluguConsonants}${teluguConsonantsRare}][${teluguModifiers}`;
            const teluguTriple = `[${teluguConsonants}]\\u0c4d[${teluguConsonants}]`;
            const telugu = `(?:${teluguTriple}|${teluguDouble}|${teluguSingle})`;

            // Unicode capture groups
            const astral = `[${astralRange}]`;
            const combo = `[${comboRange}]`;
            const fitz = '\\ud83c[\\udffb-\\udfff]';
            const modifier = `(?:${combo}|${fitz})`;
            const nonAstral = `[^${astralRange}]`;
            const regional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
            const surrogatePair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
            const zeroWidthJoiner = '\\u200d';
            const blackFlag = '(?:\\ud83c\\udff4\\udb40\\udc67\\udb40\\udc62\\udb40(?:\\udc65|\\udc73|\\udc77)\\udb40(?:\\udc6e|\\udc63|\\udc6c)\\udb40(?:\\udc67|\\udc74|\\udc73)\\udb40\\udc7f)';

            // Unicode regexes
            const optModifier = `${modifier}?`;
            const optVar = `[${varRange}]?`;
            const optJoin = `(?:${zeroWidthJoiner}(?:${[nonAstral, regional, surrogatePair].join('|')})${optVar + optModifier})*`;
            const seq = optVar + optModifier + optJoin;
            const nonAstralCombo = `${nonAstral}${combo}?`;
            const symbol = `(?:${[blackFlag, nonAstralCombo, combo, regional, surrogatePair, astral].join('|')})`;

            // Match string symbols (https://mathiasbynens.be/notes/javascript-unicode)
            return new RegExp(`${fitz}(?=${fitz})|${telugu}|${symbol + seq}`, 'g');
        },
        
        // https://github.com/sindresorhus/string-length
        _getStringLength = function(str) {
            if (str === '') return 0;
            str = _stripAnsi(`${str}`);
            if (str === '') return 0;
            return str.match(_charRegex()).length;

        },  

        _fillString = function(str, len, char) {
                while (_getStringLength(str) < len) {
                str += char;
            }
            return str;
        },

        _isLine = function(str) {
            if (typeof str === "string") {
                return (str.substr(0, 8) === _lineDelimiter);
            }
            return false;
        },

         _getLineChar = function(str) {
            if (str.substr(0, 8) === _lineDelimiter) {
                if (str.length > 8) {
                    return str.substr(8, str.length);
                } else {
                    return _opts.line;
               }
            }
            return false;
        };

    var _inst = function(opts) {
        _opts = opts || {
            fill: " ",
            border: " | ",
            line: "="
        };
        return {
            output: [],
            output_print: null,

            reset: function() {
                this.output = [];
                return this;
            },

            pushrow: function(arr) {
                this.output.push(arr);
                return this;
            },

            row: function() {
                this.output.push([]);
                return this;
            },

            col: function(s) {
                if (this.output.length === 0) {
                    this.output.push([]);
                }
                if (typeof this.output[this.output.length-1] === "string") {
                    this.output.push([]);
                }
                this.output[this.output.length-1].push(s);
                return this;
            },

            line: function(linegfx) {
                this.output.push(_lineDelimiter + (linegfx ? linegfx : ""));
                return this;
            },

            print: function(print) {
                // Validate columns and rows
                // Make a deep copy of output data
                var o, i, len, j, jlen;
                this.output_print = o = JSON.parse(JSON.stringify(this.output));
                // Make everything a string
                // And check longest item in each column
                var col_length = [];
                for(i = 0, len = o.length; i < len; i++) {
                    if (!_isLine(o[i])) {
                        for (j = 0, jlen = o[i].length; j < jlen; j++) {
                            o[i][j] += "";
                            if (!col_length[j]) col_length[j] = 0;
                            if (col_length[j] < _getStringLength(o[i][j])) {
                                col_length[j] = _getStringLength(o[i][j]);
                            }
                        }
                    }
                }

                var total_width = 0;
                col_length.forEach(function(val) {
                    total_width += val + _opts.border.length;
                });

                var str = "",
                    lchar;
                for(i = 0, len = o.length; i < len; i++) {
                    if (!_isLine(o[i])) {
                        for (j = 0, jlen = o[i].length; j < jlen; j++) {
                            str += _fillString(o[i][j], col_length[j], _opts.fill) + _opts.border;
                        }
                    } else {
                        lchar = _getLineChar(o[i]); 
                        str += Array(Math.round(total_width/lchar.length)).join(lchar);
                    }
                    str += "\n"
                }
                if (print) {
                    console.log(str);
                } else {
                    return str;
                }
            },

            export: function() {



            }
        };
    };

    return {
        create: function(opts) {
            return _inst(opts);
        }
    };
})();

module.exports = _output;
