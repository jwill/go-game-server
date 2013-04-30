/**
 * CoffeeScript Compiler v1.1.3
 * http://coffeescript.org
 *
 * Copyright 2011, Jeremy Ashkenas
 * Released under the MIT License
 */
this.CoffeeScript = function () {
    function require(a) {
        return require[a]
    }

    require["./helpers"] = new function () {
        var a = this;
        (function () {
            var b, c;
            a.starts = function (a, b, c) {
                return b === a.substr(c, b.length)
            }, a.ends = function (a, b, c) {
                var d;
                d = b.length;
                return b === a.substr(a.length - d - (c || 0), d)
            }, a.compact = function (a) {
                var b, c, d, e;
                e = [];
                for (c = 0, d = a.length; c < d; c++)b = a[c], b && e.push(b);
                return e
            }, a.count = function (a, b) {
                var c, d;
                c = d = 0;
                if (!b.length)return 1 / 0;
                while (d = 1 + a.indexOf(b, d))c++;
                return c
            }, a.merge = function (a, c) {
                return b(b({}, a), c)
            }, b = a.extend = function (a, b) {
                var c, d;
                for (c in b)d = b[c], a[c] = d;
                return a
            }, a.flatten = c = function (a) {
                var b, d, e, f;
                d = [];
                for (e = 0, f = a.length; e < f; e++)b = a[e], b instanceof Array ? d = d.concat(c(b)) : d.push(b);
                return d
            }, a.del = function (a, b) {
                var c;
                c = a[b], delete a[b];
                return c
            }, a.last = function (a, b) {
                return a[a.length - (b || 0) - 1]
            }
        }).call(this)
    }, require["./rewriter"] = new function () {
        var a = this;
        (function () {
            var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t = Object.prototype.hasOwnProperty, u = Array.prototype.indexOf || function (a) {
                for (var b = 0, c = this.length; b < c; b++)if (t.call(this, b) && this[b] === a)return b;
                return-1
            }, v = Array.prototype.slice;
            a.Rewriter = function () {
                function a() {
                }

                a.prototype.rewrite = function (a) {
                    this.tokens = a, this.removeLeadingNewlines(), this.removeMidExpressionNewlines(), this.closeOpenCalls(), this.closeOpenIndexes(), this.addImplicitIndentation(), this.tagPostfixConditionals(), this.addImplicitBraces(), this.addImplicitParentheses();
                    return this.tokens
                }, a.prototype.scanTokens = function (a) {
                    var b, c, d;
                    d = this.tokens, b = 0;
                    while (c = d[b])b += a.call(this, c, b, d);
                    return!0
                }, a.prototype.detectEnd = function (a, b, c) {
                    var f, g, h, i, j;
                    h = this.tokens, f = 0;
                    while (g = h[a]) {
                        if (f === 0 && b.call(this, g, a))return c.call(this, g, a);
                        if (!g || f < 0)return c.call(this, g, a - 1);
                        if (i = g[0], u.call(e, i) >= 0)f += 1; else if (j = g[0], u.call(d, j) >= 0)f -= 1;
                        a += 1
                    }
                    return a - 1
                }, a.prototype.removeLeadingNewlines = function () {
                    var a, b, c, d;
                    d = this.tokens;
                    for (a = 0, c = d.length; a < c; a++) {
                        b = d[a][0];
                        if (b !== "TERMINATOR")break
                    }
                    if (a)return this.tokens.splice(0, a)
                }, a.prototype.removeMidExpressionNewlines = function () {
                    return this.scanTokens(function (a, b, d) {
                        var e;
                        if (!(a[0] === "TERMINATOR" && (e = this.tag(b + 1), u.call(c, e) >= 0)))return 1;
                        d.splice(b, 1);
                        return 0
                    })
                }, a.prototype.closeOpenCalls = function () {
                    var a, b;
                    b = function (a, b) {
                        var c;
                        return(c = a[0]) === ")" || c === "CALL_END" || a[0] === "OUTDENT" && this.tag(b - 1) === ")"
                    }, a = function (a, b) {
                        return this.tokens[a[0] === "OUTDENT" ? b - 1 : b][0] = "CALL_END"
                    };
                    return this.scanTokens(function (c, d) {
                        c[0] === "CALL_START" && this.detectEnd(d + 1, b, a);
                        return 1
                    })
                }, a.prototype.closeOpenIndexes = function () {
                    var a, b;
                    b = function (a, b) {
                        var c;
                        return(c = a[0]) === "]" || c === "INDEX_END"
                    }, a = function (a, b) {
                        return a[0] = "INDEX_END"
                    };
                    return this.scanTokens(function (c, d) {
                        c[0] === "INDEX_START" && this.detectEnd(d + 1, b, a);
                        return 1
                    })
                }, a.prototype.addImplicitBraces = function () {
                    var a, b, c, f, g;
                    c = [], f = null, g = 0, b = function (a, b) {
                        var c, d, e, f, g, h;
                        g = this.tokens.slice(b + 1, b + 3 + 1 || 9e9), c = g[0], f = g[1], e = g[2];
                        if ("HERECOMMENT" === (c != null ? c[0] : void 0))return!1;
                        d = a[0];
                        return(d === "TERMINATOR" || d === "OUTDENT") && (f != null ? f[0] : void 0) !== ":" && ((c != null ? c[0] : void 0) !== "@" || (e != null ? e[0] : void 0) !== ":") || d === "," && c && (h = c[0]) !== "IDENTIFIER" && h !== "NUMBER" && h !== "STRING" && h !== "@" && h !== "TERMINATOR" && h !== "OUTDENT"
                    }, a = function (a, b) {
                        var c;
                        c = ["}", "}", a[2]], c.generated = !0;
                        return this.tokens.splice(b, 0, c)
                    };
                    return this.scanTokens(function (g, h, i) {
                        var j, k, l, m, n, o, p;
                        if (o = l = g[0], u.call(e, o) >= 0) {
                            c.push([l === "INDENT" && this.tag(h - 1) === "{" ? "{" : l, h]);
                            return 1
                        }
                        if (u.call(d, l) >= 0) {
                            f = c.pop();
                            return 1
                        }
                        if (l !== ":" || (j = this.tag(h - 2)) !== ":" && ((p = c[c.length - 1]) != null ? p[0] : void 0) === "{")return 1;
                        c.push(["{"]), k = j === "@" ? h - 2 : h - 1;
                        while (this.tag(k - 2) === "HERECOMMENT")k -= 2;
                        n = new String("{"), n.generated = !0, m = ["{", n, g[2]], m.generated = !0, i.splice(k, 0, m), this.detectEnd(h + 2, b, a);
                        return 2
                    })
                }, a.prototype.addImplicitParentheses = function () {
                    var a, b;
                    b = !1, a = function (a, b) {
                        return this.tokens.splice(b, 0, ["CALL_END", ")", a[2]])
                    };
                    return this.scanTokens(function (c, d, e) {
                        var k, m, n, o, p, q, r, s, t, v;
                        r = c[0];
                        if (r === "CLASS" || r === "IF")b = !0;
                        s = e.slice(d - 1, d + 1 + 1 || 9e9), o = s[0], m = s[1], n = s[2], k = !b && r === "INDENT" && n && n.generated && n[0] === "{" && o && (t = o[0], u.call(i, t) >= 0), q = !1, p = !1, u.call(l, r) >= 0 && (b = !1), o && !o.spaced && r === "?" && (c.call = !0);
                        if (c.fromThen)return 1;
                        if (!(k || (o != null ? o.spaced : void 0) && (o.call || (v = o[0], u.call(i, v) >= 0)) && (u.call(g, r) >= 0 || !c.spaced && !c.newLine && u.call(j, r) >= 0)))return 1;
                        e.splice(d, 0, ["CALL_START", "(", c[2]]), this.detectEnd(d + 1, function (a, b) {
                            var c, d;
                            r = a[0];
                            if (!q && a.fromThen)return!0;
                            if (r === "IF" || r === "ELSE" || r === "CATCH" || r === "->" || r === "=>")q = !0;
                            if (r === "IF" || r === "ELSE" || r === "SWITCH" || r === "TRY")p = !0;
                            if ((r === "." || r === "?." || r === "::") && this.tag(b - 1) === "OUTDENT")return!0;
                            return!a.generated && this.tag(b - 1) !== "," && (u.call(h, r) >= 0 || r === "INDENT" && !p) && (r !== "INDENT" || this.tag(b - 2) !== "CLASS" && (d = this.tag(b - 1), u.call(f, d) < 0) && (!(c = this.tokens[b + 1]) || !c.generated || c[0] !== "{"))
                        }, a), o[0] === "?" && (o[0] = "FUNC_EXIST");
                        return 2
                    })
                }, a.prototype.addImplicitIndentation = function () {
                    return this.scanTokens(function (a, b, c) {
                        var d, e, f, g, h, i, j, k;
                        i = a[0];
                        if (i === "TERMINATOR" && this.tag(b + 1) === "THEN") {
                            c.splice(b, 1);
                            return 0
                        }
                        if (i === "ELSE" && this.tag(b - 1) !== "OUTDENT") {
                            c.splice.apply(c, [b, 0].concat(v.call(this.indentation(a))));
                            return 2
                        }
                        if (i === "CATCH" && ((j = this.tag(b + 2)) === "OUTDENT" || j === "TERMINATOR" || j === "FINALLY")) {
                            c.splice.apply(c, [b + 2, 0].concat(v.call(this.indentation(a))));
                            return 4
                        }
                        if (u.call(n, i) >= 0 && this.tag(b + 1) !== "INDENT" && (i !== "ELSE" || this.tag(b + 1) !== "IF")) {
                            h = i, k = this.indentation(a), f = k[0], g = k[1], h === "THEN" && (f.fromThen = !0), f.generated = g.generated = !0, c.splice(b + 1, 0, f), e = function (a, b) {
                                var c;
                                return a[1] !== ";" && (c = a[0], u.call(m, c) >= 0) && (a[0] !== "ELSE" || h === "IF" || h === "THEN")
                            }, d = function (a, b) {
                                return this.tokens.splice(this.tag(b - 1) === "," ? b - 1 : b, 0, g)
                            }, this.detectEnd(b + 2, e, d), i === "THEN" && c.splice(b, 1);
                            return 1
                        }
                        return 1
                    })
                }, a.prototype.tagPostfixConditionals = function () {
                    var a;
                    a = function (a, b) {
                        var c;
                        return(c = a[0]) === "TERMINATOR" || c === "INDENT"
                    };
                    return this.scanTokens(function (b, c) {
                        var d;
                        if (b[0] !== "IF")return 1;
                        d = b, this.detectEnd(c + 1, a, function (a, b) {
                            if (a[0] !== "INDENT")return d[0] = "POST_" + d[0]
                        });
                        return 1
                    })
                }, a.prototype.indentation = function (a) {
                    return[
                        ["INDENT", 2, a[2]],
                        ["OUTDENT", 2, a[2]]
                    ]
                }, a.prototype.tag = function (a) {
                    var b;
                    return(b = this.tokens[a]) != null ? b[0] : void 0
                };
                return a
            }(), b = [
                ["(", ")"],
                ["[", "]"],
                ["{", "}"],
                ["INDENT", "OUTDENT"],
                ["CALL_START", "CALL_END"],
                ["PARAM_START", "PARAM_END"],
                ["INDEX_START", "INDEX_END"]
            ], a.INVERSES = k = {}, e = [], d = [];
            for (q = 0, r = b.length; q < r; q++)s = b[q], o = s[0], p = s[1], e.push(k[p] = o), d.push(k[o] = p);
            c = ["CATCH", "WHEN", "ELSE", "FINALLY"].concat(d), i = ["IDENTIFIER", "SUPER", ")", "CALL_END", "]", "INDEX_END", "@", "THIS"], g = ["IDENTIFIER", "NUMBER", "STRING", "JS", "REGEX", "NEW", "PARAM_START", "CLASS", "IF", "TRY", "SWITCH", "THIS", "BOOL", "UNARY", "SUPER", "@", "->", "=>", "[", "(", "{", "--", "++"], j = ["+", "-"], f = ["->", "=>", "{", "[", ","], h = ["POST_IF", "FOR", "WHILE", "UNTIL", "WHEN", "BY", "LOOP", "TERMINATOR"], n = ["ELSE", "->", "=>", "TRY", "FINALLY", "THEN"], m = ["TERMINATOR", "CATCH", "FINALLY", "ELSE", "OUTDENT", "LEADING_WHEN"], l = ["TERMINATOR", "INDENT", "OUTDENT"]
        }).call(this)
    }, require["./lexer"] = new function () {
        var a = this;
        (function () {
            var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W = Object.prototype.hasOwnProperty, X = Array.prototype.indexOf || function (a) {
                for (var b = 0, c = this.length; b < c; b++)if (W.call(this, b) && this[b] === a)return b;
                return-1
            };
            U = require("./rewriter"), J = U.Rewriter, r = U.INVERSES, V = require("./helpers"), Q = V.count, T = V.starts, P = V.compact, S = V.last, a.Lexer = y = function () {
                function a() {
                }

                a.prototype.tokenize = function (a, b) {
                    var c, d;
                    b == null && (b = {}), O.test(a) && (a = "\n" + a), a = a.replace(/\r/g, "").replace(M, ""), this.code = a, this.line = b.line || 0, this.indent = 0, this.indebt = 0, this.outdebt = 0, this.indents = [], this.ends = [], this.tokens = [], c = 0;
                    while (this.chunk = a.slice(c))c += this.identifierToken() || this.commentToken() || this.whitespaceToken() || this.lineToken() || this.heredocToken() || this.stringToken() || this.numberToken() || this.regexToken() || this.jsToken() || this.literalToken();
                    this.closeIndentation(), (d = this.ends.pop()) && this.error("missing " + d);
                    if (b.rewrite === !1)return this.tokens;
                    return(new J).rewrite(this.tokens)
                }, a.prototype.identifierToken = function () {
                    var a, b, c, d, h, i, j, k, l;
                    if (!(h = p.exec(this.chunk)))return 0;
                    d = h[0], c = h[1], a = h[2];
                    if (c === "own" && this.tag() === "FOR") {
                        this.token("OWN", c);
                        return c.length
                    }
                    b = a || (i = S(this.tokens)) && ((k = i[0]) === "." || k === "?." || k === "::" || !i.spaced && i[0] === "@"), j = "IDENTIFIER", !b && (X.call(u, c) >= 0 || X.call(g, c) >= 0) && (j = c.toUpperCase(), j === "WHEN" && (l = this.tag(), X.call(v, l) >= 0) ? j = "LEADING_WHEN" : j === "FOR" ? this.seenFor = !0 : j === "UNLESS" ? j = "IF" : X.call(N, j) >= 0 ? j = "UNARY" : X.call(H, j) >= 0 && (j !== "INSTANCEOF" && this.seenFor ? (j = "FOR" + j, this.seenFor = !1) : (j = "RELATION", this.value() === "!" && (this.tokens.pop(), c = "!" + c)))), X.call(["eval", "arguments"].concat(t), c) >= 0 && (b ? (j = "IDENTIFIER", c = new String(c), c.reserved = !0) : X.call(I, c) >= 0 && this.error('reserved word "' + word + '"')), b || (X.call(e, c) >= 0 && (c = f[c]), j = function () {
                        switch (c) {
                            case"!":
                                return"UNARY";
                            case"==":
                            case"!=":
                                return"COMPARE";
                            case"&&":
                            case"||":
                                return"LOGIC";
                            case"true":
                            case"false":
                            case"null":
                            case"undefined":
                                return"BOOL";
                            case"break":
                            case"continue":
                            case"debugger":
                                return"STATEMENT";
                            default:
                                return j
                        }
                    }()), this.token(j, c), a && this.token(":", ":");
                    return d.length
                }, a.prototype.numberToken = function () {
                    var a, b, c, d;
                    if (!(c = E.exec(this.chunk)))return 0;
                    d = c[0], b = d.length;
                    if (a = /0b([01]+)/.exec(d))d = parseInt(a[1], 2).toString();
                    this.token("NUMBER", d);
                    return b
                }, a.prototype.stringToken = function () {
                    var a, b;
                    switch (this.chunk.charAt(0)) {
                        case"'":
                            if (!(a = L.exec(this.chunk)))return 0;
                            this.token("STRING", (b = a[0]).replace(A, "\\\n"));
                            break;
                        case'"':
                            if (!(b = this.balancedString(this.chunk, '"')))return 0;
                            0 < b.indexOf("#{",1)?this.interpolateString(b.slice(1,-1)):this.token("STRING", this.escapeLines(b));
                            break;
                        default:
                            return 0
                    }
                    this.line += Q(b, "\n");
                    return b.length
                }, a.prototype.heredocToken = function () {
                    var a, b, c, d;
                    if (!(c = k.exec(this.chunk)))return 0;
                    b = c[0], d = b.charAt(0), a = this.sanitizeHeredoc(c[2], {quote: d, indent: null}), d === '"' && 0 <= a.indexOf("#{")?this.interpolateString(a,{heredoc:!0}):this.token("STRING",this.makeString(a,d,!0)),this.line+=Q(b,"\n");
                    return b.length
                }, a.prototype.commentToken = function () {
                    var a, b, c;
                    if (!(c = this.chunk.match(h)))return 0;
                    a = c[0], b = c[1], b && (this.token("HERECOMMENT", this.sanitizeHeredoc(b, {herecomment: !0, indent: Array(this.indent + 1).join(" ")})), this.token("TERMINATOR", "\n")), this.line += Q(a, "\n");
                    return a.length
                }, a.prototype.jsToken = function () {
                    var a, b;
                    if (this.chunk.charAt(0) !== "`" || !(a = s.exec(this.chunk)))return 0;
                    this.token("JS", (b = a[0]).slice(1, -1));
                    return b.length
                }, a.prototype.regexToken = function () {
                    var a, b, c, d, e, f, g;
                    if (this.chunk.charAt(0) !== "/")return 0;
                    if (c = n.exec(this.chunk)) {
                        b = this.heregexToken(c), this.line += Q(c[0], "\n");
                        return b
                    }
                    d = S(this.tokens);
                    if (d && (f = d[0], X.call(d.spaced ? C : D, f) >= 0))return 0;
                    if (!(c = G.exec(this.chunk)))return 0;
                    g = c, c = g[0], e = g[1], a = g[2], e.slice(0, 2) === "/*" && this.error("regular expressions cannot begin with `*`"), e === "//" && (e = "/(?:)/"), this.token("REGEX", "" + e + a);
                    return c.length
                }, a.prototype.heregexToken = function (a) {
                    var b, c, d, e, f, g, h, i, j, k, l, m, n;
                    d = a[0], b = a[1], c = a[2];
                    if (0 > b.indexOf("#{")){e=b.replace(o,"").replace(/\//g,"\\/"),e.match(/^\*/)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX","/"+(e||"(?:)")+"/" + c);
                    return d.length
                }
                this.token("IDENTIFIER", "RegExp"), this.tokens.push(["CALL_START", "("]), g = [], k = this.interpolateString(b, {regex: !0});
                for (i = 0, j = k.length; i < j; i++) {
                    l = k[i], f = l[0], h = l[1];
                    if (f === "TOKENS")g.push.apply(g, h); else {
                        if (!(h = h.replace(o, "")))continue;
                        h = h.replace(/\\/g, "\\\\"), g.push(["STRING", this.makeString(h, '"', !0)])
                    }
                    g.push(["+", "+"])
                }
                g.pop(), ((m = g[0]) != null ? m[0] : void 0) !== "STRING" && this.tokens.push(["STRING", '""'], ["+", "+"]), (n = this.tokens).push.apply(n, g), c && this.tokens.push([",", ","], ["STRING", '"' + c + '"']), this.token(")", ")");
                return d.length
            }, a.prototype.lineToken = function () {
                var a, b, c, d, e, f;
                if (!(c = B.exec(this.chunk)))return 0;
                b = c[0], this.line += Q(b, "\n"), this.seenFor = !1, e = S(this.tokens, 1), f = b.length - 1 - b.lastIndexOf("\n"), d = this.unfinished();
                if (f - this.indebt === this.indent) {
                    d ? this.suppressNewlines() : this.newlineToken();
                    return b.length
                }
                if (f > this.indent) {
                    if (d) {
                        this.indebt = f - this.indent, this.suppressNewlines();
                        return b.length
                    }
                    a = f - this.indent + this.outdebt, this.token("INDENT", a), this.indents.push(a), this.ends.push("OUTDENT"), this.outdebt = this.indebt = 0
                } else this.indebt = 0, this.outdentToken(this.indent - f, d);
                this.indent = f;
                return b.length
            }, a.prototype.outdentToken = function (a, b) {
                var c, d;
                while (a > 0)d = this.indents.length - 1, this.indents[d] === void 0 ? a = 0 : this.indents[d] === this.outdebt ? (a -= this.outdebt, this.outdebt = 0) : this.indents[d] < this.outdebt ? (this.outdebt -= this.indents[d], a -= this.indents[d]) : (c = this.indents.pop() - this.outdebt, a -= c, this.outdebt = 0, this.pair("OUTDENT"), this.token("OUTDENT", c));
                c && (this.outdebt -= a);
                while (this.value() === ";")this.tokens.pop();
                this.tag() !== "TERMINATOR" && !b && this.token("TERMINATOR", "\n");
                return this
            }, a.prototype.whitespaceToken = function () {
                var a, b, c;
                if (!(a = O.exec(this.chunk)) && !(b = this.chunk.charAt(0) === "\n"))return 0;
                c = S(this.tokens), c && (c[a ? "spaced" : "newLine"] = !0);
                return a ? a[0].length : 0
            }, a.prototype.newlineToken = function () {
                while (this.value() === ";")this.tokens.pop();
                this.tag() !== "TERMINATOR" && this.token("TERMINATOR", "\n");
                return this
            }, a.prototype.suppressNewlines = function () {
                this.value() === "\\" && this.tokens.pop();
                return this
            }, a.prototype.literalToken = function () {
                var a, b, e, f, g, h, k, l;
                (a = F.exec(this.chunk)) ? (f = a[0], d.test(f) && this.tagParameters()) : f = this.chunk.charAt(0), e = f, b = S(this.tokens);
                if (f === "=" && b) {
                    !b[1].reserved && (g = b[1], X.call(t, g) >= 0) && this.error('reserved word "' + this.value() + "\" can't be assigned");
                    if ((h = b[1]) === "||" || h === "&&") {
                        b[0] = "COMPOUND_ASSIGN", b[1] += "=";
                        return f.length
                    }
                }
                if (f === ";")this.seenFor = !1, e = "TERMINATOR"; else if (X.call(z, f) >= 0)e = "MATH"; else if (X.call(i, f) >= 0)e = "COMPARE"; else if (X.call(j, f) >= 0)e = "COMPOUND_ASSIGN"; else if (X.call(N, f) >= 0)e = "UNARY"; else if (X.call(K, f) >= 0)e = "SHIFT"; else if (X.call(x, f) >= 0 || f === "?" && (b != null ? b.spaced : void 0))e = "LOGIC"; else if (b && !b.spaced)if (f === "(" && (k = b[0], X.call(c, k) >= 0))b[0] === "?" && (b[0] = "FUNC_EXIST"), e = "CALL_START"; else if (f === "[" && (l = b[0], X.call(q, l) >= 0)) {
                    e = "INDEX_START";
                    switch (b[0]) {
                        case"?":
                            b[0] = "INDEX_SOAK"
                    }
                }
                switch (f) {
                    case"(":
                    case"{":
                    case"[":
                        this.ends.push(r[f]);
                        break;
                    case")":
                    case"}":
                    case"]":
                        this.pair(f)
                }
                this.token(e, f);
                return f.length
            }, a.prototype.sanitizeHeredoc = function (a, b) {
                var c, d, e, f, g;
                e = b.indent, d = b.herecomment;
                if (d) {
                    l.test(a) && this.error('block comment cannot contain "*/", starting');
                    if (a.indexOf("\n") <= 0)return a
                } else while (f = m.exec(a)) {
                    c = f[1];
                    if (e === null || 0 < (g = c.length) && g < e.length)e = c
                }
                e && (a = a.replace(RegExp("\\n" + e, "g"), "\n")), d || (a = a.replace(/^\n/, ""));
                return a
            }, a.prototype.tagParameters = function () {
                var a, b, c, d;
                if (this.tag() !== ")")return this;
                b = [], d = this.tokens, a = d.length, d[--a][0] = "PARAM_END";
                while (c = d[--a])switch (c[0]) {
                    case")":
                        b.push(c);
                        break;
                    case"(":
                    case"CALL_START":
                        if (b.length)b.pop(); else {
                            if (c[0] === "(") {
                                c[0] = "PARAM_START";
                                return this
                            }
                            return this
                        }
                }
                return this
            }, a.prototype.closeIndentation = function () {
                return this.outdentToken(this.indent)
            }, a.prototype.balancedString = function (a, b) {
                var c, d, e, f, g, h;
                g = [b];
                for (c = 1, h = a.length; 1 <= h ? c < h : c > h; 1 <= h ? c++ : c--) {
                    switch (d = a.charAt(c)) {
                        case"\\":
                            c++;
                            continue;
                        case b:
                            g.pop();
                            if (!g.length)return a.slice(0, c + 1);
                            b = g[g.length - 1];
                            continue
                    }
                    b !== "}" || d !== '"' && d !== "'" ? b === "}" && d === "/" && (e = n.exec(a.slice(c)) || G.exec(a.slice(c))) ? c += e[0].length - 1 : b === "}" && d === "{" ? g.push(b = "}") : b === '"' && f === "#" && d === "{" && g.push(b = "}") : g.push(b = d), f = d
                }
                return this.error("missing " + g.pop() + ", starting")
            }, a.prototype.interpolateString = function (b, c) {
                var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t;
                c == null && (c = {}), e = c.heredoc, m = c.regex, o = [], l = 0, f = -1;
                while (j = b.charAt(f += 1)) {
                    if (j === "\\") {
                        f += 1;
                        continue
                    }
                    if (j !== "#" || b.charAt(f + 1) !== "{" || !(d = this.balancedString(b.slice(f + 1), "}")))continue;
                    l < f && o.push(["NEOSTRING", b.slice(l, f)]), g = d.slice(1, -1);
                    if (g.length) {
                        k = (new a).tokenize(g, {line: this.line, rewrite: !1}), k.pop(), ((r = k[0]) != null ? r[0] : void 0) === "TERMINATOR" && k.shift();
                        if (i = k.length)i > 1 && (k.unshift(["(", "("]), k.push([")", ")"])), o.push(["TOKENS", k])
                    }
                    f += d.length, l = f + 1
                }
                f > l && l < b.length && o.push(["NEOSTRING", b.slice(l)]);
                if (m)return o;
                if (!o.length)return this.token("STRING", '""');
                o[0][0] !== "NEOSTRING" && o.unshift(["", ""]), (h = o.length > 1) && this.token("(", "(");
                for (f = 0, q = o.length; f < q; f++)s = o[f], n = s[0], p = s[1], f && this.token("+", "+"), n === "TOKENS" ? (t = this.tokens).push.apply(t, p) : this.token("STRING", this.makeString(p, '"', e));
                h && this.token(")", ")");
                return o
            }, a.prototype.pair = function (a) {
                var b, c;
                if (a !== (c = S(this.ends))) {
                    "OUTDENT" !== c && this.error("unmatched " + a), this.indent -= b = S(this.indents), this.outdentToken(b, !0);
                    return this.pair(a)
                }
                return this.ends.pop()
            }, a.prototype.token = function (a, b) {
                return this.tokens.push([a, b, this.line])
            }, a.prototype.tag = function (a, b) {
                var c;
                return(c = S(this.tokens, a)) && (b ? c[0] = b : c[0])
            }, a.prototype.value = function (a, b) {
                var c;
                return(c = S(this.tokens, a)) && (b ? c[1] = b : c[1])
            }, a.prototype.unfinished = function () {
                var a;
                return w.test(this.chunk) || (a = this.tag()) === "\\" || a === "." || a === "?." || a === "UNARY" || a === "MATH" || a === "+" || a === "-" || a === "SHIFT" || a === "RELATION" || a === "COMPARE" || a === "LOGIC" || a === "COMPOUND_ASSIGN" || a === "THROW" || a === "EXTENDS"
            }, a.prototype.escapeLines = function (a, b) {
                return a.replace(A, b ? "\\n" : "")
            }, a.prototype.makeString = function (a, b, c) {
                if (!a)return b + b;
                a = a.replace(/\\([\s\S])/g, function (a, c) {
                    return c === "\n" || c === b ? c : a
                }), a = a.replace(RegExp("" + b, "g"), "\\$&");
                return b + this.escapeLines(a, c) + b
            }, a.prototype.error = function (a) {
                throw SyntaxError("" + a + " on line " + (this.line + 1))
            };
            return a
        }(), u = ["true", "false", "null", "this", "new", "delete", "typeof", "in", "instanceof", "return", "throw", "break", "continue", "debugger", "if", "else", "switch", "for", "while", "do", "try", "catch", "finally", "class", "extends", "super"], g = ["undefined", "then", "unless", "until", "loop", "of", "by", "when"], f = {and: "&&", or: "||", is: "==", isnt: "!=", not: "!", yes: "true", no: "false", on: "true", off: "false"}, e = function () {
            var a;
            a = [];
            for (R in f)a.push(R);
            return a
        }(), g = g.concat(e), I = ["case", "default", "function", "var", "void", "with", "const", "let", "enum", "export", "import", "native", "__hasProp", "__extends", "__slice", "__bind", "__indexOf"], t = u.concat(I), a.RESERVED = I.concat(u).concat(g), p = /^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/, E = /^0x[\da-f]+|^0b[01]+|^\d*\.?\d+(?:e[+-]?\d+)?/i, k = /^("""|''')([\s\S]*?)(?:\n[^\n\S]*)?\1/, F = /^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?\.|\.{2,3})/, O = /^[^\n\S]+/, h = /^###([^#][\s\S]*?)(?:###[^\n\S]*|(?:###)?$)|^(?:\s*#(?!##[^#]).*)+/, d = /^[-=]>/, B = /^(?:\n[^\n\S]*)+/, L = /^'[^\\']*(?:\\.[^\\']*)*'/, s = /^`[^\\`]*(?:\\.[^\\`]*)*`/, G = /^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/, n = /^\/{3}([\s\S]+?)\/{3}([imgy]{0,4})(?!\w)/, o = /\s+(?:#.*)?/g, A = /\n/g, m = /\n+([^\n\S]*)/g, l = /\*\//, w = /^\s*(?:,|\??\.(?![.\d])|::)/, M = /\s+$/, j = ["-=", "+=", "/=", "*=", "%=", "||=", "&&=", "?=", "<<=", ">>=", ">>>=", "&=", "^=", "|="], N = ["!", "~", "NEW", "TYPEOF", "DELETE", "DO"], x = ["&&", "||", "&", "|", "^"], K = ["<<", ">>", ">>>"], i = ["==", "!=", "<", ">", "<=", ">="], z = ["*", "/", "%"], H = ["IN", "OF", "INSTANCEOF"], b = ["TRUE", "FALSE", "NULL", "UNDEFINED"], C = ["NUMBER", "REGEX", "BOOL", "++", "--", "]"], D = C.concat(")", "}", "THIS", "IDENTIFIER", "STRING"), c = ["IDENTIFIER", "STRING", "REGEX", ")", "]", "}", "?", "::", "@", "THIS", "SUPER"], q = c.concat("NUMBER", "BOOL"), v = ["INDENT", "OUTDENT", "TERMINATOR"]
    }
    ).
    call(this)
}, require["./parser"] = new function () {
    var a = this, b = function () {
        var a = {trace: function () {
        }, yy: {}, symbols_: {error: 2, Root: 3, Body: 4, Block: 5, TERMINATOR: 6, Line: 7, Expression: 8, Statement: 9, Return: 10, Throw: 11, Comment: 12, STATEMENT: 13, Value: 14, Invocation: 15, Code: 16, Operation: 17, Assign: 18, If: 19, Try: 20, While: 21, For: 22, Switch: 23, Class: 24, INDENT: 25, OUTDENT: 26, Identifier: 27, IDENTIFIER: 28, AlphaNumeric: 29, NUMBER: 30, STRING: 31, Literal: 32, JS: 33, REGEX: 34, BOOL: 35, Assignable: 36, "=": 37, AssignObj: 38, ObjAssignable: 39, ":": 40, ThisProperty: 41, RETURN: 42, HERECOMMENT: 43, PARAM_START: 44, ParamList: 45, PARAM_END: 46, FuncGlyph: 47, "->": 48, "=>": 49, OptComma: 50, ",": 51, Param: 52, ParamVar: 53, "...": 54, Array: 55, Object: 56, Splat: 57, SimpleAssignable: 58, Accessor: 59, Parenthetical: 60, Range: 61, This: 62, ".": 63, "?.": 64, "::": 65, Index: 66, INDEX_START: 67, IndexValue: 68, INDEX_END: 69, INDEX_SOAK: 70, Slice: 71, "{": 72, AssignList: 73, "}": 74, CLASS: 75, EXTENDS: 76, OptFuncExist: 77, Arguments: 78, SUPER: 79, FUNC_EXIST: 80, CALL_START: 81, CALL_END: 82, ArgList: 83, THIS: 84, "@": 85, "[": 86, "]": 87, RangeDots: 88, "..": 89, Arg: 90, SimpleArgs: 91, TRY: 92, Catch: 93, FINALLY: 94, CATCH: 95, THROW: 96, "(": 97, ")": 98, WhileSource: 99, WHILE: 100, WHEN: 101, UNTIL: 102, Loop: 103, LOOP: 104, ForBody: 105, FOR: 106, ForStart: 107, ForSource: 108, ForVariables: 109, OWN: 110, ForValue: 111, FORIN: 112, FOROF: 113, BY: 114, SWITCH: 115, Whens: 116, ELSE: 117, When: 118, LEADING_WHEN: 119, IfBlock: 120, IF: 121, POST_IF: 122, UNARY: 123, "-": 124, "+": 125, "--": 126, "++": 127, "?": 128, MATH: 129, SHIFT: 130, COMPARE: 131, LOGIC: 132, RELATION: 133, COMPOUND_ASSIGN: 134, $accept: 0, $end: 1}, terminals_: {2: "error", 6: "TERMINATOR", 13: "STATEMENT", 25: "INDENT", 26: "OUTDENT", 28: "IDENTIFIER", 30: "NUMBER", 31: "STRING", 33: "JS", 34: "REGEX", 35: "BOOL", 37: "=", 40: ":", 42: "RETURN", 43: "HERECOMMENT", 44: "PARAM_START", 46: "PARAM_END", 48: "->", 49: "=>", 51: ",", 54: "...", 63: ".", 64: "?.", 65: "::", 67: "INDEX_START", 69: "INDEX_END", 70: "INDEX_SOAK", 72: "{", 74: "}", 75: "CLASS", 76: "EXTENDS", 79: "SUPER", 80: "FUNC_EXIST", 81: "CALL_START", 82: "CALL_END", 84: "THIS", 85: "@", 86: "[", 87: "]", 89: "..", 92: "TRY", 94: "FINALLY", 95: "CATCH", 96: "THROW", 97: "(", 98: ")", 100: "WHILE", 101: "WHEN", 102: "UNTIL", 104: "LOOP", 106: "FOR", 110: "OWN", 112: "FORIN", 113: "FOROF", 114: "BY", 115: "SWITCH", 117: "ELSE", 119: "LEADING_WHEN", 121: "IF", 122: "POST_IF", 123: "UNARY", 124: "-", 125: "+", 126: "--", 127: "++", 128: "?", 129: "MATH", 130: "SHIFT", 131: "COMPARE", 132: "LOGIC", 133: "RELATION", 134: "COMPOUND_ASSIGN"}, productions_: [0, [3, 0], [3, 1], [3, 2], [4, 1], [4, 3], [4, 2], [7, 1], [7, 1], [9, 1], [9, 1], [9, 1], [9, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [5, 2], [5, 3], [27, 1], [29, 1], [29, 1], [32, 1], [32, 1], [32, 1], [32, 1], [18, 3], [18, 5], [38, 1], [38, 3], [38, 5], [38, 1], [39, 1], [39, 1], [39, 1], [10, 2], [10, 1], [12, 1], [16, 5], [16, 2], [47, 1], [47, 1], [50, 0], [50, 1], [45, 0], [45, 1], [45, 3], [52, 1], [52, 2], [52, 3], [53, 1], [53, 1], [53, 1], [53, 1], [57, 2], [58, 1], [58, 2], [58, 2], [58, 1], [36, 1], [36, 1], [36, 1], [14, 1], [14, 1], [14, 1], [14, 1], [14, 1], [59, 2], [59, 2], [59, 2], [59, 1], [59, 1], [66, 3], [66, 2], [68, 1], [68, 1], [56, 4], [73, 0], [73, 1], [73, 3], [73, 4], [73, 6], [24, 1], [24, 2], [24, 3], [24, 4], [24, 2], [24, 3], [24, 4], [24, 5], [15, 3], [15, 3], [15, 1], [15, 2], [77, 0], [77, 1], [78, 2], [78, 4], [62, 1], [62, 1], [41, 2], [55, 2], [55, 4], [88, 1], [88, 1], [61, 5], [71, 3], [71, 2], [71, 2], [83, 1], [83, 3], [83, 4], [83, 4], [83, 6], [90, 1], [90, 1], [91, 1], [91, 3], [20, 2], [20, 3], [20, 4], [20, 5], [93, 3], [11, 2], [60, 3], [60, 5], [99, 2], [99, 4], [99, 2], [99, 4], [21, 2], [21, 2], [21, 2], [21, 1], [103, 2], [103, 2], [22, 2], [22, 2], [22, 2], [105, 2], [105, 2], [107, 2], [107, 3], [111, 1], [111, 1], [111, 1], [109, 1], [109, 3], [108, 2], [108, 2], [108, 4], [108, 4], [108, 4], [108, 6], [108, 6], [23, 5], [23, 7], [23, 4], [23, 6], [116, 1], [116, 2], [118, 3], [118, 4], [120, 3], [120, 5], [19, 1], [19, 3], [19, 3], [19, 3], [17, 2], [17, 2], [17, 2], [17, 2], [17, 2], [17, 2], [17, 2], [17, 2], [17, 3], [17, 3], [17, 3], [17, 3], [17, 3], [17, 3], [17, 3], [17, 3], [17, 5], [17, 3]], performAction: function (b, c, d, e, f, g, h) {
            var i = g.length - 1;
            switch (f) {
                case 1:
                    return this.$ = new e.Block;
                case 2:
                    return this.$ = g[i];
                case 3:
                    return this.$ = g[i - 1];
                case 4:
                    this.$ = e.Block.wrap([g[i]]);
                    break;
                case 5:
                    this.$ = g[i - 2].push(g[i]);
                    break;
                case 6:
                    this.$ = g[i - 1];
                    break;
                case 7:
                    this.$ = g[i];
                    break;
                case 8:
                    this.$ = g[i];
                    break;
                case 9:
                    this.$ = g[i];
                    break;
                case 10:
                    this.$ = g[i];
                    break;
                case 11:
                    this.$ = g[i];
                    break;
                case 12:
                    this.$ = new e.Literal(g[i]);
                    break;
                case 13:
                    this.$ = g[i];
                    break;
                case 14:
                    this.$ = g[i];
                    break;
                case 15:
                    this.$ = g[i];
                    break;
                case 16:
                    this.$ = g[i];
                    break;
                case 17:
                    this.$ = g[i];
                    break;
                case 18:
                    this.$ = g[i];
                    break;
                case 19:
                    this.$ = g[i];
                    break;
                case 20:
                    this.$ = g[i];
                    break;
                case 21:
                    this.$ = g[i];
                    break;
                case 22:
                    this.$ = g[i];
                    break;
                case 23:
                    this.$ = g[i];
                    break;
                case 24:
                    this.$ = new e.Block;
                    break;
                case 25:
                    this.$ = g[i - 1];
                    break;
                case 26:
                    this.$ = new e.Literal(g[i]);
                    break;
                case 27:
                    this.$ = new e.Literal(g[i]);
                    break;
                case 28:
                    this.$ = new e.Literal(g[i]);
                    break;
                case 29:
                    this.$ = g[i];
                    break;
                case 30:
                    this.$ = new e.Literal(g[i]);
                    break;
                case 31:
                    this.$ = new e.Literal(g[i]);
                    break;
                case 32:
                    this.$ = function () {
                        var a;
                        a = new e.Literal(g[i]), g[i] === "undefined" && (a.isUndefined = !0);
                        return a
                    }();
                    break;
                case 33:
                    this.$ = new e.Assign(g[i - 2], g[i]);
                    break;
                case 34:
                    this.$ = new e.Assign(g[i - 4], g[i - 1]);
                    break;
                case 35:
                    this.$ = new e.Value(g[i]);
                    break;
                case 36:
                    this.$ = new e.Assign(new e.Value(g[i - 2]), g[i], "object");
                    break;
                case 37:
                    this.$ = new e.Assign(new e.Value(g[i - 4]), g[i - 1], "object");
                    break;
                case 38:
                    this.$ = g[i];
                    break;
                case 39:
                    this.$ = g[i];
                    break;
                case 40:
                    this.$ = g[i];
                    break;
                case 41:
                    this.$ = g[i];
                    break;
                case 42:
                    this.$ = new e.Return(g[i]);
                    break;
                case 43:
                    this.$ = new e.Return;
                    break;
                case 44:
                    this.$ = new e.Comment(g[i]);
                    break;
                case 45:
                    this.$ = new e.Code(g[i - 3], g[i], g[i - 1]);
                    break;
                case 46:
                    this.$ = new e.Code([], g[i], g[i - 1]);
                    break;
                case 47:
                    this.$ = "func";
                    break;
                case 48:
                    this.$ = "boundfunc";
                    break;
                case 49:
                    this.$ = g[i];
                    break;
                case 50:
                    this.$ = g[i];
                    break;
                case 51:
                    this.$ = [];
                    break;
                case 52:
                    this.$ = [g[i]];
                    break;
                case 53:
                    this.$ = g[i - 2].concat(g[i]);
                    break;
                case 54:
                    this.$ = new e.Param(g[i]);
                    break;
                case 55:
                    this.$ = new e.Param(g[i - 1], null, !0);
                    break;
                case 56:
                    this.$ = new e.Param(g[i - 2], g[i]);
                    break;
                case 57:
                    this.$ = g[i];
                    break;
                case 58:
                    this.$ = g[i];
                    break;
                case 59:
                    this.$ = g[i];
                    break;
                case 60:
                    this.$ = g[i];
                    break;
                case 61:
                    this.$ = new e.Splat(g[i - 1]);
                    break;
                case 62:
                    this.$ = new e.Value(g[i]);
                    break;
                case 63:
                    this.$ = g[i - 1].add(g[i]);
                    break;
                case 64:
                    this.$ = new e.Value(g[i - 1], [g[i]]);
                    break;
                case 65:
                    this.$ = g[i];
                    break;
                case 66:
                    this.$ = g[i];
                    break;
                case 67:
                    this.$ = new e.Value(g[i]);
                    break;
                case 68:
                    this.$ = new e.Value(g[i]);
                    break;
                case 69:
                    this.$ = g[i];
                    break;
                case 70:
                    this.$ = new e.Value(g[i]);
                    break;
                case 71:
                    this.$ = new e.Value(g[i]);
                    break;
                case 72:
                    this.$ = new e.Value(g[i]);
                    break;
                case 73:
                    this.$ = g[i];
                    break;
                case 74:
                    this.$ = new e.Access(g[i]);
                    break;
                case 75:
                    this.$ = new e.Access(g[i], "soak");
                    break;
                case 76:
                    this.$ = [new e.Access(new e.Literal("prototype")), new e.Access(g[i])];
                    break;
                case 77:
                    this.$ = new e.Access(new e.Literal("prototype"));
                    break;
                case 78:
                    this.$ = g[i];
                    break;
                case 79:
                    this.$ = g[i - 1];
                    break;
                case 80:
                    this.$ = e.extend(g[i], {soak: !0});
                    break;
                case 81:
                    this.$ = new e.Index(g[i]);
                    break;
                case 82:
                    this.$ = new e.Slice(g[i]);
                    break;
                case 83:
                    this.$ = new e.Obj(g[i - 2], g[i - 3].generated);
                    break;
                case 84:
                    this.$ = [];
                    break;
                case 85:
                    this.$ = [g[i]];
                    break;
                case 86:
                    this.$ = g[i - 2].concat(g[i]);
                    break;
                case 87:
                    this.$ = g[i - 3].concat(g[i]);
                    break;
                case 88:
                    this.$ = g[i - 5].concat(g[i - 2]);
                    break;
                case 89:
                    this.$ = new e.Class;
                    break;
                case 90:
                    this.$ = new e.Class(null, null, g[i]);
                    break;
                case 91:
                    this.$ = new e.Class(null, g[i]);
                    break;
                case 92:
                    this.$ = new e.Class(null, g[i - 1], g[i]);
                    break;
                case 93:
                    this.$ = new e.Class(g[i]);
                    break;
                case 94:
                    this.$ = new e.Class(g[i - 1], null, g[i]);
                    break;
                case 95:
                    this.$ = new e.Class(g[i - 2], g[i]);
                    break;
                case 96:
                    this.$ = new e.Class(g[i - 3], g[i - 1], g[i]);
                    break;
                case 97:
                    this.$ = new e.Call(g[i - 2], g[i], g[i - 1]);
                    break;
                case 98:
                    this.$ = new e.Call(g[i - 2], g[i], g[i - 1]);
                    break;
                case 99:
                    this.$ = new e.Call("super", [new e.Splat(new e.Literal("arguments"))]);
                    break;
                case 100:
                    this.$ = new e.Call("super", g[i]);
                    break;
                case 101:
                    this.$ = !1;
                    break;
                case 102:
                    this.$ = !0;
                    break;
                case 103:
                    this.$ = [];
                    break;
                case 104:
                    this.$ = g[i - 2];
                    break;
                case 105:
                    this.$ = new e.Value(new e.Literal("this"));
                    break;
                case 106:
                    this.$ = new e.Value(new e.Literal("this"));
                    break;
                case 107:
                    this.$ = new e.Value(new e.Literal("this"), [new e.Access(g[i])], "this");
                    break;
                case 108:
                    this.$ = new e.Arr([]);
                    break;
                case 109:
                    this.$ = new e.Arr(g[i - 2]);
                    break;
                case 110:
                    this.$ = "inclusive";
                    break;
                case 111:
                    this.$ = "exclusive";
                    break;
                case 112:
                    this.$ = new e.Range(g[i - 3], g[i - 1], g[i - 2]);
                    break;
                case 113:
                    this.$ = new e.Range(g[i - 2], g[i], g[i - 1]);
                    break;
                case 114:
                    this.$ = new e.Range(g[i - 1], null, g[i]);
                    break;
                case 115:
                    this.$ = new e.Range(null, g[i], g[i - 1]);
                    break;
                case 116:
                    this.$ = [g[i]];
                    break;
                case 117:
                    this.$ = g[i - 2].concat(g[i]);
                    break;
                case 118:
                    this.$ = g[i - 3].concat(g[i]);
                    break;
                case 119:
                    this.$ = g[i - 2];
                    break;
                case 120:
                    this.$ = g[i - 5].concat(g[i - 2]);
                    break;
                case 121:
                    this.$ = g[i];
                    break;
                case 122:
                    this.$ = g[i];
                    break;
                case 123:
                    this.$ = g[i];
                    break;
                case 124:
                    this.$ = [].concat(g[i - 2], g[i]);
                    break;
                case 125:
                    this.$ = new e.Try(g[i]);
                    break;
                case 126:
                    this.$ = new e.Try(g[i - 1], g[i][0], g[i][1]);
                    break;
                case 127:
                    this.$ = new e.Try(g[i - 2], null, null, g[i]);
                    break;
                case 128:
                    this.$ = new e.Try(g[i - 3], g[i - 2][0], g[i - 2][1], g[i]);
                    break;
                case 129:
                    this.$ = [g[i - 1], g[i]];
                    break;
                case 130:
                    this.$ = new e.Throw(g[i]);
                    break;
                case 131:
                    this.$ = new e.Parens(g[i - 1]);
                    break;
                case 132:
                    this.$ = new e.Parens(g[i - 2]);
                    break;
                case 133:
                    this.$ = new e.While(g[i]);
                    break;
                case 134:
                    this.$ = new e.While(g[i - 2], {guard: g[i]});
                    break;
                case 135:
                    this.$ = new e.While(g[i], {invert: !0});
                    break;
                case 136:
                    this.$ = new e.While(g[i - 2], {invert: !0, guard: g[i]});
                    break;
                case 137:
                    this.$ = g[i - 1].addBody(g[i]);
                    break;
                case 138:
                    this.$ = g[i].addBody(e.Block.wrap([g[i - 1]]));
                    break;
                case 139:
                    this.$ = g[i].addBody(e.Block.wrap([g[i - 1]]));
                    break;
                case 140:
                    this.$ = g[i];
                    break;
                case 141:
                    this.$ = (new e.While(new e.Literal("true"))).addBody(g[i]);
                    break;
                case 142:
                    this.$ = (new e.While(new e.Literal("true"))).addBody(e.Block.wrap([g[i]]));
                    break;
                case 143:
                    this.$ = new e.For(g[i - 1], g[i]);
                    break;
                case 144:
                    this.$ = new e.For(g[i - 1], g[i]);
                    break;
                case 145:
                    this.$ = new e.For(g[i], g[i - 1]);
                    break;
                case 146:
                    this.$ = {source: new e.Value(g[i])};
                    break;
                case 147:
                    this.$ = function () {
                        g[i].own = g[i - 1].own, g[i].name = g[i - 1][0], g[i].index = g[i - 1][1];
                        return g[i]
                    }();
                    break;
                case 148:
                    this.$ = g[i];
                    break;
                case 149:
                    this.$ = function () {
                        g[i].own = !0;
                        return g[i]
                    }();
                    break;
                case 150:
                    this.$ = g[i];
                    break;
                case 151:
                    this.$ = new e.Value(g[i]);
                    break;
                case 152:
                    this.$ = new e.Value(g[i]);
                    break;
                case 153:
                    this.$ = [g[i]];
                    break;
                case 154:
                    this.$ = [g[i - 2], g[i]];
                    break;
                case 155:
                    this.$ = {source: g[i]};
                    break;
                case 156:
                    this.$ = {source: g[i], object: !0};
                    break;
                case 157:
                    this.$ = {source: g[i - 2], guard: g[i]};
                    break;
                case 158:
                    this.$ = {source: g[i - 2], guard: g[i], object: !0};
                    break;
                case 159:
                    this.$ = {source: g[i - 2], step: g[i]};
                    break;
                case 160:
                    this.$ = {source: g[i - 4], guard: g[i - 2], step: g[i]};
                    break;
                case 161:
                    this.$ = {source: g[i - 4], step: g[i - 2], guard: g[i]};
                    break;
                case 162:
                    this.$ = new e.Switch(g[i - 3], g[i - 1]);
                    break;
                case 163:
                    this.$ = new e.Switch(g[i - 5], g[i - 3], g[i - 1]);
                    break;
                case 164:
                    this.$ = new e.Switch(null, g[i - 1]);
                    break;
                case 165:
                    this.$ = new e.Switch(null, g[i - 3], g[i - 1]);
                    break;
                case 166:
                    this.$ = g[i];
                    break;
                case 167:
                    this.$ = g[i - 1].concat(g[i]);
                    break;
                case 168:
                    this.$ = [
                        [g[i - 1], g[i]]
                    ];
                    break;
                case 169:
                    this.$ = [
                        [g[i - 2], g[i - 1]]
                    ];
                    break;
                case 170:
                    this.$ = new e.If(g[i - 1], g[i], {type: g[i - 2]});
                    break;
                case 171:
                    this.$ = g[i - 4].addElse(new e.If(g[i - 1], g[i], {type: g[i - 2]}));
                    break;
                case 172:
                    this.$ = g[i];
                    break;
                case 173:
                    this.$ = g[i - 2].addElse(g[i]);
                    break;
                case 174:
                    this.$ = new e.If(g[i], e.Block.wrap([g[i - 2]]), {type: g[i - 1], statement: !0});
                    break;
                case 175:
                    this.$ = new e.If(g[i], e.Block.wrap([g[i - 2]]), {type: g[i - 1], statement: !0});
                    break;
                case 176:
                    this.$ = new e.Op(g[i - 1], g[i]);
                    break;
                case 177:
                    this.$ = new e.Op("-", g[i]);
                    break;
                case 178:
                    this.$ = new e.Op("+", g[i]);
                    break;
                case 179:
                    this.$ = new e.Op("--", g[i]);
                    break;
                case 180:
                    this.$ = new e.Op("++", g[i]);
                    break;
                case 181:
                    this.$ = new e.Op("--", g[i - 1], null, !0);
                    break;
                case 182:
                    this.$ = new e.Op("++", g[i - 1], null, !0);
                    break;
                case 183:
                    this.$ = new e.Existence(g[i - 1]);
                    break;
                case 184:
                    this.$ = new e.Op("+", g[i - 2], g[i]);
                    break;
                case 185:
                    this.$ = new e.Op("-", g[i - 2], g[i]);
                    break;
                case 186:
                    this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
                    break;
                case 187:
                    this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
                    break;
                case 188:
                    this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
                    break;
                case 189:
                    this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
                    break;
                case 190:
                    this.$ = function () {
                        return g[i - 1].charAt(0) === "!" ? (new e.Op(g[i - 1].slice(1), g[i - 2], g[i])).invert() : new e.Op(g[i - 1], g[i - 2], g[i])
                    }();
                    break;
                case 191:
                    this.$ = new e.Assign(g[i - 2], g[i], g[i - 1]);
                    break;
                case 192:
                    this.$ = new e.Assign(g[i - 4], g[i - 1], g[i - 3]);
                    break;
                case 193:
                    this.$ = new e.Extends(g[i - 2], g[i])
            }
        }, table: [
            {1: [2, 1], 3: 1, 4: 2, 5: 3, 7: 4, 8: 6, 9: 7, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 5], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [3]},
            {1: [2, 2], 6: [1, 71]},
            {6: [1, 72]},
            {1: [2, 4], 6: [2, 4], 26: [2, 4], 98: [2, 4]},
            {4: 74, 7: 4, 8: 6, 9: 7, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 26: [1, 73], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 7], 6: [2, 7], 26: [2, 7], 98: [2, 7], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 8], 6: [2, 8], 26: [2, 8], 98: [2, 8], 99: 87, 100: [1, 62], 102: [1, 63], 105: 88, 106: [1, 65], 107: 66, 122: [1, 86]},
            {1: [2, 13], 6: [2, 13], 25: [2, 13], 26: [2, 13], 46: [2, 13], 51: [2, 13], 54: [2, 13], 59: 90, 63: [1, 92], 64: [1, 93], 65: [1, 94], 66: 95, 67: [1, 96], 69: [2, 13], 70: [1, 97], 74: [2, 13], 77: 89, 80: [1, 91], 81: [2, 101], 82: [2, 13], 87: [2, 13], 89: [2, 13], 98: [2, 13], 100: [2, 13], 101: [2, 13], 102: [2, 13], 106: [2, 13], 114: [2, 13], 122: [2, 13], 124: [2, 13], 125: [2, 13], 128: [2, 13], 129: [2, 13], 130: [2, 13], 131: [2, 13], 132: [2, 13], 133: [2, 13]},
            {1: [2, 14], 6: [2, 14], 25: [2, 14], 26: [2, 14], 46: [2, 14], 51: [2, 14], 54: [2, 14], 59: 99, 63: [1, 92], 64: [1, 93], 65: [1, 94], 66: 95, 67: [1, 96], 69: [2, 14], 70: [1, 97], 74: [2, 14], 77: 98, 80: [1, 91], 81: [2, 101], 82: [2, 14], 87: [2, 14], 89: [2, 14], 98: [2, 14], 100: [2, 14], 101: [2, 14], 102: [2, 14], 106: [2, 14], 114: [2, 14], 122: [2, 14], 124: [2, 14], 125: [2, 14], 128: [2, 14], 129: [2, 14], 130: [2, 14], 131: [2, 14], 132: [2, 14], 133: [2, 14]},
            {1: [2, 15], 6: [2, 15], 25: [2, 15], 26: [2, 15], 46: [2, 15], 51: [2, 15], 54: [2, 15], 69: [2, 15], 74: [2, 15], 82: [2, 15], 87: [2, 15], 89: [2, 15], 98: [2, 15], 100: [2, 15], 101: [2, 15], 102: [2, 15], 106: [2, 15], 114: [2, 15], 122: [2, 15], 124: [2, 15], 125: [2, 15], 128: [2, 15], 129: [2, 15], 130: [2, 15], 131: [2, 15], 132: [2, 15], 133: [2, 15]},
            {1: [2, 16], 6: [2, 16], 25: [2, 16], 26: [2, 16], 46: [2, 16], 51: [2, 16], 54: [2, 16], 69: [2, 16], 74: [2, 16], 82: [2, 16], 87: [2, 16], 89: [2, 16], 98: [2, 16], 100: [2, 16], 101: [2, 16], 102: [2, 16], 106: [2, 16], 114: [2, 16], 122: [2, 16], 124: [2, 16], 125: [2, 16], 128: [2, 16], 129: [2, 16], 130: [2, 16], 131: [2, 16], 132: [2, 16], 133: [2, 16]},
            {1: [2, 17], 6: [2, 17], 25: [2, 17], 26: [2, 17], 46: [2, 17], 51: [2, 17], 54: [2, 17], 69: [2, 17], 74: [2, 17], 82: [2, 17], 87: [2, 17], 89: [2, 17], 98: [2, 17], 100: [2, 17], 101: [2, 17], 102: [2, 17], 106: [2, 17], 114: [2, 17], 122: [2, 17], 124: [2, 17], 125: [2, 17], 128: [2, 17], 129: [2, 17], 130: [2, 17], 131: [2, 17], 132: [2, 17], 133: [2, 17]},
            {1: [2, 18], 6: [2, 18], 25: [2, 18], 26: [2, 18], 46: [2, 18], 51: [2, 18], 54: [2, 18], 69: [2, 18], 74: [2, 18], 82: [2, 18], 87: [2, 18], 89: [2, 18], 98: [2, 18], 100: [2, 18], 101: [2, 18], 102: [2, 18], 106: [2, 18], 114: [2, 18], 122: [2, 18], 124: [2, 18], 125: [2, 18], 128: [2, 18], 129: [2, 18], 130: [2, 18], 131: [2, 18], 132: [2, 18], 133: [2, 18]},
            {1: [2, 19], 6: [2, 19], 25: [2, 19], 26: [2, 19], 46: [2, 19], 51: [2, 19], 54: [2, 19], 69: [2, 19], 74: [2, 19], 82: [2, 19], 87: [2, 19], 89: [2, 19], 98: [2, 19], 100: [2, 19], 101: [2, 19], 102: [2, 19], 106: [2, 19], 114: [2, 19], 122: [2, 19], 124: [2, 19], 125: [2, 19], 128: [2, 19], 129: [2, 19], 130: [2, 19], 131: [2, 19], 132: [2, 19], 133: [2, 19]},
            {1: [2, 20], 6: [2, 20], 25: [2, 20], 26: [2, 20], 46: [2, 20], 51: [2, 20], 54: [2, 20], 69: [2, 20], 74: [2, 20], 82: [2, 20], 87: [2, 20], 89: [2, 20], 98: [2, 20], 100: [2, 20], 101: [2, 20], 102: [2, 20], 106: [2, 20], 114: [2, 20], 122: [2, 20], 124: [2, 20], 125: [2, 20], 128: [2, 20], 129: [2, 20], 130: [2, 20], 131: [2, 20], 132: [2, 20], 133: [2, 20]},
            {1: [2, 21], 6: [2, 21], 25: [2, 21], 26: [2, 21], 46: [2, 21], 51: [2, 21], 54: [2, 21], 69: [2, 21], 74: [2, 21], 82: [2, 21], 87: [2, 21], 89: [2, 21], 98: [2, 21], 100: [2, 21], 101: [2, 21], 102: [2, 21], 106: [2, 21], 114: [2, 21], 122: [2, 21], 124: [2, 21], 125: [2, 21], 128: [2, 21], 129: [2, 21], 130: [2, 21], 131: [2, 21], 132: [2, 21], 133: [2, 21]},
            {1: [2, 22], 6: [2, 22], 25: [2, 22], 26: [2, 22], 46: [2, 22], 51: [2, 22], 54: [2, 22], 69: [2, 22], 74: [2, 22], 82: [2, 22], 87: [2, 22], 89: [2, 22], 98: [2, 22], 100: [2, 22], 101: [2, 22], 102: [2, 22], 106: [2, 22], 114: [2, 22], 122: [2, 22], 124: [2, 22], 125: [2, 22], 128: [2, 22], 129: [2, 22], 130: [2, 22], 131: [2, 22], 132: [2, 22], 133: [2, 22]},
            {1: [2, 23], 6: [2, 23], 25: [2, 23], 26: [2, 23], 46: [2, 23], 51: [2, 23], 54: [2, 23], 69: [2, 23], 74: [2, 23], 82: [2, 23], 87: [2, 23], 89: [2, 23], 98: [2, 23], 100: [2, 23], 101: [2, 23], 102: [2, 23], 106: [2, 23], 114: [2, 23], 122: [2, 23], 124: [2, 23], 125: [2, 23], 128: [2, 23], 129: [2, 23], 130: [2, 23], 131: [2, 23], 132: [2, 23], 133: [2, 23]},
            {1: [2, 9], 6: [2, 9], 26: [2, 9], 98: [2, 9], 100: [2, 9], 102: [2, 9], 106: [2, 9], 122: [2, 9]},
            {1: [2, 10], 6: [2, 10], 26: [2, 10], 98: [2, 10], 100: [2, 10], 102: [2, 10], 106: [2, 10], 122: [2, 10]},
            {1: [2, 11], 6: [2, 11], 26: [2, 11], 98: [2, 11], 100: [2, 11], 102: [2, 11], 106: [2, 11], 122: [2, 11]},
            {1: [2, 12], 6: [2, 12], 26: [2, 12], 98: [2, 12], 100: [2, 12], 102: [2, 12], 106: [2, 12], 122: [2, 12]},
            {1: [2, 69], 6: [2, 69], 25: [2, 69], 26: [2, 69], 37: [1, 100], 46: [2, 69], 51: [2, 69], 54: [2, 69], 63: [2, 69], 64: [2, 69], 65: [2, 69], 67: [2, 69], 69: [2, 69], 70: [2, 69], 74: [2, 69], 80: [2, 69], 81: [2, 69], 82: [2, 69], 87: [2, 69], 89: [2, 69], 98: [2, 69], 100: [2, 69], 101: [2, 69], 102: [2, 69], 106: [2, 69], 114: [2, 69], 122: [2, 69], 124: [2, 69], 125: [2, 69], 128: [2, 69], 129: [2, 69], 130: [2, 69], 131: [2, 69], 132: [2, 69], 133: [2, 69]},
            {1: [2, 70], 6: [2, 70], 25: [2, 70], 26: [2, 70], 46: [2, 70], 51: [2, 70], 54: [2, 70], 63: [2, 70], 64: [2, 70], 65: [2, 70], 67: [2, 70], 69: [2, 70], 70: [2, 70], 74: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 87: [2, 70], 89: [2, 70], 98: [2, 70], 100: [2, 70], 101: [2, 70], 102: [2, 70], 106: [2, 70], 114: [2, 70], 122: [2, 70], 124: [2, 70], 125: [2, 70], 128: [2, 70], 129: [2, 70], 130: [2, 70], 131: [2, 70], 132: [2, 70], 133: [2, 70]},
            {1: [2, 71], 6: [2, 71], 25: [2, 71], 26: [2, 71], 46: [2, 71], 51: [2, 71], 54: [2, 71], 63: [2, 71], 64: [2, 71], 65: [2, 71], 67: [2, 71], 69: [2, 71], 70: [2, 71], 74: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 87: [2, 71], 89: [2, 71], 98: [2, 71], 100: [2, 71], 101: [2, 71], 102: [2, 71], 106: [2, 71], 114: [2, 71], 122: [2, 71], 124: [2, 71], 125: [2, 71], 128: [2, 71], 129: [2, 71], 130: [2, 71], 131: [2, 71], 132: [2, 71], 133: [2, 71]},
            {1: [2, 72], 6: [2, 72], 25: [2, 72], 26: [2, 72], 46: [2, 72], 51: [2, 72], 54: [2, 72], 63: [2, 72], 64: [2, 72], 65: [2, 72], 67: [2, 72], 69: [2, 72], 70: [2, 72], 74: [2, 72], 80: [2, 72], 81: [2, 72], 82: [2, 72], 87: [2, 72], 89: [2, 72], 98: [2, 72], 100: [2, 72], 101: [2, 72], 102: [2, 72], 106: [2, 72], 114: [2, 72], 122: [2, 72], 124: [2, 72], 125: [2, 72], 128: [2, 72], 129: [2, 72], 130: [2, 72], 131: [2, 72], 132: [2, 72], 133: [2, 72]},
            {1: [2, 73], 6: [2, 73], 25: [2, 73], 26: [2, 73], 46: [2, 73], 51: [2, 73], 54: [2, 73], 63: [2, 73], 64: [2, 73], 65: [2, 73], 67: [2, 73], 69: [2, 73], 70: [2, 73], 74: [2, 73], 80: [2, 73], 81: [2, 73], 82: [2, 73], 87: [2, 73], 89: [2, 73], 98: [2, 73], 100: [2, 73], 101: [2, 73], 102: [2, 73], 106: [2, 73], 114: [2, 73], 122: [2, 73], 124: [2, 73], 125: [2, 73], 128: [2, 73], 129: [2, 73], 130: [2, 73], 131: [2, 73], 132: [2, 73], 133: [2, 73]},
            {1: [2, 99], 6: [2, 99], 25: [2, 99], 26: [2, 99], 46: [2, 99], 51: [2, 99], 54: [2, 99], 63: [2, 99], 64: [2, 99], 65: [2, 99], 67: [2, 99], 69: [2, 99], 70: [2, 99], 74: [2, 99], 78: 101, 80: [2, 99], 81: [1, 102], 82: [2, 99], 87: [2, 99], 89: [2, 99], 98: [2, 99], 100: [2, 99], 101: [2, 99], 102: [2, 99], 106: [2, 99], 114: [2, 99], 122: [2, 99], 124: [2, 99], 125: [2, 99], 128: [2, 99], 129: [2, 99], 130: [2, 99], 131: [2, 99], 132: [2, 99], 133: [2, 99]},
            {27: 106, 28: [1, 70], 41: 107, 45: 103, 46: [2, 51], 51: [2, 51], 52: 104, 53: 105, 55: 108, 56: 109, 72: [1, 67], 85: [1, 110], 86: [1, 111]},
            {5: 112, 25: [1, 5]},
            {8: 113, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 115, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 116, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {14: 118, 15: 119, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 120, 41: 60, 55: 47, 56: 48, 58: 117, 60: 25, 61: 26, 62: 27, 72: [1, 67], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 97: [1, 53]},
            {14: 118, 15: 119, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 120, 41: 60, 55: 47, 56: 48, 58: 121, 60: 25, 61: 26, 62: 27, 72: [1, 67], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 97: [1, 53]},
            {1: [2, 66], 6: [2, 66], 25: [2, 66], 26: [2, 66], 37: [2, 66], 46: [2, 66], 51: [2, 66], 54: [2, 66], 63: [2, 66], 64: [2, 66], 65: [2, 66], 67: [2, 66], 69: [2, 66], 70: [2, 66], 74: [2, 66], 76: [1, 125], 80: [2, 66], 81: [2, 66], 82: [2, 66], 87: [2, 66], 89: [2, 66], 98: [2, 66], 100: [2, 66], 101: [2, 66], 102: [2, 66], 106: [2, 66], 114: [2, 66], 122: [2, 66], 124: [2, 66], 125: [2, 66], 126: [1, 122], 127: [1, 123], 128: [2, 66], 129: [2, 66], 130: [2, 66], 131: [2, 66], 132: [2, 66], 133: [2, 66], 134: [1, 124]},
            {1: [2, 172], 6: [2, 172], 25: [2, 172], 26: [2, 172], 46: [2, 172], 51: [2, 172], 54: [2, 172], 69: [2, 172], 74: [2, 172], 82: [2, 172], 87: [2, 172], 89: [2, 172], 98: [2, 172], 100: [2, 172], 101: [2, 172], 102: [2, 172], 106: [2, 172], 114: [2, 172], 117: [1, 126], 122: [2, 172], 124: [2, 172], 125: [2, 172], 128: [2, 172], 129: [2, 172], 130: [2, 172], 131: [2, 172], 132: [2, 172], 133: [2, 172]},
            {5: 127, 25: [1, 5]},
            {5: 128, 25: [1, 5]},
            {1: [2, 140], 6: [2, 140], 25: [2, 140], 26: [2, 140], 46: [2, 140], 51: [2, 140], 54: [2, 140], 69: [2, 140], 74: [2, 140], 82: [2, 140], 87: [2, 140], 89: [2, 140], 98: [2, 140], 100: [2, 140], 101: [2, 140], 102: [2, 140], 106: [2, 140], 114: [2, 140], 122: [2, 140], 124: [2, 140], 125: [2, 140], 128: [2, 140], 129: [2, 140], 130: [2, 140], 131: [2, 140], 132: [2, 140], 133: [2, 140]},
            {5: 129, 25: [1, 5]},
            {8: 130, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 131], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 89], 5: 132, 6: [2, 89], 14: 118, 15: 119, 25: [1, 5], 26: [2, 89], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 120, 41: 60, 46: [2, 89], 51: [2, 89], 54: [2, 89], 55: 47, 56: 48, 58: 134, 60: 25, 61: 26, 62: 27, 69: [2, 89], 72: [1, 67], 74: [2, 89], 76: [1, 133], 79: [1, 28], 82: [2, 89], 84: [1, 55], 85: [1, 56], 86: [1, 54], 87: [2, 89], 89: [2, 89], 97: [1, 53], 98: [2, 89], 100: [2, 89], 101: [2, 89], 102: [2, 89], 106: [2, 89], 114: [2, 89], 122: [2, 89], 124: [2, 89], 125: [2, 89], 128: [2, 89], 129: [2, 89], 130: [2, 89], 131: [2, 89], 132: [2, 89], 133: [2, 89]},
            {1: [2, 43], 6: [2, 43], 8: 135, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 26: [2, 43], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 98: [2, 43], 99: 39, 100: [2, 43], 102: [2, 43], 103: 40, 104: [1, 64], 105: 41, 106: [2, 43], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 122: [2, 43], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 136, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 44], 6: [2, 44], 25: [2, 44], 26: [2, 44], 51: [2, 44], 74: [2, 44], 98: [2, 44], 100: [2, 44], 102: [2, 44], 106: [2, 44], 122: [2, 44]},
            {1: [2, 67], 6: [2, 67], 25: [2, 67], 26: [2, 67], 37: [2, 67], 46: [2, 67], 51: [2, 67], 54: [2, 67], 63: [2, 67], 64: [2, 67], 65: [2, 67], 67: [2, 67], 69: [2, 67], 70: [2, 67], 74: [2, 67], 80: [2, 67], 81: [2, 67], 82: [2, 67], 87: [2, 67], 89: [2, 67], 98: [2, 67], 100: [2, 67], 101: [2, 67], 102: [2, 67], 106: [2, 67], 114: [2, 67], 122: [2, 67], 124: [2, 67], 125: [2, 67], 128: [2, 67], 129: [2, 67], 130: [2, 67], 131: [2, 67], 132: [2, 67], 133: [2, 67]},
            {1: [2, 68], 6: [2, 68], 25: [2, 68], 26: [2, 68], 37: [2, 68], 46: [2, 68], 51: [2, 68], 54: [2, 68], 63: [2, 68], 64: [2, 68], 65: [2, 68], 67: [2, 68], 69: [2, 68], 70: [2, 68], 74: [2, 68], 80: [2, 68], 81: [2, 68], 82: [2, 68], 87: [2, 68], 89: [2, 68], 98: [2, 68], 100: [2, 68], 101: [2, 68], 102: [2, 68], 106: [2, 68], 114: [2, 68], 122: [2, 68], 124: [2, 68], 125: [2, 68], 128: [2, 68], 129: [2, 68], 130: [2, 68], 131: [2, 68], 132: [2, 68], 133: [2, 68]},
            {1: [2, 29], 6: [2, 29], 25: [2, 29], 26: [2, 29], 46: [2, 29], 51: [2, 29], 54: [2, 29], 63: [2, 29], 64: [2, 29], 65: [2, 29], 67: [2, 29], 69: [2, 29], 70: [2, 29], 74: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 87: [2, 29], 89: [2, 29], 98: [2, 29], 100: [2, 29], 101: [2, 29], 102: [2, 29], 106: [2, 29], 114: [2, 29], 122: [2, 29], 124: [2, 29], 125: [2, 29], 128: [2, 29], 129: [2, 29], 130: [2, 29], 131: [2, 29], 132: [2, 29], 133: [2, 29]},
            {1: [2, 30], 6: [2, 30], 25: [2, 30], 26: [2, 30], 46: [2, 30], 51: [2, 30], 54: [2, 30], 63: [2, 30], 64: [2, 30], 65: [2, 30], 67: [2, 30], 69: [2, 30], 70: [2, 30], 74: [2, 30], 80: [2, 30], 81: [2, 30], 82: [2, 30], 87: [2, 30], 89: [2, 30], 98: [2, 30], 100: [2, 30], 101: [2, 30], 102: [2, 30], 106: [2, 30], 114: [2, 30], 122: [2, 30], 124: [2, 30], 125: [2, 30], 128: [2, 30], 129: [2, 30], 130: [2, 30], 131: [2, 30], 132: [2, 30], 133: [2, 30]},
            {1: [2, 31], 6: [2, 31], 25: [2, 31], 26: [2, 31], 46: [2, 31], 51: [2, 31], 54: [2, 31], 63: [2, 31], 64: [2, 31], 65: [2, 31], 67: [2, 31], 69: [2, 31], 70: [2, 31], 74: [2, 31], 80: [2, 31], 81: [2, 31], 82: [2, 31], 87: [2, 31], 89: [2, 31], 98: [2, 31], 100: [2, 31], 101: [2, 31], 102: [2, 31], 106: [2, 31], 114: [2, 31], 122: [2, 31], 124: [2, 31], 125: [2, 31], 128: [2, 31], 129: [2, 31], 130: [2, 31], 131: [2, 31], 132: [2, 31], 133: [2, 31]},
            {1: [2, 32], 6: [2, 32], 25: [2, 32], 26: [2, 32], 46: [2, 32], 51: [2, 32], 54: [2, 32], 63: [2, 32], 64: [2, 32], 65: [2, 32], 67: [2, 32], 69: [2, 32], 70: [2, 32], 74: [2, 32], 80: [2, 32], 81: [2, 32], 82: [2, 32], 87: [2, 32], 89: [2, 32], 98: [2, 32], 100: [2, 32], 101: [2, 32], 102: [2, 32], 106: [2, 32], 114: [2, 32], 122: [2, 32], 124: [2, 32], 125: [2, 32], 128: [2, 32], 129: [2, 32], 130: [2, 32], 131: [2, 32], 132: [2, 32], 133: [2, 32]},
            {4: 137, 7: 4, 8: 6, 9: 7, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 138], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 139, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 143], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 57: 144, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 83: 141, 84: [1, 55], 85: [1, 56], 86: [1, 54], 87: [1, 140], 90: 142, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 105], 6: [2, 105], 25: [2, 105], 26: [2, 105], 46: [2, 105], 51: [2, 105], 54: [2, 105], 63: [2, 105], 64: [2, 105], 65: [2, 105], 67: [2, 105], 69: [2, 105], 70: [2, 105], 74: [2, 105], 80: [2, 105], 81: [2, 105], 82: [2, 105], 87: [2, 105], 89: [2, 105], 98: [2, 105], 100: [2, 105], 101: [2, 105], 102: [2, 105], 106: [2, 105], 114: [2, 105], 122: [2, 105], 124: [2, 105], 125: [2, 105], 128: [2, 105], 129: [2, 105], 130: [2, 105], 131: [2, 105], 132: [2, 105], 133: [2, 105]},
            {1: [2, 106], 6: [2, 106], 25: [2, 106], 26: [2, 106], 27: 145, 28: [1, 70], 46: [2, 106], 51: [2, 106], 54: [2, 106], 63: [2, 106], 64: [2, 106], 65: [2, 106], 67: [2, 106], 69: [2, 106], 70: [2, 106], 74: [2, 106], 80: [2, 106], 81: [2, 106], 82: [2, 106], 87: [2, 106], 89: [2, 106], 98: [2, 106], 100: [2, 106], 101: [2, 106], 102: [2, 106], 106: [2, 106], 114: [2, 106], 122: [2, 106], 124: [2, 106], 125: [2, 106], 128: [2, 106], 129: [2, 106], 130: [2, 106], 131: [2, 106], 132: [2, 106], 133: [2, 106]},
            {25: [2, 47]},
            {25: [2, 48]},
            {1: [2, 62], 6: [2, 62], 25: [2, 62], 26: [2, 62], 37: [2, 62], 46: [2, 62], 51: [2, 62], 54: [2, 62], 63: [2, 62], 64: [2, 62], 65: [2, 62], 67: [2, 62], 69: [2, 62], 70: [2, 62], 74: [2, 62], 76: [2, 62], 80: [2, 62], 81: [2, 62], 82: [2, 62], 87: [2, 62], 89: [2, 62], 98: [2, 62], 100: [2, 62], 101: [2, 62], 102: [2, 62], 106: [2, 62], 114: [2, 62], 122: [2, 62], 124: [2, 62], 125: [2, 62], 126: [2, 62], 127: [2, 62], 128: [2, 62], 129: [2, 62], 130: [2, 62], 131: [2, 62], 132: [2, 62], 133: [2, 62], 134: [2, 62]},
            {1: [2, 65], 6: [2, 65], 25: [2, 65], 26: [2, 65], 37: [2, 65], 46: [2, 65], 51: [2, 65], 54: [2, 65], 63: [2, 65], 64: [2, 65], 65: [2, 65], 67: [2, 65], 69: [2, 65], 70: [2, 65], 74: [2, 65], 76: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 87: [2, 65], 89: [2, 65], 98: [2, 65], 100: [2, 65], 101: [2, 65], 102: [2, 65], 106: [2, 65], 114: [2, 65], 122: [2, 65], 124: [2, 65], 125: [2, 65], 126: [2, 65], 127: [2, 65], 128: [2, 65], 129: [2, 65], 130: [2, 65], 131: [2, 65], 132: [2, 65], 133: [2, 65], 134: [2, 65]},
            {8: 146, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 147, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 148, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {5: 149, 8: 150, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 5], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {27: 155, 28: [1, 70], 55: 156, 56: 157, 61: 151, 72: [1, 67], 86: [1, 54], 109: 152, 110: [1, 153], 111: 154},
            {108: 158, 112: [1, 159], 113: [1, 160]},
            {6: [2, 84], 12: 164, 25: [2, 84], 27: 165, 28: [1, 70], 29: 166, 30: [1, 68], 31: [1, 69], 38: 162, 39: 163, 41: 167, 43: [1, 46], 51: [2, 84], 73: 161, 74: [2, 84], 85: [1, 110]},
            {1: [2, 27], 6: [2, 27], 25: [2, 27], 26: [2, 27], 40: [2, 27], 46: [2, 27], 51: [2, 27], 54: [2, 27], 63: [2, 27], 64: [2, 27], 65: [2, 27], 67: [2, 27], 69: [2, 27], 70: [2, 27], 74: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 87: [2, 27], 89: [2, 27], 98: [2, 27], 100: [2, 27], 101: [2, 27], 102: [2, 27], 106: [2, 27], 114: [2, 27], 122: [2, 27], 124: [2, 27], 125: [2, 27], 128: [2, 27], 129: [2, 27], 130: [2, 27], 131: [2, 27], 132: [2, 27], 133: [2, 27]},
            {1: [2, 28], 6: [2, 28], 25: [2, 28], 26: [2, 28], 40: [2, 28], 46: [2, 28], 51: [2, 28], 54: [2, 28], 63: [2, 28], 64: [2, 28], 65: [2, 28], 67: [2, 28], 69: [2, 28], 70: [2, 28], 74: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 87: [2, 28], 89: [2, 28], 98: [2, 28], 100: [2, 28], 101: [2, 28], 102: [2, 28], 106: [2, 28], 114: [2, 28], 122: [2, 28], 124: [2, 28], 125: [2, 28], 128: [2, 28], 129: [2, 28], 130: [2, 28], 131: [2, 28], 132: [2, 28], 133: [2, 28]},
            {1: [2, 26], 6: [2, 26], 25: [2, 26], 26: [2, 26], 37: [2, 26], 40: [2, 26], 46: [2, 26], 51: [2, 26], 54: [2, 26], 63: [2, 26], 64: [2, 26], 65: [2, 26], 67: [2, 26], 69: [2, 26], 70: [2, 26], 74: [2, 26], 76: [2, 26], 80: [2, 26], 81: [2, 26], 82: [2, 26], 87: [2, 26], 89: [2, 26], 98: [2, 26], 100: [2, 26], 101: [2, 26], 102: [2, 26], 106: [2, 26], 112: [2, 26], 113: [2, 26], 114: [2, 26], 122: [2, 26], 124: [2, 26], 125: [2, 26], 126: [2, 26], 127: [2, 26], 128: [2, 26], 129: [2, 26], 130: [2, 26], 131: [2, 26], 132: [2, 26], 133: [2, 26], 134: [2, 26]},
            {1: [2, 6], 6: [2, 6], 7: 168, 8: 6, 9: 7, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 26: [2, 6], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 98: [2, 6], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 3]},
            {1: [2, 24], 6: [2, 24], 25: [2, 24], 26: [2, 24], 46: [2, 24], 51: [2, 24], 54: [2, 24], 69: [2, 24], 74: [2, 24], 82: [2, 24], 87: [2, 24], 89: [2, 24], 94: [2, 24], 95: [2, 24], 98: [2, 24], 100: [2, 24], 101: [2, 24], 102: [2, 24], 106: [2, 24], 114: [2, 24], 117: [2, 24], 119: [2, 24], 122: [2, 24], 124: [2, 24], 125: [2, 24], 128: [2, 24], 129: [2, 24], 130: [2, 24], 131: [2, 24], 132: [2, 24], 133: [2, 24]},
            {6: [1, 71], 26: [1, 169]},
            {1: [2, 183], 6: [2, 183], 25: [2, 183], 26: [2, 183], 46: [2, 183], 51: [2, 183], 54: [2, 183], 69: [2, 183], 74: [2, 183], 82: [2, 183], 87: [2, 183], 89: [2, 183], 98: [2, 183], 100: [2, 183], 101: [2, 183], 102: [2, 183], 106: [2, 183], 114: [2, 183], 122: [2, 183], 124: [2, 183], 125: [2, 183], 128: [2, 183], 129: [2, 183], 130: [2, 183], 131: [2, 183], 132: [2, 183], 133: [2, 183]},
            {8: 170, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 171, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 172, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 173, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 174, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 175, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 176, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 177, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 139], 6: [2, 139], 25: [2, 139], 26: [2, 139], 46: [2, 139], 51: [2, 139], 54: [2, 139], 69: [2, 139], 74: [2, 139], 82: [2, 139], 87: [2, 139], 89: [2, 139], 98: [2, 139], 100: [2, 139], 101: [2, 139], 102: [2, 139], 106: [2, 139], 114: [2, 139], 122: [2, 139], 124: [2, 139], 125: [2, 139], 128: [2, 139], 129: [2, 139], 130: [2, 139], 131: [2, 139], 132: [2, 139], 133: [2, 139]},
            {1: [2, 144], 6: [2, 144], 25: [2, 144], 26: [2, 144], 46: [2, 144], 51: [2, 144], 54: [2, 144], 69: [2, 144], 74: [2, 144], 82: [2, 144], 87: [2, 144], 89: [2, 144], 98: [2, 144], 100: [2, 144], 101: [2, 144], 102: [2, 144], 106: [2, 144], 114: [2, 144], 122: [2, 144], 124: [2, 144], 125: [2, 144], 128: [2, 144], 129: [2, 144], 130: [2, 144], 131: [2, 144], 132: [2, 144], 133: [2, 144]},
            {8: 178, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 138], 6: [2, 138], 25: [2, 138], 26: [2, 138], 46: [2, 138], 51: [2, 138], 54: [2, 138], 69: [2, 138], 74: [2, 138], 82: [2, 138], 87: [2, 138], 89: [2, 138], 98: [2, 138], 100: [2, 138], 101: [2, 138], 102: [2, 138], 106: [2, 138], 114: [2, 138], 122: [2, 138], 124: [2, 138], 125: [2, 138], 128: [2, 138], 129: [2, 138], 130: [2, 138], 131: [2, 138], 132: [2, 138], 133: [2, 138]},
            {1: [2, 143], 6: [2, 143], 25: [2, 143], 26: [2, 143], 46: [2, 143], 51: [2, 143], 54: [2, 143], 69: [2, 143], 74: [2, 143], 82: [2, 143], 87: [2, 143], 89: [2, 143], 98: [2, 143], 100: [2, 143], 101: [2, 143], 102: [2, 143], 106: [2, 143], 114: [2, 143], 122: [2, 143], 124: [2, 143], 125: [2, 143], 128: [2, 143], 129: [2, 143], 130: [2, 143], 131: [2, 143], 132: [2, 143], 133: [2, 143]},
            {78: 179, 81: [1, 102]},
            {1: [2, 63], 6: [2, 63], 25: [2, 63], 26: [2, 63], 37: [2, 63], 46: [2, 63], 51: [2, 63], 54: [2, 63], 63: [2, 63], 64: [2, 63], 65: [2, 63], 67: [2, 63], 69: [2, 63], 70: [2, 63], 74: [2, 63], 76: [2, 63], 80: [2, 63], 81: [2, 63], 82: [2, 63], 87: [2, 63], 89: [2, 63], 98: [2, 63], 100: [2, 63], 101: [2, 63], 102: [2, 63], 106: [2, 63], 114: [2, 63], 122: [2, 63], 124: [2, 63], 125: [2, 63], 126: [2, 63], 127: [2, 63], 128: [2, 63], 129: [2, 63], 130: [2, 63], 131: [2, 63], 132: [2, 63], 133: [2, 63], 134: [2, 63]},
            {81: [2, 102]},
            {27: 180, 28: [1, 70]},
            {27: 181, 28: [1, 70]},
            {1: [2, 77], 6: [2, 77], 25: [2, 77], 26: [2, 77], 27: 182, 28: [1, 70], 37: [2, 77], 46: [2, 77], 51: [2, 77], 54: [2, 77], 63: [2, 77], 64: [2, 77], 65: [2, 77], 67: [2, 77], 69: [2, 77], 70: [2, 77], 74: [2, 77], 76: [2, 77], 80: [2, 77], 81: [2, 77], 82: [2, 77], 87: [2, 77], 89: [2, 77], 98: [2, 77], 100: [2, 77], 101: [2, 77], 102: [2, 77], 106: [2, 77], 114: [2, 77], 122: [2, 77], 124: [2, 77], 125: [2, 77], 126: [2, 77], 127: [2, 77], 128: [2, 77], 129: [2, 77], 130: [2, 77], 131: [2, 77], 132: [2, 77], 133: [2, 77], 134: [2, 77]},
            {1: [2, 78], 6: [2, 78], 25: [2, 78], 26: [2, 78], 37: [2, 78], 46: [2, 78], 51: [2, 78], 54: [2, 78], 63: [2, 78], 64: [2, 78], 65: [2, 78], 67: [2, 78], 69: [2, 78], 70: [2, 78], 74: [2, 78], 76: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 87: [2, 78], 89: [2, 78], 98: [2, 78], 100: [2, 78], 101: [2, 78], 102: [2, 78], 106: [2, 78], 114: [2, 78], 122: [2, 78], 124: [2, 78], 125: [2, 78], 126: [2, 78], 127: [2, 78], 128: [2, 78], 129: [2, 78], 130: [2, 78], 131: [2, 78], 132: [2, 78], 133: [2, 78], 134: [2, 78]},
            {8: 184, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 54: [1, 188], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 68: 183, 71: 185, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 88: 186, 89: [1, 187], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {66: 189, 67: [1, 96], 70: [1, 97]},
            {78: 190, 81: [1, 102]},
            {1: [2, 64], 6: [2, 64], 25: [2, 64], 26: [2, 64], 37: [2, 64], 46: [2, 64], 51: [2, 64], 54: [2, 64], 63: [2, 64], 64: [2, 64], 65: [2, 64], 67: [2, 64], 69: [2, 64], 70: [2, 64], 74: [2, 64], 76: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 87: [2, 64], 89: [2, 64], 98: [2, 64], 100: [2, 64], 101: [2, 64], 102: [2, 64], 106: [2, 64], 114: [2, 64], 122: [2, 64], 124: [2, 64], 125: [2, 64], 126: [2, 64], 127: [2, 64], 128: [2, 64], 129: [2, 64], 130: [2, 64], 131: [2, 64], 132: [2, 64], 133: [2, 64], 134: [2, 64]},
            {8: 191, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 192], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 100], 6: [2, 100], 25: [2, 100], 26: [2, 100], 46: [2, 100], 51: [2, 100], 54: [2, 100], 63: [2, 100], 64: [2, 100], 65: [2, 100], 67: [2, 100], 69: [2, 100], 70: [2, 100], 74: [2, 100], 80: [2, 100], 81: [2, 100], 82: [2, 100], 87: [2, 100], 89: [2, 100], 98: [2, 100], 100: [2, 100], 101: [2, 100], 102: [2, 100], 106: [2, 100], 114: [2, 100], 122: [2, 100], 124: [2, 100], 125: [2, 100], 128: [2, 100], 129: [2, 100], 130: [2, 100], 131: [2, 100], 132: [2, 100], 133: [2, 100]},
            {8: 195, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 143], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 57: 144, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 82: [1, 193], 83: 194, 84: [1, 55], 85: [1, 56], 86: [1, 54], 90: 142, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {46: [1, 196], 51: [1, 197]},
            {46: [2, 52], 51: [2, 52]},
            {37: [1, 199], 46: [2, 54], 51: [2, 54], 54: [1, 198]},
            {37: [2, 57], 46: [2, 57], 51: [2, 57], 54: [2, 57]},
            {37: [2, 58], 46: [2, 58], 51: [2, 58], 54: [2, 58]},
            {37: [2, 59], 46: [2, 59], 51: [2, 59], 54: [2, 59]},
            {37: [2, 60], 46: [2, 60], 51: [2, 60], 54: [2, 60]},
            {27: 145, 28: [1, 70]},
            {8: 195, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 143], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 57: 144, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 83: 141, 84: [1, 55], 85: [1, 56], 86: [1, 54], 87: [1, 140], 90: 142, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 46], 6: [2, 46], 25: [2, 46], 26: [2, 46], 46: [2, 46], 51: [2, 46], 54: [2, 46], 69: [2, 46], 74: [2, 46], 82: [2, 46], 87: [2, 46], 89: [2, 46], 98: [2, 46], 100: [2, 46], 101: [2, 46], 102: [2, 46], 106: [2, 46], 114: [2, 46], 122: [2, 46], 124: [2, 46], 125: [2, 46], 128: [2, 46], 129: [2, 46], 130: [2, 46], 131: [2, 46], 132: [2, 46], 133: [2, 46]},
            {1: [2, 176], 6: [2, 176], 25: [2, 176], 26: [2, 176], 46: [2, 176], 51: [2, 176], 54: [2, 176], 69: [2, 176], 74: [2, 176], 82: [2, 176], 87: [2, 176], 89: [2, 176], 98: [2, 176], 99: 84, 100: [2, 176], 101: [2, 176], 102: [2, 176], 105: 85, 106: [2, 176], 107: 66, 114: [2, 176], 122: [2, 176], 124: [2, 176], 125: [2, 176], 128: [1, 75], 129: [2, 176], 130: [2, 176], 131: [2, 176], 132: [2, 176], 133: [2, 176]},
            {99: 87, 100: [1, 62], 102: [1, 63], 105: 88, 106: [1, 65], 107: 66, 122: [1, 86]},
            {1: [2, 177], 6: [2, 177], 25: [2, 177], 26: [2, 177], 46: [2, 177], 51: [2, 177], 54: [2, 177], 69: [2, 177], 74: [2, 177], 82: [2, 177], 87: [2, 177], 89: [2, 177], 98: [2, 177], 99: 84, 100: [2, 177], 101: [2, 177], 102: [2, 177], 105: 85, 106: [2, 177], 107: 66, 114: [2, 177], 122: [2, 177], 124: [2, 177], 125: [2, 177], 128: [1, 75], 129: [2, 177], 130: [2, 177], 131: [2, 177], 132: [2, 177], 133: [2, 177]},
            {1: [2, 178], 6: [2, 178], 25: [2, 178], 26: [2, 178], 46: [2, 178], 51: [2, 178], 54: [2, 178], 69: [2, 178], 74: [2, 178], 82: [2, 178], 87: [2, 178], 89: [2, 178], 98: [2, 178], 99: 84, 100: [2, 178], 101: [2, 178], 102: [2, 178], 105: 85, 106: [2, 178], 107: 66, 114: [2, 178], 122: [2, 178], 124: [2, 178], 125: [2, 178], 128: [1, 75], 129: [2, 178], 130: [2, 178], 131: [2, 178], 132: [2, 178], 133: [2, 178]},
            {1: [2, 179], 6: [2, 179], 25: [2, 179], 26: [2, 179], 46: [2, 179], 51: [2, 179], 54: [2, 179], 63: [2, 66], 64: [2, 66], 65: [2, 66], 67: [2, 66], 69: [2, 179], 70: [2, 66], 74: [2, 179], 80: [2, 66], 81: [2, 66], 82: [2, 179], 87: [2, 179], 89: [2, 179], 98: [2, 179], 100: [2, 179], 101: [2, 179], 102: [2, 179], 106: [2, 179], 114: [2, 179], 122: [2, 179], 124: [2, 179], 125: [2, 179], 128: [2, 179], 129: [2, 179], 130: [2, 179], 131: [2, 179], 132: [2, 179], 133: [2, 179]},
            {59: 90, 63: [1, 92], 64: [1, 93], 65: [1, 94], 66: 95, 67: [1, 96], 70: [1, 97], 77: 89, 80: [1, 91], 81: [2, 101]},
            {59: 99, 63: [1, 92], 64: [1, 93], 65: [1, 94], 66: 95, 67: [1, 96], 70: [1, 97], 77: 98, 80: [1, 91], 81: [2, 101]},
            {63: [2, 69], 64: [2, 69], 65: [2, 69], 67: [2, 69], 70: [2, 69], 80: [2, 69], 81: [2, 69]},
            {1: [2, 180], 6: [2, 180], 25: [2, 180], 26: [2, 180], 46: [2, 180], 51: [2, 180], 54: [2, 180], 63: [2, 66], 64: [2, 66], 65: [2, 66], 67: [2, 66], 69: [2, 180], 70: [2, 66], 74: [2, 180], 80: [2, 66], 81: [2, 66], 82: [2, 180], 87: [2, 180], 89: [2, 180], 98: [2, 180], 100: [2, 180], 101: [2, 180], 102: [2, 180], 106: [2, 180], 114: [2, 180], 122: [2, 180], 124: [2, 180], 125: [2, 180], 128: [2, 180], 129: [2, 180], 130: [2, 180], 131: [2, 180], 132: [2, 180], 133: [2, 180]},
            {1: [2, 181], 6: [2, 181], 25: [2, 181], 26: [2, 181], 46: [2, 181], 51: [2, 181], 54: [2, 181], 69: [2, 181], 74: [2, 181], 82: [2, 181], 87: [2, 181], 89: [2, 181], 98: [2, 181], 100: [2, 181], 101: [2, 181], 102: [2, 181], 106: [2, 181], 114: [2, 181], 122: [2, 181], 124: [2, 181], 125: [2, 181], 128: [2, 181], 129: [2, 181], 130: [2, 181], 131: [2, 181], 132: [2, 181], 133: [2, 181]},
            {1: [2, 182], 6: [2, 182], 25: [2, 182], 26: [2, 182], 46: [2, 182], 51: [2, 182], 54: [2, 182], 69: [2, 182], 74: [2, 182], 82: [2, 182], 87: [2, 182], 89: [2, 182], 98: [2, 182], 100: [2, 182], 101: [2, 182], 102: [2, 182], 106: [2, 182], 114: [2, 182], 122: [2, 182], 124: [2, 182], 125: [2, 182], 128: [2, 182], 129: [2, 182], 130: [2, 182], 131: [2, 182], 132: [2, 182], 133: [2, 182]},
            {8: 200, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 201], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 202, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {5: 203, 25: [1, 5], 121: [1, 204]},
            {1: [2, 125], 6: [2, 125], 25: [2, 125], 26: [2, 125], 46: [2, 125], 51: [2, 125], 54: [2, 125], 69: [2, 125], 74: [2, 125], 82: [2, 125], 87: [2, 125], 89: [2, 125], 93: 205, 94: [1, 206], 95: [1, 207], 98: [2, 125], 100: [2, 125], 101: [2, 125], 102: [2, 125], 106: [2, 125], 114: [2, 125], 122: [2, 125], 124: [2, 125], 125: [2, 125], 128: [2, 125], 129: [2, 125], 130: [2, 125], 131: [2, 125], 132: [2, 125], 133: [2, 125]},
            {1: [2, 137], 6: [2, 137], 25: [2, 137], 26: [2, 137], 46: [2, 137], 51: [2, 137], 54: [2, 137], 69: [2, 137], 74: [2, 137], 82: [2, 137], 87: [2, 137], 89: [2, 137], 98: [2, 137], 100: [2, 137], 101: [2, 137], 102: [2, 137], 106: [2, 137], 114: [2, 137], 122: [2, 137], 124: [2, 137], 125: [2, 137], 128: [2, 137], 129: [2, 137], 130: [2, 137], 131: [2, 137], 132: [2, 137], 133: [2, 137]},
            {1: [2, 145], 6: [2, 145], 25: [2, 145], 26: [2, 145], 46: [2, 145], 51: [2, 145], 54: [2, 145], 69: [2, 145], 74: [2, 145], 82: [2, 145], 87: [2, 145], 89: [2, 145], 98: [2, 145], 100: [2, 145], 101: [2, 145], 102: [2, 145], 106: [2, 145], 114: [2, 145], 122: [2, 145], 124: [2, 145], 125: [2, 145], 128: [2, 145], 129: [2, 145], 130: [2, 145], 131: [2, 145], 132: [2, 145], 133: [2, 145]},
            {25: [1, 208], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {116: 209, 118: 210, 119: [1, 211]},
            {1: [2, 90], 6: [2, 90], 25: [2, 90], 26: [2, 90], 46: [2, 90], 51: [2, 90], 54: [2, 90], 69: [2, 90], 74: [2, 90], 82: [2, 90], 87: [2, 90], 89: [2, 90], 98: [2, 90], 100: [2, 90], 101: [2, 90], 102: [2, 90], 106: [2, 90], 114: [2, 90], 122: [2, 90], 124: [2, 90], 125: [2, 90], 128: [2, 90], 129: [2, 90], 130: [2, 90], 131: [2, 90], 132: [2, 90], 133: [2, 90]},
            {8: 212, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 93], 5: 213, 6: [2, 93], 25: [1, 5], 26: [2, 93], 46: [2, 93], 51: [2, 93], 54: [2, 93], 63: [2, 66], 64: [2, 66], 65: [2, 66], 67: [2, 66], 69: [2, 93], 70: [2, 66], 74: [2, 93], 76: [1, 214], 80: [2, 66], 81: [2, 66], 82: [2, 93], 87: [2, 93], 89: [2, 93], 98: [2, 93], 100: [2, 93], 101: [2, 93], 102: [2, 93], 106: [2, 93], 114: [2, 93], 122: [2, 93], 124: [2, 93], 125: [2, 93], 128: [2, 93], 129: [2, 93], 130: [2, 93], 131: [2, 93], 132: [2, 93], 133: [2, 93]},
            {1: [2, 42], 6: [2, 42], 26: [2, 42], 98: [2, 42], 99: 84, 100: [2, 42], 102: [2, 42], 105: 85, 106: [2, 42], 107: 66, 122: [2, 42], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 130], 6: [2, 130], 26: [2, 130], 98: [2, 130], 99: 84, 100: [2, 130], 102: [2, 130], 105: 85, 106: [2, 130], 107: 66, 122: [2, 130], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {6: [1, 71], 98: [1, 215]},
            {4: 216, 7: 4, 8: 6, 9: 7, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {6: [2, 121], 25: [2, 121], 51: [2, 121], 54: [1, 218], 87: [2, 121], 88: 217, 89: [1, 187], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 108], 6: [2, 108], 25: [2, 108], 26: [2, 108], 37: [2, 108], 46: [2, 108], 51: [2, 108], 54: [2, 108], 63: [2, 108], 64: [2, 108], 65: [2, 108], 67: [2, 108], 69: [2, 108], 70: [2, 108], 74: [2, 108], 80: [2, 108], 81: [2, 108], 82: [2, 108], 87: [2, 108], 89: [2, 108], 98: [2, 108], 100: [2, 108], 101: [2, 108], 102: [2, 108], 106: [2, 108], 112: [2, 108], 113: [2, 108], 114: [2, 108], 122: [2, 108], 124: [2, 108], 125: [2, 108], 128: [2, 108], 129: [2, 108], 130: [2, 108], 131: [2, 108], 132: [2, 108], 133: [2, 108]},
            {6: [2, 49], 25: [2, 49], 50: 219, 51: [1, 220], 87: [2, 49]},
            {6: [2, 116], 25: [2, 116], 26: [2, 116], 51: [2, 116], 82: [2, 116], 87: [2, 116]},
            {8: 195, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 143], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 57: 144, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 83: 221, 84: [1, 55], 85: [1, 56], 86: [1, 54], 90: 142, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {6: [2, 122], 25: [2, 122], 26: [2, 122], 51: [2, 122], 82: [2, 122], 87: [2, 122]},
            {1: [2, 107], 6: [2, 107], 25: [2, 107], 26: [2, 107], 37: [2, 107], 40: [2, 107], 46: [2, 107], 51: [2, 107], 54: [2, 107], 63: [2, 107], 64: [2, 107], 65: [2, 107], 67: [2, 107], 69: [2, 107], 70: [2, 107], 74: [2, 107], 76: [2, 107], 80: [2, 107], 81: [2, 107], 82: [2, 107], 87: [2, 107], 89: [2, 107], 98: [2, 107], 100: [2, 107], 101: [2, 107], 102: [2, 107], 106: [2, 107], 114: [2, 107], 122: [2, 107], 124: [2, 107], 125: [2, 107], 126: [2, 107], 127: [2, 107], 128: [2, 107], 129: [2, 107], 130: [2, 107], 131: [2, 107], 132: [2, 107], 133: [2, 107], 134: [2, 107]},
            {5: 222, 25: [1, 5], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 133], 6: [2, 133], 25: [2, 133], 26: [2, 133], 46: [2, 133], 51: [2, 133], 54: [2, 133], 69: [2, 133], 74: [2, 133], 82: [2, 133], 87: [2, 133], 89: [2, 133], 98: [2, 133], 99: 84, 100: [1, 62], 101: [1, 223], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 133], 122: [2, 133], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 135], 6: [2, 135], 25: [2, 135], 26: [2, 135], 46: [2, 135], 51: [2, 135], 54: [2, 135], 69: [2, 135], 74: [2, 135], 82: [2, 135], 87: [2, 135], 89: [2, 135], 98: [2, 135], 99: 84, 100: [1, 62], 101: [1, 224], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 135], 122: [2, 135], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 141], 6: [2, 141], 25: [2, 141], 26: [2, 141], 46: [2, 141], 51: [2, 141], 54: [2, 141], 69: [2, 141], 74: [2, 141], 82: [2, 141], 87: [2, 141], 89: [2, 141], 98: [2, 141], 100: [2, 141], 101: [2, 141], 102: [2, 141], 106: [2, 141], 114: [2, 141], 122: [2, 141], 124: [2, 141], 125: [2, 141], 128: [2, 141], 129: [2, 141], 130: [2, 141], 131: [2, 141], 132: [2, 141], 133: [2, 141]},
            {1: [2, 142], 6: [2, 142], 25: [2, 142], 26: [2, 142], 46: [2, 142], 51: [2, 142], 54: [2, 142], 69: [2, 142], 74: [2, 142], 82: [2, 142], 87: [2, 142], 89: [2, 142], 98: [2, 142], 99: 84, 100: [1, 62], 101: [2, 142], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 142], 122: [2, 142], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 146], 6: [2, 146], 25: [2, 146], 26: [2, 146], 46: [2, 146], 51: [2, 146], 54: [2, 146], 69: [2, 146], 74: [2, 146], 82: [2, 146], 87: [2, 146], 89: [2, 146], 98: [2, 146], 100: [2, 146], 101: [2, 146], 102: [2, 146], 106: [2, 146], 114: [2, 146], 122: [2, 146], 124: [2, 146], 125: [2, 146], 128: [2, 146], 129: [2, 146], 130: [2, 146], 131: [2, 146], 132: [2, 146], 133: [2, 146]},
            {112: [2, 148], 113: [2, 148]},
            {27: 155, 28: [1, 70], 55: 156, 56: 157, 72: [1, 67], 86: [1, 111], 109: 225, 111: 154},
            {51: [1, 226], 112: [2, 153], 113: [2, 153]},
            {51: [2, 150], 112: [2, 150], 113: [2, 150]},
            {51: [2, 151], 112: [2, 151], 113: [2, 151]},
            {51: [2, 152], 112: [2, 152], 113: [2, 152]},
            {1: [2, 147], 6: [2, 147], 25: [2, 147], 26: [2, 147], 46: [2, 147], 51: [2, 147], 54: [2, 147], 69: [2, 147], 74: [2, 147], 82: [2, 147], 87: [2, 147], 89: [2, 147], 98: [2, 147], 100: [2, 147], 101: [2, 147], 102: [2, 147], 106: [2, 147], 114: [2, 147], 122: [2, 147], 124: [2, 147], 125: [2, 147], 128: [2, 147], 129: [2, 147], 130: [2, 147], 131: [2, 147], 132: [2, 147], 133: [2, 147]},
            {8: 227, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 228, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {6: [2, 49], 25: [2, 49], 50: 229, 51: [1, 230], 74: [2, 49]},
            {6: [2, 85], 25: [2, 85], 26: [2, 85], 51: [2, 85], 74: [2, 85]},
            {6: [2, 35], 25: [2, 35], 26: [2, 35], 40: [1, 231], 51: [2, 35], 74: [2, 35]},
            {6: [2, 38], 25: [2, 38], 26: [2, 38], 51: [2, 38], 74: [2, 38]},
            {6: [2, 39], 25: [2, 39], 26: [2, 39], 40: [2, 39], 51: [2, 39], 74: [2, 39]},
            {6: [2, 40], 25: [2, 40], 26: [2, 40], 40: [2, 40], 51: [2, 40], 74: [2, 40]},
            {6: [2, 41], 25: [2, 41], 26: [2, 41], 40: [2, 41], 51: [2, 41], 74: [2, 41]},
            {1: [2, 5], 6: [2, 5], 26: [2, 5], 98: [2, 5]},
            {1: [2, 25], 6: [2, 25], 25: [2, 25], 26: [2, 25], 46: [2, 25], 51: [2, 25], 54: [2, 25], 69: [2, 25], 74: [2, 25], 82: [2, 25], 87: [2, 25], 89: [2, 25], 94: [2, 25], 95: [2, 25], 98: [2, 25], 100: [2, 25], 101: [2, 25], 102: [2, 25], 106: [2, 25], 114: [2, 25], 117: [2, 25], 119: [2, 25], 122: [2, 25], 124: [2, 25], 125: [2, 25], 128: [2, 25], 129: [2, 25], 130: [2, 25], 131: [2, 25], 132: [2, 25], 133: [2, 25]},
            {1: [2, 184], 6: [2, 184], 25: [2, 184], 26: [2, 184], 46: [2, 184], 51: [2, 184], 54: [2, 184], 69: [2, 184], 74: [2, 184], 82: [2, 184], 87: [2, 184], 89: [2, 184], 98: [2, 184], 99: 84, 100: [2, 184], 101: [2, 184], 102: [2, 184], 105: 85, 106: [2, 184], 107: 66, 114: [2, 184], 122: [2, 184], 124: [2, 184], 125: [2, 184], 128: [1, 75], 129: [1, 78], 130: [2, 184], 131: [2, 184], 132: [2, 184], 133: [2, 184]},
            {1: [2, 185], 6: [2, 185], 25: [2, 185], 26: [2, 185], 46: [2, 185], 51: [2, 185], 54: [2, 185], 69: [2, 185], 74: [2, 185], 82: [2, 185], 87: [2, 185], 89: [2, 185], 98: [2, 185], 99: 84, 100: [2, 185], 101: [2, 185], 102: [2, 185], 105: 85, 106: [2, 185], 107: 66, 114: [2, 185], 122: [2, 185], 124: [2, 185], 125: [2, 185], 128: [1, 75], 129: [1, 78], 130: [2, 185], 131: [2, 185], 132: [2, 185], 133: [2, 185]},
            {1: [2, 186], 6: [2, 186], 25: [2, 186], 26: [2, 186], 46: [2, 186], 51: [2, 186], 54: [2, 186], 69: [2, 186], 74: [2, 186], 82: [2, 186], 87: [2, 186], 89: [2, 186], 98: [2, 186], 99: 84, 100: [2, 186], 101: [2, 186], 102: [2, 186], 105: 85, 106: [2, 186], 107: 66, 114: [2, 186], 122: [2, 186], 124: [2, 186], 125: [2, 186], 128: [1, 75], 129: [2, 186], 130: [2, 186], 131: [2, 186], 132: [2, 186], 133: [2, 186]},
            {1: [2, 187], 6: [2, 187], 25: [2, 187], 26: [2, 187], 46: [2, 187], 51: [2, 187], 54: [2, 187], 69: [2, 187], 74: [2, 187], 82: [2, 187], 87: [2, 187], 89: [2, 187], 98: [2, 187], 99: 84, 100: [2, 187], 101: [2, 187], 102: [2, 187], 105: 85, 106: [2, 187], 107: 66, 114: [2, 187], 122: [2, 187], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [2, 187], 131: [2, 187], 132: [2, 187], 133: [2, 187]},
            {1: [2, 188], 6: [2, 188], 25: [2, 188], 26: [2, 188], 46: [2, 188], 51: [2, 188], 54: [2, 188], 69: [2, 188], 74: [2, 188], 82: [2, 188], 87: [2, 188], 89: [2, 188], 98: [2, 188], 99: 84, 100: [2, 188], 101: [2, 188], 102: [2, 188], 105: 85, 106: [2, 188], 107: 66, 114: [2, 188], 122: [2, 188], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [2, 188], 132: [2, 188], 133: [1, 82]},
            {1: [2, 189], 6: [2, 189], 25: [2, 189], 26: [2, 189], 46: [2, 189], 51: [2, 189], 54: [2, 189], 69: [2, 189], 74: [2, 189], 82: [2, 189], 87: [2, 189], 89: [2, 189], 98: [2, 189], 99: 84, 100: [2, 189], 101: [2, 189], 102: [2, 189], 105: 85, 106: [2, 189], 107: 66, 114: [2, 189], 122: [2, 189], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [2, 189], 133: [1, 82]},
            {1: [2, 190], 6: [2, 190], 25: [2, 190], 26: [2, 190], 46: [2, 190], 51: [2, 190], 54: [2, 190], 69: [2, 190], 74: [2, 190], 82: [2, 190], 87: [2, 190], 89: [2, 190], 98: [2, 190], 99: 84, 100: [2, 190], 101: [2, 190], 102: [2, 190], 105: 85, 106: [2, 190], 107: 66, 114: [2, 190], 122: [2, 190], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [2, 190], 132: [2, 190], 133: [2, 190]},
            {1: [2, 175], 6: [2, 175], 25: [2, 175], 26: [2, 175], 46: [2, 175], 51: [2, 175], 54: [2, 175], 69: [2, 175], 74: [2, 175], 82: [2, 175], 87: [2, 175], 89: [2, 175], 98: [2, 175], 99: 84, 100: [1, 62], 101: [2, 175], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 175], 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 174], 6: [2, 174], 25: [2, 174], 26: [2, 174], 46: [2, 174], 51: [2, 174], 54: [2, 174], 69: [2, 174], 74: [2, 174], 82: [2, 174], 87: [2, 174], 89: [2, 174], 98: [2, 174], 99: 84, 100: [1, 62], 101: [2, 174], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 174], 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 97], 6: [2, 97], 25: [2, 97], 26: [2, 97], 46: [2, 97], 51: [2, 97], 54: [2, 97], 63: [2, 97], 64: [2, 97], 65: [2, 97], 67: [2, 97], 69: [2, 97], 70: [2, 97], 74: [2, 97], 80: [2, 97], 81: [2, 97], 82: [2, 97], 87: [2, 97], 89: [2, 97], 98: [2, 97], 100: [2, 97], 101: [2, 97], 102: [2, 97], 106: [2, 97], 114: [2, 97], 122: [2, 97], 124: [2, 97], 125: [2, 97], 128: [2, 97], 129: [2, 97], 130: [2, 97], 131: [2, 97], 132: [2, 97], 133: [2, 97]},
            {1: [2, 74], 6: [2, 74], 25: [2, 74], 26: [2, 74], 37: [2, 74], 46: [2, 74], 51: [2, 74], 54: [2, 74], 63: [2, 74], 64: [2, 74], 65: [2, 74], 67: [2, 74], 69: [2, 74], 70: [2, 74], 74: [2, 74], 76: [2, 74], 80: [2, 74], 81: [2, 74], 82: [2, 74], 87: [2, 74], 89: [2, 74], 98: [2, 74], 100: [2, 74], 101: [2, 74], 102: [2, 74], 106: [2, 74], 114: [2, 74], 122: [2, 74], 124: [2, 74], 125: [2, 74], 126: [2, 74], 127: [2, 74], 128: [2, 74], 129: [2, 74], 130: [2, 74], 131: [2, 74], 132: [2, 74], 133: [2, 74], 134: [2, 74]},
            {1: [2, 75], 6: [2, 75], 25: [2, 75], 26: [2, 75], 37: [2, 75], 46: [2, 75], 51: [2, 75], 54: [2, 75], 63: [2, 75], 64: [2, 75], 65: [2, 75], 67: [2, 75], 69: [2, 75], 70: [2, 75], 74: [2, 75], 76: [2, 75], 80: [2, 75], 81: [2, 75], 82: [2, 75], 87: [2, 75], 89: [2, 75], 98: [2, 75], 100: [2, 75], 101: [2, 75], 102: [2, 75], 106: [2, 75], 114: [2, 75], 122: [2, 75], 124: [2, 75], 125: [2, 75], 126: [2, 75], 127: [2, 75], 128: [2, 75], 129: [2, 75], 130: [2, 75], 131: [2, 75], 132: [2, 75], 133: [2, 75], 134: [2, 75]},
            {1: [2, 76], 6: [2, 76], 25: [2, 76], 26: [2, 76], 37: [2, 76], 46: [2, 76], 51: [2, 76], 54: [2, 76], 63: [2, 76], 64: [2, 76], 65: [2, 76], 67: [2, 76], 69: [2, 76], 70: [2, 76], 74: [2, 76], 76: [2, 76], 80: [2, 76], 81: [2, 76], 82: [2, 76], 87: [2, 76], 89: [2, 76], 98: [2, 76], 100: [2, 76], 101: [2, 76], 102: [2, 76], 106: [2, 76], 114: [2, 76], 122: [2, 76], 124: [2, 76], 125: [2, 76], 126: [2, 76], 127: [2, 76], 128: [2, 76], 129: [2, 76], 130: [2, 76], 131: [2, 76], 132: [2, 76], 133: [2, 76], 134: [2, 76]},
            {69: [1, 232]},
            {54: [1, 188], 69: [2, 81], 88: 233, 89: [1, 187], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {69: [2, 82]},
            {8: 234, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {13: [2, 110], 28: [2, 110], 30: [2, 110], 31: [2, 110], 33: [2, 110], 34: [2, 110], 35: [2, 110], 42: [2, 110], 43: [2, 110], 44: [2, 110], 48: [2, 110], 49: [2, 110], 69: [2, 110], 72: [2, 110], 75: [2, 110], 79: [2, 110], 84: [2, 110], 85: [2, 110], 86: [2, 110], 92: [2, 110], 96: [2, 110], 97: [2, 110], 100: [2, 110], 102: [2, 110], 104: [2, 110], 106: [2, 110], 115: [2, 110], 121: [2, 110], 123: [2, 110], 124: [2, 110], 125: [2, 110], 126: [2, 110], 127: [2, 110]},
            {13: [2, 111], 28: [2, 111], 30: [2, 111], 31: [2, 111], 33: [2, 111], 34: [2, 111], 35: [2, 111], 42: [2, 111], 43: [2, 111], 44: [2, 111], 48: [2, 111], 49: [2, 111], 69: [2, 111], 72: [2, 111], 75: [2, 111], 79: [2, 111], 84: [2, 111], 85: [2, 111], 86: [2, 111], 92: [2, 111], 96: [2, 111], 97: [2, 111], 100: [2, 111], 102: [2, 111], 104: [2, 111], 106: [2, 111], 115: [2, 111], 121: [2, 111], 123: [2, 111], 124: [2, 111], 125: [2, 111], 126: [2, 111], 127: [2, 111]},
            {1: [2, 80], 6: [2, 80], 25: [2, 80], 26: [2, 80], 37: [2, 80], 46: [2, 80], 51: [2, 80], 54: [2, 80], 63: [2, 80], 64: [2, 80], 65: [2, 80], 67: [2, 80], 69: [2, 80], 70: [2, 80], 74: [2, 80], 76: [2, 80], 80: [2, 80], 81: [2, 80], 82: [2, 80], 87: [2, 80], 89: [2, 80], 98: [2, 80], 100: [2, 80], 101: [2, 80], 102: [2, 80], 106: [2, 80], 114: [2, 80], 122: [2, 80], 124: [2, 80], 125: [2, 80], 126: [2, 80], 127: [2, 80], 128: [2, 80], 129: [2, 80], 130: [2, 80], 131: [2, 80], 132: [2, 80], 133: [2, 80], 134: [2, 80]},
            {1: [2, 98], 6: [2, 98], 25: [2, 98], 26: [2, 98], 46: [2, 98], 51: [2, 98], 54: [2, 98], 63: [2, 98], 64: [2, 98], 65: [2, 98], 67: [2, 98], 69: [2, 98], 70: [2, 98], 74: [2, 98], 80: [2, 98], 81: [2, 98], 82: [2, 98], 87: [2, 98], 89: [2, 98], 98: [2, 98], 100: [2, 98], 101: [2, 98], 102: [2, 98], 106: [2, 98], 114: [2, 98], 122: [2, 98], 124: [2, 98], 125: [2, 98], 128: [2, 98], 129: [2, 98], 130: [2, 98], 131: [2, 98], 132: [2, 98], 133: [2, 98]},
            {1: [2, 33], 6: [2, 33], 25: [2, 33], 26: [2, 33], 46: [2, 33], 51: [2, 33], 54: [2, 33], 69: [2, 33], 74: [2, 33], 82: [2, 33], 87: [2, 33], 89: [2, 33], 98: [2, 33], 99: 84, 100: [2, 33], 101: [2, 33], 102: [2, 33], 105: 85, 106: [2, 33], 107: 66, 114: [2, 33], 122: [2, 33], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {8: 235, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 103], 6: [2, 103], 25: [2, 103], 26: [2, 103], 46: [2, 103], 51: [2, 103], 54: [2, 103], 63: [2, 103], 64: [2, 103], 65: [2, 103], 67: [2, 103], 69: [2, 103], 70: [2, 103], 74: [2, 103], 80: [2, 103], 81: [2, 103], 82: [2, 103], 87: [2, 103], 89: [2, 103], 98: [2, 103], 100: [2, 103], 101: [2, 103], 102: [2, 103], 106: [2, 103], 114: [2, 103], 122: [2, 103], 124: [2, 103], 125: [2, 103], 128: [2, 103], 129: [2, 103], 130: [2, 103], 131: [2, 103], 132: [2, 103], 133: [2, 103]},
            {6: [2, 49], 25: [2, 49], 50: 236, 51: [1, 220], 82: [2, 49]},
            {6: [2, 121], 25: [2, 121], 26: [2, 121], 51: [2, 121], 54: [1, 237], 82: [2, 121], 87: [2, 121], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {47: 238, 48: [1, 57], 49: [1, 58]},
            {27: 106, 28: [1, 70], 41: 107, 52: 239, 53: 105, 55: 108, 56: 109, 72: [1, 67], 85: [1, 110], 86: [1, 111]},
            {46: [2, 55], 51: [2, 55]},
            {8: 240, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 191], 6: [2, 191], 25: [2, 191], 26: [2, 191], 46: [2, 191], 51: [2, 191], 54: [2, 191], 69: [2, 191], 74: [2, 191], 82: [2, 191], 87: [2, 191], 89: [2, 191], 98: [2, 191], 99: 84, 100: [2, 191], 101: [2, 191], 102: [2, 191], 105: 85, 106: [2, 191], 107: 66, 114: [2, 191], 122: [2, 191], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {8: 241, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 193], 6: [2, 193], 25: [2, 193], 26: [2, 193], 46: [2, 193], 51: [2, 193], 54: [2, 193], 69: [2, 193], 74: [2, 193], 82: [2, 193], 87: [2, 193], 89: [2, 193], 98: [2, 193], 99: 84, 100: [2, 193], 101: [2, 193], 102: [2, 193], 105: 85, 106: [2, 193], 107: 66, 114: [2, 193], 122: [2, 193], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 173], 6: [2, 173], 25: [2, 173], 26: [2, 173], 46: [2, 173], 51: [2, 173], 54: [2, 173], 69: [2, 173], 74: [2, 173], 82: [2, 173], 87: [2, 173], 89: [2, 173], 98: [2, 173], 100: [2, 173], 101: [2, 173], 102: [2, 173], 106: [2, 173], 114: [2, 173], 122: [2, 173], 124: [2, 173], 125: [2, 173], 128: [2, 173], 129: [2, 173], 130: [2, 173], 131: [2, 173], 132: [2, 173], 133: [2, 173]},
            {8: 242, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 126], 6: [2, 126], 25: [2, 126], 26: [2, 126], 46: [2, 126], 51: [2, 126], 54: [2, 126], 69: [2, 126], 74: [2, 126], 82: [2, 126], 87: [2, 126], 89: [2, 126], 94: [1, 243], 98: [2, 126], 100: [2, 126], 101: [2, 126], 102: [2, 126], 106: [2, 126], 114: [2, 126], 122: [2, 126], 124: [2, 126], 125: [2, 126], 128: [2, 126], 129: [2, 126], 130: [2, 126], 131: [2, 126], 132: [2, 126], 133: [2, 126]},
            {5: 244, 25: [1, 5]},
            {27: 245, 28: [1, 70]},
            {116: 246, 118: 210, 119: [1, 211]},
            {26: [1, 247], 117: [1, 248], 118: 249, 119: [1, 211]},
            {26: [2, 166], 117: [2, 166], 119: [2, 166]},
            {8: 251, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 91: 250, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 91], 5: 252, 6: [2, 91], 25: [1, 5], 26: [2, 91], 46: [2, 91], 51: [2, 91], 54: [2, 91], 69: [2, 91], 74: [2, 91], 82: [2, 91], 87: [2, 91], 89: [2, 91], 98: [2, 91], 99: 84, 100: [1, 62], 101: [2, 91], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 91], 122: [2, 91], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 94], 6: [2, 94], 25: [2, 94], 26: [2, 94], 46: [2, 94], 51: [2, 94], 54: [2, 94], 69: [2, 94], 74: [2, 94], 82: [2, 94], 87: [2, 94], 89: [2, 94], 98: [2, 94], 100: [2, 94], 101: [2, 94], 102: [2, 94], 106: [2, 94], 114: [2, 94], 122: [2, 94], 124: [2, 94], 125: [2, 94], 128: [2, 94], 129: [2, 94], 130: [2, 94], 131: [2, 94], 132: [2, 94], 133: [2, 94]},
            {8: 253, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 131], 6: [2, 131], 25: [2, 131], 26: [2, 131], 46: [2, 131], 51: [2, 131], 54: [2, 131], 63: [2, 131], 64: [2, 131], 65: [2, 131], 67: [2, 131], 69: [2, 131], 70: [2, 131], 74: [2, 131], 80: [2, 131], 81: [2, 131], 82: [2, 131], 87: [2, 131], 89: [2, 131], 98: [2, 131], 100: [2, 131], 101: [2, 131], 102: [2, 131], 106: [2, 131], 114: [2, 131], 122: [2, 131], 124: [2, 131], 125: [2, 131], 128: [2, 131], 129: [2, 131], 130: [2, 131], 131: [2, 131], 132: [2, 131], 133: [2, 131]},
            {6: [1, 71], 26: [1, 254]},
            {8: 255, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {6: [2, 61], 13: [2, 111], 25: [2, 61], 28: [2, 111], 30: [2, 111], 31: [2, 111], 33: [2, 111], 34: [2, 111], 35: [2, 111], 42: [2, 111], 43: [2, 111], 44: [2, 111], 48: [2, 111], 49: [2, 111], 51: [2, 61], 72: [2, 111], 75: [2, 111], 79: [2, 111], 84: [2, 111], 85: [2, 111], 86: [2, 111], 87: [2, 61], 92: [2, 111], 96: [2, 111], 97: [2, 111], 100: [2, 111], 102: [2, 111], 104: [2, 111], 106: [2, 111], 115: [2, 111], 121: [2, 111], 123: [2, 111], 124: [2, 111], 125: [2, 111], 126: [2, 111], 127: [2, 111]},
            {6: [1, 257], 25: [1, 258], 87: [1, 256]},
            {6: [2, 50], 8: 195, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [2, 50], 26: [2, 50], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 57: 144, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 82: [2, 50], 84: [1, 55], 85: [1, 56], 86: [1, 54], 87: [2, 50], 90: 259, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {6: [2, 49], 25: [2, 49], 26: [2, 49], 50: 260, 51: [1, 220]},
            {1: [2, 170], 6: [2, 170], 25: [2, 170], 26: [2, 170], 46: [2, 170], 51: [2, 170], 54: [2, 170], 69: [2, 170], 74: [2, 170], 82: [2, 170], 87: [2, 170], 89: [2, 170], 98: [2, 170], 100: [2, 170], 101: [2, 170], 102: [2, 170], 106: [2, 170], 114: [2, 170], 117: [2, 170], 122: [2, 170], 124: [2, 170], 125: [2, 170], 128: [2, 170], 129: [2, 170], 130: [2, 170], 131: [2, 170], 132: [2, 170], 133: [2, 170]},
            {8: 261, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 262, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {112: [2, 149], 113: [2, 149]},
            {27: 155, 28: [1, 70], 55: 156, 56: 157, 72: [1, 67], 86: [1, 111], 111: 263},
            {1: [2, 155], 6: [2, 155], 25: [2, 155], 26: [2, 155], 46: [2, 155], 51: [2, 155], 54: [2, 155], 69: [2, 155], 74: [2, 155], 82: [2, 155], 87: [2, 155], 89: [2, 155], 98: [2, 155], 99: 84, 100: [2, 155], 101: [1, 264], 102: [2, 155], 105: 85, 106: [2, 155], 107: 66, 114: [1, 265], 122: [2, 155], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 156], 6: [2, 156], 25: [2, 156], 26: [2, 156], 46: [2, 156], 51: [2, 156], 54: [2, 156], 69: [2, 156], 74: [2, 156], 82: [2, 156], 87: [2, 156], 89: [2, 156], 98: [2, 156], 99: 84, 100: [2, 156], 101: [1, 266], 102: [2, 156], 105: 85, 106: [2, 156], 107: 66, 114: [2, 156], 122: [2, 156], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {6: [1, 268], 25: [1, 269], 74: [1, 267]},
            {6: [2, 50], 12: 164, 25: [2, 50], 26: [2, 50], 27: 165, 28: [1, 70], 29: 166, 30: [1, 68], 31: [1, 69], 38: 270, 39: 163, 41: 167, 43: [1, 46], 74: [2, 50], 85: [1, 110]},
            {8: 271, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 272], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 79], 6: [2, 79], 25: [2, 79], 26: [2, 79], 37: [2, 79], 46: [2, 79], 51: [2, 79], 54: [2, 79], 63: [2, 79], 64: [2, 79], 65: [2, 79], 67: [2, 79], 69: [2, 79], 70: [2, 79], 74: [2, 79], 76: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 87: [2, 79], 89: [2, 79], 98: [2, 79], 100: [2, 79], 101: [2, 79], 102: [2, 79], 106: [2, 79], 114: [2, 79], 122: [2, 79], 124: [2, 79], 125: [2, 79], 126: [2, 79], 127: [2, 79], 128: [2, 79], 129: [2, 79], 130: [2, 79], 131: [2, 79], 132: [2, 79], 133: [2, 79], 134: [2, 79]},
            {8: 273, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 69: [2, 114], 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {69: [2, 115], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {26: [1, 274], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {6: [1, 257], 25: [1, 258], 82: [1, 275]},
            {6: [2, 61], 25: [2, 61], 26: [2, 61], 51: [2, 61], 82: [2, 61], 87: [2, 61]},
            {5: 276, 25: [1, 5]},
            {46: [2, 53], 51: [2, 53]},
            {46: [2, 56], 51: [2, 56], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {26: [1, 277], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {5: 278, 25: [1, 5], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {5: 279, 25: [1, 5]},
            {1: [2, 127], 6: [2, 127], 25: [2, 127], 26: [2, 127], 46: [2, 127], 51: [2, 127], 54: [2, 127], 69: [2, 127], 74: [2, 127], 82: [2, 127], 87: [2, 127], 89: [2, 127], 98: [2, 127], 100: [2, 127], 101: [2, 127], 102: [2, 127], 106: [2, 127], 114: [2, 127], 122: [2, 127], 124: [2, 127], 125: [2, 127], 128: [2, 127], 129: [2, 127], 130: [2, 127], 131: [2, 127], 132: [2, 127], 133: [2, 127]},
            {5: 280, 25: [1, 5]},
            {26: [1, 281], 117: [1, 282], 118: 249, 119: [1, 211]},
            {1: [2, 164], 6: [2, 164], 25: [2, 164], 26: [2, 164], 46: [2, 164], 51: [2, 164], 54: [2, 164], 69: [2, 164], 74: [2, 164], 82: [2, 164], 87: [2, 164], 89: [2, 164], 98: [2, 164], 100: [2, 164], 101: [2, 164], 102: [2, 164], 106: [2, 164], 114: [2, 164], 122: [2, 164], 124: [2, 164], 125: [2, 164], 128: [2, 164], 129: [2, 164], 130: [2, 164], 131: [2, 164], 132: [2, 164], 133: [2, 164]},
            {5: 283, 25: [1, 5]},
            {26: [2, 167], 117: [2, 167], 119: [2, 167]},
            {5: 284, 25: [1, 5], 51: [1, 285]},
            {25: [2, 123], 51: [2, 123], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 92], 6: [2, 92], 25: [2, 92], 26: [2, 92], 46: [2, 92], 51: [2, 92], 54: [2, 92], 69: [2, 92], 74: [2, 92], 82: [2, 92], 87: [2, 92], 89: [2, 92], 98: [2, 92], 100: [2, 92], 101: [2, 92], 102: [2, 92], 106: [2, 92], 114: [2, 92], 122: [2, 92], 124: [2, 92], 125: [2, 92], 128: [2, 92], 129: [2, 92], 130: [2, 92], 131: [2, 92], 132: [2, 92], 133: [2, 92]},
            {1: [2, 95], 5: 286, 6: [2, 95], 25: [1, 5], 26: [2, 95], 46: [2, 95], 51: [2, 95], 54: [2, 95], 69: [2, 95], 74: [2, 95], 82: [2, 95], 87: [2, 95], 89: [2, 95], 98: [2, 95], 99: 84, 100: [1, 62], 101: [2, 95], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 95], 122: [2, 95], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {98: [1, 287]},
            {87: [1, 288], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 109], 6: [2, 109], 25: [2, 109], 26: [2, 109], 37: [2, 109], 46: [2, 109], 51: [2, 109], 54: [2, 109], 63: [2, 109], 64: [2, 109], 65: [2, 109], 67: [2, 109], 69: [2, 109], 70: [2, 109], 74: [2, 109], 80: [2, 109], 81: [2, 109], 82: [2, 109], 87: [2, 109], 89: [2, 109], 98: [2, 109], 100: [2, 109], 101: [2, 109], 102: [2, 109], 106: [2, 109], 112: [2, 109], 113: [2, 109], 114: [2, 109], 122: [2, 109], 124: [2, 109], 125: [2, 109], 128: [2, 109], 129: [2, 109], 130: [2, 109], 131: [2, 109], 132: [2, 109], 133: [2, 109]},
            {8: 195, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 57: 144, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 90: 289, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 195, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: [1, 143], 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 57: 144, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 83: 290, 84: [1, 55], 85: [1, 56], 86: [1, 54], 90: 142, 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {6: [2, 117], 25: [2, 117], 26: [2, 117], 51: [2, 117], 82: [2, 117], 87: [2, 117]},
            {6: [1, 257], 25: [1, 258], 26: [1, 291]},
            {1: [2, 134], 6: [2, 134], 25: [2, 134], 26: [2, 134], 46: [2, 134], 51: [2, 134], 54: [2, 134], 69: [2, 134], 74: [2, 134], 82: [2, 134], 87: [2, 134], 89: [2, 134], 98: [2, 134], 99: 84, 100: [1, 62], 101: [2, 134], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 134], 122: [2, 134], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 136], 6: [2, 136], 25: [2, 136], 26: [2, 136], 46: [2, 136], 51: [2, 136], 54: [2, 136], 69: [2, 136], 74: [2, 136], 82: [2, 136], 87: [2, 136], 89: [2, 136], 98: [2, 136], 99: 84, 100: [1, 62], 101: [2, 136], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 114: [2, 136], 122: [2, 136], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {112: [2, 154], 113: [2, 154]},
            {8: 292, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 293, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 294, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 83], 6: [2, 83], 25: [2, 83], 26: [2, 83], 37: [2, 83], 46: [2, 83], 51: [2, 83], 54: [2, 83], 63: [2, 83], 64: [2, 83], 65: [2, 83], 67: [2, 83], 69: [2, 83], 70: [2, 83], 74: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 87: [2, 83], 89: [2, 83], 98: [2, 83], 100: [2, 83], 101: [2, 83], 102: [2, 83], 106: [2, 83], 112: [2, 83], 113: [2, 83], 114: [2, 83], 122: [2, 83], 124: [2, 83], 125: [2, 83], 128: [2, 83], 129: [2, 83], 130: [2, 83], 131: [2, 83], 132: [2, 83], 133: [2, 83]},
            {12: 164, 27: 165, 28: [1, 70], 29: 166, 30: [1, 68], 31: [1, 69], 38: 295, 39: 163, 41: 167, 43: [1, 46], 85: [1, 110]},
            {6: [2, 84], 12: 164, 25: [2, 84], 26: [2, 84], 27: 165, 28: [1, 70], 29: 166, 30: [1, 68], 31: [1, 69], 38: 162, 39: 163, 41: 167, 43: [1, 46], 51: [2, 84], 73: 296, 85: [1, 110]},
            {6: [2, 86], 25: [2, 86], 26: [2, 86], 51: [2, 86], 74: [2, 86]},
            {6: [2, 36], 25: [2, 36], 26: [2, 36], 51: [2, 36], 74: [2, 36], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {8: 297, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {69: [2, 113], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 34], 6: [2, 34], 25: [2, 34], 26: [2, 34], 46: [2, 34], 51: [2, 34], 54: [2, 34], 69: [2, 34], 74: [2, 34], 82: [2, 34], 87: [2, 34], 89: [2, 34], 98: [2, 34], 100: [2, 34], 101: [2, 34], 102: [2, 34], 106: [2, 34], 114: [2, 34], 122: [2, 34], 124: [2, 34], 125: [2, 34], 128: [2, 34], 129: [2, 34], 130: [2, 34], 131: [2, 34], 132: [2, 34], 133: [2, 34]},
            {1: [2, 104], 6: [2, 104], 25: [2, 104], 26: [2, 104], 46: [2, 104], 51: [2, 104], 54: [2, 104], 63: [2, 104], 64: [2, 104], 65: [2, 104], 67: [2, 104], 69: [2, 104], 70: [2, 104], 74: [2, 104], 80: [2, 104], 81: [2, 104], 82: [2, 104], 87: [2, 104], 89: [2, 104], 98: [2, 104], 100: [2, 104], 101: [2, 104], 102: [2, 104], 106: [2, 104], 114: [2, 104], 122: [2, 104], 124: [2, 104], 125: [2, 104], 128: [2, 104], 129: [2, 104], 130: [2, 104], 131: [2, 104], 132: [2, 104], 133: [2, 104]},
            {1: [2, 45], 6: [2, 45], 25: [2, 45], 26: [2, 45], 46: [2, 45], 51: [2, 45], 54: [2, 45], 69: [2, 45], 74: [2, 45], 82: [2, 45], 87: [2, 45], 89: [2, 45], 98: [2, 45], 100: [2, 45], 101: [2, 45], 102: [2, 45], 106: [2, 45], 114: [2, 45], 122: [2, 45], 124: [2, 45], 125: [2, 45], 128: [2, 45], 129: [2, 45], 130: [2, 45], 131: [2, 45], 132: [2, 45], 133: [2, 45]},
            {1: [2, 192], 6: [2, 192], 25: [2, 192], 26: [2, 192], 46: [2, 192], 51: [2, 192], 54: [2, 192], 69: [2, 192], 74: [2, 192], 82: [2, 192], 87: [2, 192], 89: [2, 192], 98: [2, 192], 100: [2, 192], 101: [2, 192], 102: [2, 192], 106: [2, 192], 114: [2, 192], 122: [2, 192], 124: [2, 192], 125: [2, 192], 128: [2, 192], 129: [2, 192], 130: [2, 192], 131: [2, 192], 132: [2, 192], 133: [2, 192]},
            {1: [2, 171], 6: [2, 171], 25: [2, 171], 26: [2, 171], 46: [2, 171], 51: [2, 171], 54: [2, 171], 69: [2, 171], 74: [2, 171], 82: [2, 171], 87: [2, 171], 89: [2, 171], 98: [2, 171], 100: [2, 171], 101: [2, 171], 102: [2, 171], 106: [2, 171], 114: [2, 171], 117: [2, 171], 122: [2, 171], 124: [2, 171], 125: [2, 171], 128: [2, 171], 129: [2, 171], 130: [2, 171], 131: [2, 171], 132: [2, 171], 133: [2, 171]},
            {1: [2, 128], 6: [2, 128], 25: [2, 128], 26: [2, 128], 46: [2, 128], 51: [2, 128], 54: [2, 128], 69: [2, 128], 74: [2, 128], 82: [2, 128], 87: [2, 128], 89: [2, 128], 98: [2, 128], 100: [2, 128], 101: [2, 128], 102: [2, 128], 106: [2, 128], 114: [2, 128], 122: [2, 128], 124: [2, 128], 125: [2, 128], 128: [2, 128], 129: [2, 128], 130: [2, 128], 131: [2, 128], 132: [2, 128], 133: [2, 128]},
            {1: [2, 129], 6: [2, 129], 25: [2, 129], 26: [2, 129], 46: [2, 129], 51: [2, 129], 54: [2, 129], 69: [2, 129], 74: [2, 129], 82: [2, 129], 87: [2, 129], 89: [2, 129], 94: [2, 129], 98: [2, 129], 100: [2, 129], 101: [2, 129], 102: [2, 129], 106: [2, 129], 114: [2, 129], 122: [2, 129], 124: [2, 129], 125: [2, 129], 128: [2, 129], 129: [2, 129], 130: [2, 129], 131: [2, 129], 132: [2, 129], 133: [2, 129]},
            {1: [2, 162], 6: [2, 162], 25: [2, 162], 26: [2, 162], 46: [2, 162], 51: [2, 162], 54: [2, 162], 69: [2, 162], 74: [2, 162], 82: [2, 162], 87: [2, 162], 89: [2, 162], 98: [2, 162], 100: [2, 162], 101: [2, 162], 102: [2, 162], 106: [2, 162], 114: [2, 162], 122: [2, 162], 124: [2, 162], 125: [2, 162], 128: [2, 162], 129: [2, 162], 130: [2, 162], 131: [2, 162], 132: [2, 162], 133: [2, 162]},
            {5: 298, 25: [1, 5]},
            {26: [1, 299]},
            {6: [1, 300], 26: [2, 168], 117: [2, 168], 119: [2, 168]},
            {8: 301, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {1: [2, 96], 6: [2, 96], 25: [2, 96], 26: [2, 96], 46: [2, 96], 51: [2, 96], 54: [2, 96], 69: [2, 96], 74: [2, 96], 82: [2, 96], 87: [2, 96], 89: [2, 96], 98: [2, 96], 100: [2, 96], 101: [2, 96], 102: [2, 96], 106: [2, 96], 114: [2, 96], 122: [2, 96], 124: [2, 96], 125: [2, 96], 128: [2, 96], 129: [2, 96], 130: [2, 96], 131: [2, 96], 132: [2, 96], 133: [2, 96]},
            {1: [2, 132], 6: [2, 132], 25: [2, 132], 26: [2, 132], 46: [2, 132], 51: [2, 132], 54: [2, 132], 63: [2, 132], 64: [2, 132], 65: [2, 132], 67: [2, 132], 69: [2, 132], 70: [2, 132], 74: [2, 132], 80: [2, 132], 81: [2, 132], 82: [2, 132], 87: [2, 132], 89: [2, 132], 98: [2, 132], 100: [2, 132], 101: [2, 132], 102: [2, 132], 106: [2, 132], 114: [2, 132], 122: [2, 132], 124: [2, 132], 125: [2, 132], 128: [2, 132], 129: [2, 132], 130: [2, 132], 131: [2, 132], 132: [2, 132], 133: [2, 132]},
            {1: [2, 112], 6: [2, 112], 25: [2, 112], 26: [2, 112], 46: [2, 112], 51: [2, 112], 54: [2, 112], 63: [2, 112], 64: [2, 112], 65: [2, 112], 67: [2, 112], 69: [2, 112], 70: [2, 112], 74: [2, 112], 80: [2, 112], 81: [2, 112], 82: [2, 112], 87: [2, 112], 89: [2, 112], 98: [2, 112], 100: [2, 112], 101: [2, 112], 102: [2, 112], 106: [2, 112], 114: [2, 112], 122: [2, 112], 124: [2, 112], 125: [2, 112], 128: [2, 112], 129: [2, 112], 130: [2, 112], 131: [2, 112], 132: [2, 112], 133: [2, 112]},
            {6: [2, 118], 25: [2, 118], 26: [2, 118], 51: [2, 118], 82: [2, 118], 87: [2, 118]},
            {6: [2, 49], 25: [2, 49], 26: [2, 49], 50: 302, 51: [1, 220]},
            {6: [2, 119], 25: [2, 119], 26: [2, 119], 51: [2, 119], 82: [2, 119], 87: [2, 119]},
            {1: [2, 157], 6: [2, 157], 25: [2, 157], 26: [2, 157], 46: [2, 157], 51: [2, 157], 54: [2, 157], 69: [2, 157], 74: [2, 157], 82: [2, 157], 87: [2, 157], 89: [2, 157], 98: [2, 157], 99: 84, 100: [2, 157], 101: [2, 157], 102: [2, 157], 105: 85, 106: [2, 157], 107: 66, 114: [1, 303], 122: [2, 157], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 159], 6: [2, 159], 25: [2, 159], 26: [2, 159], 46: [2, 159], 51: [2, 159], 54: [2, 159], 69: [2, 159], 74: [2, 159], 82: [2, 159], 87: [2, 159], 89: [2, 159], 98: [2, 159], 99: 84, 100: [2, 159], 101: [1, 304], 102: [2, 159], 105: 85, 106: [2, 159], 107: 66, 114: [2, 159], 122: [2, 159], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 158], 6: [2, 158], 25: [2, 158], 26: [2, 158], 46: [2, 158], 51: [2, 158], 54: [2, 158], 69: [2, 158], 74: [2, 158], 82: [2, 158], 87: [2, 158], 89: [2, 158], 98: [2, 158], 99: 84, 100: [2, 158], 101: [2, 158], 102: [2, 158], 105: 85, 106: [2, 158], 107: 66, 114: [2, 158], 122: [2, 158], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {6: [2, 87], 25: [2, 87], 26: [2, 87], 51: [2, 87], 74: [2, 87]},
            {6: [2, 49], 25: [2, 49], 26: [2, 49], 50: 305, 51: [1, 230]},
            {26: [1, 306], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {26: [1, 307]},
            {1: [2, 165], 6: [2, 165], 25: [2, 165], 26: [2, 165], 46: [2, 165], 51: [2, 165], 54: [2, 165], 69: [2, 165], 74: [2, 165], 82: [2, 165], 87: [2, 165], 89: [2, 165], 98: [2, 165], 100: [2, 165], 101: [2, 165], 102: [2, 165], 106: [2, 165], 114: [2, 165], 122: [2, 165], 124: [2, 165], 125: [2, 165], 128: [2, 165], 129: [2, 165], 130: [2, 165], 131: [2, 165], 132: [2, 165], 133: [2, 165]},
            {26: [2, 169], 117: [2, 169], 119: [2, 169]},
            {25: [2, 124], 51: [2, 124], 99: 84, 100: [1, 62], 102: [1, 63], 105: 85, 106: [1, 65], 107: 66, 122: [1, 83], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {6: [1, 257], 25: [1, 258], 26: [1, 308]},
            {8: 309, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {8: 310, 9: 114, 10: 19, 11: 20, 12: 21, 13: [1, 22], 14: 8, 15: 9, 16: 10, 17: 11, 18: 12, 19: 13, 20: 14, 21: 15, 22: 16, 23: 17, 24: 18, 27: 59, 28: [1, 70], 29: 49, 30: [1, 68], 31: [1, 69], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: 23, 41: 60, 42: [1, 44], 43: [1, 46], 44: [1, 29], 47: 30, 48: [1, 57], 49: [1, 58], 55: 47, 56: 48, 58: 36, 60: 25, 61: 26, 62: 27, 72: [1, 67], 75: [1, 43], 79: [1, 28], 84: [1, 55], 85: [1, 56], 86: [1, 54], 92: [1, 38], 96: [1, 45], 97: [1, 53], 99: 39, 100: [1, 62], 102: [1, 63], 103: 40, 104: [1, 64], 105: 41, 106: [1, 65], 107: 66, 115: [1, 42], 120: 37, 121: [1, 61], 123: [1, 31], 124: [1, 32], 125: [1, 33], 126: [1, 34], 127: [1, 35]},
            {6: [1, 268], 25: [1, 269], 26: [1, 311]},
            {6: [2, 37], 25: [2, 37], 26: [2, 37], 51: [2, 37], 74: [2, 37]},
            {1: [2, 163], 6: [2, 163], 25: [2, 163], 26: [2, 163], 46: [2, 163], 51: [2, 163], 54: [2, 163], 69: [2, 163], 74: [2, 163], 82: [2, 163], 87: [2, 163], 89: [2, 163], 98: [2, 163], 100: [2, 163], 101: [2, 163], 102: [2, 163], 106: [2, 163], 114: [2, 163], 122: [2, 163], 124: [2, 163], 125: [2, 163], 128: [2, 163], 129: [2, 163], 130: [2, 163], 131: [2, 163], 132: [2, 163], 133: [2, 163]},
            {6: [2, 120], 25: [2, 120], 26: [2, 120], 51: [2, 120], 82: [2, 120], 87: [2, 120]},
            {1: [2, 160], 6: [2, 160], 25: [2, 160], 26: [2, 160], 46: [2, 160], 51: [2, 160], 54: [2, 160], 69: [2, 160], 74: [2, 160], 82: [2, 160], 87: [2, 160], 89: [2, 160], 98: [2, 160], 99: 84, 100: [2, 160], 101: [2, 160], 102: [2, 160], 105: 85, 106: [2, 160], 107: 66, 114: [2, 160], 122: [2, 160], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {1: [2, 161], 6: [2, 161], 25: [2, 161], 26: [2, 161], 46: [2, 161], 51: [2, 161], 54: [2, 161], 69: [2, 161], 74: [2, 161], 82: [2, 161], 87: [2, 161], 89: [2, 161], 98: [2, 161], 99: 84, 100: [2, 161], 101: [2, 161], 102: [2, 161], 105: 85, 106: [2, 161], 107: 66, 114: [2, 161], 122: [2, 161], 124: [1, 77], 125: [1, 76], 128: [1, 75], 129: [1, 78], 130: [1, 79], 131: [1, 80], 132: [1, 81], 133: [1, 82]},
            {6: [2, 88], 25: [2, 88], 26: [2, 88], 51: [2, 88], 74: [2, 88]}
        ], defaultActions: {57: [2, 47], 58: [2, 48], 72: [2, 3], 91: [2, 102], 185: [2, 82]}, parseError: function (b, c) {
            throw new Error(b)
        }, parse: function (b) {
            function p() {
                var a;
                a = c.lexer.lex() || 1, typeof a != "number" && (a = c.symbols_[a] || a);
                return a
            }

            function o(a) {
                d.length = d.length - 2 * a, e.length = e.length - a, f.length = f.length - a
            }

            var c = this, d = [0], e = [null], f = [], g = this.table, h = "", i = 0, j = 0, k = 0, l = 2, m = 1;
            this.lexer.setInput(b), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, typeof this.lexer.yylloc == "undefined" && (this.lexer.yylloc = {});
            var n = this.lexer.yylloc;
            f.push(n), typeof this.yy.parseError == "function" && (this.parseError = this.yy.parseError);
            var q, r, s, t, u, v, w = {}, x, y, z, A;
            for (; ;) {
                s = d[d.length - 1], this.defaultActions[s] ? t = this.defaultActions[s] : (q == null && (q = p()), t = g[s] && g[s][q]);
                if (typeof t == "undefined" || !t.length || !t[0]) {
                    if (!k) {
                        A = [];
                        for (x in g[s])this.terminals_[x] && x > 2 && A.push("'" + this.terminals_[x] + "'");
                        var B = "";
                        this.lexer.showPosition ? B = "Parse error on line " + (i + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + A.join(", ") : B = "Parse error on line " + (i + 1) + ": Unexpected " + (q == 1 ? "end of input" : "'" + (this.terminals_[q] || q) + "'"), this.parseError(B, {text: this.lexer.match, token: this.terminals_[q] || q, line: this.lexer.yylineno, loc: n, expected: A})
                    }
                    if (k == 3) {
                        if (q == m)throw new Error(B || "Parsing halted.");
                        j = this.lexer.yyleng, h = this.lexer.yytext, i = this.lexer.yylineno, n = this.lexer.yylloc, q = p()
                    }
                    for (; ;) {
                        if (l.toString()in g[s])break;
                        if (s == 0)throw new Error(B || "Parsing halted.");
                        o(1), s = d[d.length - 1]
                    }
                    r = q, q = l, s = d[d.length - 1], t = g[s] && g[s][l], k = 3
                }
                if (t[0]instanceof Array && t.length > 1)throw new Error("Parse Error: multiple actions possible at state: " + s + ", token: " + q);
                switch (t[0]) {
                    case 1:
                        d.push(q), e.push(this.lexer.yytext), f.push(this.lexer.yylloc), d.push(t[1]), q = null, r ? (q = r, r = null) : (j = this.lexer.yyleng, h = this.lexer.yytext, i = this.lexer.yylineno, n = this.lexer.yylloc, k > 0 && k--);
                        break;
                    case 2:
                        y = this.productions_[t[1]][1], w.$ = e[e.length - y], w._$ = {first_line: f[f.length - (y || 1)].first_line, last_line: f[f.length - 1].last_line, first_column: f[f.length - (y || 1)].first_column, last_column: f[f.length - 1].last_column}, v = this.performAction.call(w, h, j, i, this.yy, t[1], e, f);
                        if (typeof v != "undefined")return v;
                        y && (d = d.slice(0, -1 * y * 2), e = e.slice(0, -1 * y), f = f.slice(0, -1 * y)), d.push(this.productions_[t[1]][0]), e.push(w.$), f.push(w._$), z = g[d[d.length - 2]][d[d.length - 1]], d.push(z);
                        break;
                    case 3:
                        return!0
                }
            }
            return!0
        }};
        return a
    }();
    typeof require != "undefined" && typeof a != "undefined" && (a.parser = b, a.parse = function () {
        return b.parse.apply(b, arguments)
    }, a.main = function (c) {
        if (!c[1])throw new Error("Usage: " + c[0] + " FILE");
        if (typeof process != "undefined")var d = require("fs").readFileSync(require("path").join(process.cwd(), c[1]), "utf8"); else var e = require("file").path(require("file").cwd()), d = e.join(c[1]).read({charset: "utf-8"});
        return a.parser.parse(d)
    }, typeof module != "undefined" && require.main === module && a.main(typeof process != "undefined" ? process.argv.slice(1) : require("system").args))
}, require["./scope"] = new function () {
    var a = this;
    (function () {
        var b, c, d, e;
        e = require("./helpers"), c = e.extend, d = e.last, a.Scope = b = function () {
            function a(b, c, d) {
                this.parent = b, this.expressions = c, this.method = d, this.variables = [
                    {name: "arguments", type: "arguments"}
                ], this.positions = {}, this.parent || (a.root = this)
            }

            a.root = null, a.prototype.add = function (a, b, c) {
                var d;
                if (this.shared && !c)return this.parent.add(a, b, c);
                return typeof (d = this.positions[a]) == "number" ? this.variables[d].type = b : this.positions[a] = this.variables.push({name: a, type: b}) - 1
            }, a.prototype.find = function (a, b) {
                if (this.check(a, b))return!0;
                this.add(a, "var");
                return!1
            }, a.prototype.parameter = function (a) {
                if (!this.shared || !this.parent.check(a, !0))return this.add(a, "param")
            }, a.prototype.check = function (a, b) {
                var c, d;
                c = !!this.type(a);
                if (c || b)return c;
                return(d = this.parent) != null ? !!d.check(a) : !!void 0
            }, a.prototype.temporary = function (a, b) {
                return a.length > 1 ? "_" + a + (b > 1 ? b : "") : "_" + (b + parseInt(a, 36)).toString(36).replace(/\d/g, "a")
            }, a.prototype.type = function (a) {
                var b, c, d, e;
                e = this.variables;
                for (c = 0, d = e.length; c < d; c++) {
                    b = e[c];
                    if (b.name === a)return b.type
                }
                return null
            }, a.prototype.freeVariable = function (a) {
                var b, c;
                b = 0;
                while (this.check(c = this.temporary(a, b)))b++;
                this.add(c, "var", !0);
                return c
            }, a.prototype.assign = function (a, b) {
                this.add(a, {value: b, assigned: !0});
                return this.hasAssignments = !0
            }, a.prototype.hasDeclarations = function () {
                return!!this.declaredVariables().length
            }, a.prototype.declaredVariables = function () {
                var a, b, c, d, e, f;
                a = [], b = [], f = this.variables;
                for (d = 0, e = f.length; d < e; d++)c = f[d], c.type === "var" && (c.name.charAt(0) === "_" ? b : a).push(c.name);
                return a.sort().concat(b.sort())
            }, a.prototype.assignedVariables = function () {
                var a, b, c, d, e;
                d = this.variables, e = [];
                for (b = 0, c = d.length; b < c; b++)a = d[b], a.type.assigned && e.push("" + a.name + " = " + a.type.value);
                return e
            };
            return a
        }()
    }).call(this)
}, require["./nodes"] = new function () {
    var a = this;
    (function () {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, $, _, ba, bb, bc, bd, be, bf, bg, bh, bi = Object.prototype.hasOwnProperty, bj = function (a, b) {
            function d() {
                this.constructor = a
            }

            for (var c in b)bi.call(b, c) && (a[c] = b[c]);
            d.prototype = b.prototype, a.prototype = new d, a.__super__ = b.prototype;
            return a
        }, bk = Array.prototype.indexOf || function (a) {
            for (var b = 0, c = this.length; b < c; b++)if (bi.call(this, b) && this[b] === a)return b;
            return-1
        };
        M = require("./scope").Scope, I = require("./lexer").RESERVED, bh = require("./helpers"), Y = bh.compact, ba = bh.flatten, _ = bh.extend, bc = bh.merge, Z = bh.del, be = bh.starts, $ = bh.ends, bb = bh.last, a.extend = _, X = function () {
            return!0
        }, D = function () {
            return!1
        }, R = function () {
            return this
        }, C = function () {
            this.negated = !this.negated;
            return this
        }, a.Base = e = function () {
            function a() {
            }

            a.prototype.compile = function (a, b) {
                var c;
                a = _({}, a), b && (a.level = b), c = this.unfoldSoak(a) || this, c.tab = a.indent;
                return a.level === z || !c.isStatement(a) ? c.compileNode(a) : c.compileClosure(a)
            }, a.prototype.compileClosure = function (a) {
                if (this.jumps() || this instanceof S)throw SyntaxError("cannot use a pure statement in an expression.");
                a.sharedScope = !0;
                return i.wrap(this).compileNode(a)
            }, a.prototype.cache = function (a, b, c) {
                var e, f;
                if (!this.isComplex()) {
                    e = b ? this.compile(a, b) : this;
                    return[e, e]
                }
                e = new A(c || a.scope.freeVariable("ref")), f = new d(e, this);
                return b ? [f.compile(a, b), e.value] : [f, e]
            }, a.prototype.compileLoopReference = function (a, b) {
                var c, d;
                c = d = this.compile(a, w), -Infinity < +c && +c < Infinity || o.test(c) && a.scope.check(c, !0) || (c = "" + (d = a.scope.freeVariable(b)) + " = " + c);
                return[c, d]
            }, a.prototype.makeReturn = function (a) {
                var b;
                b = this.unwrapAll();
                return a ? new g(new A("" + a + ".push"), [b]) : new K(b)
            }, a.prototype.contains = function (a) {
                var b;
                b = !1, this.traverseChildren(!1, function (c) {
                    if (a(c)) {
                        b = !0;
                        return!1
                    }
                });
                return b
            }, a.prototype.containsType = function (a) {
                return this instanceof a || this.contains(function (b) {
                    return b instanceof a
                })
            }, a.prototype.lastNonComment = function (a) {
                var b;
                b = a.length;
                while (b--)if (!(a[b]instanceof k))return a[b];
                return null
            }, a.prototype.toString = function (a, b) {
                var c;
                a == null && (a = ""), b == null && (b = this.constructor.name), c = "\n" + a + b, this.soak && (c += "?"), this.eachChild(function (b) {
                    return c += b.toString(a + Q)
                });
                return c
            }, a.prototype.eachChild = function (a) {
                var b, c, d, e, f, g, h, i;
                if (!this.children)return this;
                h = this.children;
                for (d = 0, f = h.length; d < f; d++) {
                    b = h[d];
                    if (this[b]) {
                        i = ba([this[b]]);
                        for (e = 0, g = i.length; e < g; e++) {
                            c = i[e];
                            if (a(c) === !1)return this
                        }
                    }
                }
                return this
            }, a.prototype.traverseChildren = function (a, b) {
                return this.eachChild(function (c) {
                    if (b(c) === !1)return!1;
                    return c.traverseChildren(a, b)
                })
            }, a.prototype.invert = function () {
                return new F("!", this)
            }, a.prototype.unwrapAll = function () {
                var a;
                a = this;
                while (a !== (a = a.unwrap()))continue;
                return a
            }, a.prototype.children = [], a.prototype.isStatement = D, a.prototype.jumps = D, a.prototype.isComplex = X, a.prototype.isChainable = D, a.prototype.isAssignable = D, a.prototype.unwrap = R, a.prototype.unfoldSoak = D, a.prototype.assigns = D;
            return a
        }(), a.Block = f = function () {
            function a(a) {
                this.expressions = Y(ba(a || []))
            }

            bj(a, e), a.prototype.children = ["expressions"], a.prototype.push = function (a) {
                this.expressions.push(a);
                return this
            }, a.prototype.pop = function () {
                return this.expressions.pop()
            }, a.prototype.unshift = function (a) {
                this.expressions.unshift(a);
                return this
            }, a.prototype.unwrap = function () {
                return this.expressions.length === 1 ? this.expressions[0] : this
            }, a.prototype.isEmpty = function () {
                return!this.expressions.length
            }, a.prototype.isStatement = function (a) {
                var b, c, d, e;
                e = this.expressions;
                for (c = 0, d = e.length; c < d; c++) {
                    b = e[c];
                    if (b.isStatement(a))return!0
                }
                return!1
            }, a.prototype.jumps = function (a) {
                var b, c, d, e;
                e = this.expressions;
                for (c = 0, d = e.length; c < d; c++) {
                    b = e[c];
                    if (b.jumps(a))return b
                }
            }, a.prototype.makeReturn = function (a) {
                var b, c;
                c = this.expressions.length;
                while (c--) {
                    b = this.expressions[c];
                    if (!(b instanceof k)) {
                        this.expressions[c] = b.makeReturn(a), b instanceof K && !b.expression && this.expressions.splice(c, 1);
                        break
                    }
                }
                return this
            }, a.prototype.compile = function (b, c) {
                b == null && (b = {});
                return b.scope ? a.__super__.compile.call(this, b, c) : this.compileRoot(b)
            }, a.prototype.compileNode = function (b) {
                var c, d, e, f, g, h, i;
                this.tab = b.indent, f = b.level === z, d = [], i = this.expressions;
                for (g = 0, h = i.length; g < h; g++)e = i[g], e = e.unwrapAll(), e = e.unfoldSoak(b) || e, e instanceof a ? d.push(e.compileNode(b)) : f ? (e.front = !0, c = e.compile(b), d.push(e.isStatement(b) ? c : "" + this.tab + c + ";")) : d.push(e.compile(b, w));
                if (f)return this.spaced ? "\n" + d.join("\n\n") + "\n" : d.join("\n");
                c = d.join(", ") || "void 0";
                return d.length > 1 && b.level >= w ? "(" + c + ")" : c
            }, a.prototype.compileRoot = function (a) {
                var b;
                a.indent = this.tab = a.bare ? "" : Q, a.scope = new M(null, this, null), a.level = z, this.spaced = !0, b = this.compileWithDeclarations(a);
                if (a.bare || a.scope.variables.length <= 1)return b;
                return"(function() {\n" + b + "\n}).call(this);\n"
            }, a.prototype.compileWithDeclarations = function (a) {
                var b, c, d, e, f, g, h, i, j, l;
                c = g = "", l = this.expressions;
                for (f = 0, j = l.length; f < j; f++) {
                    e = l[f], e = e.unwrap();
                    if (!(e instanceof k || e instanceof A))break
                }
                a = bc(a, {level: z}), f && (h = this.expressions.splice(f, this.expressions.length), c = this.compileNode(a), this.expressions = h), g = this.compileNode(a), i = a.scope, i.expressions === this && (d = a.scope.hasDeclarations(), b = i.hasAssignments, (d || b) && f && (c += "\n"), d && (c += "" + this.tab + "var " + i.declaredVariables().join(", ") + ";\n"), b && (c += "" + this.tab + "var " + bd(i.assignedVariables().join(", "), this.tab) + ";\n"));
                return c + g
            }, a.wrap = function (b) {
                if (b.length === 1 && b[0]instanceof a)return b[0];
                return new a(b)
            };
            return a
        }(), a.Literal = A = function () {
            function a(a) {
                this.value = a
            }

            bj(a, e), a.prototype.makeReturn = function () {
                return this.isStatement() ? this : a.__super__.makeReturn.apply(this, arguments)
            }, a.prototype.isAssignable = function () {
                return o.test(this.value)
            }, a.prototype.isStatement = function () {
                var a;
                return(a = this.value) === "break" || a === "continue" || a === "debugger"
            }, a.prototype.isComplex = D, a.prototype.assigns = function (a) {
                return a === this.value
            }, a.prototype.jumps = function (a) {
                if (!this.isStatement())return!1;
                return!a || !(a.loop || a.block && this.value !== "continue") ? this : !1
            }, a.prototype.compileNode = function (a) {
                var b, c, d;
                b = this.isUndefined ? a.level >= u ? "(void 0)" : "void 0" : this.value === "this" ? ((c = a.scope.method) != null ? c.bound : void 0) ? a.scope.method.context : this.value : this.value.reserved && (d = "" + this.value) !== "eval" && d !== "arguments" ? '"' + this.value + '"' : this.value;
                return this.isStatement() ? "" + this.tab + b + ";" : b
            }, a.prototype.toString = function () {
                return' "' + this.value + '"'
            };
            return a
        }(), a.Return = K = function () {
            function a(a) {
                a && !a.unwrap().isUndefined && (this.expression = a)
            }

            bj(a, e), a.prototype.children = ["expression"], a.prototype.isStatement = X, a.prototype.makeReturn = R, a.prototype.jumps = R, a.prototype.compile = function (b, c) {
                var d, e;
                d = (e = this.expression) != null ? e.makeReturn() : void 0;
                return!d || d instanceof a ? a.__super__.compile.call(this, b, c) : d.compile(b, c)
            }, a.prototype.compileNode = function (a) {
                return this.tab + ("return" + [this.expression ? " " + this.expression.compile(a, y) : void 0] + ";")
            };
            return a
        }(), a.Value = V = function () {
            function a(b, c, d) {
                if (!c && b instanceof a)return b;
                this.base = b, this.properties = c || [], d && (this[d] = !0);
                return this
            }

            bj(a, e), a.prototype.children = ["base", "properties"], a.prototype.add = function (a) {
                this.properties = this.properties.concat(a);
                return this
            }, a.prototype.hasProperties = function () {
                return!!this.properties.length
            }, a.prototype.isArray = function () {
                return!this.properties.length && this.base instanceof c
            }, a.prototype.isComplex = function () {
                return this.hasProperties() || this.base.isComplex()
            }, a.prototype.isAssignable = function () {
                return this.hasProperties() || this.base.isAssignable()
            }, a.prototype.isSimpleNumber = function () {
                return this.base instanceof A && L.test(this.base.value)
            }, a.prototype.isAtomic = function () {
                var a, b, c, d;
                d = this.properties.concat(this.base);
                for (b = 0, c = d.length; b < c; b++) {
                    a = d[b];
                    if (a.soak || a instanceof g)return!1
                }
                return!0
            }, a.prototype.isStatement = function (a) {
                return!this.properties.length && this.base.isStatement(a)
            }, a.prototype.assigns = function (a) {
                return!this.properties.length && this.base.assigns(a)
            }, a.prototype.jumps = function (a) {
                return!this.properties.length && this.base.jumps(a)
            }, a.prototype.isObject = function (a) {
                if (this.properties.length)return!1;
                return this.base instanceof E && (!a || this.base.generated)
            }, a.prototype.isSplice = function () {
                return bb(this.properties)instanceof N
            }, a.prototype.unwrap = function () {
                return this.properties.length ? this : this.base
            }, a.prototype.cacheReference = function (b) {
                var c, e, f, g;
                f = bb(this.properties);
                if (this.properties.length < 2 && !this.base.isComplex() && (f != null ? !f.isComplex() : !void 0))return[this, this];
                c = new a(this.base, this.properties.slice(0, -1)), c.isComplex() && (e = new A(b.scope.freeVariable("base")), c = new a(new H(new d(e, c))));
                if (!f)return[c, e];
                f.isComplex() && (g = new A(b.scope.freeVariable("name")), f = new t(new d(g, f.index)), g = new t(g));
                return[c.add(f), new a(e || c.base, [g || f])]
            }, a.prototype.compileNode = function (a) {
                var b, c, d, e, f;
                this.base.front = this.front, d = this.properties, b = this.base.compile(a, d.length ? u : null), (this.base instanceof H || d.length) && L.test(b) && (b = "" + b + ".");
                for (e = 0, f = d.length; e < f; e++)c = d[e], b += c.compile(a);
                return b
            }, a.prototype.unfoldSoak = function (b) {
                var c, e = this;
                if (this.unfoldedSoak != null)return this.unfoldedSoak;
                c = function () {
                    var c, f, g, h, i, j, k, m;
                    if (g = e.base.unfoldSoak(b)) {
                        Array.prototype.push.apply(g.body.properties, e.properties);
                        return g
                    }
                    m = e.properties;
                    for (f = 0, k = m.length; f < k; f++) {
                        h = m[f];
                        if (!h.soak)continue;
                        h.soak = !1, c = new a(e.base, e.properties.slice(0, f)), j = new a(e.base, e.properties.slice(f)), c.isComplex() && (i = new A(b.scope.freeVariable("ref")), c = new H(new d(i, c)), j.base = i);
                        return new r(new l(c), j, {soak: !0})
                    }
                    return null
                }();
                return this.unfoldedSoak = c || !1
            };
            return a
        }(), a.Comment = k = function () {
            function a(a) {
                this.comment = a
            }

            bj(a, e), a.prototype.isStatement = X, a.prototype.makeReturn = R, a.prototype.compileNode = function (a, b) {
                var c;
                c = "/*" + bd(this.comment, this.tab) + ("\n" + this.tab + "*/"), (b || a.level) === z && (c = a.indent + c);
                return c
            };
            return a
        }(), a.Call = g = function () {
            function a(a, b, c) {
                this.args = b != null ? b : [], this.soak = c, this.isNew = !1, this.isSuper = a === "super", this.variable = this.isSuper ? null : a
            }

            bj(a, e), a.prototype.children = ["variable", "args"], a.prototype.newInstance = function () {
                var b, c;
                b = ((c = this.variable) != null ? c.base : void 0) || this.variable, b instanceof a && !b.isNew ? b.newInstance() : this.isNew = !0;
                return this
            }, a.prototype.superReference = function (a) {
                var c, d, e;
                d = a.scope.method;
                if (!d)throw SyntaxError("cannot call super outside of a function.");
                e = d.name;
                if (e == null)throw SyntaxError("cannot call super on an anonymous function.");
                if (d.klass) {
                    c = [new b(new A("__super__"))], d.static && c.push(new b(new A("constructor"))), c.push(new b(new A(e)));
                    return(new V(new A(d.klass), c)).compile(a)
                }
                return"" + e + ".__super__.constructor"
            }, a.prototype.unfoldSoak = function (b) {
                var c, d, e, f, g, h, i, j, k;
                if (this.soak) {
                    if (this.variable) {
                        if (d = bf(b, this, "variable"))return d;
                        j = (new V(this.variable)).cacheReference(b), e = j[0], g = j[1]
                    } else e = new A(this.superReference(b)), g = new V(e);
                    g = new a(g, this.args), g.isNew = this.isNew, e = new A("typeof " + e.compile(b) + ' === "function"');
                    return new r(e, new V(g), {soak: !0})
                }
                c = this, f = [];
                for (; ;) {
                    if (c.variable instanceof a) {
                        f.push(c), c = c.variable;
                        continue
                    }
                    if (!(c.variable instanceof V))break;
                    f.push(c);
                    if (!((c = c.variable.base)instanceof a))break
                }
                k = f.reverse();
                for (h = 0, i = k.length; h < i; h++)c = k[h], d && (c.variable instanceof a ? c.variable = d : c.variable.base = d), d = bf(b, c, "variable");
                return d
            }, a.prototype.filterImplicitObjects = function (a) {
                var b, c, e, f, g, h, i, j, l, m;
                c = [];
                for (h = 0, j = a.length; h < j; h++) {
                    b = a[h];
                    if (!((typeof b.isObject == "function" ? b.isObject() : void 0) && b.base.generated)) {
                        c.push(b);
                        continue
                    }
                    e = null, m = b.base.properties;
                    for (i = 0, l = m.length; i < l; i++)f = m[i], f instanceof d || f instanceof k ? (e || c.push(e = new E(g = [], !0)), g.push(f)) : (c.push(f), e = null)
                }
                return c
            }, a.prototype.compileNode = function (a) {
                var b, c, d, e;
                (e = this.variable) != null && (e.front = this.front);
                if (d = O.compileSplattedArray(a, this.args, !0))return this.compileSplat(a, d);
                c = this.filterImplicitObjects(this.args), c = function () {
                    var d, e, f;
                    f = [];
                    for (d = 0, e = c.length; d < e; d++)b = c[d], f.push(b.compile(a, w));
                    return f
                }().join(", ");
                return this.isSuper ? this.superReference(a) + (".call(this" + (c && ", " + c) + ")") : (this.isNew ? "new " : "") + this.variable.compile(a, u) + ("(" + c + ")")
            }, a.prototype.compileSuper = function (a, b) {
                return"" + this.superReference(b) + ".call(this" + (a.length ? ", " : "") + a + ")"
            }, a.prototype.compileSplat = function (a, b) {
                var c, d, e, f, g;
                if (this.isSuper)return"" + this.superReference(a) + ".apply(this, " + b + ")";
                if (this.isNew) {
                    e = this.tab + Q;
                    return"(function(func, args, ctor) {\n" + e + "ctor.prototype = func.prototype;\n" + e + "var child = new ctor, result = func.apply(child, args);\n" + e + 'return typeof result === "object" ? result : child;\n' + this.tab + "})(" + this.variable.compile(a, w) + ", " + b + ", function() {})"
                }
                c = new V(this.variable), (f = c.properties.pop()) && c.isComplex() ? (g = a.scope.freeVariable("ref"), d = "(" + g + " = " + c.compile(a, w) + ")" + f.compile(a)) : (d = c.compile(a, u), L.test(d) && (d = "(" + d + ")"), f ? (g = d, d += f.compile(a)) : g = "null");
                return"" + d + ".apply(" + g + ", " + b + ")"
            };
            return a
        }(), a.Extends = m = function () {
            function a(a, b) {
                this.child = a, this.parent = b
            }

            bj(a, e), a.prototype.children = ["child", "parent"], a.prototype.compile = function (a) {
                return(new g(new V(new A(bg("extends"))), [this.child, this.parent])).compile(a)
            };
            return a
        }(), a.Access = b = function () {
            function a(a, b) {
                this.name = a, this.name.asKey = !0, this.soak = b === "soak"
            }

            bj(a, e), a.prototype.children = ["name"], a.prototype.compile = function (a) {
                var b;
                b = this.name.compile(a);
                return o.test(b) ? "." + b : "[" + b + "]"
            }, a.prototype.isComplex = D;
            return a
        }(), a.Index = t = function () {
            function a(a) {
                this.index = a
            }

            bj(a, e), a.prototype.children = ["index"], a.prototype.compile = function (a) {
                return"[" + this.index.compile(a, y) + "]"
            }, a.prototype.isComplex = function () {
                return this.index.isComplex()
            };
            return a
        }(), a.Range = J = function () {
            function a(a, b, c) {
                this.from = a, this.to = b, this.exclusive = c === "exclusive", this.equals = this.exclusive ? "" : "="
            }

            bj(a, e), a.prototype.children = ["from", "to"], a.prototype.compileVariables = function (a) {
                var b, c, d, e, f;
                a = bc(a, {top: !0}), c = this.from.cache(a, w), this.fromC = c[0], this.fromVar = c[1], d = this.to.cache(a, w), this.toC = d[0], this.toVar = d[1];
                if (b = Z(a, "step"))e = b.cache(a, w), this.step = e[0], this.stepVar = e[1];
                f = [this.fromVar.match(L), this.toVar.match(L)], this.fromNum = f[0], this.toNum = f[1];
                if (this.stepVar)return this.stepNum = this.stepVar.match(L)
            }, a.prototype.compileNode = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m;
                this.fromVar || this.compileVariables(a);
                if (!a.index)return this.compileArray(a);
                g = this.fromNum && this.toNum, f = Z(a, "index"), k = "" + f + " = " + this.fromC, this.toC !== this.toVar && (k += ", " + this.toC), this.step !== this.stepVar && (k += ", " + this.step), l = ["" + f + " <" + this.equals, "" + f + " >" + this.equals], h = l[0], e = l[1], c = this.stepNum ? +this.stepNum > 0 ? "" + h + " " + this.toVar : "" + e + " " + this.toVar : g ? (m = [+this.fromNum, +this.toNum], d = m[0], j = m[1], m, d <= j ? "" + h + " " + j : "" + e + " " + j) : (b = "" + this.fromVar + " <= " + this.toVar, "" + b + " ? " + h + " " + this.toVar + " : " + e + " " + this.toVar), i = this.stepVar ? "" + f + " += " + this.stepVar : g ? d <= j ? "" + f + "++" : "" + f + "--" : "" + b + " ? " + f + "++ : " + f + "--";
                return"" + k + "; " + c + "; " + i
            }, a.prototype.compileArray = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p;
                if (this.fromNum && this.toNum && Math.abs(this.fromNum - this.toNum) <= 20) {
                    j = function () {
                        p = [];
                        for (var a = n = +this.fromNum, b = +this.toNum; n <= b ? a <= b : a >= b; n <= b ? a++ : a--)p.push(a);
                        return p
                    }.apply(this), this.exclusive && j.pop();
                    return"[" + j.join(", ") + "]"
                }
                g = this.tab + Q, f = a.scope.freeVariable("i"), k = a.scope.freeVariable("results"), i = "\n" + g + k + " = [];", this.fromNum && this.toNum ? (a.index = f, c = this.compileNode(a)) : (l = "" + f + " = " + this.fromC + (this.toC !== this.toVar ? ", " + this.toC : ""), d = "" + this.fromVar + " <= " + this.toVar, c = "var " + l + "; " + d + " ? " + f + " <" + this.equals + " " + this.toVar + " : " + f + " >" + this.equals + " " + this.toVar + "; " + d + " ? " + f + "++ : " + f + "--"), h = "{ " + k + ".push(" + f + "); }\n" + g + "return " + k + ";\n" + a.indent, e = function (a) {
                    return a != null ? a.contains(function (a) {
                        return a instanceof A && a.value === "arguments" && !a.asKey
                    }) : void 0
                };
                if (e(this.from) || e(this.to))b = ", arguments";
                return"(function() {" + i + "\n" + g + "for (" + c + ")" + h + "}).apply(this" + (b != null ? b : "") + ")"
            };
            return a
        }(), a.Slice = N = function () {
            function a(b) {
                this.range = b, a.__super__.constructor.call(this)
            }

            bj(a, e), a.prototype.children = ["range"], a.prototype.compileNode = function (a) {
                var b, c, d, e, f, g;
                g = this.range, e = g.to, c = g.from, d = c && c.compile(a, y) || "0", b = e && e.compile(a, u), e && (!!this.range.exclusive || +b !== -1) && (f = ", " + (this.range.exclusive ? b : L.test(b) ? (+b + 1).toString() : "" + b + " + 1 || 9e9"));
                return".slice(" + d + (f || "") + ")"
            };
            return a
        }(), a.Obj = E = function () {
            function a(a, b) {
                this.generated = b != null ? b : !1, this.objects = this.properties = a || []
            }

            bj(a, e), a.prototype.children = ["properties"], a.prototype.compileNode = function (a) {
                var b, c, e, f, g, h, i, j, l, m, n;
                l = this.properties;
                if (!l.length)return this.front ? "({})" : "{}";
                if (this.generated)for (m = 0, n = l.length; m < n; m++) {
                    h = l[m];
                    if (h instanceof V)throw new Error("cannot have an implicit value in an implicit object")
                }
                c = a.indent += Q, g = this.lastNonComment(this.properties), l = function () {
                    var h, i;
                    i = [];
                    for (b = 0, h = l.length; b < h; b++)j = l[b], f = b === l.length - 1 ? "" : j === g || j instanceof k ? "\n" : ",\n", e = j instanceof k ? "" : c, j instanceof V && j["this"] && (j = new d(j.properties[0].name, j, "object")), j instanceof k || (j instanceof d || (j = new d(j, j, "object")), (j.variable.base || j.variable).asKey = !0), i.push(e + j.compile(a, z) + f);
                    return i
                }(), l = l.join(""), i = "{" + (l && "\n" + l + "\n" + this.tab) + "}";
                return this.front ? "(" + i + ")" : i
            }, a.prototype.assigns = function (a) {
                var b, c, d, e;
                e = this.properties;
                for (c = 0, d = e.length; c < d; c++) {
                    b = e[c];
                    if (b.assigns(a))return!0
                }
                return!1
            };
            return a
        }(), a.Arr = c = function () {
            function a(a) {
                this.objects = a || []
            }

            bj(a, e), a.prototype.children = ["objects"], a.prototype.filterImplicitObjects = g.prototype.filterImplicitObjects, a.prototype.compileNode = function (a) {
                var b, c, d;
                if (!this.objects.length)return"[]";
                a.indent += Q, d = this.filterImplicitObjects(this.objects);
                if (b = O.compileSplattedArray(a, d))return b;
                b = function () {
                    var b, e, f;
                    f = [];
                    for (b = 0, e = d.length; b < e; b++)c = d[b], f.push(c.compile(a, w));
                    return f
                }().join(", ");
                return b.indexOf("\n") >= 0 ? "[\n" + a.indent + b + "\n" + this.tab + "]" : "[" + b + "]"
            }, a.prototype.assigns = function (a) {
                var b, c, d, e;
                e = this.objects;
                for (c = 0, d = e.length; c < d; c++) {
                    b = e[c];
                    if (b.assigns(a))return!0
                }
                return!1
            };
            return a
        }(), a.Class = h = function () {
            function a(a, b, c) {
                this.variable = a, this.parent = b, this.body = c != null ? c : new f, this.boundFuncs = [], this.body.classBody = !0
            }

            bj(a, e), a.prototype.children = ["variable", "parent", "body"], a.prototype.determineName = function () {
                var a, c;
                if (!this.variable)return null;
                a = (c = bb(this.variable.properties)) ? c instanceof b && c.name.value : this.variable.base.value;
                return a && (a = o.test(a) && a)
            }, a.prototype.setContext = function (a) {
                return this.body.traverseChildren(!1, function (b) {
                    if (b.classBody)return!1;
                    if (b instanceof A && b.value === "this")return b.value = a;
                    if (b instanceof j) {
                        b.klass = a;
                        if (b.bound)return b.context = a
                    }
                })
            }, a.prototype.addBoundFunctions = function (a) {
                var c, d, e, f, g, h;
                if (this.boundFuncs.length) {
                    g = this.boundFuncs, h = [];
                    for (e = 0, f = g.length; e < f; e++)c = g[e], d = (new V(new A("this"), [new b(c)])).compile(a), h.push(this.ctor.body.unshift(new A("" + d + " = " + bg("bind") + "(" + d + ", this)")));
                    return h
                }
            }, a.prototype.addProperties = function (a, c, e) {
                var f, g, h, i, k;
                k = a.base.properties.slice(0), h = function () {
                    var a;
                    a = [];
                    while (f = k.shift()) {
                        if (f instanceof d) {
                            g = f.variable.base, delete f.context, i = f.value;
                            if (g.value === "constructor") {
                                if (this.ctor)throw new Error("cannot define more than one constructor in a class");
                                if (i.bound)throw new Error("cannot define a constructor as a bound function");
                                i instanceof j ? f = this.ctor = i : (this.externalCtor = e.scope.freeVariable("class"), f = new d(new A(this.externalCtor), i))
                            } else f.variable["this"] ? i.static = !0 : (f.variable = new V(new A(c), [new b(new A("prototype")), new b(g)]), i instanceof j && i.bound && (this.boundFuncs.push(g), i.bound = !1))
                        }
                        a.push(f)
                    }
                    return a
                }.call(this);
                return Y(h)
            }, a.prototype.walkBody = function (b, c) {
                var d = this;
                return this.traverseChildren(!1, function (e) {
                    var g, h, i, j, k;
                    if (e instanceof a)return!1;
                    if (e instanceof f) {
                        k = g = e.expressions;
                        for (h = 0, j = k.length; h < j; h++)i = k[h], i instanceof V && i.isObject(!0) && (g[h] = d.addProperties(i, b, c));
                        return e.expressions = g = ba(g)
                    }
                })
            }, a.prototype.ensureConstructor = function (a) {
                this.ctor || (this.ctor = new j, this.parent && this.ctor.body.push(new A("" + a + ".__super__.constructor.apply(this, arguments)")), this.externalCtor && this.ctor.body.push(new A("" + this.externalCtor + ".apply(this, arguments)")), this.body.expressions.unshift(this.ctor)), this.ctor.ctor = this.ctor.name = a, this.ctor.klass = null;
                return this.ctor.noReturn = !0
            }, a.prototype.compileNode = function (a) {
                var b, c, e, f;
                b = this.determineName(), f = b || this.name || "_Class", f.reserved && (f = "_" + f), e = new A(f), this.setContext(f), this.walkBody(f, a), this.ensureConstructor(f), this.body.spaced = !0, this.parent && this.body.expressions.unshift(new m(e, this.parent)), this.ctor instanceof j || this.body.expressions.unshift(this.ctor), this.body.expressions.push(e), this.addBoundFunctions(a), c = new H(i.wrap(this.body), !0), this.variable && (c = new d(this.variable, c));
                return c.compile(a)
            };
            return a
        }(), a.Assign = d = function () {
            function a(a, b, c, d) {
                this.variable = a, this.value = b, this.context = c, this.param = d && d.param, this.subpattern = d && d.subpattern
            }

            bj(a, e), a.prototype.children = ["variable", "value"], a.prototype.isStatement = function (a) {
                return(a != null ? a.level : void 0) === z && this.context != null && bk.call(this.context, "?") >= 0
            }, a.prototype.assigns = function (a) {
                return this[this.context === "object" ? "value" : "variable"].assigns(a)
            }, a.prototype.unfoldSoak = function (a) {
                return bf(a, this, "variable")
            }, a.prototype.compileNode = function (a) {
                var b, c, d, e, f, g, h, i, k;
                if (b = this.variable instanceof V) {
                    if (this.variable.isArray() || this.variable.isObject())return this.compilePatternMatch(a);
                    if (this.variable.isSplice())return this.compileSplice(a);
                    if ((g = this.context) === "||=" || g === "&&=" || g === "?=")return this.compileConditional(a)
                }
                d = this.variable.compile(a, w);
                if (!this.context) {
                    if (!(f = this.variable.unwrapAll()).isAssignable())throw SyntaxError('"' + this.variable.compile(a) + '" cannot be assigned.');
                    if (typeof f.hasProperties == "function" ? !f.hasProperties() : !void 0)this.param ? a.scope.add(d, "var") : a.scope.find(d)
                }
                this.value instanceof j && (c = B.exec(d)) && (c[1] && (this.value.klass = c[1]), this.value.name = (h = (i = (k = c[2]) != null ? k : c[3]) != null ? i : c[4]) != null ? h : c[5]), e = this.value.compile(a, w);
                if (this.context === "object")return"" + d + ": " + e;
                e = d + (" " + (this.context || "=") + " ") + e;
                return a.level <= w ? e : "(" + e + ")"
            }, a.prototype.compilePatternMatch = function (c) {
                var d, e, f, g, h, i, j, k, l, m, n, p, q, r, s, u, v, y, B, C, D, E, F, G, J, K;
                s = c.level === z, v = this.value, m = this.variable.base.objects;
                if (!(n = m.length)) {
                    f = v.compile(c);
                    return c.level >= x ? "(" + f + ")" : f
                }
                i = this.variable.isObject();
                if (s && n === 1 && !((l = m[0])instanceof O)) {
                    l instanceof a ? (C = l, D = C.variable, h = D.base, l = C.value) : l.base instanceof H ? (E = (new V(l.unwrapAll())).cacheReference(c), l = E[0], h = E[1]) : h = i ? l["this"] ? l.properties[0].name : l : new A(0), d = o.test(h.unwrap().value || 0), v = new V(v), v.properties.push(new (d ? b : t)(h));
                    if (F = l.unwrap().value, bk.call(["arguments", "eval"].concat(I), F) >= 0)throw new SyntaxError("assignment to a reserved word: " + l.compile(c) + " = " + v.compile(c));
                    return(new a(l, v, null, {param: this.param})).compile(c, z)
                }
                y = v.compile(c, w), e = [], r = !1;
                if (!o.test(y) || this.variable.assigns(y))e.push("" + (p = c.scope.freeVariable("ref")) + " = " + y), y = p;
                for (g = 0, B = m.length; g < B; g++) {
                    l = m[g], h = g, i && (l instanceof a ? (G = l, J = G.variable, h = J.base, l = G.value) : l.base instanceof H ? (K = (new V(l.unwrapAll())).cacheReference(c), l = K[0], h = K[1]) : h = l["this"] ? l.properties[0].name : l);
                    if (!r && l instanceof O)k = l.name.unwrap().value, l = l.unwrap(), u = "" + n + " <= " + y + ".length ? " + bg("slice") + ".call(" + y + ", " + g, (q = n - g - 1) ? (j = c.scope.freeVariable("i"), u += ", " + j + " = " + y + ".length - " + q + ") : (" + j + " = " + g + ", [])") : u += ") : []", u = new A(u), r = "" + j + "++"; else {
                        k = l.unwrap().value;
                        if (l instanceof O) {
                            l = l.name.compile(c);
                            throw new SyntaxError("multiple splats are disallowed in an assignment: " + l + "...")
                        }
                        typeof h == "number" ? (h = new A(r || h), d = !1) : d = i && o.test(h.unwrap().value || 0), u = new V(new A(y), [new (d ? b : t)(h)])
                    }
                    if (k != null && bk.call(["arguments", "eval"].concat(I), k) >= 0)throw new SyntaxError("assignment to a reserved word: " + l.compile(c) + " = " + u.compile(c));
                    e.push((new a(l, u, null, {param: this.param, subpattern: !0})).compile(c, w))
                }
                !s && !this.subpattern && e.push(y), f = e.join(", ");
                return c.level < w ? f : "(" + f + ")"
            }, a.prototype.compileConditional = function (b) {
                var c, d, e;
                e = this.variable.cacheReference(b), c = e[0], d = e[1], bk.call(this.context, "?") >= 0 && (b.isExistentialEquals = !0);
                return(new F(this.context.slice(0, -1), c, new a(d, this.value, "="))).compile(b)
            }, a.prototype.compileSplice = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m;
                k = this.variable.properties.pop().range, d = k.from, h = k.to, c = k.exclusive, g = this.variable.compile(a), l = (d != null ? d.cache(a, x) : void 0) || ["0", "0"], e = l[0], f = l[1], h ? (d != null ? d.isSimpleNumber() : void 0) && h.isSimpleNumber() ? (h = +h.compile(a) - +f, c || (h += 1)) : (h = h.compile(a, u) + " - " + f, c || (h += " + 1")) : h = "9e9", m = this.value.cache(a, w), i = m[0], j = m[1], b = "[].splice.apply(" + g + ", [" + e + ", " + h + "].concat(" + i + ")), " + j;
                return a.level > z ? "(" + b + ")" : b
            };
            return a
        }(), a.Code = j = function () {
            function a(a, b, c) {
                this.params = a || [], this.body = b || new f, this.bound = c === "boundfunc", this.bound && (this.context = "_this")
            }

            bj(a, e), a.prototype.children = ["params", "body"], a.prototype.isStatement = function () {
                return!!this.ctor
            }, a.prototype.jumps = D, a.prototype.compileNode = function (a) {
                var b, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, v, w, x, y, z, B, C, D, E;
                a.scope = new M(a.scope, this.body, this), a.scope.shared = Z(a, "sharedScope"), a.indent += Q, delete a.bare, o = [], e = [], z = this.params;
                for (q = 0, v = z.length; q < v; q++) {
                    j = z[q];
                    if (!j.splat)continue;
                    B = this.params;
                    for (s = 0, w = B.length; s < w; s++)i = B[s], i.name.value && a.scope.add(i.name.value, "var", !0);
                    l = new d(new V(new c(function () {
                        var b, c, d, e;
                        d = this.params, e = [];
                        for (b = 0, c = d.length; b < c; b++)i = d[b], e.push(i.asReference(a));
                        return e
                    }.call(this))), new V(new A("arguments")));
                    break
                }
                C = this.params;
                for (t = 0, x = C.length; t < x; t++)j = C[t], j.isComplex() ? (n = k = j.asReference(a), j.value && (n = new F("?", k, j.value)), e.push(new d(new V(j.name), n, "=", {param: !0}))) : (k = j, j.value && (h = new A(k.name.value + " == null"), n = new d(new V(j.name), j.value, "="), e.push(new r(h, n)))), l || o.push(k);
                p = this.body.isEmpty(), l && e.unshift(l), e.length && (D = this.body.expressions).unshift.apply(D, e);
                if (!l)for (f = 0, y = o.length; f < y; f++)m = o[f], a.scope.parameter(o[f] = m.compile(a));
                !p && !this.noReturn && this.body.makeReturn(), this.bound && (((E = a.scope.parent.method) != null ? E.bound : void 0) ? this.bound = a.scope.parent.method.context : a.scope.parent.assign("_this", "this")), g = a.indent, b = "function", this.ctor && (b += " " + this.name), b += "(" + o.join(", ") + ") {", this.body.isEmpty() || (b += "\n" + this.body.compileWithDeclarations(a) + "\n" + this.tab), b += "}";
                if (this.ctor)return this.tab + b;
                return this.front || a.level >= u ? "(" + b + ")" : b
            }, a.prototype.traverseChildren = function (b, c) {
                if (b)return a.__super__.traverseChildren.call(this, b, c)
            };
            return a
        }(), a.Param = G = function () {
            function a(a, b, c) {
                this.name = a, this.value = b, this.splat = c
            }

            bj(a, e), a.prototype.children = ["name", "value"], a.prototype.compile = function (a) {
                return this.name.compile(a, w)
            }, a.prototype.asReference = function (a) {
                var b;
                if (this.reference)return this.reference;
                b = this.name, b["this"] ? (b = b.properties[0].name, b.value.reserved && (b = new A("_" + b.value))) : b.isComplex() && (b = new A(a.scope.freeVariable("arg"))), b = new V(b), this.splat && (b = new O(b));
                return this.reference = b
            }, a.prototype.isComplex = function () {
                return this.name.isComplex()
            };
            return a
        }(), a.Splat = O = function () {
            function a(a) {
                this.name = a.compile ? a : new A(a)
            }

            bj(a, e), a.prototype.children = ["name"], a.prototype.isAssignable = X, a.prototype.assigns = function (a) {
                return this.name.assigns(a)
            }, a.prototype.compile = function (a) {
                return this.index != null ? this.compileParam(a) : this.name.compile(a)
            }, a.prototype.unwrap = function () {
                return this.name
            }, a.compileSplattedArray = function (b, c, d) {
                var e, f, g, h, i, j, k;
                i = -1;
                while ((j = c[++i]) && !(j instanceof a))continue;
                if (i >= c.length)return"";
                if (c.length === 1) {
                    g = c[0].compile(b, w);
                    if (d)return g;
                    return"" + bg("slice") + ".call(" + g + ")"
                }
                e = c.slice(i);
                for (h = 0, k = e.length; h < k; h++)j = e[h], g = j.compile(b, w), e[h] = j instanceof a ? "" + bg("slice") + ".call(" + g + ")" : "[" + g + "]";
                if (i === 0)return e[0] + (".concat(" + e.slice(1).join(", ") + ")");
                f = function () {
                    var a, d, e, f;
                    e = c.slice(0, i), f = [];
                    for (a = 0, d = e.length; a < d; a++)j = e[a], f.push(j.compile(b, w));
                    return f
                }();
                return"[" + f.join(", ") + "].concat(" + e.join(", ") + ")"
            };
            return a
        }(), a.While = W = function () {
            function a(a, b) {
                this.condition = (b != null ? b.invert : void 0) ? a.invert() : a, this.guard = b != null ? b.guard : void 0
            }

            bj(a, e), a.prototype.children = ["condition", "guard", "body"], a.prototype.isStatement = X, a.prototype.makeReturn = function (b) {
                if (b)return a.__super__.makeReturn.apply(this, arguments);
                this.returns = !0;
                return this
            }, a.prototype.addBody = function (a) {
                this.body = a;
                return this
            }, a.prototype.jumps = function () {
                var a, b, c, d;
                a = this.body.expressions;
                if (!a.length)return!1;
                for (c = 0, d = a.length; c < d; c++) {
                    b = a[c];
                    if (b.jumps({loop: !0}))return b
                }
                return!1
            }, a.prototype.compileNode = function (a) {
                var b, c, d, e;
                a.indent += Q, e = "", b = this.body, b.isEmpty() ? b = "" : (this.returns && (b.makeReturn(d = a.scope.freeVariable("results")), e = "" + this.tab + d + " = [];\n"), this.guard && (b.expressions.length > 1 ? b.expressions.unshift(new r((new H(this.guard)).invert(), new A("continue"))) : this.guard && (b = f.wrap([new r(this.guard, b)]))), b = "\n" + b.compile(a, z) + "\n" + this.tab), c = e + this.tab + ("while (" + this.condition.compile(a, y) + ") {" + b + "}"), this.returns && (c += "\n" + this.tab + "return " + d + ";");
                return c
            };
            return a
        }(), a.Op = F = function () {
            function c(b, c, d, e) {
                var f;
                if (b === "in")return new s(c, d);
                if (b === "do") {
                    f = new g(c, c.params || []), f["do"] = !0;
                    return f
                }
                if (b === "new") {
                    if (c instanceof g && !c["do"] && !c.isNew)return c.newInstance();
                    if (c instanceof j && c.bound || c["do"])c = new H(c)
                }
                this.operator = a[b] || b, this.first = c, this.second = d, this.flip = !!e;
                return this
            }

            var a, b;
            bj(c, e), a = {"==": "===", "!=": "!==", of: "in"}, b = {"!==": "===", "===": "!=="}, c.prototype.children = ["first", "second"], c.prototype.isSimpleNumber = D, c.prototype.isUnary = function () {
                return!this.second
            }, c.prototype.isComplex = function () {
                var a;
                return!this.isUnary() || (a = this.operator) !== "+" && a !== "-" || this.first.isComplex()
            }, c.prototype.isChainable = function () {
                var a;
                return(a = this.operator) === "<" || a === ">" || a === ">=" || a === "<=" || a === "===" || a === "!=="
            }, c.prototype.invert = function () {
                var a, d, e, f, g;
                if (this.isChainable() && this.first.isChainable()) {
                    a = !0, d = this;
                    while (d && d.operator)a && (a = d.operator in b), d = d.first;
                    if (!a)return(new H(this)).invert();
                    d = this;
                    while (d && d.operator)d.invert = !d.invert, d.operator = b[d.operator], d = d.first;
                    return this
                }
                if (f = b[this.operator]) {
                    this.operator = f, this.first.unwrap()instanceof c && this.first.invert();
                    return this
                }
                return this.second ? (new H(this)).invert() : this.operator === "!" && (e = this.first.unwrap())instanceof c && ((g = e.operator) === "!" || g === "in" || g === "instanceof") ? e : new c("!", this)
            }, c.prototype.unfoldSoak = function (a) {
                var b;
                return((b = this.operator) === "++" || b === "--" || b === "delete") && bf(a, this, "first")
            }, c.prototype.compileNode = function (a) {
                var b, c;
                c = this.isChainable() && this.first.isChainable(), c || (this.first.front = this.front);
                if (this.isUnary())return this.compileUnary(a);
                if (c)return this.compileChain(a);
                if (this.operator === "?")return this.compileExistence(a);
                b = this.first.compile(a, x) + " " + this.operator + " " + this.second.compile(a, x);
                return a.level <= x ? b : "(" + b + ")"
            }, c.prototype.compileChain = function (a) {
                var b, c, d, e;
                e = this.first.second.cache(a), this.first.second = e[0], d = e[1], c = this.first.compile(a, x), b = "" + c + " " + (this.invert ? "&&" : "||") + " " + d.compile(a) + " " + this.operator + " " + this.second.compile(a, x);
                return"(" + b + ")"
            }, c.prototype.compileExistence = function (a) {
                var b, c;
                this.first.isComplex() ? (c = new A(a.scope.freeVariable("ref")), b = new H(new d(c, this.first))) : (b = this.first, c = b);
                return(new r(new l(b), c, {type: "if"})).addElse(this.second).compile(a)
            }, c.prototype.compileUnary = function (a) {
                var b, d, e;
                d = [b = this.operator], e = b === "+" || b === "-", (b === "new" || b === "typeof" || b === "delete" || e && this.first instanceof c && this.first.operator === b) && d.push(" ");
                if (e && this.first instanceof c || b === "new" && this.first.isStatement(a))this.first = new H(this.first);
                d.push(this.first.compile(a, x)), this.flip && d.reverse();
                return d.join("")
            }, c.prototype.toString = function (a) {
                return c.__super__.toString.call(this, a, this.constructor.name + " " + this.operator)
            };
            return c
        }(), a.In = s = function () {
            function a(a, b) {
                this.object = a, this.array = b
            }

            bj(a, e), a.prototype.children = ["object", "array"], a.prototype.invert = C, a.prototype.compileNode = function (a) {
                var b, c, d, e, f;
                if (this.array instanceof V && this.array.isArray()) {
                    f = this.array.base.objects;
                    for (d = 0, e = f.length; d < e; d++) {
                        c = f[d];
                        if (!(c instanceof O))continue;
                        b = !0;
                        break
                    }
                    if (!b)return this.compileOrTest(a)
                }
                return this.compileLoopTest(a)
            }, a.prototype.compileOrTest = function (a) {
                var b, c, d, e, f, g, h, i, j;
                if (this.array.base.objects.length === 0)return"" + !!this.negated;
                i = this.object.cache(a, x), g = i[0], f = i[1], j = this.negated ? [" !== ", " && "] : [" === ", " || "], b = j[0], c = j[1], h = function () {
                    var c, h, i;
                    h = this.array.base.objects, i = [];
                    for (d = 0, c = h.length; d < c; d++)e = h[d], i.push((d ? f : g) + b + e.compile(a, u));
                    return i
                }.call(this), h = h.join(c);
                return a.level < x ? h : "(" + h + ")"
            }, a.prototype.compileLoopTest = function (a) {
                var b, c, d, e;
                e = this.object.cache(a, w), d = e[0], c = e[1], b = bg("indexOf") + (".call(" + this.array.compile(a, w) + ", " + c + ") ") + (this.negated ? "< 0" : ">= 0");
                if (d === c)return b;
                b = d + ", " + b;
                return a.level < w ? b : "(" + b + ")"
            }, a.prototype.toString = function (b) {
                return a.__super__.toString.call(this, b, this.constructor.name + (this.negated ? "!" : ""))
            };
            return a
        }(), a.Try = T = function () {
            function a(a, b, c, d) {
                this.attempt = a, this.error = b, this.recovery = c, this.ensure = d
            }

            bj(a, e), a.prototype.children = ["attempt", "recovery", "ensure"], a.prototype.isStatement = X, a.prototype.jumps = function (a) {
                var b;
                return this.attempt.jumps(a) || ((b = this.recovery) != null ? b.jumps(a) : void 0)
            }, a.prototype.makeReturn = function (a) {
                this.attempt && (this.attempt = this.attempt.makeReturn(a)), this.recovery && (this.recovery = this.recovery.makeReturn(a));
                return this
            }, a.prototype.compileNode = function (a) {
                var b, c, d, e;
                a.indent += Q, d = this.error ? " (" + this.error.compile(a) + ") " : " ", e = this.attempt.compile(a, z), b = this.recovery ? (a.scope.check(this.error.value) ? void 0 : a.scope.add(this.error.value, "param"), " catch" + d + "{\n" + this.recovery.compile(a, z) + "\n" + this.tab + "}") : !this.ensure && !this.recovery ? " catch (_error) {}" : void 0, c = this.ensure ? " finally {\n" + this.ensure.compile(a, z) + "\n" + this.tab + "}" : "";
                return"" + this.tab + "try {\n" + e + "\n" + this.tab + "}" + (b || "") + c
            };
            return a
        }(), a.Throw = S = function () {
            function a(a) {
                this.expression = a
            }

            bj(a, e), a.prototype.children = ["expression"], a.prototype.isStatement = X, a.prototype.jumps = D, a.prototype.makeReturn = R, a.prototype.compileNode = function (a) {
                return this.tab + ("throw " + this.expression.compile(a) + ";")
            };
            return a
        }(), a.Existence = l = function () {
            function a(a) {
                this.expression = a
            }

            bj(a, e), a.prototype.children = ["expression"], a.prototype.invert = C, a.prototype.compileNode = function (a) {
                var b, c, d, e;
                this.expression.front = this.front, d = this.expression.compile(a, x), o.test(d) && !a.scope.check(d) ? (e = this.negated ? ["===", "||"] : ["!==", "&&"], b = e[0], c = e[1], d = "typeof " + d + " " + b + ' "undefined" ' + c + " " + d + " " + b + " null") : d = "" + d + " " + (this.negated ? "==" : "!=") + " null";
                return a.level <= v ? d : "(" + d + ")"
            };
            return a
        }(), a.Parens = H = function () {
            function a(a) {
                this.body = a
            }

            bj(a, e), a.prototype.children = ["body"], a.prototype.unwrap = function () {
                return this.body
            }, a.prototype.isComplex = function () {
                return this.body.isComplex()
            }, a.prototype.compileNode = function (a) {
                var b, c, d;
                d = this.body.unwrap();
                if (d instanceof V && d.isAtomic()) {
                    d.front = this.front;
                    return d.compile(a)
                }
                c = d.compile(a, y), b = a.level < x && (d instanceof F || d instanceof g || d instanceof n && d.returns);
                return b ? c : "(" + c + ")"
            };
            return a
        }(), a.For = n = function () {
            function a(a, b) {
                var c;
                this.source = b.source, this.guard = b.guard, this.step = b.step, this.name = b.name, this.index = b.index, this.body = f.wrap([a]), this.own = !!b.own, this.object = !!b.object, this.object && (c = [this.index, this.name], this.name = c[0], this.index = c[1]);
                if (this.index instanceof V)throw SyntaxError("index cannot be a pattern matching expression");
                this.range = this.source instanceof V && this.source.base instanceof J && !this.source.properties.length, this.pattern = this.name instanceof V;
                if (this.range && this.index)throw SyntaxError("indexes do not apply to range loops");
                if (this.range && this.pattern)throw SyntaxError("cannot pattern match over range loops");
                this.returns = !1
            }

            bj(a, W), a.prototype.children = ["body", "source", "guard", "step"], a.prototype.compileNode = function (a) {
                var b, c, e, g, h, i, j, k, l, m, n, p, q, s, t, u, v, y, B, C, D, E, F;
                b = f.wrap([this.body]), l = (F = bb(b.expressions)) != null ? F.jumps() : void 0, l && l instanceof K && (this.returns = !1), y = this.range ? this.source.base : this.source, v = a.scope, n = this.name && this.name.compile(a, w), j = this.index && this.index.compile(a, w), n && !this.pattern && v.find(n, {immediate: !0}), j && v.find(j, {immediate: !0}), this.returns && (u = v.freeVariable("results")), k = (this.range ? n : j) || v.freeVariable("i"), this.step && !this.range && (C = v.freeVariable("step")), this.pattern && (n = k), E = "", h = "", c = "", i = this.tab + Q, this.range ? e = y.compile(bc(a, {index: k, step: this.step})) : (D = this.source.compile(a, w), (n || this.own) && !o.test(D) && (c = "" + this.tab + (q = v.freeVariable("ref")) + " = " + D + ";\n", D = q), n && !this.pattern && (p = "" + n + " = " + D + "[" + k + "]"), this.object || (m = v.freeVariable("len"), g = "" + k + " = 0, " + m + " = " + D + ".length" + (this.step ? ", " + C + " = " + this.step.compile(a, x) : ""), B = this.step ? "" + k + " += " + C : "" + k + "++", e = "" + g + "; " + k + " < " + m + "; " + B)), this.returns && (s = "" + this.tab + u + " = [];\n", t = "\n" + this.tab + "return " + u + ";", b.makeReturn(u)), this.guard && (b.expressions.length > 1 ? b.expressions.unshift(new r((new H(this.guard)).invert(), new A("continue"))) : this.guard && (b = f.wrap([new r(this.guard, b)]))), this.pattern && b.expressions.unshift(new d(this.name, new A("" + D + "[" + k + "]"))), c += this.pluckDirectCall(a, b), p && (E = "\n" + i + p + ";"), this.object && (e = "" + k + " in " + D, this.own && (h = "\n" + i + "if (!" + bg("hasProp") + ".call(" + D + ", " + k + ")) continue;")), b = b.compile(bc(a, {indent: i}), z), b && (b = "\n" + b + "\n");
                return"" + c + (s || "") + this.tab + "for (" + e + ") {" + h + E + b + this.tab + "}" + (t || "")
            }, a.prototype.pluckDirectCall = function (a, b) {
                var c, e, f, h, i, k, l, m, n, o, p, q, r, s;
                e = "", n = b.expressions;
                for (i = 0, m = n.length; i < m; i++) {
                    f = n[i], f = f.unwrapAll();
                    if (!(f instanceof g))continue;
                    l = f.variable.unwrapAll();
                    if (!(l instanceof j || l instanceof V && ((o = l.base) != null ? o.unwrapAll() : void 0)instanceof j && l.properties.length === 1 && ((p = (q = l.properties[0].name) != null ? q.value : void 0) === "call" || p === "apply")))continue;
                    h = ((r = l.base) != null ? r.unwrapAll() : void 0) || l, k = new A(a.scope.freeVariable("fn")), c = new V(k), l.base && (s = [c, l], l.base = s[0], c = s[1]), b.expressions[i] = new g(c, f.args), e += this.tab + (new d(k, h)).compile(a, z) + ";\n"
                }
                return e
            };
            return a
        }(), a.Switch = P = function () {
            function a(a, b, c) {
                this.subject = a, this.cases = b, this.otherwise = c
            }

            bj(a, e), a.prototype.children = ["subject", "cases", "otherwise"], a.prototype.isStatement = X, a.prototype.jumps = function (a) {
                var b, c, d, e, f, g, h;
                a == null && (a = {block: !0}), f = this.cases;
                for (d = 0, e = f.length; d < e; d++) {
                    g = f[d], c = g[0], b = g[1];
                    if (b.jumps(a))return b
                }
                return(h = this.otherwise) != null ? h.jumps(a) : void 0
            }, a.prototype.makeReturn = function (a) {
                var b, c, d, e, g;
                e = this.cases;
                for (c = 0, d = e.length; c < d; c++)b = e[c], b[1].makeReturn(a);
                a && (this.otherwise || (this.otherwise = new f([new A("void 0")]))), (g = this.otherwise) != null && g.makeReturn(a);
                return this
            }, a.prototype.compileNode = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q;
                i = a.indent + Q, j = a.indent = i + Q, d = this.tab + ("switch (" + (((n = this.subject) != null ? n.compile(a, y) : void 0) || !1) + ") {\n"), o = this.cases;
                for (h = 0, l = o.length; h < l; h++) {
                    p = o[h], f = p[0], b = p[1], q = ba([f]);
                    for (k = 0, m = q.length; k < m; k++)e = q[k], this.subject || (e = e.invert()), d += i + ("case " + e.compile(a, y) + ":\n");
                    if (c = b.compile(a, z))d += c + "\n";
                    if (h === this.cases.length - 1 && !this.otherwise)break;
                    g = this.lastNonComment(b.expressions);
                    if (g instanceof K || g instanceof A && g.jumps() && g.value !== "debugger")continue;
                    d += j + "break;\n"
                }
                this.otherwise && this.otherwise.expressions.length && (d += i + ("default:\n" + this.otherwise.compile(a, z) + "\n"));
                return d + this.tab + "}"
            };
            return a
        }(), a.If = r = function () {
            function a(a, b, c) {
                this.body = b, c == null && (c = {}), this.condition = c.type === "unless" ? a.invert() : a, this.elseBody = null, this.isChain = !1, this.soak = c.soak
            }

            bj(a, e), a.prototype.children = ["condition", "body", "elseBody"], a.prototype.bodyNode = function () {
                var a;
                return(a = this.body) != null ? a.unwrap() : void 0
            }, a.prototype.elseBodyNode = function () {
                var a;
                return(a = this.elseBody) != null ? a.unwrap() : void 0
            }, a.prototype.addElse = function (b) {
                this.isChain ? this.elseBodyNode().addElse(b) : (this.isChain = b instanceof a, this.elseBody = this.ensureBlock(b));
                return this
            }, a.prototype.isStatement = function (a) {
                var b;
                return(a != null ? a.level : void 0) === z || this.bodyNode().isStatement(a) || ((b = this.elseBodyNode()) != null ? b.isStatement(a) : void 0)
            }, a.prototype.jumps = function (a) {
                var b;
                return this.body.jumps(a) || ((b = this.elseBody) != null ? b.jumps(a) : void 0)
            }, a.prototype.compileNode = function (a) {
                return this.isStatement(a) ? this.compileStatement(a) : this.compileExpression(a)
            }, a.prototype.makeReturn = function (a) {
                a && (this.elseBody || (this.elseBody = new f([new A("void 0")]))), this.body && (this.body = new f([this.body.makeReturn(a)])), this.elseBody && (this.elseBody = new f([this.elseBody.makeReturn(a)]));
                return this
            }, a.prototype.ensureBlock = function (a) {
                return a instanceof f ? a : new f([a])
            }, a.prototype.compileStatement = function (b) {
                var c, d, e, f, g, h, i;
                e = Z(b, "chainChild"), g = Z(b, "isExistentialEquals");
                if (g)return(new a(this.condition.invert(), this.elseBodyNode(), {type: "if"})).compile(b);
                f = this.condition.compile(b, y), b.indent += Q, c = this.ensureBlock(this.body), d = c.compile(b);
                if (1 === ((i = c.expressions) != null ? i.length : void 0) && !this.elseBody && !e && d && f && -1 === d.indexOf("\n") && 80 > f.length + d.length)return"" + this.tab + "if (" + f + ") " + d.replace(/^\s+/, "");
                d && (d = "\n" + d + "\n" + this.tab), h = "if (" + f + ") {" + d + "}", e || (h = this.tab + h);
                if (!this.elseBody)return h;
                return h + " else " + (this.isChain ? (b.indent = this.tab, b.chainChild = !0, this.elseBody.unwrap().compile(b, z)) : "{\n" + this.elseBody.compile(b, z) + "\n" + this.tab + "}")
            }, a.prototype.compileExpression = function (a) {
                var b, c, d, e;
                e = this.condition.compile(a, v), c = this.bodyNode().compile(a, w), b = this.elseBodyNode() ? this.elseBodyNode().compile(a, w) : "void 0", d = "" + e + " ? " + c + " : " + b;
                return a.level >= v ? "(" + d + ")" : d
            }, a.prototype.unfoldSoak = function () {
                return this.soak && this
            };
            return a
        }(), i = {wrap: function (a, c, d) {
            var e, h, i, k, l;
            if (a.jumps())return a;
            i = new j([], f.wrap([a])), e = [];
            if ((k = a.contains(this.literalArgs)) || a.contains(this.literalThis))l = new A(k ? "apply" : "call"), e = [new A("this")], k && e.push(new A("arguments")), i = new V(i, [new b(l)]);
            i.noReturn = d, h = new g(i, e);
            return c ? f.wrap([h]) : h
        }, literalArgs: function (a) {
            return a instanceof A && a.value === "arguments" && !a.asKey
        }, literalThis: function (a) {
            return a instanceof A && a.value === "this" && !a.asKey || a instanceof j && a.bound
        }}, bf = function (a, b, c) {
            var d;
            if (!!(d = b[c].unfoldSoak(a))) {
                b[c] = d.body, d.body = new V(b);
                return d
            }
        }, U = {"extends": function () {
            return"function(child, parent) { for (var key in parent) { if (" + bg("hasProp") + ".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }"
        }, bind: function () {
            return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"
        }, indexOf: function () {
            return"Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (" + bg("hasProp") + ".call(this, i) && this[i] === item) return i; } return -1; }"
        }, hasProp: function () {
            return"Object.prototype.hasOwnProperty"
        }, slice: function () {
            return"Array.prototype.slice"
        }}, z = 1, y = 2, w = 3, v = 4, x = 5, u = 6, Q = "  ", p = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*", o = RegExp("^" + p + "$"), L = /^[+-]?\d+$/, B = RegExp("^(?:(" + p + ")\\.prototype(?:\\.(" + p + ")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\]))|(" + p + ")$"), q = /^['"]/, bg = function (a) {
            var b;
            b = "__" + a, M.root.assign(b, U[a]());
            return b
        }, bd = function (a, b) {
            a = a.replace(/\n/g, "$&" + b);
            return a.replace(/\s+$/, "")
        }
    }).call(this)
}, require["./coffee-script"] = new function () {
    var a = this;
    (function () {
        var b, c, d, e, f, g, h, i, j, k = Object.prototype.hasOwnProperty;
        e = require("fs"), h = require("path"), j = require("./lexer"), b = j.Lexer, c = j.RESERVED, g = require("./parser").parser, i = require("vm"), require.extensions ? require.extensions[".coffee"] = function (a, b) {
            var c;
            c = d(e.readFileSync(b, "utf8"), {filename: b});
            return a._compile(c, b)
        } : require.registerExtension && require.registerExtension(".coffee", function (a) {
            return d(a)
        }), a.VERSION = "1.1.3", a.RESERVED = c, a.helpers = require("./helpers"), a.compile = d = function (a, b) {
            b == null && (b = {});
            try {
                return g.parse(f.tokenize(a)).compile(b)
            } catch (c) {
                b.filename && (c.message = "In " + b.filename + ", " + c.message);
                throw c
            }
        }, a.tokens = function (a, b) {
            return f.tokenize(a, b)
        }, a.nodes = function (a, b) {
            return typeof a == "string" ? g.parse(f.tokenize(a, b)) : g.parse(a)
        }, a.run = function (a, b) {
            var c;
            c = require.main, c.filename = process.argv[1] = b.filename ? e.realpathSync(b.filename) : ".", c.moduleCache && (c.moduleCache = {}), c.paths = require("module")._nodeModulePaths(h.dirname(b.filename));
            return h.extname(c.filename) !== ".coffee" || require.extensions ? c._compile(d(a, b), c.filename) : c._compile(a, c.filename)
        }, a.eval = function (a, b) {
            var c, e, f, g, j, l, m, n, o, p, q, r, s, t;
            b == null && (b = {});
            if (!!(a = a.trim())) {
                e = i.Script;
                if (e) {
                    if (b.sandbox != null) {
                        if (b.sandbox instanceof e.createContext().constructor)m = b.sandbox; else {
                            m = e.createContext(), r = b.sandbox;
                            for (g in r) {
                                if (!k.call(r, g))continue;
                                n = r[g], m[g] = n
                            }
                        }
                        m.global = m.root = m.GLOBAL = m
                    } else m = global;
                    m.__filename = b.filename || "eval", m.__dirname = h.dirname(m.__filename);
                    if (m === global && !m.module && !m.require) {
                        c = require("module"), m.module = q = new c(b.modulename || "eval"), m.require = t = function (a) {
                            return c._load(a, q, !0)
                        }, q.filename = m.__filename, s = Object.getOwnPropertyNames(require);
                        for (o = 0, p = s.length; o < p; o++)l = s[o], l !== "paths" && (t[l] = require[l]);
                        t.paths = q.paths = c._nodeModulePaths(process.cwd()), t.resolve = function (a) {
                            return c._resolveFilename(a, q)
                        }
                    }
                }
                j = {};
                for (g in b) {
                    if (!k.call(b, g))continue;
                    n = b[g], j[g] = n
                }
                j.bare = !0, f = d(a, j);
                return m === global ? i.runInThisContext(f) : i.runInContext(f, m)
            }
        }, f = new b, g.lexer = {lex: function () {
            var a, b;
            b = this.tokens[this.pos++] || [""], a = b[0], this.yytext = b[1], this.yylineno = b[2];
            return a
        }, setInput: function (a) {
            this.tokens = a;
            return this.pos = 0
        }, upcomingInput: function () {
            return""
        }}, g.yy = require("./nodes")
    }).call(this)
}, require["./browser"] = new function () {
    var exports = this;
    (function () {
        var CoffeeScript, runScripts;
        CoffeeScript = require("./coffee-script"), CoffeeScript.require = require, CoffeeScript.eval = function (code, options) {
            return eval(CoffeeScript.compile(code, options))
        }, CoffeeScript.run = function (a, b) {
            b == null && (b = {}), b.bare = !0;
            return Function(CoffeeScript.compile(a, b))()
        };
        typeof window != "undefined" && window !== null && (CoffeeScript.load = function (a, b) {
            var c;
            c = new (window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP"), c.open("GET", a, !0), "overrideMimeType"in c && c.overrideMimeType("text/plain"), c.onreadystatechange = function () {
                var d;
                if (c.readyState === 4) {
                    if ((d = c.status) === 0 || d === 200)CoffeeScript.run(c.responseText); else throw new Error("Could not load " + a);
                    if (b)return b()
                }
            };
            return c.send(null)
        }, runScripts = function () {
            var a, b, c, d, e, f;
            f = document.getElementsByTagName("script"), a = function () {
                var a, b, c;
                c = [];
                for (a = 0, b = f.length; a < b; a++)e = f[a], e.type === "text/coffeescript" && c.push(e);
                return c
            }(), c = 0, d = a.length, (b = function () {
                var d;
                d = a[c++];
                if ((d != null ? d.type : void 0) === "text/coffeescript") {
                    if (d.src)return CoffeeScript.load(d.src, b);
                    CoffeeScript.run(d.innerHTML);
                    return b()
                }
            })();
            return null
        }, window.addEventListener ? addEventListener("DOMContentLoaded", runScripts, !1) : attachEvent("onload", runScripts))
    }).call(this)
};
return require["./coffee-script"]
}
()