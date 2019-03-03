//---------------------------------
// 視界管理クラステスト
// 作成者：FlatMountain
//---------------------------------

var expect = require('expect.js');
var source = require('../src/SightManager.js');

describe('初期化時は視界値が登録されていない', function () {
  it('初期化時はユニットレイヤーに視界値が登録されていない', function () {
    var sightManager = new source.SightManager();

    var keys = Object.keys(sightManager._unitSightAssocArr);
    expect(keys.length).to.be(1);
  });

  it('初期化時はマップレイヤーに視界値が登録されていない', function () {
    var sightManager = new source.SightManager();

    var keys = Object.keys(sightManager._mapSightAssocArr);
    expect(keys.length).to.be(0);
  });
});

describe('レイヤーのキーは「(x座標)_(y座標)」', function () {
  it('レイヤーのキーは「(x座標)_(y座標)」', function () {
    var sightManager = new source.SightManager();

    var key = sightManager._createAssocArrKey(1, 1);
    expect(key).to.be('1_1');
  });
});

describe('視界値の登録を行える', function () {
  it('ユニットレイヤーに視界値の登録を行える', function () {
    var sightManager = new source.SightManager();

    sightManager.registerUnitSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    expect(isRegistered).to.be(true);

    var value = sightManager._unitSightAssocArr['1_1'];
    expect(value).to.be(1);
  });

  it('マップレイヤーに視界値の登録を行える', function () {
    var sightManager = new source.SightManager();

    sightManager.registerMapSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    expect(isRegistered).to.be(true);

    var value = sightManager._mapSightAssocArr['1_1'];
    expect(value).to.be(1);
  });
});

describe('視界値の削除を行える', function () {
  it('ユニットレイヤーに視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;

    sightManager.deleteUnitSight(1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    expect(isRegistered).to.be(false);
  });

  it('マップレイヤーに視界値の削除を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;

    sightManager.deleteMapSight(1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    expect(isRegistered).to.be(false);
  });
});

describe('視界値の減算を行える', function () {
  it('ユニットレイヤーに視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 2;

    sightManager.subtractUnitSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    expect(isRegistered).to.be(true);

    var value = sightManager._unitSightAssocArr['1_1'];
    expect(value).to.be(1);
  });

  it('マップレイヤーに視界値の減算を行える', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 2;

    sightManager.subtractMapSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    expect(isRegistered).to.be(true);

    var value = sightManager._mapSightAssocArr['1_1'];
    expect(value).to.be(1);
  });

  it('ユニットレイヤーの視界値が0となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;

    sightManager.subtractUnitSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._unitSightAssocArr);
    expect(isRegistered).to.be(false);
  });

  it('マップレイヤーの視界値が0となった場合、視界値を削除する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;

    sightManager.subtractMapSight(1, 1, 1);

    var isRegistered = ('1_1' in sightManager._mapSightAssocArr);
    expect(isRegistered).to.be(false);
  });
});

describe('どちらかのレイヤーに視界値が登録されていれば、視界内と判定する', function () {
  it('ユニットレイヤーに視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;

    var isVisible = sightManager.isVisible(1, 1);
    expect(isVisible).to.be(true);
  });

  it('マップレイヤーに視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._mapSightAssocArr['1_1'] = 1;

    var isVisible = sightManager.isVisible(1, 1);
    expect(isVisible).to.be(true);
  });

  it('どちらのレイヤーにも視界値が登録されていれば、視界内と判定する', function () {
    var sightManager = new source.SightManager();

    sightManager._unitSightAssocArr['1_1'] = 1;
    sightManager._mapSightAssocArr['1_1'] = 1;

    var isVisible = sightManager.isVisible(1, 1);
    expect(isVisible).to.be(true);
  });

  it('どちらのレイヤーにも視界値が登録されていなければ、視界外と判定する', function () {
    var sightManager = new source.SightManager();

    var isVisible = sightManager.isVisible(1, 1);
    expect(isVisible).to.be(false);
  });
});