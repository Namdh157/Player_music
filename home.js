const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'ĐẶNG_ NAM';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const playList = $('.playlist');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const darkBtn = $('#dark-night');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    conFig: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConFig: function(key, value) {
        this.conFig[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.conFig));
    },
    songs: [{
            name: 'Bài Này Chill Phết',
            singer: 'Đen ft Min',
            image: './source/bai_nay_chill_phết.jpg',
            path: './source/Đen ft. MIN - Bài Này Chill Phết (M-V).mp3'
        },
        {
            name: 'Hai Triệu Năm',
            singer: 'Đen ft Biên',
            image: './source/2_Triệu_nam.jpg',
            path: './source/Đen - hai triệu năm ft. Biên (m-v).mp3'
        },
        {
            name: 'Bật Tình Yêu Lên',
            singer: 'Hòa Minzy ft Tăng Duy Tân',
            image: './source/bat_tinh_yeu_len.jpg',
            path: './source/BatTinhYeuLen-TangDuyTanHoaMinzy-8715666.mp3'
        },
        {
            name: 'Waiting For You',
            singer: 'Mono',
            image: './source/waiting_for_you.jpg',
            path: './source/WaitingForYou-MONOOnionn-7733882.mp3'
        },
        {
            name: 'Hãy Trao Cho Anh',
            singer: 'Sơn Tùng MTP',
            image: './source/Hay_trao_cho-anh.jpg',
            path: './source/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3'
        },
        {
            name: 'Không Phải Dạng Vừa Đâu',
            singer: 'Sơn Tùng MTP',
            image: './source/khong_dạng_phải_vua_dau.jpg',
            path: './source/Khong-Phai-Dang-Vua-Dau-Son-Tung-M-TP.mp3'
        },
        {
            name: 'Sóng Gió',
            singer: 'Jack Ft K-ICM',
            image: './source/sóng_gio.jpg',
            path: './source/SÓNG GIÓ - K-ICM x JACK - OFFICIAL MUSIC VIDEO.mp3'
        },
        {
            name: 'Em Gì Ơi',
            singer: 'Jack Ft K-ICM',
            image: './source/em_gì_ơi.jpg',
            path: './source/Jack - Em Gì Ơi - Official Lyric Video.mp3'
        }, {

            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            image: './source/nang_tho.jpg',
            path: './source/NangTho-HoangDung-6413381.mp3'
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            image: './source/Unstoppable.jpg',
            path: './source/Unstoppable - Sia (Lyrics + Vietsub) ♫.mp3'
        }
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${ index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity

        })
        cdThumbAnimate.pause();

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
           
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }
        nextBtn.onclick = function () {
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.next();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        prevBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.prev();
            }
            audio.play()
            _this.scrollToActiveSong();
            _this.scrollToActiveSong;
        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConFig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConFig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        darkBtn.onclick = function () {
            document.body.classList.toggle('dark-theme');
            if(document.body.classList.contains('dark-theme')){
                darkBtn.style.color = '#fff'
            }else {
                darkBtn.style.color = '#000'
            }
        }
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode || e.target.closest('.option')){
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }

    },
    loadConfig: function () {
        this.isRandom = this.conFig.isRandom;
        this.isRepeat = this.conFig.isRepeat;
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    next: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prev: function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300);
    },
    start: function () {
        this.loadConfig();
        this.handleEvents();
        this.defineProperties();
        this.loadCurrentSong();

        this.render();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat)

    }

}
app.start();