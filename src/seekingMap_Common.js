//---------------------------------
//索敵マップ処理の共通処理.
//作成者：FlatMountain
//---------------------------------

(function () {
    var alias1 = CurrentMap.prepareMap;
    CurrentMap.prepareMap = function () {
        alias1.call(this);
        SeekingMapManager.setDrawInfoFromMapData();
        if (SeekingMapManager.isSeekingMap()) {
            SeekingMapManager.initializeMapData();
            SeekingMapManager.updateUnitSight(UnitType.PLAYER, UnitType.ENEMY, UnitType.ALLY);
        }
    };

    var alias2 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function () {
        alias2.call(this);
        if (SeekingMapManager.isSeekingMap()) {
            SeekingMapManager.drawMapSight();
            SeekingMapManager.drawUnitSight();
        }
    };

    MapLayer._temporaryInvisibleUnitList = [];

    var alias3 = MapLayer.drawUnitLayer;
    MapLayer.drawUnitLayer = function () {
        this._temporaryInvisibleUnitList = SeekingMapManager.getInvisibleUnitList(UnitType.PLAYER);
        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, true);

        alias3.call(this);

        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, false);
        this._temporaryInvisibleUnitList = [];
    };

    var alias4 = BattleResultScene._changeNextScene;
    BattleResultScene._changeNextScene = function () {
        SeekingMapManager.endSeekingMap();

        alias4.call(this);
    };

    var alias5 = UnitDeathFlowEntry._doEndAction;
    UnitDeathFlowEntry._doEndAction = function () {
        alias5.call(this);
        if (SeekingMapManager.isSeekingMap()) {
            SeekingMapManager.updateUnitSight(this._passiveUnit.getUnitType());
        }
    };
})();

// マーキングに関する処理.
(function () {
    MarkingPanel._TemporaryInvisibleUnitList = [];

    var alias1 = MarkingPanel.updateMarkingPanel;
    MarkingPanel.updateMarkingPanel = function () {
        this._temporaryInvisibleUnitList = SeekingMapManager.getInvisibleUnitList(UnitType.PLAYER);
        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, true);

        alias1.call(this);

        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, false);
        this._temporaryInvisibleUnitList = [];
    };

    var alias2 = MarkingPanel.updateMarkingPanelFromUnit;
    MarkingPanel.updateMarkingPanelFromUnit = function (unit) {
        this._temporaryInvisibleUnitList = SeekingMapManager.getInvisibleUnitList(UnitType.PLAYER);
        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, true);

        alias2.call(this, unit);

        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, false);
        this._temporaryInvisibleUnitList = [];
    };
})();