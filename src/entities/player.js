import Game from "../game.js";
import LevelRender from "../level/levelrender.js";
import Entity from "./entity.js";
import Inventory from "./inventory.js";
import ItemSprite from "./itemsprite.js";
import Projectile from "./projectile.js";
const up = {x:0,y:1,z:0};
const down = {x:0,y:-1,z:0}
class Player extends Entity{
    constructor(x,y,z) {
        super("p",x,y,z,5);
        this.isAttacking = false;
        this.inventory = new Inventory();
        this.showAttack = false;
        this.attackCounter = 0;
        this.eatDelay = 0;
        this.daggerItemLevel = 0;
        this.wandItemLevel = 0;
        this.hitCounter = 0.5;
        this.velocity = {x:0,z:0};
        this.strafe = {x:0,z:0};
        this.tempVector = {x:0,z:0};
    }

    // Used if player is playing with checkpoints. Not able to rotate the player in the right direction.
    spawnAtCheckpoint(level){
        level.displayMessage("Respawned","",2);
        this.currentHealth = this.health;
        this.p.x = this.checkpoint.x;
        this.p.z = this.checkpoint.z;
    }

    tick(deltaTime, level){
        super.tick(deltaTime,level);
        //If player is dead or game has finished rotate the camera.
        if (this.currentHealth <= 0 || level.finished){
            if (level.finished) this.i = null;
            LevelRender.camera.rotate(0.15*deltaTime);
            LevelRender.camera.setPos(this.p);
            if (Game.inputHandler.isKeyDown(32) && !level.finished) Game.restart();
            return;
        }

        //Set the playerhurt variable to show a 100ms red flashing on the screen if the player has taken damage
        LevelRender.playerHurt=this.hitCounter < 0.1?1:0;
        this.inventory.tick(deltaTime,level);
        this.i = this.inventory.getItemInSlot(this.inventory.selectedSlot);
        //Tick some counters to prevent spamming of eating and attack
        if (this.showAttack && this.attackCounter > 0) this.attackCounter -= deltaTime;
        if (this.attackCounter <= 0) this.showAttack = false;
        if (this.eatDelay >0) this.eatDelay -= deltaTime;

        //Dont allow player to control the movement if knocked back.
        if (this.knockBack.x == 0 || this.knockBack.z == 0){
            //Zero out all velocity and strafing. Also reuse the same vector object to save memory
            this.velocity.x = 0;
            this.velocity.z = 0;
            this.strafe.x = 0;
            this.strafe.z = 0;
            let inputHandler = Game.inputHandler;
            this.counter += deltaTime;

            //Rotate the camera based on mouse input. (This value seems to differ a bit between FF and Chrome and the size of the window)
            LevelRender.camera.rotate((inputHandler.getMouseX()/9) * deltaTime);
            //Save the direction the camera is looking.
            let cameraDirection = LevelRender.camera.getDirection();
            //If W or S is pressed assign positive or negative velocity in the move forward/backwards velocity.
            if (inputHandler.isKeyDown(87))this.velocity.z = -1;
            if (inputHandler.isKeyDown(83))this.velocity.z = 1;

            //If A or D is pressed use the cross product of camera direction and camera up/down to figure out which direction a left and right strafe is in relation to the camera rotation.
            if (inputHandler.isKeyDown(65))this.cross(this.strafe,cameraDirection,up);
            if (inputHandler.isKeyDown(68))this.cross(this.strafe,cameraDirection,down);

            //If mouse is clicked trigger an attack but limit it to every 0.3 second.
            if (inputHandler.getClicked() && this.attackCounter <= 0){
                this.isAttacking = this.showAttack = true;
                this.attackCounter = 0.3;
                this.attack(level);
                               
            }else{
                this.isAttacking = false;
            }

            //If E is pressed eat an apple.
            if (inputHandler.isKeyDown(69))this.eat();

            //If Q is pressed drop the current equipped item on the floor.
            if (inputHandler.isKeyDown(81)){ this.dropCurrentItem(level); inputHandler.kp[81] = false} ;
            
            //If movement or strafe has been pressed lets calculate the movement
            if (this.velocity.x !=0 || this.velocity.z != 0 || this.strafe.x != 0 || this.strafe.z !=0){
                //combine forward/backward movement with strafe movement and multiply that with the direction the camera is facing
                this.tempVector.x = cameraDirection.x * this.velocity.z + this.strafe.x;
                this.tempVector.z = cameraDirection.z * this.velocity.z + this.strafe.z;
                
                //normalize it to prevent moving faster when strafing and moving forward/backward at the same time
                this.normalize(this.tempVector);

                //multiply the final normalized movement with the speed the player will move multiplied with the deltatime
                this.tempVector.x *= deltaTime*2.5;
                this.tempVector.z *= deltaTime*2.5;

                //finally add the current position of the player to the calculated movement vector
                this.tempVector.x += this.p.x;
                this.tempVector.z += this.p.z;

                //check if the player can move in X or Z direction separetly to allow sliding on the walls. Otherwise the player would get stuck when close to a wall
                //which would be very annoying. If the player can move to the new position then transform the current position to that position.
                if (this.canMove(level,this.tempVector.x,this.p.z)) this.p.x += this.tempVector.x-this.p.x;
                if (this.canMove(level,this.p.x,this.tempVector.z)) this.p.z += this.tempVector.z-this.p.z;

            }
        }
        
        //Render the item the player is holding. If attacking render the attack position of it.
        if (this.i != null && (this.currentHealth>0 || !level.finished)){
            let itemPos = {x:this.p.x - LevelRender.camera.getDirection().x/4,y:0,z:this.p.z - LevelRender.camera.getDirection().z/4};
            if (!this.showAttack){
                this.i.renderPlayerHolding(itemPos,0.11);
            }else{
                this.i.renderPlayerAttack(itemPos,0.10);
            }
        }
        //Update the camera with the player position
        LevelRender.camera.setPos(this.p);
        //Show prepare for boss fight message on this ugly hard coded position
        if (Math.round(this.p.x) == 32 && Math.round(this.p.z) == 47) level.displayMessage("Prepare for boss fight!" ,"", 4);

    }
    //Vector cross product math of two vectors
    cross(out, a, b) {
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
        return out;
      }

    //Completly override removeThisEntity function since if we have died we shouldn't do anything more than display the message
    removeThisEntity(level){
        level.displayMessage("You have died.","Press space to try again");
    }
    
    dropCurrentItem(level){
        if (this.i != null){
            //Drop currently equipped item and place in front of the player using the direction the camera is looking
            let itemSprite = new ItemSprite(this.i,this.p.x-LevelRender.camera.getDirection().x/2,-0.2,this.p.z-LevelRender.camera.getDirection().z/2,this.i.texture,level.gl);
            //Knockback the item a bit using the direction the camera is looking
            itemSprite.knockback(LevelRender.camera.getDirection().x,LevelRender.camera.getDirection().z);
            level.addEntity(itemSprite); 
            this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
        }
    }

    removeCurrentItem(){
        this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
    }

    pickup(level,item){
        Game.playAudio(350,0.1);
        this.inventory.addItemToFirstAvailableSlot(level,item);
        //Save the itemlevel of picked up weapon. Will be used so bats always drops an updated version of the weapon.
        //This works if the player downgrades his weapon too.
        if (item.n == "dagger") if (this.daggerItemLevel < item.level) this.daggerItemLevel = item.level;
        if (item.n == "wand") if (this.wandItemLevel < item.level) this.wandItemLevel = item.level;
    }

    eat(){
        //Eat and set delay to stop keyboard spamming to instant eat very quickly
        if (this.currentHealth < this.health && this.eatDelay <= 0){
            this.inventory.eat(this);
            this.eatDelay = 0.2;
        } 
    }

    collidedBy(entity, level){
        if (level.finished) return;
        super.collidedBy(entity,level);
        //If the player collides with bat or a particle which isn't shot by the player take damage but limit taking damage to once a second
        if (entity.n == "ba" || (entity.n == "pp" && entity.source != this)){
            if(this.distanceToOtherEntity(entity) < 0.6){
                if (this.hitCounter>= 1){
                    Game.playAudio(60,0.3);
                    super.knockback(entity.p.x - this.p.x*2, entity.p.z - this.p.z*2);
                    this.hit(level,entity,1);
                }
            }
        }
    }

    //Set the new checkpoint but save the previous one in case a checkpoint becomes invalid (bar being closed again)
    setCheckpoint(x,z){
        this.prevCheckpoint = this.checkpoint;
        this.checkpoint = {x,z};
    }

    //Revert the checkpoint to previous one  in case a checkpoint becomes invalid (bar being closed again)
    revertCheckpoint(){
        this.checkpoint = this.prevCheckpoint;
    }

    attack(level){
        if (this.i == null) return;
        if (this.i.n == "wand"){
            //Shoot a projectile in the direction the camera is facing if we are equipping the wand.
            level.addEntity(new Projectile(this.p.x - LevelRender.camera.getDirection().x, 0.3, this.p.z - LevelRender.camera.getDirection().z,level.gl, -LevelRender.camera.getDirection().x*7, -LevelRender.camera.getDirection().z*7,this.i.getDamage(),this,[0.3,0.3,0,1]));
        }else{
            //Bit of ugly hack to check the tiles in front of the player for a valid enemy to attack. If not found at first then just check a little but further ahead of the player.
            if (!this.findEnemyAndAttack(level,level.getCollisionTile(Math.round(this.p.x - LevelRender.camera.getDirection().x), Math.round(this.p.z - LevelRender.camera.getDirection().z)))){
                this.findEnemyAndAttack(level,level.getCollisionTile(Math.round(this.p.x - LevelRender.camera.getDirection().x*2), Math.round(this.p.z - LevelRender.camera.getDirection().z*2)));
            }
        }
    }
    findEnemyAndAttack(level,ct){
        //Check if the collisiontile contains any entites
        ct.getEntities().forEach(e => {
            if (e == this) return;
            //If the entity is a bat, pot or a box hit it dealing currently equipped item damage (including apples that does one damage)
            if (e.n == "ba" || e.n == "po" || e.n == "b"){
                e.hit(level,this,this.i.getDamage());
                return true;
            }
        });
        return false;
    }
}

export default Player;