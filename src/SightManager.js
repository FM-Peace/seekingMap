//---------------------------------
// 視界管理クラス群
// 作成者：FlatMountain
//---------------------------------

/**
 * 「視界管理クラス」の基底クラス.
 */
var BaseSightManager = defineObject(BaseObject, {
    /**
     * ユニットレイヤーの視界管理用連想配列
     */
    _unitSightAssocArr: {},
    /**
     * マップレイヤーの視界管理用連想配列
     */
    _mapSightAssocArr: {},
    /**
     * 視界範囲の計算用シミュレータ
     */
    _simulator: null,

    /**
     * ユニットレイヤーの視界情報を登録する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値
     */
    registerUnitSight: function(x, y, value){
        this._unitSightAssocArr[this._createAssocArrKey(x, y)] = value;
    },

    /**
     * マップレイヤーの視界値を登録する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値
     */
    registerMapSight: function(x, y, value){
        this._mapSightAssocArr[this._createAssocArrKey(x, y)] = value;
    },

    /**
     * ユニットレイヤーの視界値を減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値 
     */
    subtractUnitSight:function(x,y,value){
        var sight = this._unitSightAssocArr[this._createAssocArrKey(x, y)];
        if (sight - value < 1){
            deleteUnitSight(x, y);            
        }else{
            this._unitSightAssocArr[this._createAssocArrKey(x, y)] = sight - value;
        }
    },
    
    /**
     * マップレイヤーの視界値を減算する.減算後の視界値が0の場合,視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     * @param {number} value 視界値 
     */
    subtractMapSight:function(x,y,value){
        var sight = this._mapSightAssocArr[this._createAssocArrKey(x, y)];
        if (sight - value < 1){
            deleteMapSight(x, y);            
        }else{
            this._mapSightAssocArr[this._createAssocArrKey(x, y)] = sight - value;
        }
    },

    /**
     * ユニットレイヤーの視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    deleteUnitSight: function(x, y){
        delete this._unitSightAssocArr[this._createAssocArrKey(x, y)];
    },

    /**
     * マップレイヤーの視界値を削除する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    deleteMapSight: function(x, y){
        delete this._mapSightAssocArr[this._createAssocArrKey(x, y)];
    },

    /**
     * ユニットレイヤー、もしくはマップレイヤーに視界値が設定されているか
     * @param {*} x マップ上のx座標
     * @param {*} y マップ上のy座標
     */
    isVisible: function(x, y){
        var key = this._createAssocArrKey(x, y);

        return (key in this._unitSightAssocArr)||(key in this._mapSightAssocArr)
    },

    /**
     * 連想配列のキーを作成する
     * @param {number} x マップ上のx座標
     * @param {number} y マップ上のy座標
     */
    _createAssocArrKey: function(x, y){
        return x + '_' + y;
    }
});