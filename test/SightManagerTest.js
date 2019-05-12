//---------------------------------
// 視界管理クラステスト
// 作成者：FlatMountain
//---------------------------------

var assert = require('power-assert');
var source = require('../src/SightManager.js');

/**
 * モックマップ
 */
var CurrentMapMock = (function () {
  var currentMap = function () {
  };

  var p = currentMap.prototype;

  p._width = 2;
  p._height = 2;

  p.getIndex = function (x, y) {
      return (y * this._width) + x;
  };

  return currentMap;
})();

CurrentMap = new CurrentMapMock();

describe('視界管理クラステスト', function () {
  // 初期条件チェック
  it('初期化時はユニットレイヤーに視界値が登録されていない', function () {
    var sightManager = new source.SightManager();

    var keys = Object.keys(sightManager._unitSightAssocArr);
    assert.strictEqual(keys.length, 0);
  });
  it('初期化時はマップレイヤーに視界値が登録されていない', function () {
    var sightManager = new source.SightManager();

    var keys = Object.keys(sightManager._mapSightAssocArr);
    assert.strictEqual(keys.length, 0);
  });

  // キー作成テスト
  it('キー(index)を作成できる', function () {
    var sightManager = new source.SightManager();

    var key = sightManager._createAssocArrKey(0);
    assert.strictEqual(key, '0');
  });

  it('キー(index)_(ユニットID)を作成できる', function () {
    var sightManager = new source.SightManager();

    var key = sightManager._createUnitLayerArrKey(0, 1);
    assert.strictEqual(key, '0_1');
  });

  // レイヤーに視界値の登録を行える
  it('ユニットレイヤーに視界値の登録を行える', function () {
    var sightManager = new source.SightManager();

    sightManager.registerUnitSight(0, 1, 1);

    var isRegistered = ('0_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._unitSightAssocArr['0_1'];
    assert.strictEqual(value, 1);
  });
  it('マップレイヤーに視界値の登録を行える', function () {
    var sightManager = new source.SightManager();

    sightManager.registerMapSight(0, 1);

    var isRegistered = ('0' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._mapSightAssocArr['0'];
    assert.strictEqual(value, 1);
  });

  // レイヤーから視界値を取得できる
  it('ユニットレイヤーから視界値を取得できる', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;

    var sight = sightManager.getUnitSight(0, 1);
    assert.strictEqual(sight, 1);
  });
  it('マップレイヤーから視界値を取得できる', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 1;

    var sight = sightManager.getMapSight(0);
    assert.strictEqual(sight, 1);
  });

  // レイヤーから視界値の削除を行える
  it('ユニットレイヤーから視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;

    sightManager.deleteUnitSight(0, 1);

    var isRegistered = ('0_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });

  it('マップレイヤーから視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 1;

    sightManager.deleteMapSight(0);

    var isRegistered = ('0' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });

  // レイヤーに視界値の減算を行える。値の減算時に0となった場合、視界値を削除する
  it('ユニットレイヤーに視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 2;

    sightManager.decreaseUnitSight(0, 1, 1);

    var isRegistered = ('0_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._unitSightAssocArr['0_1'];
    assert.strictEqual(value, 1);
  });
  it('ユニットレイヤーの視界値が0以下となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;

    sightManager.decreaseUnitSight(0, 1, 1);

    var isRegistered = ('0_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });
  it('マップレイヤーに視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 2;

    sightManager.decreaseMapSight(0, 1);

    var isRegistered = ('0' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._mapSightAssocArr['0'];
    assert.strictEqual(value, 1);
  });
  it('マップレイヤーの視界値が0以下となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 1;

    sightManager.decreaseMapSight(0, 1);

    var isRegistered = ('0' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });

  // 両方のレイヤーのうち、どちらかに視界値が存在すれば視界内と判定する
  it('ユニットレイヤーに視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;

    var isVisible = sightManager.isVisible(0);
    assert.strictEqual(isVisible, true);
  });

  it('マップレイヤーに視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 1;

    var isVisible = sightManager.isVisible(0);
    assert.strictEqual(isVisible, true);
  });

  it('どちらのレイヤーにも視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;
    sightManager._mapSightAssocArr['0'] = 1;

    var isVisible = sightManager.isVisible(0);
    assert.strictEqual(isVisible, true);
  });

  it('どちらのレイヤーにも視界値が登録されていなければ、視界外と判定する', function () {
    var sightManager = new source.SightManager();

    var isVisible = sightManager.isVisible(0);
    assert.strictEqual(isVisible, false);
  });

  // レイヤーから一括で視界値の削除を行える
  it('ユニットレイヤーから一括で視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;
    sightManager._unitSightAssocArr['0_2'] = 1;

    sightManager.deleteUnitSightAll();

    var isRegistered = ('0_1' in sightManager._mapSightAssocArr)
    assert.strictEqual(isRegistered, false);

    isRegistered = ('0_2' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);

    var keys = Object.keys(sightManager._unitSightAssocArr);
    var length = keys.length;
    assert.strictEqual(length, 0);
  });
  it('ユニットレイヤーからユニットIDを基に一括で視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;
    sightManager._unitSightAssocArr['0_2'] = 1;

    sightManager.deleteUnitSightAllFromUnitId(1);

    var isRegistered = ('0_1' in sightManager._unitSightAssocArr)
    assert.strictEqual(isRegistered, false);

    isRegistered = ('0_2' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);
  });
  it('マップレイヤーから一括で視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 1;
    sightManager._mapSightAssocArr['1'] = 1;

    sightManager.deleteMapSightAll();

    var isRegistered = ('0' in sightManager._mapSightAssocArr)
    assert.strictEqual(isRegistered, false);

    isRegistered = ('1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);

    var keys = Object.keys(sightManager._mapSightAssocArr);
    var length = keys.length;
    assert.strictEqual(length, 0);
  });

  // レイヤーに一括で視界値の減算を行える。値の減算時に0となった場合、視界値を削除する
  it('ユニットレイヤーから一括で視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 2;
    sightManager._unitSightAssocArr['0_2'] = 2;

    sightManager.decreaseUnitSightAll(1);

    var isRegistered = ('0_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);
    isRegistered = ('0_2' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._unitSightAssocArr['0_1'];
    assert.strictEqual(value, 1);
    value = sightManager._unitSightAssocArr['0_2'];
    assert.strictEqual(value, 1);
  });
  it('ユニットレイヤーの視界値が0となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['0_1'] = 1;
    sightManager._unitSightAssocArr['0_2'] = 2;

    sightManager.decreaseUnitSightAll(1);

    var isRegistered = ('0_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, false);
    isRegistered = ('0_2' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);

    value = sightManager._unitSightAssocArr['0_2'];
    assert.strictEqual(value, 1);
  });
  it('マップレイヤーから一括で視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 2;
    sightManager._mapSightAssocArr['1'] = 2;

    sightManager.decreaseMapSightAll(1);

    var isRegistered = ('0' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);
    isRegistered = ('1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._mapSightAssocArr['0'];
    assert.strictEqual(value, 1);
    value = sightManager._mapSightAssocArr['1'];
    assert.strictEqual(value, 1);
  });

  it('マップレイヤーの視界値が0となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['0'] = 1;
    sightManager._mapSightAssocArr['1'] = 2;

    sightManager.decreaseMapSightAll(1);

    var isRegistered = ('0' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);
    isRegistered = ('1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);

    value = sightManager._mapSightAssocArr['1'];
    assert.strictEqual(value, 1);
  });
});