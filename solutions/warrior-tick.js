class Player {
    constructor() {
      this.health = 20;
      this.directions = ["forward", "backward", "right", "left"]
    }
  
    playTurn(warrior) {
      const space = this.feelAround(warrior, this.directions)
      const units = this.unitsAround(space);
      const room = warrior.listen();
      const enemies = units[0],
          bound = units[1],
          captives = units[2],
          path = this.getPath(warrior, room, space);
      const look = warrior.look(path);
      const ahead = this.checkAhead(look)
  
      warrior.think(this.enemiesInRoom(room))
      if (this.isBombInTheRoom(room) && warrior.feel(path).isEmpty()){
        if (this.isHeavyInjured(warrior) && enemies.length === 0 && this.enemiesInRoom(room)){
          warrior.rest();
        } else {
          warrior.walk(path);
        }
      } else if (this.isBombInTheRoom(room) && !warrior.feel(path).isEmpty()) {
        if (enemies.length >= 2){
          const filteredEnemies = enemies.filter(enemy => enemy[0] !== `${path}`);
          this.bindAround(warrior, filteredEnemies)
        }else {
          this.encounterResolve(warrior, path, ahead)
        }
      } else if (this.isHeavyInjured(warrior) && enemies.length === 0 && room.length !== 0){
        warrior.rest();
      }else if (enemies.length >= 2){
        this.bindAround(warrior, enemies);
      }else if (enemies.length > 0 || bound.length > 0 ){
        this.attackAround(warrior, enemies, bound)
      }else if (captives.length > 0){
        this.rescueAround(warrior, captives)
      }else{
        warrior.walk(path)
      }
    }
  
  
  
    feelAround(warrior, directions){
      return directions.map((space) => [space, warrior.feel(space)])
    }
  
    unitsAround(area){
      let enemyCount = [];
      let captiveCount = [];
      let boundCount =[];
      for (let i = 0; i < area.length; i++){
        if (area[i][1].isUnit()){
          if(area[i][1].getUnit().isEnemy()){
               if (area[i][1].getUnit().isBound()){
                 boundCount.push(area[i])
               }else{
                 enemyCount.push(area[i])
               }
          }else{
            captiveCount.push(area[i])
          };
        };
      };
      
      return [enemyCount, boundCount, captiveCount]
    }
  
    getPath(warrior, room, proximity){
      if (room.length === 0){
        return warrior.directionOfStairs();
      }else if (this.isBombInTheRoom(room)) {
        const bomb = room.find((unit) => unit.getUnit().isUnderEffect('ticking'));
        return warrior.directionOf(bomb)
      } else if (warrior.feel(warrior.directionOf(room[0])).isStairs()){
        return this.avoidStairs(warrior, proximity);
      }else {
        return warrior.directionOf(room[0])
      }
    }
  
    avoidStairs(warrior, area) {
      const emptySpace = [];
       for (let i = 0; i < area.length; i++){
        if (!area[i][1].isStairs()){
          if (!area[i][1].isWall()){
            emptySpace.push(area[i][0])
          }
        }
       }
      
      return emptySpace[0]
    }
  
    bindAround(warrior, enemies){
        warrior.bind(enemies[0][0]);
    }
    
    isBombInTheRoom(room) {
      return room.some(unit => unit.getUnit().isUnderEffect("ticking"));
    }
  
    attackAround(warrior, enemies, bound){
      if (enemies.length > 0){
        warrior.attack(enemies[0][0]);
      } else if (bound.length > 0){
        warrior.attack(bound[0][0])
      }
    }
  
    rescueAround(warrior, captives){
       warrior.rescue(captives[0][0])
    }
  
    isDetonateGoodDecision(ahead) {
      
      return (ahead[0] === 'enemy' && ahead[1] === 'enemy');
    }
  
    isHeavyInjured(warrior) {
        return warrior.health() < 14
    }
  
    encounterResolve(warrior, path, ahead){
      let encounter = warrior.feel(path).getUnit();
      if (encounter.isEnemy() && this.isDetonateGoodDecision(ahead)){
        warrior.detonate(path);
      }else if (encounter.isEnemy()){
        warrior.attack(path)
      }else {
        warrior.rescue(path)
      }
    }
  
    enemiesInRoom(room){
      return this.checkAhead(room).includes('enemy');
    }
  
    checkAhead(ahead) {
      const res = [];
      for (let i = 0; i < ahead.length; i++){
        if (!ahead[i].isEmpty() && ahead[i].isUnit()){
          if (ahead[i].getUnit().isEnemy()){
            res.push('enemy')
          }else {
            res.push('captive')
          }
        }else{
          res.push('empty')
        }
      }
      return res
    }
  }
  