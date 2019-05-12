//---------------------------------
// 視界管理クラス群
// 作成者：FlatMountain
//---------------------------------

/**
 * 視界管理クラス.
 */
SightManager = (function () {
    var sightManager = function () {
        /**
         * ユニットレイヤーの視界管理用連想配列
         */
        this._unitSightAssocArr = {};
        /**
         * マップレイヤーの視界管理用連想配列
         */
        this._mapSightAssocArr = {};
    };

    var p = sightManager.prototype;

    /**
     * ユニットレイヤーの視界情報を登録する
     * @param {number} index マップ上のindex
     * @param {number} unitId ユニットID
     * @param {number} value 視界値
     */
    p.registerUnitSight = function (index, unitId, value) {
        this._unitSightAssocArr[this._createUnitLayerArrKey(index, unitId)] = value;
    };

    /**
     * マップレイヤーの視界値を登録する
     * @param {number} index マップ上のindex
     * @param {number} value 視界値
     */
    p.registerMapSight = function (index, value) {
        this._mapSightAssocArr[this._createAssocArrKey(index)] = value;
    };

    /**
     * ユニットレイヤーの視界値を取得する
     * @param {number} index マップ上のindex
     * @param {number} unitId ユニットID
     */
    p.getUnitSight = function (index, unitId) {
        return this._unitSightAssocArr[this._createUnitLayerArrKey(index, unitId)];
    };

    /**
     * マップレイヤーの視界値を取得する
     * @param {number} index マップ上のindex
     */
    p.getMapSight = function (index) {
        return this._mapSightAssocArr[this._createAssocArrKey(index)];
    };

    /**
     * ユニットレイヤーの視界値を減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} index マップ上のindex
     * @param {number} unitId ユニットID
     * @param {number} value 視界値 
     */
    p.decreaseUnitSight = function (index, unitId, value) {
        var sight = this._unitSightAssocArr[this._createUnitLayerArrKey(index, unitId)];
        if (sight - value < 1) {
            this.deleteUnitSight(index, unitId);
        } else {
            this._unitSightAssocArr[this._createUnitLayerArrKey(index, unitId)] = sight - value;
        }
    };

    /**
     * マップレイヤーの視界値を減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} index マップ上のindex
     * @param {number} value 視界値 
     */
    p.decreaseMapSight = function (index, value) {
        var sight = this._mapSightAssocArr[this._createAssocArrKey(index)];
        if (sight - value < 1) {
            this.deleteMapSight(index);
        } else {
            this._mapSightAssocArr[this._createAssocArrKey(index)] = sight - value;
        }
    };

    /**
     * ユニットレイヤーの視界値を全て減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} value 視界値
     */
    p.decreaseUnitSightAll = function (value) {
        for (key in this._unitSightAssocArr) {
            var sight = this._unitSightAssocArr[key];
            if (sight - value < 1) {
                var args = key.split('_');
                this.deleteUnitSight(args[0], args[1]);
            } else {
                this._unitSightAssocArr[key] = sight - value;
            }
        }
    };

    /**
     * マップレイヤーの視界値を全て減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} value 視界値
     */
    p.decreaseMapSightAll = function (value) {
        for (key in this._mapSightAssocArr) {
            var sight = this._mapSightAssocArr[key];
            if (sight - value < 1) {
                this.deleteMapSight(key);
            } else {
                this._mapSightAssocArr[key] = sight - value;
            }
        }
    };

    /**
     * ユニットレイヤーの視界値を削除する
     * @param {number} index マップ上のindex
     * @param {number} unitId ユニットID
     */
    p.deleteUnitSight = function (index, unitId) {
        delete this._unitSightAssocArr[this._createUnitLayerArrKey(index, unitId)];
    };

    /**
     * マップレイヤーの視界値を削除する
     * @param {number} index マップ上のindex
     */
    p.deleteMapSight = function (index) {
        delete this._mapSightAssocArr[this._createAssocArrKey(index)];
    };

    /**
     * ユニットレイヤーの視界値を全て削除する
     */
    p.deleteUnitSightAll = function () {
        for (key in this._unitSightAssocArr) {
            delete this._unitSightAssocArr[key];
        }
    };

    /**
     * ユニットレイヤーの特定ユニットIDの視界値を全て削除する
     */
    p.deleteUnitSightAllFromUnitId = function (unitId) {
        for (key in this._unitSightAssocArr) {
            var splitkeys = key.split('_');
            if (splitkeys[1] === String(unitId)) {
                delete this._unitSightAssocArr[key];
            }
        }
    };

    /**
     * マップレイヤーの視界値を全て削除する
     */
    p.deleteMapSightAll = function () {
        for (key in this._mapSightAssocArr) {
            delete this._mapSightAssocArr[key];
        }
    };

    /**
     * ユニットレイヤー、もしくはマップレイヤーに視界値が設定されているか
     * @param {number} index マップ上のindex
     */
    p.isVisible = function (index) {
        var key = this._createAssocArrKey(index);

        if (key in this._mapSightAssocArr) {
            return true;
        }

        for (unitLayerkey in this._unitSightAssocArr) {
            var splitkeys = unitLayerkey.split('_');
            if (splitkeys[0] === String(index)) {
                return true;
            }
        }

        return false;
    };

    /**
     * 連想配列のキーを作成する
     * @param {number} index マップ上のindex
     */
    p._createAssocArrKey = function (index) {
        return String(index);
    };

    /**
     * ユニットレイヤー配列のキーを作成する
     * @param {number} index マップ上のindex
     * @param {number} unitId ユニットID
     */
    p._createUnitLayerArrKey = function (index, unitId) {
        return index + '_' + unitId;
    };
    return sightManager;
})();

// 単体テストを行うため、クラスをエクスポートする
// SRPG Studioはexportsが未定義なので、事前にundefinedチェックを行う
if (typeof exports !== 'undefined') {
    exports.SightManager = SightManager;
}