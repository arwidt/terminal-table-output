var _output = (function() {

    var _fillString = function(str, len, char) {
        while (str.length < len) {
            str += char;
        }
        return str;
    };

    var _inst = function(opts) {
        var _opts = opts || {
                fill: " ",
                border: " | "
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
                this.output[this.output.length-1].push(s);
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
                    for (j = 0, jlen = o[i].length; j < jlen; j++) {
                        o[i][j] += "";

                        if (!col_length[j]) col_length[j] = 0;
                        if (col_length[j] < o[i][j].length) {
                            col_length[j] = o[i][j].length;
                        }
                    }
                }

                var str = "";
                for(i = 0, len = o.length; i < len; i++) {
                    for (j = 0, jlen = o[i].length; j < jlen; j++) {
                        str += _fillString(o[i][j], col_length[j], _opts.fill) + _opts.border;
                    }
                    str += "\n"
                }
                if (print) {
                    console.log(str);
                } else {
                    return str;
                }
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