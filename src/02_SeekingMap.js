//---------------------------------
// 索敵マップ処理
// 作成者：FlatMountain
//---------------------------------

var seekingMapManager = new SeekingMapManager();

// 描画系
(function () {
    var alias1 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function () {
        alias1.call(this);
        if (seekingMapManager.isSightMode()) {
            var session = root.getCurrentSession();

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
                var index = array[i];
                if (!seekingMapManager.isVisible(index, UnitType.PLAYER)) {
                    drawIndexArray.push(index);
                }
            }

            root.drawFadeLight(drawIndexArray, 0xffffff, 123);
        }
    };

    var alias2 = MapLayer.drawUnitLayer;
    MapLayer.drawUnitLayer = function () {
        if (seekingMapManager.isSightMode()) {
            seekingMapManager.setUnitInvisibleFromUnitList(EnemyList.getAliveList(), UnitType.PLAYER);
            seekingMapManager.setUnitInvisibleFromUnitList(AllyList.getAliveList(), UnitType.PLAYER);
        }

        alias2.call(this);

        if (seekingMapManager.isSightMode()) {
            seekingMapManager.setUnitVisibleFromUnitList(EnemyList.getAliveList());
            seekingMapManager.setUnitVisibleFromUnitList(AllyList.getAliveList());
        }
    };

    var alias3 = MapParts.UnitInfo.drawMapParts;
    MapParts.UnitInfo.drawMapParts = function () {
        if (!seekingMapManager.isSightMode()) {
            alias3.call(this);
            return;
        }

        var unit = this.getMapPartsTarget();
        if (unit === null) {
            return;
        }

        index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());

        if (unit.getUnitType() === UnitType.PLAYER || seekingMapManager.isVisible(index, UnitType.PLAYER)) {
            alias3.call(this);
        }
    };

    var alias4 = MapEdit._openMenu;
    MapEdit._openMenu = function (unit) {
        if (!seekingMapManager.isSightMode()) {
            return alias4.call(this, unit);
        }

        if (unit !== null) {
            index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());

            if (unit.getUnitType() !== UnitType.PLAYER && !seekingMapManager.isVisible(index, UnitType.PLAYER)) {
                return MapEditResult.MAPCHIPCANCEL;
            }
        }

        return alias4.call(this, unit);
    };

    var alias5 = MarkingPanel.updateMarkingPanel;
    MarkingPanel.updateMarkingPanel = function () {
        if (seekingMapManager.isSightMode()) {
            seekingMapManager.setUnitInvisibleFromUnitList(EnemyList.getAliveList(), UnitType.PLAYER);
        }

        alias5.call(this);

        if (seekingMapManager.isSightMode()) {
            seekingMapManager.setUnitVisibleFromUnitList(EnemyList.getAliveList());
        }
    };

    var alias6 = MarkingPanel.updateMarkingPanelFromUnit;
    MarkingPanel.updateMarkingPanelFromUnit = function (unit) {
        if (seekingMapManager.isSightMode()) {
            seekingMapManager.setUnitInvisibleFromUnitList(EnemyList.getAliveList(), UnitType.PLAYER);
        }

        alias6.call(this, unit);

        if (seekingMapManager.isSightMode()) {
            seekingMapManager.setUnitVisibleFromUnitList(EnemyList.getAliveList());
        }
    }

    var alias7 = SimulateMove.drawUnit;
    SimulateMove.drawUnit = function () {
        var x = Math.floor(this._xPixel / GraphicsFormat.MAPCHIP_WIDTH);
        var y = Math.floor(this._yPixel / GraphicsFormat.MAPCHIP_HEIGHT);
        var index = CurrentMap.getIndex(x, y);

        if (this._unit.getUnitType() !== UnitType.PLAYER && !seekingMapManager.isVisible(index, UnitType.PLAYER)) {
            return;
        }

        alias7.call(this);
    };
})();

// 視界更新系
(function () {
    var alias1 = PlayerTurn._prepareTurnMemberData;
    PlayerTurn._prepareTurnMemberData = function () {
        alias1.call(this);
        if (seekingMapManager.isSightMode()) {
            var playerList = PlayerList.getAliveList();

            for (var i = 0; i < playerList.getCount(); i++) {
                var unit = playerList.getData(i);
                seekingMapManager.updateUnitSight(unit);
            }

        }
    };

    var alias2 = UnitWaitFlowEntry._completeMemberData;
    UnitWaitFlowEntry._completeMemberData = function (playerTurn) {
        var result = alias2.call(this, playerTurn);

        if (seekingMapManager.isSightMode()) {
            var unit = playerTurn.getTurnTargetUnit();
            seekingMapManager.updateUnitSight(unit);
        }
        return result;
    };
})();

// 攻撃系
(function () {
    var alias1 = AttackChecker.getAttackIndexArray;
    AttackChecker.getAttackIndexArray = function (unit, weapon, isSingleCheck) {
        var indexArray = alias1.call(this, unit, weapon, isSingleCheck);
        var indexArrayNew = [];

        if (seekingMapManager.isSightMode()) {
            for (var i = 0; i < indexArray.length; i++) {
                var index = indexArray[i];
                var targetUnit = PosChecker.getUnitFromPos(CurrentMap.getX(index), CurrentMap.getY(index));
                if (unit.getUnitType() !== targetUnit.getUnitType()) {
                    if (seekingMapManager.isVisible(index, unit.getUnitType())) {
                        indexArrayNew.push(index);
                    }
                }
            }
        }

        return indexArrayNew;
    };

    var alias2 = AttackChecker.getFusionAttackIndexArray;
    AttackChecker.getFusionAttackIndexArray = function (unit, weapon, fusionData) {
        var indexArray = alias2.call(this, unit, weapon, fusionData);
        var indexArrayNew = [];

        if (seekingMapManager.isSightMode()) {
            for (var i = 0; i < indexArray.length; i++) {
                var index = indexArray[i];
                var targetUnit = PosChecker.getUnitFromPos(CurrentMap.getX(index), CurrentMap.getY(index));
                if (unit.getUnitType() !== targetUnit.getUnitType()) {
                    if (seekingMapManager.isVisible(index, unit.getUnitType())) {
                        indexArrayNew.push(index);
                    }
                }
            }
        }

        return indexArrayNew;
    };
})();

// 移動系
(function () {
    var alias1 = MapSequenceArea._isPlaceSelectable;
    MapSequenceArea._isPlaceSelectable = function () {
        var isPlaseSelectable = alias1.call(this);

        if (seekingMapManager.isSightMode() && !isPlaseSelectable) {
            var x = this._mapCursor.getX();
            var y = this._mapCursor.getY();
            var unit = PosChecker.getUnitFromPos(x, y);

            if (unit !== null && unit.getUnitType() !== UnitType.PLAYER && !seekingMapManager.isVisible(CurrentMap.getIndex(x, y), UnitType.PLAYER)) {
                isPlaseSelectable = true;
            }
        }

        return isPlaseSelectable;
    };

    var alias2 = UnitRangePanel._setRangeData;
    UnitRangePanel._setRangeData = function () {
        if (seekingMapManager.isSightMode()) {
            if (this._unit.getUnitType() === UnitType.PLAYER) {
                seekingMapManager.setUnitInvisibleFromUnitList(EnemyList.getAliveList(), UnitType.PLAYER);
                seekingMapManager.setUnitInvisibleFromUnitList(AllyList.getAliveList(), UnitType.PLAYER);
            }
        }

        alias2.call(this);

        if (seekingMapManager.isSightMode()) {
            if (this._unit.getUnitType() === UnitType.PLAYER) {
                seekingMapManager.setUnitVisibleFromUnitList(EnemyList.getAliveList());
                seekingMapManager.setUnitVisibleFromUnitList(AllyList.getAliveList());
            }
        }
    };

    var alias3 = UnitRangePanel._setRepeatRangeData;
    UnitRangePanel._setRepeatRangeData = function () {
        if (seekingMapManager.isSightMode()) {
            if (this._unit.getUnitType() === UnitType.PLAYER) {
                seekingMapManager.setUnitInvisibleFromUnitList(EnemyList.getAliveList(), UnitType.PLAYER);
                seekingMapManager.setUnitInvisibleFromUnitList(AllyList.getAliveList(), UnitType.PLAYER);
            }
        }

        alias3.call(this);

        if (seekingMapManager.isSightMode()) {
            if (this._unit.getUnitType() === UnitType.PLAYER) {
                seekingMapManager.setUnitVisibleFromUnitList(EnemyList.getAliveList());
                seekingMapManager.setUnitVisibleFromUnitList(AllyList.getAliveList());
            }
        }
    };

    var alias4 = CourceBuilder._createCource;
    CourceBuilder._createCource = function (unit, goalIndex, simulator, indexArrayDisabled, moveMaxCount, type) {
        var cource = alias4.call(this, unit, goalIndex, simulator, indexArrayDisabled, moveMaxCount, type);

        if (!seekingMapManager.isSightMode()) {
            return cource;
        }

        var invisibleUnitList = [];
        while (indexArrayDisabled.length > 0) {
            var index = indexArrayDisabled.pop();
            if (!seekingMapManager.isVisible(index, unit.getUnitType())) {
                var targetUnit = PosChecker.getUnitFromPos(CurrentMap.getX(index), CurrentMap.getY(index));
                seekingMapManager.setUnitInvisible(targetUnit);
                invisibleUnitList.push(targetUnit);
            }
        }

        simulator.resetSimulationMark();
        cource = alias4.call(this, unit, goalIndex, simulator, indexArrayDisabled, moveMaxCount, type);

        while (invisibleUnitList.length > 0) {
            seekingMapManager.setUnitVisible(invisibleUnitList.pop());
        }

        var newCource = [];
        var x = unit.getMapX();
        var y = unit.getMapY();

        for (var i = 0; i < cource.length; i++) {
            x += XPoint[cource[i]];
            y += YPoint[cource[i]];

            if (PosChecker.getUnitFromPos(x, y) !== null) {
                break;
            }

            newCource.push(cource[i]);
        }

        return newCource;
    };

})();