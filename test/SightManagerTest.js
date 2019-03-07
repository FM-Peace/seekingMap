//---------------------------------
// 視界管理クラステスト
// 作成者：FlatMountain
//---------------------------------

var assert = require('power-assert');
var source = require('../src/SightManager.js');

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
  it('キー(x座標)_(y座標)を作成できる', function () {
    var sightManager = new source.SightManager();

    var key = sightManager._createAssocArrKey(1, 1);
    assert.strictEqual(key, '1_1');
  });

  // レイヤーに視界値の登録を行える
  it('ユニットレイヤーに視界値の登録を行える', function () {
    var sightManager = new source.SightManager();

    sightManager.registerUnitSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._unitSightAssocArr['1_1'];
    assert.strictEqual(value, 1);
  });
  it('マップレイヤーに視界値の登録を行える', function () {
    var sightManager = new source.SightManager();

    sightManager.registerMapSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._mapSightAssocArr['1_1'];
    assert.strictEqual(value, 1);
  });

  // レイヤーから視界値の削除を行える
  it('ユニットレイヤーから視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;

    sightManager.deleteUnitSight(1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });

  it('マップレイヤーから視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;

    sightManager.deleteMapSight(1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });

  // レイヤーに視界値の減算を行える。値の減算時に0となった場合、視界値を削除する
  it('ユニットレイヤーに視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 2;

    sightManager.decreaseUnitSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._unitSightAssocArr['1_1'];
    assert.strictEqual(value, 1);
  });
  it('ユニットレイヤーの視界値が0以下となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;

    sightManager.decreaseUnitSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });
  it('マップレイヤーに視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 2;

    sightManager.decreaseMapSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._mapSightAssocArr['1_1'];
    assert.strictEqual(value, 1);
  });
  it('マップレイヤーの視界値が0以下となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;

    sightManager.decreaseMapSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);
  });

  // 両方のレイヤーのうち、どちらかに視界値が存在すれば視界内と判定する
  it('ユニットレイヤーに視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;

    var isVisible = sightManager.isVisible(1, 1);
    assert.strictEqual(isVisible, true);
  });

  it('マップレイヤーに視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;

    var isVisible = sightManager.isVisible(1, 1);
    assert.strictEqual(isVisible, true);
  });

  it('どちらのレイヤーにも視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;
    sightManager._mapSightAssocArr['1_1'] = 1;

    var isVisible = sightManager.isVisible(1, 1);
    assert.strictEqual(isVisible, true);
  });

  it('どちらのレイヤーにも視界値が登録されていなければ、視界外と判定する', function () {
    var sightManager = new source.SightManager();

    var isVisible = sightManager.isVisible(1, 1);
    assert.strictEqual(isVisible, false);
  });

  // レイヤーから一括で視界値の削除を行える
  it('ユニットレイヤーから一括で視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;
    sightManager._unitSightAssocArr['1_2'] = 1;

    sightManager.deleteUnitSightAll();

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr)
    assert.strictEqual(isRegistered, false);

    isRegistered = ('1_2' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);

    var keys = Object.keys(sightManager._unitSightAssocArr);
    var length = keys.length;
    assert.strictEqual(length, 0);
  });
  it('マップレイヤーから一括で視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;
    sightManager._mapSightAssocArr['1_2'] = 1;

    sightManager.deleteMapSightAll();

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr)
    assert.strictEqual(isRegistered, false);

    isRegistered = ('1_2' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);

    var keys = Object.keys(sightManager._mapSightAssocArr);
    var length = keys.length;
    assert.strictEqual(length, 0);
  });

  // レイヤーに一括で視界値の減算を行える。値の減算時に0となった場合、視界値を削除する
  it('ユニットレイヤーから一括で視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 2;
    sightManager._unitSightAssocArr['1_2'] = 2;

    sightManager.decreaseUnitSightAll(1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);
    isRegistered = ('1_2' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._unitSightAssocArr['1_1'];
    assert.strictEqual(value, 1);
    value = sightManager._unitSightAssocArr['1_2'];
    assert.strictEqual(value, 1);
  });
  it('マップレイヤーから一括で視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 2;
    sightManager._mapSightAssocArr['1_2'] = 2;

    sightManager.decreaseMapSightAll(1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);
    isRegistered = ('1_2' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, true);

    var value = sightManager._mapSightAssocArr['1_1'];
    assert.strictEqual(value, 1);
    value = sightManager._mapSightAssocArr['1_2'];
    assert.strictEqual(value, 1);
  });
  it('ユニットレイヤーの視界値が0となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;
    sightManager._unitSightAssocArr['1_2'] = 1;

    sightManager.decreaseUnitSightAll(1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, false);
    isRegistered = ('1_2' in sightManager._unitSightAssocArr);
    assert.strictEqual(isRegistered, false);

    var keys = Object.keys(sightManager._mapSightAssocArr);
    var length = keys.length;
    assert.strictEqual(length, 0);
  });
  it('マップレイヤーの視界値が0となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;
    sightManager._mapSightAssocArr['1_2'] = 1;

    sightManager.decreaseMapSightAll(1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);
    isRegistered = ('1_2' in sightManager._mapSightAssocArr);
    assert.strictEqual(isRegistered, false);

    var keys = Object.keys(sightManager._mapSightAssocArr);
    var length = keys.length;
    assert.strictEqual(length, 0);
  });
});