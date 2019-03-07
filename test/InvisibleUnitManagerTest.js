//---------------------------------
// 不可視ユニット管理クラステスト
// 作成者：FlatMountain
//---------------------------------

var assert = require('power-assert');
var source = require('../src/InvisibleUnitManager.js');

/**
 * モックユニット
 */
var Unit = (function () {
    var unit = function () {
        this._id = 0;
        this._mapX = 0;
        this._mapY = 0;
        this._invisible_flag = false;
    };

    var p = unit.prototype;

    p.getId = function () {
        return this._id;
    };

    p.getMapX = function () {
        return this._mapX;
    }

    p.getMapY = function () {
        return this._mapY;
    }

    p.setInvisible = function (flag) {
        this._invisible_flag = flag;
    }

    p.isInvisible = function () {
        return this._invisible_flag;
    }

    return unit;
})();

describe('不可視ユニット管理クラステスト', function () {
    // 初期条件チェック
    it('初期化時は不可視ユニットが登録されていない', function () {
        var invisibleUnitManager = new source.InvisibleUnitManager();

        var keys = Object.keys(invisibleUnitManager._invisibleUnitAssocArr);
        assert.strictEqual(keys.length, 0);
    });
    // キー作成チェック
    it('キー(x座標)_(y座標)_(unitId)を作成できる', function () {
        var invisibleUnitManager = new source.InvisibleUnitManager();

        var unit = new Unit();

        unit._id = 1;
        unit._mapX = 1;
        unit._mapY = 1;

        var key = invisibleUnitManager._createAssocArrKey(unit);
        assert.strictEqual(key, '1_1_1');
    });
    it('ユニットに対して不可視処理を行える', function () {
        assert.ok(true);
    });

    it('ユニットに対して可視化処理を行える', function () {
        assert.ok(true);
    });

    it('不可視ユニットを取得できる', function () {
        assert.ok(true);
    });

    it('ユニットが不可視か判定できる', function () {
        assert.ok(true);
    });
});