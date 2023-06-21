let canvas,ctx;
let state = "???";
let startupTick = 0;
let running = true;
const mouse = {
    x:0,
    y:0,
    down:false,
    clicked:false
}
const keys = {
    up:false,
    down:false,
    left:false,
    right:false,
    reload:false,
    switch:false,
    grenade:false,
    aim:false,
    sprint:false
}
const keymap = {
    ArrowUp:"up",
    ArrowDown:"down",
    ArrowLeft:"left",
    ArrowRight:"right",
    KeyW:"up",
    KeyS:"down",
    KeyA:"left",
    KeyD:"right",
    KeyR:"reload",
    KeyE:"switch",
    KeyQ:"grenade",
    ShiftLeft:"aim",
    ShiftRight:"aim",
    Space:"sprint"
}
const audio = {
    menuTheme:new Audio("./resources/sounds/Menu Theme.mp3"),
    gunshot:new Audio("./resources/sounds/shoot.wav"),
    death:new Audio("./resources/sounds/death.mp3"),
    reload:new Audio("./resources/sounds/reload.wav"),
}
const images = {
    logo:image("./resources/images/logo.svg"),
    crosshair:image("./resources/images/crosshair.svg")
}
const characterFrames ={
    idle:image("./resources/images/character/SoldierIdle.svg"),
    walk1:image("./resources/images/character/SoldierWalk1.svg"),
    walk2:image("./resources/images/character/SoldierWalk2.svg"),
    walk3:image("./resources/images/character/SoldierWalk3.svg"),
    walk4:image("./resources/images/character/SoldierWalk4.svg"),
    walk5:image("./resources/images/character/SoldierWalk5.svg"),
    walk6:image("./resources/images/character/SoldierWalk6.svg"),
    reload1:image("./resources/images/character/SoldierReload1.svg"),
    reload2:image("./resources/images/character/SoldierReload2.svg"),
    reload3:image("./resources/images/character/SoldierReload3.svg"),
    reload4:image("./resources/images/character/SoldierReload4.svg"),
    reload5:image("./resources/images/character/SoldierReload5.svg"),
    reload6:image("./resources/images/character/SoldierReload6.svg"),
    reload7:image("./resources/images/character/SoldierReload7.svg"),
    reload8:image("./resources/images/character/SoldierReload8.svg"),
    reload9:image("./resources/images/character/SoldierReload9.svg"),
    reload10:image("./resources/images/character/SoldierReload10.svg"),
    reload11:image("./resources/images/character/SoldierReload11.svg"),
    reload12:image("./resources/images/character/SoldierReload12.svg"),
    reload13:image("./resources/images/character/SoldierReload13.svg"),
    reload14:image("./resources/images/character/SoldierReload14.svg"),
    aim:image("./resources/images/character/SoldierAim.svg"),
    aimfire:image("./resources/images/character/SoldierAimFire.svg"),
    fire:image("./resources/images/character/SoldierFire.svg")
}
const enemyFrames = {
    idle:image("./resources/images/enemy/SoldierIdle.svg"),
    walk1:image("./resources/images/enemy/SoldierWalk1.svg"),
    walk2:image("./resources/images/enemy/SoldierWalk2.svg"),
    walk3:image("./resources/images/enemy/SoldierWalk3.svg"),
    walk4:image("./resources/images/enemy/SoldierWalk4.svg"),
    walk5:image("./resources/images/enemy/SoldierWalk5.svg"),
    walk6:image("./resources/images/enemy/SoldierWalk6.svg"),
    reload1:image("./resources/images/enemy/SoldierReload1.svg"),
    reload2:image("./resources/images/enemy/SoldierReload2.svg"),
    reload3:image("./resources/images/enemy/SoldierReload3.svg"),
    reload4:image("./resources/images/enemy/SoldierReload4.svg"),
    reload5:image("./resources/images/enemy/SoldierReload5.svg"),
    reload6:image("./resources/images/enemy/SoldierReload6.svg"),
    reload7:image("./resources/images/enemy/SoldierReload7.svg"),
    reload8:image("./resources/images/enemy/SoldierReload8.svg"),
    reload9:image("./resources/images/enemy/SoldierReload9.svg"),
    reload10:image("./resources/images/enemy/SoldierReload10.svg"),
    reload11:image("./resources/images/enemy/SoldierReload11.svg"),
    reload12:image("./resources/images/enemy/SoldierReload12.svg"),
    reload13:image("./resources/images/enemy/SoldierReload13.svg"),
    reload14:image("./resources/images/enemy/SoldierReload14.svg"),
    aim:image("./resources/images/enemy/SoldierAim.svg"),
    aimfire:image("./resources/images/enemy/SoldierAimFire.svg"),
    fire:image("./resources/images/enemy/SoldierFire.svg")
}
const playertemplate = new Soldier(10,40,"player")
let player = Object.assign(Object.create(Object.getPrototypeOf(playertemplate)),playertemplate)
const enemies = [new Soldier(10,30,"enemy",1000,0.4,40,60,700,500),new Soldier(10,30,"enemy",1000,0.4,40,60,700,400),new Soldier(10,30,"enemy",1000,0.4,40,60,700,300)]
const mission = {
    operationCost:0,
    score:0
}
const finance = {
    money:100
}
const game = {
    deathTick:0
}
const objects = []
const FRAMERATE = 30;