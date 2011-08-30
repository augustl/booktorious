(function (GLOBAL) {
    var Copperplate = function (template) {
        this.template = template;
    }

    Copperplate.prototype = {
        html: function (data) {
            var elements = this.template.match(/\<[^\>]+\>|[^\<]+/g);
            var out = [];
            var ifBlocks = [];
            var previousTagWasConditionalEndTag;

            for (var i = 0, il = elements.length; i < il; i++) {
                var e = this.insertVariables(elements[i], data);
                var ifBlocksEntry = ifBlocks[ifBlocks.length - 1];

                // End tag
                if (/^\<\//.test(e)) {
                    var t = this.getTag(e);

                    if (t[0] === "if") {
                        previousTagWasConditionalEndTag = true;
                        ifBlocksEntry.previousEndTag = "if";
                    } else if (t[0] === "else") {
                        previousTagWasConditionalEndTag = true;
                        if (ifBlocks.length === 0) {
                            throw Error("Unexpected else, not in a tree.")
                        }

                        ifBlocksEntry.previousEndTag = "else";

                        ifBlocks.pop();
                    } else if (t[0] === "elseif") {
                        if (previousTagWasConditionalEndTag) {
                            ifBlocks.pop();
                        }

                        previousTagWasConditionalEndTag = true;
                        if (ifBlocks.length === 0) {
                            throw Error("Unexpected elseif, not in a tree.")
                        }

                        ifBlocksEntry.previousEndTag = "elseif";
                    } else {
                        if (ifBlocksEntry) {
                            if (previousTagWasConditionalEndTag && ifBlocksEntry.previousEndTag) {
                                ifBlocks.pop();
                            }
                        }

                        if (!this.ifBlocksContainsFalse(ifBlocks)) {
                            out.push(e);
                        }
                    }


                // Start tag
                } else if (/^\</.test(e)) {
                    var t = this.getTag(e);

                    // State for 
                    var stateAttribute = t[1][0] && t[1][0][0];
                    var state = data[stateAttribute];

                    if (typeof(state) === "function") {
                        state = state.call(data);
                    }

                    if (t[0] === "if") {
                        if (ifBlocksEntry) {
                            if (previousTagWasConditionalEndTag && ifBlocksEntry.previousEndTag === "if") {
                                ifBlocks.pop();
                            }
                        }

                        ifBlocks.push({
                            didTerminate: state,
                            currentState: state,
                            previousEndTag: null
                        });

                        previousTagWasConditionalEndTag = false;
                    } else if (t[0] === "else") {
                        previousTagWasConditionalEndTag = false;

                        if (ifBlocksEntry.didTerminate) {
                            ifBlocksEntry.currentState = false;
                            continue;
                        } else {
                            ifBlocksEntry.currentState = !ifBlocksEntry.currentState;
                        }
                    } else if (t[0] === "elseif") {
                        previousTagWasConditionalEndTag = false;

                        if (ifBlocksEntry.didTerminate) {
                            ifBlocksEntry.currentState = false;
                            continue;
                        } else {
                            ifBlocksEntry.didTerminate = state;
                            ifBlocksEntry.currentState = state;
                        }
                    } else {
                        if (ifBlocksEntry) {
                            if (previousTagWasConditionalEndTag && ifBlocksEntry.previousEndTag) {
                                ifBlocks.pop();
                            }
                        }

                        if (!this.ifBlocksContainsFalse(ifBlocks)) {
                            out.push(e);
                        }   
                    }


                // Content
                } else {
                    if (/^\s+$/.test(e)) {
                        out.push(e);
                        continue;
                    }

                    if (ifBlocksEntry) {
                        if (previousTagWasConditionalEndTag && ifBlocksEntry.previousEndTag) {
                            ifBlocks.pop();
                        }
                    }


                    if (!this.ifBlocksContainsFalse(ifBlocks)) {
                        out.push(e);
                    }
                }                
            }
            
            return out.join("");
        },

        ifBlocksContainsFalse: function (ifBlocks) {
            var res = false;
            for (var j = 0, jl = ifBlocks.length; j < jl; j++) {
                if (!ifBlocks[j].currentState) {
                    res = true;
                }                            
            }

            return res;
        },

        getTag: function (tag) {
            var out = [];
            out.push(tag.match(/^\<\/?([a-zA-Z]+)/)[1]);

            var rawAttrs = tag.match(/^\<\/?[a-zA-Z]+ ([^\>]+)/);
            if (rawAttrs) {
                data = rawAttrs[1].split(/ +/g);
                var attrs = [];
                for (var i = 0, il = data.length; i < il; i++) {
                    var split = data[i].split("=");
                    var val = split[1] || null;

                    if (val) {
                        val = val.replace(/^['"](.*?)['"]$/, "$1");
                    }

                    attrs.push([split[0], val]);
                }
                out.push(attrs);
            } else {
                out.push([]);
            }

            return out;
        },

        insertVariables: function (string, data) {
            return string.replace(/{{([^}]+)}}/, function (all, key) {
                return data[key] || "";
            });
        }
    }

    GLOBAL.Copperplate = Copperplate;
}(this));