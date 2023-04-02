class Rectangle{
    constructor(x1,y1,x2,y2,width){
        this.x1 = x1;
        this.y1 = y1;
        if(width){
            this.x2 = x1+x2;
            this.y2 = y1+y2;
        } else {
            this.x2 = x2;
            this.y2 = y2;
        }
    }
    /**
     * Check if two rectangles collide
     * @param {Rectangle} rectangle 
     */
    collides(rectangle){
        var withinX = false
        var withinY = false
        if(this.x1<rectangle.x2 && this.x2 > rectangle.x1){
            withinX = true
        }
        if(this.y1<rectangle.y2 && this.y2 > rectangle.y1){
            withinY = true
        }
        return withinX&&withinY
    }
}

class Soldier{
    constructor(maxAmmunition,damage,type,detectionRange,firingRangePercentage,fireSpread,startX=0,startY=0){
        this.x=startX
        this.y=startY
        this.state="idle"
        this.type = type
        this.firing=false
        this.direction=true
        this.walkFrame=1
        this.reloadFrame=1
        this.fireTick=0
        this.speed=3
        this.shootStart=false,
        this.hitbox={
            head:new Rectangle(this.x+10,this.y,15,15,true),
            body:new Rectangle(this.x+10,this.y+15,15,60,true),
        }
        this.frp = firingRangePercentage
        this.detection=new Rectangle(this.x-detectionRange,this.y-detectionRange,this.x+detectionRange,this.y+detectionRange)
        this.detectionRange = detectionRange
        this.fireRange = new Rectangle(this.x-detectionRange*this.frp
            ,this.y-detectionRange*this.frp
            ,this.x+detectionRange*this.frp
            ,this.y+detectionRange*this.frp)
        this.maxAmmunition=maxAmmunition
        this.ammunition = maxAmmunition
        this.reloadTick = 0
        this.fireTarget = {
            x:0,
            y:0
        }
        this.health = 100
        this.damage = damage
    }
    fire(x,y){
        if(this.ammunition>0&&this.state!="dead"){
        this.shootStart = false
        this.firing = true
        this.fireTick = -1
        this.state = "aimfire"
        this.ammunition -= 1
        var newAudio = audio.gunshot.cloneNode()
        newAudio.play()
        fire(x,y,this.damage)
        }
    }
    render(){
        if(this.state!="dead"){
            if(this.type == "enemy"){
                this.fireRange = new Rectangle(this.x-this.detectionRange*this.frp,
                    this.y-this.detectionRange*this.frp,
                    this.x+this.detectionRange*this.frp,
                    this.y+this.detectionRange*this.frp)
            this.detection=new Rectangle(this.x-this.detectionRange,
                this.y-this.detectionRange,
                this.x+this.detectionRange,
                this.y+this.detectionRange)
            }
        if(this.direction){
            this.hitbox={
                head:new Rectangle(this.x+10,this.y,15,15,true),
                body:new Rectangle(this.x+10,this.y+15,15,60,true),
            }
        } else {
            if(this.state=="aim"||this.state=="aimfire"){
                this.hitbox={
                    head:new Rectangle(this.x+37,this.y,15,15,true),
                    body:new Rectangle(this.x+37,this.y+15,15,60,true),
                }
            } else {
                if(this.state=="walk"){
                    this.hitbox={
                        head:new Rectangle(this.x+30,this.y,15,15,true),
                        body:new Rectangle(this.x+30,this.y+15,15,60,true),
                    }
                }else{
                this.hitbox={
                    head:new Rectangle(this.x+27,this.y,15,15,true),
                    body:new Rectangle(this.x+27,this.y+15,15,60,true),
                }
                }
            }
        }
        switch(this.state){
            case "idle":
                if(this.direction){
                    ctx.drawImage(characterFrames[`idle`],this.x,this.y,52,75)
                } else {
                    ctx.translate(this.x+52,this.y)
                    ctx.scale(-1,1)
                    ctx.drawImage(characterFrames[`idle`],0,0,52,75)
                    ctx.setTransform(1,0,0,1,0,0)
                }
                this.walkFrame = 1
                this.walkTick = 0
                this.shootStart = 0
                
                break;
            case "walk":
                this.walkFrame++
                this.shootStart = 0
                if(this.walkFrame > 6){
                    this.walkFrame = 1
                }
                if(this.direction){
                    ctx.drawImage(characterFrames[`walk${this.walkFrame}`],this.x,this.y,55.5,75)
                } else {
                    ctx.translate(this.x+55.5,this.y)
                    ctx.scale(-1,1)
                    ctx.drawImage(characterFrames[`walk${this.walkFrame}`],0,0,55.5,75)
                    ctx.setTransform(1,0,0,1,0,0)
                }
                
                break;
            case "aim":
                if(this.firing&&this.fireTick>-1){
                    this.state = "aimfire"
                }
                if(this.direction){
                    ctx.drawImage(characterFrames[`aim`],this.x,this.y,63,75)
                } else {
                    ctx.translate(this.x+63,this.y)
                    ctx.scale(-1,1)
                    ctx.drawImage(characterFrames[`aim`],0,0,63,75)
                    ctx.setTransform(1,0,0,1,0,0)
                }
                //ctx.drawImage(characterFrames.aim,this.x,this.y,58,75)
                this.walkFrame = 1
                this.walkTick = 0;
                break;
            case "aimfire":
                this.fireTick++
                if(this.fireTick>5){
                    this.fireTick = -1
                    this.state = "aim"
                    this.firing = false
                }
                
                if(this.direction){
                    ctx.drawImage(characterFrames[`aimfire`],this.x,this.y,75,75)
                } else {
                    ctx.translate(this.x+63,this.y)
                    ctx.scale(-1,1)
                    ctx.drawImage(characterFrames[`aimfire`],0,0,75,75)
                    ctx.setTransform(1,0,0,1,0,0)
                }
                this.walkFrame = 1
                this.walkTick = 0;
                break;
            case "reload":
                this.reloadTick++
                if(this.reloadTick>1){
                    this.reloadTick = 0
                    this.reloadFrame++ 
                }
                if(this.reloadFrame > 14){
                    this.reloadFrame = 1
                    this.reloadTick = 0
                    this.state = "idle"
                    this.firing = false
                    this.ammunition = this.maxAmmunition
                }
                if(this.direction){
                    ctx.drawImage(characterFrames[`reload${this.reloadFrame}`],this.x,this.y,55.5,75)
                } else {
                    ctx.translate(this.x+55.5,this.y)
                    ctx.scale(-1,1)
                    ctx.drawImage(characterFrames[`reload${this.reloadFrame}`],0,0,55.5,75)
                    ctx.setTransform(1,0,0,1,0,0)
                }
                break;
            }
            
        }
        
    }
    reload(){
        if(this.state!="dead"&&!this.firing){
            this.firing = true
            this.state = "reload"
            this.reloadFrame = 1
        }
    }
    takeDamage(damage,crit){
        damage = parseInt(damage)
        if(this.state!="dead"){
            this.health -= damage
            var damage = new Damage(this.x+15,this.y+30,damage,objects.length,crit)
            objects.push(damage)
            if(this.health <= 0){
                this.health = 0
                this.die()
            }
        }
    }
    die(){
        this.state = "dead"
    }
    ai(){
        if(this.type == "enemy"&&this.state!="dead"&&player.state!="dead"){
            var head = player.hitbox.head;
            var body = player.hitbox.body;
            var inRange = this.detection.collides(head)||this.detection.collides(body)
            if(this.ammunition==0){
                this.reload()
            } else {
            if(inRange){
                this.state = "walk"
                var inFiringRange = this.fireRange.collides(head)||this.fireRange.collides(body)
                if(inFiringRange){
                    if(head.x1<this.x){
                        this.direction = false
                    } else {
                        this.direction = true
                    }
                    if(this.state!="aimfire")
                        this.state = "aim"
                    if(Math.floor(Math.random()*10)==5){
                        
                        this.fire(head.x1+7+(Math.random()*40-20),head.y1+7+(Math.random()*40-20))
                    }
                } else {
                if(head.x1<this.x){
                    this.direction = false
                    this.x-=this.speed
                } else {
                    this.direction = true
                    this.x+=this.speed
                }
                if(head.y1<this.y){
                    this.y-=this.speed
                } else {
                    this.y+=this.speed
                }
                }
            } else {
                this.state = "idle"
            }
            }
        }
    }
}

class Damage{
    constructor(x,y,value,id,crit){
        this.x = x;
        this.y = y;
        this.id = id;
        this.value = value;
        this.ticks = 0;
        this.crit = crit
    }
    render(){
        this.ticks++
        if(this.ticks<6){
            if(this.crit){
                ctx.fillStyle = `rgba(255,0,0,${(6-this.ticks)/6+0.2})`
            } else {
                ctx.fillStyle = `rgba(255,255,0,${(6-this.ticks)/6+0.2})`
            }
            ctx.font = "15px sans-serif"
            ctx.strokeStyle = `rgba(0,0,0,${(6-this.ticks)/6+0.2})`
            ctx.lineWidth = 1
            ctx.strokeText(`-${this.value}`,this.x,this.y)
            ctx.fillText(`-${this.value}`,this.x,this.y)
            this.y-=2
        } else {
            objects.splice(this.id,1)
        }
    }
}

class Grenade{
    constructor(x,y,damage,id){

    }
}


function setupMouse(){
    canvas.addEventListener("mousemove",function(e){
        mouse.x = e.clientX
        mouse.y = e.clientY
    })
    canvas.addEventListener("mousedown",function(){
        mouse.down = true
    })
    canvas.addEventListener("mouseup",function(){
        mouse.down = false
    })
}

function setupKeybinds(){
    document.addEventListener("keydown",function(e){
        keys[keymap[e.code]] = true
    })
    document.addEventListener("keyup",function(e){
        keys[keymap[e.code]] = false
    })
}

function fire(x,y,damage){
    var soldiers = [player].concat(enemies)
    for(var i=0; i<soldiers.length; i++){
        var head = soldiers[i].hitbox.head;
        var body = soldiers[i].hitbox.body;
        var point = new Rectangle(x,y,x,y)
        if(head.collides(point)){
            soldiers[i].takeDamage(1.5*damage,true)
        } else if(body.collides(point)){
            soldiers[i].takeDamage(damage)
        }
        
    }
}

function image(src){
    var image = new Image()
    image.src = src
    return image
}

function playerScript(){
    if(player.state!="dead"){
    if(!keys.up&&!keys.down&&!keys.left&&!keys.right){
        if(!player.firing)
        player.state = "idle"
    } else {
        if(!player.firing)
        player.state = "walk"
    }
    if(!player.firing){
    if(!keys.aim){
        if(!keys.reload){
            if(keys.up){
                if(keys.sprint)
                player.y-=player.speed*1.5
                 else 
                player.y-=player.speed
            }else if(keys.down){
                if(keys.sprint)
                player.y+=player.speed*1.5
                 else
                player.y+=player.speed
            }
            if(keys.left){
                if(keys.sprint)
                player.x-=player.speed*1.5
                 else
                player.x-=player.speed
                player.direction = false
            }else if(keys.right){
                if(keys.sprint)
                player.x+=player.speed*1.5
                 else
                player.x+=player.speed
                player.direction = true
            }
        } else {
            if(!player.firing){
                player.reload()
            }
        }
    } else {
        if(!player.firing){
            player.state = "aim"
        }
        player.direction = mouse.x>player.x+(63/2)
        if(mouse.down){
            if(!player.firing){
                player.shootStart = true
            }
        } else if(player.shootStart){
            player.fire(mouse.x,mouse.y)
        }
    }
    }
    }
    player.render()
    if(player.state == "aim" || player.state == "aimfire"){
        ctx.drawImage(images.crosshair,mouse.x-30,mouse.y-30,60,60)
    }

}