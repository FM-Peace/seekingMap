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
            var enemyList = EnemyList.getAliveList();

            for (var i = 0; i < enemyList.getCount(); i++) {
                var unit = enemyList.getData(i);
                var index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());
                if (!seekingMapManager.isVisible(index, UnitType.PLAYER)) {
                    seekingMapManager.setUnitInvisible(unit);
                }
            }

            var allyList = AllyList.getAliveList();

            for (var i = 0; i < allyList.getCount(); i++) {
                var unit = allyList.getData(i);
                var index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());
                if (!seekingMapManager.isVisible(index, UnitType.PLAYER)) {
                    seekingMapManager.setUnitInvisible(unit);
                }
            }
        }

        alias2.call(this);

        if (seekingMapManager.isSightMode()) {
            var enemyList = EnemyList.getAliveList();

            for (var i = 0; i < enemyList.getCount(); i++) {
                var unit = enemyList.getData(i);
                seekingMapManager.setUnitVisible(unit);
            }

            var allyList = AllyList.getAliveList();

            for (var i = 0; i < allyList.getCount(); i++) {
                var unit = enemyList.getData(i);
                seekingMapManager.setUnitVisible(unit);
            }
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
            var enemyList = EnemyList.getAliveList();

            for (var i = 0; i < enemyList.getCount(); i++) {
                var unit = enemyList.getData(i);
                var index = CurrentMap.getIndex(unit.getMapX(), unit.getMapY());
                if (!seekingMapManager.isVisible(index, UnitType.PLAYER)) {
                    seekingMapManager.setUnitInvisible(unit);
                }
            }
        }

        alias5.call(this);

        if (seekingMapManager.isSightMode()) {
            for (var i = 0; i < enemyList.getCount(); i++) {
                var unit = enemyList.getData(i);
                seekingMapManager.setUnitVisible(unit);
            }
        }
    };

    var alias6 = MarkingPanel.updateMarkingPanelFromUnit;
    MarkingPanel.updateMarkingPanelFromUnit = function (unit) {
        if (seekingMapManager.isSightMode()) {
            var enemyList = EnemyList.getAliveList();

            for (var i = 0; i < enemyList.getCount(); i++) {
                var enemyUnit = enemyList.getData(i);
                var index = CurrentMap.getIndex(enemyUnit.getMapX(), enemyUnit.getMapY());
                if (!seekingMapManager.isVisible(index, UnitType.PLAYER)) {
                    seekingMapManager.setUnitInvisible(enemyUnit);
                }
            }
        }

        alias6.call(this, unit);

        if (seekingMapManager.isSightMode()) {
            for (var i = 0; i < enemyList.getCount(); i++) {
                var enemyUnit = enemyList.getData(i);
                seekingMapManager.setUnitVisible(enemyUnit);
            }
        }
    }
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

    var alias1 = AttackChecker.getFusionAttackIndexArray;
    AttackChecker.getFusionAttackIndexArray = function (unit, weapon, fusionData) {
        var indexArray = alias1.call(this, unit, weapon, fusionData);
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