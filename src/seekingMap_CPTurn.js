//---------------------------------
//索敵マップ処理のCPターン処理.
//作成者：FlatMountain
//---------------------------------

(function () {
    var alias1 = AutoActionBuilder._pushScroll;
    AutoActionBuilder._pushScroll = function (unit, autoActionArray, combination) {
        var x = unit.getMapX();
        var y = unit.getMapY();

        for (var i = 0; i < combination.cource.length; i++) {
            var direction = combination.cource[i];
            x += XPoint[direction];
            y += YPoint[direction];
            var index = CurrentMap.getIndex(x, y);

            if (!SeekingMapManager.isInvisiblePanel(index, UnitType.PLAYER)) {
                alias1.call(this, unit, autoActionArray, combination);
                break;
            }
        }
    };

    var alias2 = EnemyTurn._completeTurnMemberData;
    EnemyTurn._completeTurnMemberData = function () {
        alias2.call(this);
        if (SeekingMapManager.isSeekingMap()) {
            var turnType = root.getCurrentSession().getTurnType();
            if (turnType === TurnType.ENEMY) {
                SeekingMapManager.updateUnitSight(UnitType.ENEMY);
            } else {
                SeekingMapManager.updateUnitSight(UnitType.ALLY);
            }
        }
    };

    EnemyTurn._temporaryInvisibleUnitList = [];

    var alias3 = EnemyTurn.moveTurnCycle;
    EnemyTurn.moveTurnCycle = function () {
        var turnType = root.getCurrentSession().getTurnType();

        if (turnType === TurnType.ENEMY) {
            this._temporaryInvisibleUnitList = SeekingMapManager.getInvisibleUnitList(UnitType.ENEMY);
        } else {
            this._temporaryInvisibleUnitList = SeekingMapManager.getInvisibleUnitList(UnitType.ALLY);
        }

        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, true);

        result = alias3.call(this);

        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, false);
        this._temporaryInvisibleUnitList = [];

        if (turnType === TurnType.ENEMY) {
            SeekingMapManager.updateUnitSight(UnitType.ENEMY);
        } else {
            SeekingMapManager.updateUnitSight(UnitType.ALLY);
        }

        return result;
    };

    BaseCombinationCollector._temporaryInvisibleUnitList = [];
    var alias4 = BaseCombinationCollector._getTargetListArray;
    BaseCombinationCollector._getTargetListArray = function (filter, misc) {
        var unit = misc.unit;
        var listArray = alias4.call(this, filter, misc);

        this._temporaryInvisibleUnitList = SeekingMapManager.getInvisibleUnitList(unit.getUnitType());
        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, true);

        for (var i = 0; i < listArray.length; i++) {
            var arr = [];
            for (var j = 0; j < listArray[i].getCount(); j++) {
                if (!listArray[i].getData(j).isInvisible()) {
                    arr.push(listArray[i].getData(j));
                }
            }
            listArray[i].setDataArray(arr);
        }

        SeekingMapManager.setUnitIsInvisibleFromUnitList(this._temporaryInvisibleUnitList, false);
        this._temporaryInvisibleUnitList = [];

        return listArray;
    };

    var alias5 = WeaponAutoAction.enterAutoAction;
    WeaponAutoAction.enterAutoAction = function () {
        if (SeekingMapManager.getForcedWaitUnit() === this._unit) {
            return EnterResult.NOENTER;
        }

        return alias5.call(this);
    };

    var alias6 = ItemAutoAction.enterAutoAction;
    ItemAutoAction.enterAutoAction = function () {
        if (SeekingMapManager.getForcedWaitUnit() === this._unit) {
            return EnterResult.NOENTER;
        }

        return alias6.call(this);
    };

    var alias7 = SkillAutoAction.enterAutoAction;
    SkillAutoAction.enterAutoAction = function () {
        if (SeekingMapManager.getForcedWaitUnit() === this._unit) {
            return EnterResult.NOENTER;
        }

        return alias7.call(this);
    };
})();