function main(){
    canvas = document.getElementById("surface");
    ctx = canvas.getContext("2d");
    setupMouse()
    setupKeybinds()
    state = "load"
    mainloop()
}
window.onload = main;