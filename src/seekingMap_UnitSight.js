//---------------------------------
//視界情報オブジェクト.
//作成者：FlatMountain
//---------------------------------

/**
 * ユニットの視界描画情報.
 */
var UnitSightMapDrawInfo = {
    PLAYER: {
        color: 0x0000FF,
        alpha: 123
    },

    ENEMY: {
        color: 0xFF0000,
        alpha: 123
    },

    ALLY: {
        color: 0x00FF00,
        alpha: 123
    }
}


/**
 * 「ユニット全体の視界情報」のベースオブジェクト.
 */
var BaseUnitSight = defineObject(BaseObject, {
    _unitSightIndexArray: [],
    _simulator: null,

    /**
     * 視界情報を更新する.
     */
    updateUnitSightIndexArray: function () {
        var indexArray = this._getSimpleUnitSightArray();

        this._unitSightIndexArray = [];

        for (var i = 0; i < indexArray.length; i++) {
            var value = indexArray[i];
            if (indexArray.indexOf(value) == i) {
                this._unitSightIndexArray.push(indexArray[i]);
            }
        }
    },

    /**
     * 指定インデックスの可視状態をチェック.
     * @param {number} index 対象のマップインデックス.
     * @return {boolean} 可視ならばtrue.
     */
    isVisibleIndex: function (index) {
        for (var i = 0; i < this._unitSightIndexArray.length; i++) {
            if (index === this._unitSightIndexArray[i]) {
                return true;
            }
        }

        return false;
    },

    /**
     * ユニット全体の視界を描画する.
     */
    drawUnitSight: function () {
        if (this._isSightDrawable()) {
            root.drawFadeLight(this._unitSightIndexArray, this._getDrawInfo().color, this._getDrawInfo().alpha);
        }
    },

    /**
     * コースシミュレータを設定する.
     * @param {any} simulator コースシミュレータ.
     */
    setSimulator: function (simulator) {
        this._simulator = simulator;
    },

    /**
     * 重複を確認せずにユニット全体の視界を取得する.
     * @return {any[]} ユニット全体の視界.
     */
    _getSimpleUnitSightArray: function () {
        var indexArray = [];
        var unitList = this._getUnitList();

        for (var i = 0; i < unitList.getCount(); i++) {
            var unit = unitList.getData(i);
            this._simulator.startSimulationRange(unit.getMapX(), unit.getMapY(), 0, 3);

            var array = this._simulator.getSimulationIndexArray();
            for (var j = 0; j < array.length; j++) {
                indexArray.push(array[j]);
            }
        }

        return indexArray;
    },

    /**
     * 使用するユニットリストを取得.
     * @return {any} ユニットリスト.
     */
    _getUnitList: function () {
        return null;
    },

    /**
     * 使用する描画情報を取得する.
     * @return {any} 描画情報.
     */
    _getDrawInfo: function () {
        return null;
    },

    /**
     * 視界を描画可能かチェック.
     * @return {boolean} 描画可能ならばtrue.
     */
    _isSightDrawable: function () {
        return false;
    }
});

/**
 * 自軍全体の視界情報.
 */
var PlayerSight = defineObject(BaseUnitSight, {
    /**
     * 使用するユニットリストを取得.
     * @return {any} 出撃中で生存している自軍ユニットリスト.
     */
    _getUnitList: function () {
        return PlayerList.getSortieDefaultList();
    },

    /**
     * 使用する描画情報を取得する.
     * @return {any} 描画情報.
     */
    _getDrawInfo: function () {
        return UnitSightMapDrawInfo.PLAYER;
    },

    /**
     * 視界を描画可能かグローバルパラメータからチェック.
     * @return {boolean} 描画可能ならばtrue.
     */
    _isSightDrawable: function () {
        if (typeof root.getMetaSession().global.isUnitSightDrawable === 'undefined') {
            return false;
        }

        if (typeof root.getMetaSession().global.isUnitSightDrawable.PLAYER !== 'boolean') {
            return false;
        }

        return root.getMetaSession().global.isUnitSightDrawable.PLAYER;
    }
});

/**
 * 敵軍全体の視界情報.
 */
var EnemySight = defineObject(BaseUnitSight, {
    /**
     * 使用するユニットリストを取得.
     * @return {any} 生存している敵軍ユニットリスト.
     */
    _getUnitList: function () {
        return EnemyList.getAliveDefaultList();
    },

    /**
     * 使用する描画情報を取得する.
     * @return {any} 描画情報.
     */
    _getDrawInfo: function () {
        return UnitSightMapDrawInfo.ENEMY;
    },

    /**
     * 視界を描画可能かグローバルパラメータからチェック.
     * @return {boolean} 描画可能ならばtrue.
     */
    _isSightDrawable: function () {
        if (typeof root.getMetaSession().global.isUnitSightDrawable === 'undefined') {
            return false;
        }

        if (typeof root.getMetaSession().global.isUnitSightDrawable.ENEMY !== 'boolean') {
            return false;
        }

        return root.getMetaSession().global.isUnitSightDrawable.ENEMY;
    }
});

/**
 * 同盟軍全体の視界情報.
 */
var AllySight = defineObject(BaseUnitSight, {
    /**
     * 使用するユニットリストを取得.
     * @return {any} 生存している同盟軍ユニットリスト.
     */
    _getUnitList: function () {
        return AllyList.getAliveDefaultList();
    },

    /**
     * 使用する描画情報を取得する.
     * @return {any} 描画情報.
     */
    _getDrawInfo: function () {
        return UnitSightMapDrawInfo.ALLY;
    },

    /**
     * 視界を描画可能かグローバルパラメータからチェック.
     * @return {boolean} 描画可能ならばtrue.
     */
    _isSightDrawable: function () {
        if (typeof root.getMetaSession().global.isUnitSightDrawable === 'undefined') {
            return false;
        }

        if (typeof root.getMetaSession().global.isUnitSightDrawable.ALLY !== 'boolean') {
            return false;
        }

        return root.getMetaSession().global.isUnitSightDrawable.ALLY;
    }
});