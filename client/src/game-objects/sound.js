import Pistol from '../assets/pistol.mp3';
import RedLight from '../assets/redLight.mp3';
import GreenLight from '../assets/greenLight.mp3';
import WinningBell from '../assets/winningBell.mp3';
import DollSong from '../assets/dollSong.mp3';
import Buzzer from '../assets/buzzer.mp3';

export class Sound {
    constructor() {
        this.audio = new Audio();
        this.pistol = Pistol;
        this.redLight = RedLight;
        this.greenLight = GreenLight;
        this.winningBell = WinningBell;
        this.dollSong = DollSong;
        this.buzzer = Buzzer;
    }
    play(name, volume = 1) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = this[name];
        this.audio.volume = volume;
        this.audio.play();
    }
}
