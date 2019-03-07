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
        return unit.getMapX() + '_' + unit.getMapY() + '_' + unit.getId();
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
    return invisibleUnitManager;
})();

// 単体テストを行うため、クラスをエクスポートする
// SRPG Studioはexportsが未定義なので、事前にundefinedチェックを行う
if (typeof exports !== 'undefined') {
    exports.InvisibleUnitManager = InvisibleUnitManager;
}