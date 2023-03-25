import MEDIA from './media.js';

const APP = {
  audio: new Audio(),   // the Audio Element that will play every track
  currentTrack: 0,      // the integer representing the index in the MEDIA array
  songList: [],
  songIDs: [],
  routeImg: './images/',
  routeMP3: './mp3/',
  currentAudio: new Audio(),
  backTrack: '',
  nextTrack: '',
  playState: 0,
  iconPlay: '',
  iconPause: '',
  iconSufle: '',
  iconBack: '',
  iconNext: '',
  slider: '',
  arrayTemp: [],
  flagFirstAudio: 0,  
  init: () => {
    // --- Called when DOMContentLoaded is triggered:::

    // Init the main array (default sort)
    APP.initFirstList();

    // Init Playlist
    APP.initPlaylist();

    // Init iconPlay variable
    APP.iconPlay = document.getElementById('btnPlay');

    // Default - Hide pause icon
    APP.iconPause = document.getElementById('btnPause');
    APP.iconPause.style.display = 'none';

    APP.iconBack = document.getElementById('btnPrev');
    APP.iconNext = document.getElementById('btnNext');
    APP.iconSufle = document.getElementById('btnShuffle');

    // Slider
    APP.slider = document.getElementById('slider');

    APP.addTrackListener();
    // Init Button listeners
    APP.addButtonListeners();
  },
  async initFirstList(){
    let countTracks = 0;
    await MEDIA.map((obj) => {
        APP.arrayTemp[countTracks] = Object.entries(obj);
        countTracks++;
    });
  },
  async initPlaylist(){
    
    APP.songIDs = [];
    APP.songList = [];
    
    let playerContainer = document.getElementById('playlist');

    for(let i=0; i<APP.arrayTemp.length; i++)
    {
        let id          = i+1; // APP.arrayTemp[i][0][1];   // i-1;
        let image_big   = APP.arrayTemp[i][1][1];
        let image_small = APP.arrayTemp[i][2][1];
        let mp3         = APP.arrayTemp[i][3][1];
        let title       = APP.arrayTemp[i][4][1];
        let artist      = APP.arrayTemp[i][5][1];

        let titleArtist = title + ' - ' + artist;

        let contentAudio = `
            <li class="box track__item" data-track="${APP.routeMP3}${mp3}">
                <div class="track__thumb">
                        <img class="song__img" src="${APP.routeImg}${image_small}" alt="${titleArtist}" />
                </div>
                <div class="track__info" data-id=${id}>
                    <div class="track__details">
                        <p class="track__title">${title}</p>
                        <p class="track__artist">${artist}</p>
                    </div>
                    <div class="track__time">
                        <time class="total__mins"></time>
                    </div>
                    <div class="track__mp3">
                        <audio>${APP.routeMP3}${mp3}</audio>
                    </div>
                </div> 
            </li>
        `;

        let audioItem = document.createElement('li');
        audioItem.innerHTML = contentAudio;

        playerContainer.appendChild(audioItem);

        // Store track ID
        APP.songIDs.push(id);
    }

    // let playlistIni = MEDIA.map((obj) => {

    //     let { id, title, artist, mp3, image_small } = obj;

    //     let titleArtist = title + ' - ' + artist;

    //     let contentAudio = `
    //         <li class="box track__item" data-track="${APP.routeMP3}${mp3}">
    //             <div class="track__thumb">
    //                     <img class="song__img" src="${APP.routeImg}${image_small}" alt="${titleArtist}" />
    //             </div>
    //             <div class="track__info" data-id=${id}>
    //                 <div class="track__details">
    //                     <p class="track__title">${title}</p>
    //                     <p class="track__artist">${artist}</p>
    //                 </div>
    //                 <div class="track__time">
    //                     <time class="total__mins"></time>
    //                 </div>
    //                 <div class="track__mp3">
    //                     <audio>${APP.routeMP3}${mp3}</audio>
    //                 </div>
    //             </div> 
    //         </li>
    //     `;

    //     let audioItem = document.createElement('li');
    //     audioItem.innerHTML = contentAudio;

    //     playerContainer.appendChild(audioItem);

    //     // Store track ID
    //     APP.songIDs.push(id);
    // });
  },
  addTrackListener() {
    // APP.songList = document.querySelectorAll('.track__item');
    APP.songList = document.querySelectorAll('.track__item');
    APP.songList.forEach( (song) => {

        if(song.src!='')
        {
            song.addEventListener('click',()=>{

                // Change main cover
                let srcCover = song.querySelector('.song__img').src;
                let srcCoverBig = srcCover.replace("02","01");
                document.querySelector('.song__img_main').src = srcCoverBig;

                // Store track ID
                let srcTrackInfo = song.querySelector('.track__info');
                let trackid = srcTrackInfo.getAttribute('data-id');

                APP.playSong(trackid-1);

            });
            
            // Set the first song as default
                if(APP.flagFirstAudio==0)
                {
                        let srcAudio = song.getAttribute('data-track');
                        let newAudio = new Audio(srcAudio);
                        APP.currentAudio = newAudio;
                        
                        APP.playSong(0);
                }
            // Error
                song.addEventListener('error',(ev)=>{
                    console.warn("Error: ", err);
                });
        }
        
    });
  },
  addButtonListeners: () => {

    // Set the listener to Play the current song
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

    // Set the listener to Pause the current song
    APP.iconPause.addEventListener('click',() => {
        APP.pauseSong();
    });

    // Set listener to play the next song
    APP.iconNext.addEventListener('click', () => {

        let currentIndex = APP.songIDs.indexOf(parseInt(APP.currentTrack));

        let newIndex = parseInt(currentIndex) + 1;

        // GET NEXT AUDIO

        if(newIndex<APP.songIDs.length)
        {
            APP.playSong(newIndex);
        }
        else
        {
            APP.currentTrack = 0;
            APP.playSong(APP.currentTrack);
        }
    });

    // Set listener to play the previous song
    APP.iconBack.addEventListener('click', () => {

        let currentIndex = APP.songIDs.indexOf(parseInt(APP.currentTrack));

        let newIndex = parseInt(currentIndex) - 1;

        // GET PREVIOUS AUDIO

        if(newIndex<0)
        {
            APP.currentTrack = APP.songIDs.length - 1;
            APP.playSong(APP.currentTrack);
        }
        else
        {
            APP.playSong(newIndex);
        }
    })

    APP.iconSufle.addEventListener('click', () => {
        APP.shufflePlaylist();
    })

    // Set the listeener for the Slider
    APP.slider.addEventListener('change', () => {
        let trackPosition = APP.currentAudio.duration * (APP.slider.value / 100);
        APP.currentAudio.currentTime = trackPosition;
    });

  },
  pauseSong(){
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
  },
  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  },
  shufflePlaylist: () => {
    
    let playerContainer = document.getElementById('playlist');
    playerContainer.innerHTML = "";

    APP.arrayTemp = APP.shuffleArray(APP.arrayTemp);

    APP.initPlaylist();

    APP.addTrackListener();

    APP.pauseSong();
  },
  updateSlider: () => {
    let trackPosition = APP.currentAudio.currentTime * (100 / APP.currentAudio.duration);
    APP.slider.value = trackPosition;
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
  playSong: (index) => {
    //start the track loaded into APP.audio playing
    try {

        // Reset slider
        APP.slider.value = 0;

        // Change main cover
        let srcCover = APP.songList[index].querySelector('.song__img').src;
        let srcCoverBig = srcCover.replace("02","01");
        document.querySelector('.song__img_main').src = srcCoverBig;

        // Store track ID
        let srcTrackInfo = APP.songList[index].querySelector('.track__info');
        let trackid = srcTrackInfo.getAttribute('data-id');

        // Manage the audio and change the icon Play/Pause
        let srcAudio = APP.songList[index].getAttribute('data-track');
        let newAudio = new Audio(srcAudio);

        if(APP.currentAudio.src === newAudio.src)
        {            
            if(APP.currentAudio.paused){

                if(APP.flagFirstAudio!=0)
                {
                    APP.currentAudio.play();
                }
                else
                {
                    APP.currentAudio.pause();
                }
                
                APP.playState = 1;

                // Save the current track ID
                APP.currentTrack = trackid;
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

            // Save the current track ID
            APP.currentTrack = trackid;
        }

        // Buttons Play and Pause - Show or Hide depending the flag
        if(APP.flagFirstAudio!=0)
        {
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
        else{
            APP.flagFirstAudio = 1;
        }
        // Update Time info: Current time of the track, total duration in mins and segs

        let sTotalMinsText = APP.songList[index].querySelector('.total__mins');

        let mTotalMinsText = document.querySelector('.total-time');
        let mCurrentMinsText = document.querySelector('.current-time');
        let rangePlayed = document.getElementById('rangeValue');

        APP.currentAudio.addEventListener('timeupdate', () => {
            let durationPercent = APP.currentAudio.currentTime * (100 / APP.currentAudio.duration);
            durationPercent = Math.round(durationPercent * 100) / 100;
            rangePlayed.innerHTML = durationPercent + " %";

            sTotalMinsText.innerHTML = APP.convertTimeDisplay(APP.currentAudio.duration);
            mTotalMinsText.innerHTML = APP.convertTimeDisplay(APP.currentAudio.duration);
            mCurrentMinsText.innerHTML = APP.convertTimeDisplay(APP.currentAudio.currentTime);

        });

        // Update the slider
        clearInterval(APP.updateTimer);
        APP.updateTimer = setInterval(APP.updateSlider, 1000);
    } 
    catch(err) {
        console.warn("Error: ", err)
    }
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