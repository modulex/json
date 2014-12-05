/*global global*/
/*jshint camelcase:false*/
var Json = require('json');
/*global JSON:true*/
var JSON = ((typeof global === 'object') ? global : window).JSON;

var phantomjs = !!window.callPhantom;

describe('json', function () {
  describe('stringify', function () {
    it('should escape " in property name and value', function () {
      var x = {
        '"z"': '"q"'
      };
      var ret = Json.stringify(x);
      expect(ret).to.equal('{"\\"z\\"":"\\"q\\""}');
      var obj = Json.parse(ret);
      ret = Json.stringify(obj);
      expect(ret).to.equal('{"\\"z\\"":"\\"q\\""}');
    });

    it('should convert an arbitrary value to a Json string representation', function () {
      expect(Json.stringify({'a': true})).to.equal('{"a":true}');
      expect(Json.stringify(true)).to.equal('true');
      expect(Json.stringify(null)).to.equal('null');
      // ie8 native json will be 'undefined'
      expect(Json.stringify(undefined)).to.equal(undefined);
      expect(Json.stringify(NaN)).to.equal('null');
      if (JSON) {
        expect(Json.stringify({'a': true})).to.equal(JSON.stringify({'a': true}));
        expect(Json.stringify(true)).to.equal(JSON.stringify(true));
        expect(Json.stringify(null)).to.equal(JSON.stringify(null));
        // special number
        expect(Json.stringify(NaN)).to.equal(JSON.stringify(NaN));
        expect(Json.stringify(Infinity)).to.equal(JSON.stringify(Infinity));
      }
    });

    describe('indent', function () {
      it('string works for object', function () {
        var gap = ' ';
        var space = ' ';
        var ret = Json.stringify({
          'a': {
            b: 1
          }
        }, null, gap);

        expect(ret).to.equal('{\n' +
        gap +
        '"a":' + space + '{\n' +
        gap + gap + '"b":' + space + '1\n' +
        gap + '}' +
        '\n}');

        if (JSON) {
          expect(ret).to.equal(JSON.stringify({
            'a': {
              b: 1
            }
          }, null, gap));
        }
      });

      it('string works for array', function () {
        var gap = ' ';
        var space = ' ';

        var ret = Json.stringify({
          'a': [1]
        }, null, gap);

        expect(ret).to.equal('{\n' +
        gap +
        '"a":' + space + '[\n' +
        gap + gap + '1\n' +
        gap + ']' +
        '\n}');

        if (JSON) {
          expect(ret).to.equal(JSON.stringify({
            'a': [1]
          }, null, gap));
        }
      });

      it('number works for object', function () {
        var gap = '  ';
        var space = ' ';
        var ret = Json.stringify({
          'a': {
            b: 1
          }
        }, null, 2);

        expect(ret).to.equal('{\n' +
        gap +
        '"a":' + space + '{\n' +
        gap + gap + '"b":' + space + '1\n' +
        gap + '}' +
        '\n}');

        if (JSON) {
          expect(ret).to.equal(JSON.stringify({
            'a': {
              b: 1
            }
          }, null, 2));
        }
      });

      it('string works for array', function () {
        var gap = '  ';
        var space = ' ';

        var ret = Json.stringify({
          'a': [1]
        }, null, 2);

        expect(ret).to.equal('{\n' +
        gap +
        '"a":' + space + '[\n' +
        gap + gap + '1\n' +
        gap + ']' +
        '\n}');

        if (JSON) {
          expect(ret).to.equal(JSON.stringify({
            'a': [1]
          }, null, 2));
        }
      });
    });

    describe('replacer', function () {
      it('works for object', function () {
        var gap = '  ';
        var space = ' ';
        var ret = Json.stringify({
          'a': {
            b: {
              z: 1
            }
          }
        }, function (key, value) {
          if (key === 'b') {
            expect(value.z).to.equal(1);
            return 1;
          }
          return value;
        }, 2);

        expect(ret).to.equal('{\n' +
        gap +
        '"a":' + space + '{\n' +
        gap + gap + '"b":' + space + '1\n' +
        gap + '}' +
        '\n}');

        if (JSON) {
          expect(ret).to.equal(JSON.stringify({
            'a': {
              b: {
                z: 1
              }
            }
          }, function (key, value) {
            if (key === 'b') {
              expect(value.z).to.equal(1);
              return 1;
            }
            return value;
          }, 2));
        }
      });

      if (JSON && !phantomjs) {
        it('string works for array', function () {
          var gap = '  ';
          var space = ' ';

          var ret = Json.stringify({
            'a': [
              {
                z: 1
              }
            ]
          }, function (key, value) {
            if (key === '0') {
              expect(value.z).to.equal(1);
              return 1;
            }
            return value;
          }, 2);

          expect(ret).to.equal('{\n' +
          gap +
          '"a":' + space + '[\n' +
          gap + gap + '1\n' +
          gap + ']' +
          '\n}');


          expect(ret).to.equal(JSON.stringify({
            'a': [
              {
                z: 1
              }
            ]
          }, function (key, value) {
            // ie8 will be int
            if (String(key) === '0') {
              expect(value.z).to.equal(1);
              return 1;
            }
            return value;
          }, 2));
        });
      }
    });
  });

  describe('parse', function () {
    it('works for escaped slash', function () {
      var data = '"\\/"';
      expect(Json.parse(data)).to.equal('/');
      data = '"\\\\"';
      expect(Json.parse(data)).to.equal('\\');
    });

    it('can parse false', function () {
      expect(Json.parse('{"a":[{"a":null,"c":false}]}')).to.eql({"a": [{"a": null, "c": false}]});
    });

    it('works for xiami', function () {
      var data = '{"data":{"room_id":6252,' +
        '"content":"<a class=\\"nick-name\\" target=\\"_blank\\" ' +
        'href=\\"http://www.xiami.com/u/6252\\">iburning</a> 收到 <a class=\'nick-name\' ' +
        'href=\'http://www.xiami.com/u/2412\' target=\'_blank\'>红茶盗用</a> 的鲜花 ",' +
        '"since_id":"1393494716.25127100","user_id":2412,"type":1,"songs":null,"role":2},' +
        '"event2":"sysRoomMessage"} ';

      expect(Json.parse(data).data.since_id).to.equal('1393494716.25127100');
    });

    it('allow whitespace', function () {
      var t = '{"test": 1,"t":2}',
        r = {test: 1, t: 2};
      expect(Json.parse(t)).to.deep.equal(r);
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
    });

    it('works for array', function () {
      var t = '{"test":["t1","t2"]}',
        r = {test: ['t1', 't2']};
      expect(Json.parse(t)).to.deep.equal(r);
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
    });

    it('should throw exception when encounter non-whitespace', function () {
      var t = '{"x": x"2"}';
      expect(function () {
        Json.parse(t);
      }).to.throw();
      if (JSON) {
        expect(function () {
          JSON.parse(t);
        }).to.throw();
      }
    });

    it('should parse a Json string to the native JavaScript representation', function () {
      var r, t;
      expect(Json.parse(t = '{"test":1}')).to.deep.equal(r = {test: 1});
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
      expect(Json.parse(t = '{}')).to.deep.equal(r = {});
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
      expect(Json.parse(t = '\n{"test":1}')).to.deep.equal(r = {test: 1}); // 去除空白
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
      expect(Json.parse(t = null)).to.equal(r = null);
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
      expect(Json.parse(t = 'true')).to.equal(r = true);
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
      expect(Json.parse(t = true)).to.equal(r = true);
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
      expect(Json.parse(t = 'null')).to.equal(r = null);
      if (JSON) {
        expect(JSON.parse(t)).to.deep.equal(r);
      }
      expect(
        function () {
          Json.parse(t = '{a:1}');
        }).to.throw();
      if (JSON) {
        expect(
          function () {
            Json.parse(t);
          }).to.throw();
      }
    });

    it('reviver works', function () {
      var t, f, r;
      expect(Json.parse(t = '{"test": 1,"t":2}', f = function (key, v) {
        if (key === 't') {
          return v + 1;
        }
        return v;
      })).to.deep.equal(r = {test: 1, t: 3});
      if (JSON) {
        expect(JSON.parse(t, f)).to.deep.equal(r);
      }

      expect(Json.parse(t = '{"test": 1,"t":2}', f = function (key, v) {
        if (key === 't') {
          return undefined;
        }
        return v;
      })).to.deep.equal(r = {test: 1});
      if (JSON) {
        expect(JSON.parse(t, f)).to.deep.equal(r);
      }

      expect(Json.parse(t = '{"test": {"t":{ "t3":4},"t2":4}}', f = function (key, v) {
        if (key === 't') {
          return 1;
        }
        if (key === 't2') {
          return v + 1;
        }
        return v;
      })).to.deep.equal(r = {
          test: {
            t: 1,
            t2: 5
          }
        });
      if (JSON) {
        expect(JSON.parse(t, f)).to.deep.equal(r);
      }
    });

    // phantomjs allow \t
    it('should throw exception when encounter control character', function () {
      var t;
      expect(function () {
        Json.parse(t = '{"x":"\t"}');
      }).to.throw();
      if (JSON && !phantomjs) {
        expect(
          function () {
            Json.parse(t);
          }).to.throw();
      }
    });
  });
});
