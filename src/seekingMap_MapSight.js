//---------------------------------
//マップの視界情報オブジェクト.
//作成者：FlatMountain
//---------------------------------

/**
 * マップの視界情報.
 */
var MapSight = defineObject(BaseObject, {
    _sightMapArray: [],

    /**
     * 初期化処理.
     */
    initialize: function () {
        this._sightMapArray = [];
        for (var i = 0; i < CurrentMap.getSize(); i++) {
            this._sightMapArray.push(0);
        }
    },

    /**
     * 指定インデックスの可視状態をチェック.
     * @param {number} index 対象のマップインデックス.
     * @return {boolean} 可視ならばtrue.
     */
    isVisibleIndex: function (index) {
        return this._sightMapArray[index] > 0;
    }
});