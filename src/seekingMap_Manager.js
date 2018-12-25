//---------------------------------
//索敵マップ処理のメイン処理.
//作成者：FlatMountain
//---------------------------------

var SeekingMapDrawInfo = {
    MIST: {
        color: 0xffffff,
        alpha: 123
    },
    DARK: {
        color: 0x000000,
        alpha: 123
    }
};

/**
 * 索敵マップの全体的な処理を管理する.
 */
var SeekingMapManager = {
    _mapSight: null,
    _unitSightArray: [],
    _invisibleUnitManagerArray: [],
    _drawInfo: null,
    _simulator: null,
    _forcedWaitUnit: null,

    /**
     * 初期化処理.
     */
    initializeMapData: function () {
        this._prepareMapData();

        this._completeMapData();
    },

    /**
     * 対象のマップインデックスが不可視パネルかどうかチェックする.
     * @param {number} index 対象のマップインデックス
     * @param {number} unitType チェック元ユニット種別.
     * @return 不可視パネルならばtrue
     */
    isInvisiblePanel: function (index, unitType) {
        if (!this.isSeekingMap()) {
            return false;
        }

        if (this._unitSightArray[unitType].isVisibleIndex(index)) {
            return false;
        }

        return !this._mapSight.isVisibleIndex(index);
    },

    /**
     * ユニットの視界を描画.
     */
    drawUnitSight: function () {
        for (var i = 0; i < this._unitSightArray.length; i++) {
            this._unitSightArray[i].drawUnitSight();
        }
    },

    /**
     * マップの不可視部分を描画.
     */
    drawMapSight: function () {
        root.drawFadeLight(this._getDrawIndexArray(), this._drawInfo.color, this._drawInfo.alpha);
    },

    /**
     * カスタムパラメータから、索敵マップ情報を取得.
     */
    setDrawInfoFromMapData: function () {
        if (root.getCurrentScene() !== SceneType.REST && root.getCurrentSession() !== null) {
            var mapCustomParams = root.getCurrentSession().getCurrentMapInfo().custom;
            if (typeof mapCustomParams.seekingMapType === 'string') {
                this._drawInfo = SeekingMapDrawInfo[mapCustomParams.seekingMapType];
            } else {
                this._drawInfo = null;
            }
        }
    },

    /**
     * 索敵マップかどうか判定.
     * @return 索敵マップ描画情報がセットされていればtrue.
     */
    isSeekingMap: function () {
        return this._drawInfo !== null;
    },

    /**
     * ユニットの視界情報を更新.
     * @param {any[]} args 更新するユニット種別.
     */
    updateUnitSight: function () {
        for (var i = 0; i < arguments.length; i++) {
            this._unitSightArray[arguments[i]].updateUnitSightIndexArray();
        }
    },

    /**
     * 索敵マップ上で不可視のユニットリストを取得.
     * @param {number} unitType チェック元ユニット種別.
     * @return {any[]} 不可視のユニットリスト.
     */
    getInvisibleUnitList: function (unitType) {
        return this._invisibleUnitManagerArray[unitType].getInvisibleUnitList();
    },

    /**
     * 指定されたユニットリストをもとに、ユニットの不可視状態を変更.
     * @param {any[]} unitList ユニットリスト
     * @param {boolean} isInvisible 設定する不可視状態.
     */
    setUnitIsInvisibleFromUnitList: function (unitList, isInvisible) {
        for (var i = 0; i < unitList.length; i++) {
            unitList[i].setInvisible(isInvisible);
        }
    },

    /**
     * 索敵マップを終了する.
     */
    endSeekingMap: function () {
        delete this._mapSight;
        for (var i = 0; i < this._unitSightArray.length; i++) {
            delete this._unitSightArray[i];
        }
        this._drawInfo = null;
        this._forcedWaitUnit = null;
        this._simulator = null;
    },

    /**
     * 索敵マップ上で指定箇所にユニットが存在するかチェック.
     * @param {number} x X座標.
     * @param {number} y Y座標.
     * @param {number} unitType チェック元ユニット種別.
     * @return {boolean} ユニットが存在すればtrue.
     */
    isExistInvisibleUnit: function (x, y, unitType) {
        return this._invisibleUnitManagerArray[unitType].isExistInvisibleUnit(x, y);
    },

    /**
     * 強制待機ユニットを設定する.
     * @param {object} unit 強制待機ユニット.
     */
    setForcedWaitUnit: function (unit) {
        this._forcedWaitUnit = unit;
    },

    /**
     * 強制待機ユニットを取得する.
     * @return {object} 強制待機ユニット
     */
    getForcedWaitUnit: function () {
        return this._forcedWaitUnit;
    },

    getForcedWaitAnimation: function () {
        if (typeof root.getMetaSession().global.forcedWaitAnime === 'undefined') {
            return this._getDefaultAnime();
        } else {
            if (root.getMetaSession().global.forcedWaitAnime.isResource) {
                return this._getForcedWaitAnimeFromResource();
            } else {
                return this._getForcedWaitAnimeFromEffect();
            }
        }
    },

    /**
     * 各種オブジェクトの用意.
     */
    _prepareMapData: function () {
        this._mapSight = createObject(MapSight);

        this._unitSightArray[UnitType.PLAYER] = createObject(PlayerSight);
        this._unitSightArray[UnitType.ENEMY] = createObject(EnemySight);
        this._unitSightArray[UnitType.ALLY] = createObject(AllySight);

        this._invisibleUnitManagerArray[UnitType.PLAYER] = createObject(PlayerInvisibleUnitManager);
        this._invisibleUnitManagerArray[UnitType.ENEMY] = createObject(EnemyInvisibleUnitManager);
        this._invisibleUnitManagerArray[UnitType.ALLY] = createObject(AllyInvisibleUnitManager);

        this._simulator = root.getCurrentSession().createMapSimulator();
    },

    /**
     * 各種オブジェクトの設定.
     */
    _completeMapData: function () {
        this._mapSight.initialize();

        for (var i = 0; i < this._unitSightArray.length; i++) {
            this._unitSightArray[i].setSimulator(this._simulator);
        }

        this._simulator.disableMapUnit();
        this._simulator.disableTerrain();
        this._simulator.disableRestrictedPass();
    },

    /**
     * マップのインデックスの内、不可視部分で描画するものを取得する.
     * @return {number[]} 描画するインデックスの配列.
     */
    _getDrawIndexArray: function () {
        var session = root.getCurrentSession();

        if (session === null) {
            return;
        }

        var drawStartX = Math.floor(session.getScrollPixelX() / GraphicsFormat.MAPCHIP_WIDTH);
        var drawStartY = Math.floor(session.getScrollPixelY() / GraphicsFormat.MAPCHIP_HEIGHT);

        var drawStartIndex = CurrentMap.getIndex(drawStartX, drawStartY);

        var array = [];

        for (var y = 0; y < CurrentMap.getRow(); y++) {
            for (var x = 0; x < CurrentMap.getCol(); x++) {
                array.push(drawStartIndex + x + y * CurrentMap.getWidth());
            }
        }

        if (session.getScrollPixelX() % GraphicsFormat.MAPCHIP_WIDTH !== 0) {
            for (var y = 0; y < CurrentMap.getRow(); y++) {
                array.push(drawStartIndex + CurrentMap.getCol() + y * CurrentMap.getWidth());
            }
        }

        if (session.getScrollPixelY() % GraphicsFormat.MAPCHIP_HEIGHT !== 0) {
            for (var x = 0; x < CurrentMap.getCol(); x++) {
                array.push(drawStartIndex + x + CurrentMap.getRow() * CurrentMap.getWidth());
            }
        }

        var drawIndexArray = [];

        for (var i = 0; i < array.length; i++) {
            if (this.isInvisiblePanel(array[i], UnitType.PLAYER)) {
                drawIndexArray.push(array[i]);
            }
        }

        return drawIndexArray;
    },

    _getDefaultAnime: function () {
        return root.queryAnime('reaction');
    },

    _getForcedWaitAnimeFromResource: function () {
        if (typeof root.getMetaSession().global.forcedWaitAnime.resourceName === 'string') {
            return root.queryAnime(root.getMetaSession().global.forcedWaitAnime.resourceName);
        }

        return this._getDefaultAnime();
    },

    _getForcedWaitAnimeFromEffect: function () {
        var effectList;

        if (root.getMetaSession().global.forcedWaitAnime.isRuntime) {
            effectList = root.getBaseData().getEffectAnimationList(true);
        } else {
            effectList = root.getBaseData().getEffectAnimationList(false);
        }

        if (typeof root.getMetaSession().global.forcedWaitAnime.effectId === 'number') {
            return effectList.getData(root.getMetaSession().global.forcedWaitAnime.effectId);
        }

        return this._getDefaultAnime();
    }
};