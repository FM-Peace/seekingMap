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
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} unitId ユニットID
     * @param {number} value 視界値
     */
    p.registerUnitSight = function (x, y, unitId, value) {
        this._unitSightAssocArr[this._createUnitLayerArrKey(x, y, unitId)] = value;
    };

    /**
     * マップレイヤーの視界値を登録する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値
     */
    p.registerMapSight = function (x, y, value) {
        this._mapSightAssocArr[this._createAssocArrKey(x, y)] = value;
    };

    /**
     * ユニットレイヤーの視界値を取得する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} unitId ユニットID
     */
    p.getUnitSight = function (x, y, unitId) {
        return this._unitSightAssocArr[this._createUnitLayerArrKey(x, y, unitId)];
    };

    /**
     * マップレイヤーの視界値を取得する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    p.getMapSight = function (x, y) {
        return this._mapSightAssocArr[this._createAssocArrKey(x, y)];
    };

    /**
     * ユニットレイヤーの視界値を減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} unitId ユニットID
     * @param {number} value 視界値 
     */
    p.decreaseUnitSight = function (x, y, unitId, value) {
        var sight = this._unitSightAssocArr[this._createUnitLayerArrKey(x, y, unitId)];
        if (sight - value < 1) {
            this.deleteUnitSight(x, y, unitId);
        } else {
            this._unitSightAssocArr[this._createUnitLayerArrKey(x, y, unitId)] = sight - value;
        }
    };

    /**
     * マップレイヤーの視界値を減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値 
     */
    p.decreaseMapSight = function (x, y, value) {
        var sight = this._mapSightAssocArr[this._createAssocArrKey(x, y)];
        if (sight - value < 1) {
            this.deleteMapSight(x, y);
        } else {
            this._mapSightAssocArr[this._createAssocArrKey(x, y)] = sight - value;
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
                var args = key.split("_");
                this.deleteUnitSight(args[0], args[1], args[2]);
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
                var grids = key.split("_");
                this.deleteMapSight(grids[0], grids[1]);
            } else {
                this._mapSightAssocArr[key] = sight - value;
            }
        }
    };

    /**
     * ユニットレイヤーの視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} unitId ユニットID
     */
    p.deleteUnitSight = function (x, y, unitId) {
        delete this._unitSightAssocArr[this._createUnitLayerArrKey(x, y, unitId)];
    };

    /**
     * マップレイヤーの視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    p.deleteMapSight = function (x, y) {
        delete this._mapSightAssocArr[this._createAssocArrKey(x, y)];
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
     * マップレイヤーの視界値を全て削除する
     */
    p.deleteMapSightAll = function () {
        for (key in this._mapSightAssocArr) {
            delete this._mapSightAssocArr[key];
        }
    };

    /**
     * ユニットレイヤー、もしくはマップレイヤーに視界値が設定されているか
     * @param {*} x マップ上のx座標
     * @param {*} y マップ上のy座標
     */
    p.isVisible = function (x, y) {
        var key = this._createAssocArrKey(x, y);

        if (key in this._mapSightAssocArr) {
            return true;
        }

        for (unitLayerkey in this._unitSightAssocArr) {
            if (unitLayerkey.indexOf(key) === 0) {
                return true;
            }
        }

        return false;
    };

    /**
     * 連想配列のキーを作成する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    p._createAssocArrKey = function (x, y) {
        return x + '_' + y;
    };

    /**
     * ユニットレイヤー配列のキーを作成する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} unitId ユニットID
     */
    p._createUnitLayerArrKey = function (x, y, unitId) {
        return x + '_' + y + '_' + unitId;
    };
    return sightManager;
})();

// 単体テストを行うため、クラスをエクスポートする
// SRPG Studioはexportsが未定義なので、事前にundefinedチェックを行う
if (typeof exports !== 'undefined') {
    exports.SightManager = SightManager;
}