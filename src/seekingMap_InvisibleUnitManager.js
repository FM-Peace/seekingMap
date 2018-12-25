//-------------------------------------------------------
// 不可視ユニットに関する処理
// 作成者：FlatMountain
//-------------------------------------------------------

/**
 * 不可視ユニットに関する処理のベースオブジェクト.
 */
var BaseInvisibleUnitManager = defineObject(BaseObject, {
    /**
     * 索敵マップ上で指定箇所にユニットが存在するかチェック.
     * @param {number} x X座標.
     * @param {number} y Y座標.
     * @return {boolean} ユニットが存在すればtrue.
     */
    isExistInvisibleUnit: function (x, y) {
        if (!SeekingMapManager.isSeekingMap()) {
            return PosChecker.getUnitFromPos(x, y) !== null;
        }

        var unitArray = this._getUnitArray();

        for (var i = 0; i < unitArray.length; i++) {
            var unit = unitArray[i];

            if (unit.getMapX() === x && unit.getMapY() === y) {
                return true;
            }
        }

        return false;
    },

    /**
     * 索敵マップ上で不可視のユニットリストを取得.
     * @return {any[]} 不可視のユニットリスト.
     */
    getInvisibleUnitList: function () {
        var unitArray = this._getUnitArray();
        var list = [];

        for (var i = 0; i < unitArray.length; i++) {
            var unit = unitArray[i];

            if (unit.isInvisible()) {
                continue;
            }

            var index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());

            if (this._isInvisiblePanel(index)) {
                list.push(unit);
            }
        }

        return list;
    },

    _getUnitArray: function () {
        return null;
    },

    _isInvisiblePanel: function (index) {
        return false;
    }
});

var PlayerInvisibleUnitManager = defineObject(BaseInvisibleUnitManager, {
    _getUnitArray: function () {
        var array = [];

        for (var i = 0; i < EnemyList.getAliveDefaultList().getCount(); i++) {
            array.push(EnemyList.getAliveDefaultList().getData(i));
        }

        for (var i = 0; i < AllyList.getAliveDefaultList().getCount(); i++) {
            array.push(AllyList.getAliveDefaultList().getData(i));
        }

        return array;
    },

    _isInvisiblePanel: function (index) {
        return SeekingMapManager.isInvisiblePanel(index, UnitType.PLAYER);
    }
});

var EnemyInvisibleUnitManager = defineObject(BaseInvisibleUnitManager, {
    _getUnitArray: function () {
        var array = [];

        for (var i = 0; i < PlayerList.getSortieDefaultList().getCount(); i++) {
            array.push(PlayerList.getSortieDefaultList().getData(i));
        }

        for (var i = 0; i < AllyList.getAliveDefaultList().getCount(); i++) {
            array.push(AllyList.getAliveDefaultList().getData(i));
        }

        return array;
    },

    _isInvisiblePanel: function (index) {
        return SeekingMapManager.isInvisiblePanel(index, UnitType.ENEMY);
    }
});

var AllyInvisibleUnitManager = defineObject(BaseInvisibleUnitManager, {
    _getUnitArray: function () {
        var array = [];

        for (var i = 0; i < PlayerList.getSortieDefaultList().getCount(); i++) {
            array.push(PlayerList.getSortieDefaultList().getData(i));
        }

        for (var i = 0; i < EnemyList.getAliveDefaultList().getCount(); i++) {
            array.push(EnemyList.getAliveDefaultList().getData(i));
        }

        return array;
    },

    _isInvisiblePanel: function (index) {
        return SeekingMapManager.isInvisiblePanel(index, UnitType.ALLY);
    }
});