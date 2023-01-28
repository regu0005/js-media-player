const APP = {

  init() {

    let songList = document.querySelectorAll('.track__item');
    songList.forEach( (song) => {
        
        song.addEventListener('click',()=>{
            let srcCover = song.querySelector('.song__img').src;
            let srcCoverBig = srcCover.replace("02","01");
            document.querySelector('.song__img_main').src = srcCoverBig;
        })
    })
  },
  
};

document.addEventListener('DOMContentLoaded', APP.init);
