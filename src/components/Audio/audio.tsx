import { Howl, Howler } from 'howler';

const hoverLinkAudio = new Howl({
   src: ['/audio/hover-link.mp3']
});

const hoverBtnAudio = new Howl({
   src: ['/audio/hover-btn.mp3']
});

const openGateAudio = new Howl({
   src: ['/audio/open-gate.mp3']
});

const closeGateAudio = new Howl({
   src: ['/audio/close-gate.mp3']
});



export {
   hoverLinkAudio,
   hoverBtnAudio,
   openGateAudio,
   closeGateAudio
}
