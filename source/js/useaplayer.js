const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    mini: true,
    theme: '#46718b',
    volume: 0.5,
    loop: 'all',
    order: 'list',
    lrcType: 3,
    audio: [
        {
            name: 'Collapsing World',
            artist: 'Lightscape',
            url: '/blog_music/Collapsing%20World.mp3',
            cover: '/blog_music/Collapsing%20World.jpg'
        },
        {
            name: 'Daylight',
            artist: 'Seredris',
            url: '/blog_music/Daylight.mp3',
            cover: '/blog_music/Daylight.jpg'
        },
        {
            name: "Kingdom Hearts \u2022 Xion's Theme",
            artist: 'Yoko Shimomura',
            url: '/blog_music/Kingdom%20Hearts%20%E2%80%A2%20Xion\'s%20Theme.mp3',
            cover: '/blog_music/Kingdom%20Hearts%20%E2%80%A2%20Xion\'s%20Theme.jpg'
        },
        {
            name: 'Komorebi',
            artist: '恰见明月栖山',
            url: '/blog_music/Komorebi.mp3',
            cover: '/blog_music/Komorebi.jpg'
        },
        {
            name: '\u611b',
            artist: 'seto',
            url: '/blog_music/%E6%84%9B-seto.mp3',
            cover: '/blog_music/%E6%84%9B-seto.jpg'
        }
    ]
});
