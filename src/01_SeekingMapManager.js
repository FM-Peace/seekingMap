//---------------------------------
// 索敵マップ管理クラス
// 作成者：FlatMountain
//---------------------------------

var SightMode = {
    NONE: 0,
    MIST: 1,
    DARK: 2
};

/**
 * 索敵マップ管理クラス.
 */
SeekingMapManager = (function () {
    var seekingMapManager = function () {
        /**
         * 自軍の視界管理クラス
         */
        this._playerSightManager = null;
        /**
         * 敵軍の視界管理クラス
         */
        this._enemySightManager = null;
        /**
         * 中立軍の視界管理クラス
         */
        this._allySightManager = null;

        /**
         * 自軍の視界管理クラス
         */
        this._playerInvisibleUnitManager = null;
        /**
         * 敵軍の視界管理クラス
         */
        this._enemyInvisibleUnitManager = null;
        /**
         * 中立軍の視界管理クラス
         */
        this._allyInvisibleUnitManager = null;
        /**
         * 視界範囲の計算用シミュレータ
         */
        this._simulator = null;

        /**
         * 索敵マップのタイプ
         */
        this._sightMode = SightMode.NONE;
    };

    var p = seekingMapManager.prototype;

    /**
     * シミュレータのsetter
     * @param {any} simulator シミュレータ
     */
    p.setSimulator = function (simulator) {
        this._simulator = simulator;
    };

    p.updateUnitSight = function (unit) {
        var unitType = unit.getUnitType();

        if (unitType === UnitType.PLAYER) {
            this._updateUnitSightMain(unit, this._playerSightManager);
        }

        if (unitType === UnitType.ENEMY) {
            this._updateUnitSightMain(unit, this._enemySightManager);
        }

        if (unitType === UnitType.ALLY) {
            this._updateUnitSightMain(unit, this._allySightManager);
        }
    };

    p._updateUnitSightMain = function (unit, sightManager) {
        var unitId = unit.getId();

        sightManager.deleteUnitSightAllFromUnitId(unitId);

        this._simulator.startSimulation(unit, 3);
        var indexArray = this._simulator.getSimulationIndexArray();
        for (var i = 0; i < indexArray.length; i++) {
            var index = indexArray[i];
            var sight = 3 - this._simulator.getSimulationMovePoint(index);

            sightManager.registerUnitSight(index, unitId, sight);
        };
    }

    p.isVisible = function (index, unitType) {
        if (unitType === UnitType.PLAYER) {
            return this._playerSightManager.isVisible(index);
        }
        if (unitType === UnitType.ENEMY) {
            return this._enemySightManager.isVisible(index);
        }
        if (unitType === UnitType.ALLY) {
            return this._allySightManager.isVisible(index);
        }

        return false;
    };

    p.isSightMode = function () {
        return this._sightMode !== SightMode.NONE;
    };

    p.startSightMode = function (sightMode) {
        this._sightMode = sightMode;

        this._playerSightManager = new SightManager();
        this._enemySightManager = new SightManager();
        this._allySightManager = new SightManager();

        this._playerInvisibleUnitManager = new InvisibleUnitManager();
        this._enemyInvisibleUnitManager = new InvisibleUnitManager();
        this._allyInvisibleUnitManager = new InvisibleUnitManager();

        this._simulator = root.getCurrentSession().createMapSimulator();
        this._simulator.disableMapUnit();
        this._simulator.disableTerrain();
        this._simulator.disableRestrictedPass();
    };

    p.endSightMode = function () {
        this._playerSightManager = null;
        this._enemySightManager = null;
        this._allySightManager = null;

        this._playerInvisibleUnitManager = null;
        this._enemyInvisibleUnitManager = null;
        this._allyInvisibleUnitManager = null;

        this._simulator = null;
    };

    return seekingMapManager;
})();

// 単体テストを行うため、クラスをエクスポートする
// SRPG Studioはexportsが未定義なので、事前にundefinedチェックを行う
if (typeof exports !== 'undefined') {
    exports.SeekingMapManager = SeekingMapManager;
}