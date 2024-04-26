class Player {
    constructor() {
    this.health = 20;
    }
    // Main turn
    playTurn(warrior) {
        let ahead = warrior.look();
        let behind = warrior.look('backward')
        warrior.think(this.checkEnemy(ahead))
        warrior.think(this.checkEnemy(behind))
      
        if (warrior.feel().isWall()) {
        warrior.pivot()
      }else if (warrior.feel().isEmpty() && !this.checkEnemy(ahead)){
        if (this.isTakingDmg(warrior) && this.isHeavyInjured(warrior)){
          warrior.walk('backward')
        }else if (this.isTakingDmg(warrior) || warrior.health() == warrior.maxHealth()){
          warrior.walk()
        }else{
          warrior.rest()
        }
      }else if (!warrior.feel().isEmpty() && !this.checkEnemy(ahead)){
        warrior.rescue()
      }else if (!warrior.feel().isEmpty() && this.checkEnemy(ahead)){
        warrior.attack()
      }else if (warrior.feel().isEmpty() && this.checkEnemy(behind)) {
        warrior.shoot('backward')
      }else if (warrior.feel().isEmpty() && this.checkEnemy(ahead)) {
        warrior.shoot()
      }
  
      this.health = warrior.health()
    }
    
    // supporting functions
    isHeavyInjured(warrior) {
      return warrior.health() < 15
    }
  
  
    isTakingDmg(warrior) {
      return warrior.health() < this.health
    }
  
  
    checkEnemy(ahead) {
      let res = []
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
      if (res.includes('enemy') && res.includes('captive')){
       return res.indexOf('enemy') < res.indexOf('captive')
      }
      return res.includes('enemy')
    }
  
  
  }