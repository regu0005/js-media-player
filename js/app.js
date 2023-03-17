import MEDIA from './media.json' assert { type: "json" };

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  songList: [],
  routeImg: './images/',
  routeMP3: './mp3/',
  currentAudio: new Audio(),
  playState: 0,
  iconPlay: '',
  iconPause: '',
  flagFirstAudio: 0,
  init: () => {
    // Called when DOMContentLoaded is triggered

    // Init Playlist
    APP.initPlaylist();

    // Default - Hide pause icon
    APP.iconPlay = document.getElementById('btnPlay');
    APP.iconPause = document.getElementById('btnPause');
    APP.iconPause.style.display = 'none';

    // Init listeners
    APP.addListeners();
  },
  initPlaylist(){
    let playerContainer = document.getElementById('playlist');
    let playlist = MEDIA.map( (obj) => {
        let title = obj.title;
        let artist = obj.artist;
        let titleArtist = title+' - '+artist;
        let songFile = obj.mp3;
        let imgSmall = obj.image_small;

        let audioItem = document.createElement('li');
        audioItem.classList.add('box');
        audioItem.classList.add('track__item');
        audioItem.innerHTML = `
        
                <div class="track__thumb">
                  <img class="song__img" src="${APP.routeImg}${imgSmall}" alt="${titleArtist}" />
                </div>
                <div class="track__info">
                  <div class="track__details">
                    <p class="track__title">${title}</p>
                    <p class="track__artist">${artist}</p>
                  </div>
                  <div class="track__time">
                    <time class="total__mins"></time>
                  </div>
                  <div class="track__mp3">
                    <audio>${APP.routeMP3}${songFile}</audio>
                  </div>
                </div>
        
        `;
        // APP.setupAudio(`${APP.routeMP3}${songFile}`);
        playerContainer.appendChild(audioItem);
    });
  },
  addListeners: () => {
    //add event listeners for interface elements
    //add event listeners for APP.audio    

    APP.songList = document.querySelectorAll('.track__item');
    
    APP.songList.forEach( (song) => {
        
        if(song.src!='')
        {
            song.addEventListener('click',()=>{

                try {
                    // Change main cover
                    let srcCover = song.querySelector('.song__img').src;
                    let srcCoverBig = srcCover.replace("02","01");
                    document.querySelector('.song__img_main').src = srcCoverBig;

                    // Manage the audio and change the icon Play/Pause
                    let srcAudio = song.querySelector('audio').innerHTML;
                    let newAudio = new Audio(srcAudio);

                    if(APP.currentAudio.src === newAudio.src)
                    {            
                        if(APP.currentAudio.paused){
                            APP.currentAudio.play();
                            APP.playState = 1;
                        }
                        else{
                            APP.currentAudio.pause();
                            APP.playState = 0;
                        }
                    }
                    else
                    {
                        APP.currentAudio.pause();
                        newAudio.play();
                        APP.currentAudio = newAudio;
                        APP.playState = 1;
                    }

                    // Buttons Play and Pause - Show or Hide depending the flag
                        if(APP.playState == 1)
                        {
                            APP.iconPlay.style.display = 'none';
                            APP.iconPause.style.display = '';
                        }
                        else 
                        {
                            APP.iconPlay.style.display = '';
                            APP.iconPause.style.display = 'none';
                        }

                    // Update Time info: Current time of the track, total duration in mins and segs

                    let sTotalMinsText = song.querySelector('.total__mins');
                    let mTotalMinsText = document.querySelector('.total-time');
                    let mCurrentMinsText = document.querySelector('.current-time');
                    let rangePlayed = document.getElementById('rangeValue');

                    newAudio.addEventListener('timeupdate', () => {
                        let durationPercent = newAudio.currentTime * (100 / newAudio.duration);
                        durationPercent = Math.round(durationPercent * 100) / 100;
                        rangePlayed.innerHTML = durationPercent + " %";

                        sTotalMinsText.innerHTML = APP.convertTimeDisplay(newAudio.duration);
                        mTotalMinsText.innerHTML = APP.convertTimeDisplay(newAudio.duration);
                        mCurrentMinsText.innerHTML = APP.convertTimeDisplay(newAudio.currentTime);

                    });

                } 
                catch(err) {
                    console.warn("Error: ", err)
                }

            });
            // Display mins and secs of each track onload
                // let srcAudioBase = song.querySelector('audio').innerHTML;
                // console.log("srcAudio: ",srcAudioBase);

                // let newAudioBase = new Audio(srcAudioBase);
                // let sTotalMinsText = song.querySelector('.total__mins');

                // console.log("newAudioBase.duration: ", newAudioBase.duration);

                // let totalMins = Math.floor( newAudioBase.duration / 60 );
                // let totalSecs = Math.floor( newAudioBase.duration - (totalMins * 60) );

                // if(totalMins < 10) { totalMins = "0"+totalMins; }
                // if(totalSecs < 10) { totalSecs = "0"+totalSecs; }

                // sTotalMinsText.innerHTML = totalMins + ":" + totalSecs;

            // Set the first song as default
                if(APP.flagFirstAudio==0)
                {
                    try {
                        let srcAudio = song.querySelector('audio').innerHTML;
                        let newAudio = new Audio(srcAudio);
                        APP.currentAudio = newAudio;
                        
                        APP.flagFirstAudio = 1;

                        let srcCover = song.querySelector('.song__img').src;
                        let srcCoverBig = srcCover.replace("02","01");
                        document.querySelector('.song__img_main').src = srcCoverBig;

                        // Update Time info: Current time of the track, total duration in mins and segs

                        let sTotalMinsText = song.querySelector('.total__mins');
                        let mTotalMinsText = document.querySelector('.total-time');
                        let mCurrentMinsText = document.querySelector('.current-time');

                        newAudio.addEventListener('timeupdate', () => {
                            let durationPercent = newAudio.currentTime * (100 / newAudio.duration);
                            durationPercent = Math.round(durationPercent * 100) / 100;
                            rangePlayed.innerHTML = durationPercent + " %";

                            sTotalMinsText.innerHTML = APP.convertTimeDisplay(newAudio.duration);
                            mTotalMinsText.innerHTML = APP.convertTimeDisplay(newAudio.duration);
                            mCurrentMinsText.innerHTML = APP.convertTimeDisplay(newAudio.currentTime);

                        });
                    } 
                    catch(err) {
                        console.warn("Error: ", err)
                    }
                }
            // Error
                song.addEventListener('error',(ev)=>{
                    console.warn("Error: ", err);
                });
        }

    });

    // Set the listener to Play and Pause buttons
    APP.iconPlay.addEventListener('click',() => {
        if(APP.currentAudio.src !='')
        {
            if(APP.currentAudio.paused){
                APP.currentAudio.play();
                APP.playState = 1;
            }
            else{
                APP.currentAudio.pause();
                APP.playState = 0;
            }
            // Buttons Play and Pause - Show or Hide depending the flag
            if(APP.playState == 1)
            {
                APP.iconPlay.style.display = 'none';
                APP.iconPause.style.display = '';
            }
            else 
            {
                APP.iconPlay.style.display = '';
                APP.iconPause.style.display = 'none';
            }
        }
    });
    APP.iconPause.addEventListener('click',() => {
        if(APP.currentAudio.src!='')
        {
            if(APP.currentAudio.paused){
                APP.currentAudio.play();
                APP.playState = 1;

            }
            else{
                APP.currentAudio.pause();
                APP.playState = 0;
            }

            // Buttons Play and Pause - Show or Hide depending the flag
            if(APP.playState == 1)
            {
                APP.iconPlay.style.display = 'none';
                APP.iconPause.style.display = '';
            }
            else 
            {
                APP.iconPlay.style.display = '';
                APP.iconPause.style.display = 'none';
            }
        }
    });

    
  },
  updateImage: (srcImage) => {
    let srcCoverBig = srcImage.replace("02","01");
    document.querySelector('.song__img_main').src = srcCoverBig;
  },
  buildPlaylist: () => {
    //read the contents of MEDIA and create the playlist
  },
  loadCurrentTrack: () => {
    //use the currentTrack value to set the src of the APP.audio element
  },
  play: () => {
    //start the track loaded into APP.audio playing
  },
  pause: () => {
    //pause the track loaded into APP.audio playing
  },
  convertTimeDisplay: (seconds) => {
    //convert the seconds parameter to `00:00` style display
    let mMins = Math.floor( seconds / 60 );
    let mSecs = Math.floor( seconds - (mMins * 60) );

    if(mMins < 10) { mMins = "0"+mMins; }
    if(mSecs < 10) { mSecs = "0"+mSecs; }

    return mMins + ":" + mSecs;
  },
};

document.addEventListener('DOMContentLoaded', APP.init);