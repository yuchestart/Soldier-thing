function mainloop(){
    try{
        ctx.clearRect(0,0,900,600)
        switch(state){
            case "load":
                ctx.fillStyle = "#000000"
                ctx.fillRect(0,0,900,600)
                var box = new Rectangle(350,285,200,30,true)
                var mousebox = new Rectangle(mouse.x,mouse.y,mouse.x,mouse.y)
                if(box.collides(mousebox)){
                    ctx.fillStyle="#707070"
                    ctx.fillRect(350,285,200,30)
                    canvas.style.cursor="pointer"
                    if(mouse.down){
                        state = "startup"
                    }
                } else {
                    canvas.style.cursor = "default"
                }
                ctx.strokeStyle = "#FFFFFF"
                ctx.lineWidth = 3;
                ctx.strokeRect(350,285,200,30)
                ctx.fillStyle = "#FFFFFF"
                ctx.font = "20px sans-serif"
                ctx.fillText("PLAY",450-ctx.measureText("PLAY").width/2,307)
                
                break;
            case "startup":
                canvas.style.cursor = "default"
                ctx.fillStyle = "#000000"
                ctx.fillRect(0,0,900,600)
                startupTick+=1;
                if(startupTick == 90){
                    state="menu"
                }
                if(startupTick > 10&&startupTick<50){
                    ctx.fillStyle = `rgba(255,255,255,${(startupTick-10)/10})`
                    ctx.font = "40px sans-serif"
                    ctx.fillText("What-ever-this-is",450-ctx.measureText("What-ever-this-is").width/2,307)
                }else if(startupTick>=50){
                    ctx.fillStyle = `rgba(255,255,255,${(60-startupTick)/10})`
                    ctx.font = "40px sans-serif"
                    ctx.fillText("What-ever-this-is",450-ctx.measureText("What-ever-this-is").width/2,307)
                }
                audio.menuTheme.currentTime = 0;
                break;
            case "menu":
                ctx.fillStyle = "#CCCCCC"
                ctx.fillRect(0,0,900,600)
                audio.menuTheme.loop = true
                audio.menuTheme.play()
                ctx.drawImage(images.logo,200,50,500,80)
                var box = new Rectangle(350,250,200,100,true)
                var mousebox = new Rectangle(mouse.x,mouse.y,mouse.x,mouse.y)
                if(box.collides(mousebox)){
                    ctx.fillStyle = "rgba(255,255,255,0.75)"
                    ctx.fillRect(350,250,200,100)
                    canvas.style.cursor="pointer"
                    if(mouse.down){
                        state = "play"
                        
                    }
                } else {
                    ctx.fillStyle = "rgba(255,255,255,0.5)"
                    ctx.fillRect(350,250,200,100)
                    canvas.style.cursor = "default"
                }
                ctx.fillStyle = "black"
                ctx.font = "55px sans-serif"
                ctx.fillText("PLAY",450-ctx.measureText("PLAY").width/2,320)
                break;
            case "play":
                audio.menuTheme.pause()
                canvas.style.cursor = "none"
                ctx.fillStyle = "#CCCCCC"
                ctx.fillRect(0,0,900,600)
                for(var i=0; i<enemies.length; i++){
                    enemies[i].ai()
                    enemies[i].render()
                }
                playerScript();
                for(var i=0; i<objects.length; i++){
                    objects[i].render()
                }
                ctx.fillStyle = "rgba(0,0,0,0.5)"
                ctx.fillRect(800,550,100,50)
                ctx.strokeStyle = "#000000"
                ctx.fillStyle = "#FFFFFF"
                ctx.font = "30px monospace"
                ctx.fillText(`${player.ammunition}/${player.maxAmmunition}`,810,590)
                ctx.font = "15px monospace"
                ctx.fillText("Rifle:",810,565)
                break;
            default:
                break;
        }
        if(running){
            setTimeout(mainloop,1000/FRAMERATE)
        }
    }catch(e){
        console.error(e.stack);
        return;
    }
}