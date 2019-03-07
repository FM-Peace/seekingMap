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
        /**
         * 視界範囲の計算用シミュレータ
         */
        this._simulator = null;
    };

    var p = sightManager.prototype;

    /**
     * ユニットレイヤーの視界情報を登録する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値
     */
    p.registerUnitSight = function (x, y, value) {
        this._unitSightAssocArr[this._createAssocArrKey(x, y)] = value;
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
     * ユニットレイヤーの視界値を減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値 
     */
    p.decreaseUnitSight = function (x, y, value) {
        var sight = this._unitSightAssocArr[this._createAssocArrKey(x, y)];
        if (sight - value < 1) {
            this.deleteUnitSight(x, y);
        } else {
            this._unitSightAssocArr[this._createAssocArrKey(x, y)] = sight - value;
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
                var grids = key.split("_");
                this.deleteUnitSight(grids[0], grids[1]);
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
     */
    p.deleteUnitSight = function (x, y) {
        delete this._unitSightAssocArr[this._createAssocArrKey(x, y)];
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
     * ユニットレイヤーの視界値を全て削除する
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

        return (key in this._unitSightAssocArr) || (key in this._mapSightAssocArr)
    };

    /**
     * 連想配列のキーを作成する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    p._createAssocArrKey = function (x, y) {
        return x + '_' + y;
    };

    return sightManager;
})();

// 単体テストを行うため、クラスをエクスポートする
// SRPG Studioはexportsが未定義なので、事前にundefinedチェックを行う
if (typeof exports !== 'undefined') {
    exports.SightManager = SightManager;
}