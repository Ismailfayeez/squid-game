import Pistol from '../assets/pistol.mp3';
import RedLight from '../assets/redLight.mp3';
import GreenLight from '../assets/greenLight.mp3';
import WinningBell from '../assets/winningBell.mp3';
import DollSong from '../assets/dollSong.mp3';
import Buzzer from '../assets/buzzer.mp3';

export class Sound {
    constructor() {
        this.pistol = new Audio(Pistol);
        this.redLight = new Audio(RedLight);
        this.greenLight = new Audio(GreenLight);
        this.winningBell = new Audio(WinningBell);
        this.dollSong = new Audio(DollSong);
        this.buzzer = new Audio(Buzzer);
    }
    play(name, volume = 1) {
        this[name].currentTime = 0;
        this[name].volume = volume;
        this[name].play();
    }
}
