//---------------------------------
// 不可視ユニット管理クラス
// 作成者：FlatMountain
//---------------------------------

/**
 * 不可視ユニット管理クラス
 */
InvisibleUnitManager = (function () {
    var invisibleUnitManager = function () {
        /**
         * 不可視ユニット管理用連想配列
         */
        this._invisibleUnitAssocArr = {};
    };

    var p = invisibleUnitManager.prototype;

    /**
     * 連想配列のキーを作成する
     * @param {number} unit ユニット
     */
    p._createAssocArrKey = function (unit) {
        var index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());
        return index + '_' + unit.getId();
    };

    /**
     * ユニットに不可視処理を行う
     * @param {any} unit
     */
    p.setUnitInvisible = function (unit) {
        var key = this._createAssocArrKey(unit);

        if (this._invisibleUnitAssocArr.hasOwnProperty(key)) {
            var invisibleCount = this._invisibleUnitAssocArr[key];
            this._invisibleUnitAssocArr[key] = invisibleCount + 1;
        } else {
            this._invisibleUnitAssocArr[key] = 1;
            unit.setInvisible(true);
        }
    }

    /**
     * ユニットに可視処理を行う
     * @param {any} unit
     */
    p.setUnitVisible = function (unit) {
        var key = this._createAssocArrKey(unit);

        if (!this._invisibleUnitAssocArr.hasOwnProperty(key)) {
            return;
        }

        var invisibleCount = this._invisibleUnitAssocArr[key];
        if (invisibleCount > 0) {
            this._invisibleUnitAssocArr[key] = invisibleCount - 1;
        }

        if (this._invisibleUnitAssocArr[key] === 0) {
            unit.setInvisible(false);
            delete this._invisibleUnitAssocArr[key];
        }
    }

    /**
     * マップ座標から不可視ユニットを取得する.
     * 存在しなければ、nullを返却する.
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    p.getInvisibleUnitIdFromPoint = function (x, y) {
        for (key in this._invisibleUnitAssocArr) {
            var splitKeys = key.split("_");
            if (splitKeys[0] == CurrentMap.getIndex(x, y)) {
                var unitId = parseInt(splitKeys[1]);
                return unitId;
            }
        }
        return -1;
    }

    return invisibleUnitManager;
})();

// 単体テストを行うため、クラスをエクスポートする
// SRPG Studioはexportsが未定義なので、事前にundefinedチェックを行う
if (typeof exports !== 'undefined') {
    exports.InvisibleUnitManager = InvisibleUnitManager;
}