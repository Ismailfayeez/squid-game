export class Sound {
    constructor() {
        this.pistol = document.getElementById('pistol')
        this.redLight = document.getElementById('red-light')
        this.greenLight = document.getElementById('green-light')
    }
    play(name, volume = 1) {
        this[name].currentTime = 0
        this[name].volume = volume
        this[name].play()
    }
}
