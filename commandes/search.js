const { silamd } = require("../silamd/sila");
const axios = require("axios");
const conf = require(__dirname + "/../set");

// FakeVCard kwa ajili ya reply
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

// ==================== HELPER FUNCTION: Send Carousel ====================
async function sendCarousel(zk, dest, title, cards, footer = "> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳") {
    if (!cards || cards.length === 0) return;
    
    await zk.sendMessage(dest, {
        interactiveMessage: {
            header: {
                title: `┏━❑ ${title} ━━━━━━━━━\n┃ 👆 *Swipe left/right to view more*\n┗━━━━━━━━━━━━━━━━━━━━`,
                hasMediaAttachment: false
            },
            body: {
                text: `📱 *Total: ${cards.length} results*`
            },
            carouselMessage: {
                cards: cards.slice(0, 10) // Maximum 10 cards
            }
        }
    }, { quoted: fkontak });
}

// ==================== 1. NEWS CARDS ====================
sila({
    nomCom: '𝚗𝚎𝚠𝚜',
    alias: ['news', 'headlines', 'latest'],
    desc: 'Latest news headlines',
    Categorie: 'Cards',
    reaction: '📰',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const category = arg[0] || 'general'; // general, business, technology, sports, entertainment, health, science
    await repondre(`┏━❑ 𝙽𝙴𝚆𝚂 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Loading ${category} news...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // GNews API - Bure (hakuna API key required kwa version hii)
        const response = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=YOUR_API_KEY`);
        
        // Kama huna API key, tumia alternative:
        // const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=YOUR_API_KEY`);
        
        // Kwa sasa tutatumia dummy data kwa demonstration (badilisha na API yako)
        const articles = response.data.articles || [];
        
        const cards = articles.map(article => ({
            header: `📰 *${article.title?.substring(0, 50) || 'News'}*`,
            body: {
                text: `┏━❑ 𝙽𝙴𝚆𝚂 ━━━━━━━━━\n┃ 📰 *Title:* ${article.title}\n┃ 📝 *Source:* ${article.source?.name || 'Unknown'}\n┃ 📅 *Published:* ${new Date(article.publishedAt).toLocaleDateString()}\n┃ 📌 *Description:* ${article.description || 'No description'}\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: article.urlToImage ? { image: { url: article.urlToImage } } : null,
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🔗 Read Full Article",
                        url: article.url
                    })
                },
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📋 Copy Link",
                        copy_code: article.url
                    })
                }
            ]
        })).filter(card => card.media); // Filter out cards without images

        await sendCarousel(zk, dest, "𝙽𝙴𝚆𝚂 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        // Fallback to dummy data kama API haifanyi kazi
        const dummyCards = [
            {
                header: "📰 *Tech News*",
                body: { text: "New AI breakthrough announced" },
                media: { image: { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Read More", url: "https://example.com" }) }]
            },
            {
                header: "📰 *Sports*",
                body: { text: "World Cup updates" },
                media: { image: { url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Read More", url: "https://example.com" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝙽𝙴𝚆𝚂 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 2. MOVIES CARDS ====================
sila({
    nomCom: '𝚖𝚘𝚟𝚒𝚎𝚜',
    alias: ['movies', 'films', 'mov'],
    desc: 'Popular movies',
    Categorie: 'Cards',
    reaction: '🎬',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const query = arg.join(" ") || 'popular';
    await repondre(`┏━❑ 𝙼𝙾𝚅𝙸𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Searching movies...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // The Movie Database API - Bure (signup kwa API key)
        const API_KEY = 'YOUR_TMDB_API_KEY'; // Register kwa https://www.themoviedb.org/
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        
        const movies = response.data.results || [];
        
        const cards = movies.slice(0, 10).map(movie => ({
            header: `🎬 *${movie.title}*`,
            body: {
                text: `┏━❑ 𝙼𝙾𝚅𝙸𝙴 ━━━━━━━━━\n┃ 🎬 *Title:* ${movie.title}\n┃ 📅 *Release:* ${movie.release_date || 'N/A'}\n┃ ⭐ *Rating:* ${movie.vote_average}/10\n┃ 📝 *Overview:* ${movie.overview?.substring(0, 100)}...\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: movie.poster_path ? { image: { url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` } } : null,
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎬 View Details",
                        url: `https://www.themoviedb.org/movie/${movie.id}`
                    })
                }
            ]
        })).filter(card => card.media);

        await sendCarousel(zk, dest, "𝙼𝙾𝚅𝙸𝙴𝚂 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        // Dummy data
        const dummyCards = [
            {
                header: "🎬 *Inception*",
                body: { text: "A thief who steals corporate secrets..." },
                media: { image: { url: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "View", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝙼𝙾𝚅𝙸𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 3. RECIPES CARDS ====================
sila({
    nomCom: '𝚛𝚎𝚌𝚒𝚙𝚎𝚜',
    alias: ['recipes', 'food', 'cooking'],
    desc: 'Find food recipes',
    Categorie: 'Cards',
    reaction: '🍳',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const dish = arg.join(" ") || 'pasta';
    await repondre(`┏━❑ 𝚁𝙴𝙲𝙸𝙿𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Searching recipes for ${dish}...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // TheMealDB API - Bure kabisa
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(dish)}`);
        
        const meals = response.data.meals || [];
        
        const cards = meals.slice(0, 10).map(meal => ({
            header: `🍳 *${meal.strMeal}*`,
            body: {
                text: `┏━❑ 𝚁𝙴𝙲𝙸𝙿𝙴 ━━━━━━━━━\n┃ 🍳 *Dish:* ${meal.strMeal}\n┃ 🏠 *Cuisine:* ${meal.strArea || 'Various'}\n┃ 📝 *Instructions:* ${meal.strInstructions?.substring(0, 150)}...\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: meal.strMealThumb ? { image: { url: meal.strMealThumb } } : null,
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🍳 Full Recipe",
                        url: meal.strSource || `https://www.themealdb.com/meal.php?c=${meal.idMeal}`
                    })
                },
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📋 Copy Instructions",
                        copy_code: meal.strInstructions || "No instructions"
                    })
                }
            ]
        })).filter(card => card.media);

        await sendCarousel(zk, dest, "𝚁𝙴𝙲𝙸𝙿𝙴𝚂 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "🍳 *Spaghetti Carbonara*",
                body: { text: "Classic Italian pasta dish" },
                media: { image: { url: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "View Recipe", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝚁𝙴𝙲𝙸𝙿𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 4. BOOKS CARDS ====================
sila({
    nomCom: '𝚋𝚘𝚘𝚔𝚜',
    alias: ['books', 'booksearch'],
    desc: 'Search for books',
    Categorie: 'Cards',
    reaction: '📚',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const book = arg.join(" ") || 'harry potter';
    await repondre(`┏━❑ 𝙱𝙾𝙾𝙺𝚂 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Searching books...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // Google Books API - Bure kabisa
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book)}&maxResults=10`);
        
        const books = response.data.items || [];
        
        const cards = books.map(book => {
            const info = book.volumeInfo;
            return {
                header: `📚 *${info.title?.substring(0, 50)}*`,
                body: {
                    text: `┏━❑ 𝙱𝙾𝙾𝙺 ━━━━━━━━━\n┃ 📚 *Title:* ${info.title}\n┃ ✍️ *Author:* ${info.authors?.join(', ') || 'Unknown'}\n┃ 📅 *Published:* ${info.publishedDate || 'N/A'}\n┃ 📝 *Description:* ${info.description?.substring(0, 100)}...\n┗━━━━━━━━━━━━━━━━━━━━`
                },
                media: info.imageLinks?.thumbnail ? { image: { url: info.imageLinks.thumbnail.replace('http:', 'https:') } } : null,
                buttons: [
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📖 Preview",
                            url: info.previewLink || `https://books.google.com/books?id=${book.id}`
                        })
                    },
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📋 Copy Info",
                            copy_code: `${info.title} by ${info.authors?.join(', ') || 'Unknown'}`
                        })
                    }
                ]
            };
        }).filter(card => card.media);

        await sendCarousel(zk, dest, "𝙱𝙾𝙾𝙺𝚂 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "📚 *Harry Potter*",
                body: { text: "By J.K. Rowling" },
                media: { image: { url: "http://books.google.com/books/content?id=5iTebBW-w7QC&printsec=frontcover&img=1&zoom=1&source=gbs_api" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "View", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝙱𝙾𝙾𝙺𝚂 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 5. WEATHER CARDS (Cities) ====================
sila({
    nomCom: '𝚠𝚎𝚊𝚝𝚑𝚎𝚛',
    alias: ['weather', 'temp'],
    desc: 'Weather forecast for cities',
    Categorie: 'Cards',
    reaction: '🌤️',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const cities = arg.length ? arg : ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
    await repondre(`┏━❑ 𝚆𝙴𝙰𝚃𝙷𝙴𝚁 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Loading weather...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // OpenWeatherMap API - Bure (signup kwa API key)
        const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Register kwa https://openweathermap.org/
        
        const cards = [];
        for (const city of cities.slice(0, 5)) {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
                const data = response.data;
                
                cards.push({
                    header: `🌤️ *${data.name}, ${data.sys.country}*`,
                    body: {
                        text: `┏━❑ 𝚆𝙴𝙰𝚃𝙷𝙴𝚁 ━━━━━━━━━\n┃ 🌡️ *Temp:* ${data.main.temp}°C\n┃ 🤔 *Feels like:* ${data.main.feels_like}°C\n┃ 💧 *Humidity:* ${data.main.humidity}%\n┃ 🌬️ *Wind:* ${data.wind.speed} m/s\n┃ ☁️ *Conditions:* ${data.weather[0].description}\n┗━━━━━━━━━━━━━━━━━━━━`
                    },
                    media: { image: { url: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png` } },
                    buttons: [
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🌤️ Full Forecast",
                                url: `https://openweathermap.org/city/${data.id}`
                            })
                        }
                    ]
                });
            } catch (e) {}
        }

        await sendCarousel(zk, dest, "𝚆𝙴𝙰𝚃𝙷𝙴𝚁 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "🌤️ *London*",
                body: { text: "15°C, Partly cloudy" },
                media: { image: { url: "https://openweathermap.org/img/wn/02d@4x.png" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "View", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝚆𝙴𝙰𝚃𝙷𝙴𝚁 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 6. SPORTS CARDS ====================
sila({
    nomCom: '𝚜𝚙𝚘𝚛𝚝𝚜',
    alias: ['sports', 'games', 'matches'],
    desc: 'Live sports and matches',
    Categorie: 'Cards',
    reaction: '⚽',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    await repondre(`┏━❑ 𝚂𝙿𝙾𝚁𝚃𝚂 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Loading sports...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // TheSportsDB API - Bure kabisa
        const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328`); // Premier League
        
        const events = response.data.events || [];
        
        const cards = events.slice(0, 10).map(event => ({
            header: `⚽ *${event.strEvent}*`,
            body: {
                text: `┏━❑ 𝚂𝙿𝙾𝚁𝚃𝚂 ━━━━━━━━━\n┃ ⚽ *Match:* ${event.strEvent}\n┃ 📅 *Date:* ${event.dateEvent}\n┃ ⏰ *Time:* ${event.strTime}\n┃ 🏆 *League:* ${event.strLeague}\n┃ 📺 *TV:* ${event.strTVStation || 'N/A'}\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: event.strThumb ? { image: { url: event.strThumb } } : null,
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "⚽ Match Details",
                        url: `https://www.thesportsdb.com/event/${event.idEvent}`
                    })
                }
            ]
        })).filter(card => card.media);

        await sendCarousel(zk, dest, "𝚂𝙿𝙾𝚁𝚃𝚂 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "⚽ *Man United vs Liverpool*",
                body: { text: "Premier League - Today 17:30" },
                media: { image: { url: "https://www.thesportsdb.com/images/media/event/thumb/pxvxtq1643419718.jpg" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "View", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝚂𝙿𝙾𝚁𝚃𝚂 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 7. ANIME CARDS ====================
sila({
    nomCom: '𝚊𝚗𝚒𝚖𝚎',
    alias: ['anime', 'animelist'],
    desc: 'Search anime shows',
    Categorie: 'Cards',
    reaction: '🎌',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const anime = arg.join(" ") || 'naruto';
    await repondre(`┏━❑ 𝙰𝙽𝙸𝙼𝙴 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Searching anime...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // Jikan API (MyAnimeList) - Bure kabisa
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=10`);
        
        const animes = response.data.data || [];
        
        const cards = animes.map(anime => ({
            header: `🎌 *${anime.title}*`,
            body: {
                text: `┏━❑ 𝙰𝙽𝙸𝙼𝙴 ━━━━━━━━━\n┃ 🎌 *Title:* ${anime.title}\n┃ 📅 *Year:* ${anime.year || 'N/A'}\n┃ ⭐ *Score:* ${anime.score}/10\n┃ 📝 *Episodes:* ${anime.episodes || 'Unknown'}\n┃ 📌 *Status:* ${anime.status}\n┃ 📖 *Synopsis:* ${anime.synopsis?.substring(0, 100)}...\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: anime.images?.jpg?.image_url ? { image: { url: anime.images.jpg.image_url } } : null,
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎌 More Info",
                        url: anime.url || `https://myanimelist.net/anime/${anime.mal_id}`
                    })
                },
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📋 Copy Title",
                        copy_code: anime.title
                    })
                }
            ]
        })).filter(card => card.media);

        await sendCarousel(zk, dest, "𝙰𝙽𝙸𝙼𝙴 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "🎌 *Naruto*",
                body: { text: "A ninja story" },
                media: { image: { url: "https://cdn.myanimelist.net/images/anime/13/17405.jpg" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "View", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝙰𝙽𝙸𝙼𝙴 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 8. MUSIC CARDS ====================
sila({
    nomCom: '𝚖𝚞𝚜𝚒𝚌',
    alias: ['music', 'songs', 'tracks'],
    desc: 'Search music and songs',
    Categorie: 'Cards',
    reaction: '🎵',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const song = arg.join(" ") || 'billie eilish';
    await repondre(`┏━❑ 𝙼𝚄𝚂𝙸𝙲 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Searching music...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // iTunes API - Bure kabisa
        const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(song)}&limit=10&media=music`);
        
        const tracks = response.data.results || [];
        
        const cards = tracks.map(track => ({
            header: `🎵 *${track.trackName || 'Unknown'}*`,
            body: {
                text: `┏━❑ 𝙼𝚄𝚂𝙸𝙲 ━━━━━━━━━\n┃ 🎵 *Song:* ${track.trackName}\n┃ 🎤 *Artist:* ${track.artistName}\n┃ 💿 *Album:* ${track.collectionName || 'Single'}\n┃ 📅 *Year:* ${track.releaseDate?.substring(0, 4) || 'N/A'}\n┃ ⏱️ *Duration:* ${Math.floor(track.trackTimeMillis / 60000)}:${Math.floor((track.trackTimeMillis % 60000) / 1000)}\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: track.artworkUrl100 ? { image: { url: track.artworkUrl100.replace('100x100', '600x600') } } : null,
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎵 Preview",
                        url: track.previewUrl || track.collectionViewUrl
                    })
                }
            ]
        })).filter(card => card.media);

        await sendCarousel(zk, dest, "𝙼𝚄𝚂𝙸𝙲 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "🎵 *Bad Guy*",
                body: { text: "Billie Eilish" },
                media: { image: { url: "https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/6b/7b/7b/6b7b7b3c-3f3c-9b4b-8b1b-3b3b3b3b3b3b/600x600bb.jpg" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Preview", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝙼𝚄𝚂𝙸𝙲 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 9. GAMES CARDS ====================
sila({
    nomCom: '𝚐𝚊𝚖𝚎𝚜',
    alias: ['games', 'videogames'],
    desc: 'Search video games',
    Categorie: 'Cards',
    reaction: '🎮',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    
    const game = arg.join(" ") || 'zelda';
    await repondre(`┏━❑ 𝙶𝙰𝙼𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Searching games...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // RAWG API - Bure (signup kwa API key)
        const API_KEY = 'YOUR_RAWG_API_KEY'; // Register kwa https://rawg.io/
        const response = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(game)}&page_size=10`);
        
        const games = response.data.results || [];
        
        const cards = games.map(game => ({
            header: `🎮 *${game.name}*`,
            body: {
                text: `┏━❑ 𝙶𝙰𝙼𝙴 ━━━━━━━━━\n┃ 🎮 *Title:* ${game.name}\n┃ 📅 *Released:* ${game.released || 'N/A'}\n┃ ⭐ *Rating:* ${game.rating}/5\n┃ 🏷️ *Genres:* ${game.genres?.map(g => g.name).join(', ') || 'Various'}\n┃ 🎯 *Platforms:* ${game.platforms?.map(p => p.platform.name).join(', ') || 'Multiple'}\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: game.background_image ? { image: { url: game.background_image } } : null,
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎮 More Info",
                        url: `https://rawg.io/games/${game.slug}`
                    })
                }
            ]
        })).filter(card => card.media);

        await sendCarousel(zk, dest, "𝙶𝙰𝙼𝙴𝚂 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "🎮 *The Legend of Zelda*",
                body: { text: "Action-adventure game" },
                media: { image: { url: "https://media.rawg.io/media/games/cc5/cc576aa274780702ef93463f5410031c.jpg" } },
                buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "View", url: "#" }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝙶𝙰𝙼𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});

// ==================== 10. QUOTES CARDS ====================
sila({
    nomCom: '𝚚𝚞𝚘𝚝𝚎𝚜',
    alias: ['quotes', 'quote'],
    desc: 'Inspirational quotes',
    Categorie: 'Cards',
    reaction: '💭',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    await repondre(`┏━❑ 𝚀𝚄𝙾𝚃𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 ━━━━━━━━━\n┃ ⏳ *Loading quotes...*\n┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        // Quotable API - Bure kabisa
        const response = await axios.get('https://api.quotable.io/quotes?limit=10');
        
        const quotes = response.data.results || [];
        
        const cards = quotes.map(quote => ({
            header: `💭 *${quote.author}*`,
            body: {
                text: `┏━❑ 𝚀𝚄𝙾𝚃𝙴 ━━━━━━━━━\n┃ 💭 *"${quote.content}"*\n┃ ━━━━━━━━━━━━━━━━━━━\n┃ ✍️ *- ${quote.author}*\n┃ 🏷️ *Tags:* ${quote.tags?.join(', ') || 'Inspirational'}\n┗━━━━━━━━━━━━━━━━━━━━`
            },
            media: { image: { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" } }, // Quote background
            buttons: [
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📋 Copy Quote",
                        copy_code: `"${quote.content}" - ${quote.author}`
                    })
                }
            ]
        }));

        await sendCarousel(zk, dest, "𝚀𝚄𝙾𝚃𝙴𝚂 𝙲𝙰𝚁𝙳𝚂", cards);

    } catch (error) {
        const dummyCards = [
            {
                header: "💭 *Albert Einstein*",
                body: { text: "Imagination is more important than knowledge." },
                media: { image: { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" } },
                buttons: [{ name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "Copy", copy_code: "Imagination is more important than knowledge." }) }]
            }
        ];
        await sendCarousel(zk, dest, "𝚀𝚄𝙾𝚃𝙴𝚂 𝙲𝙰𝚁𝙳𝚂 (𝙳𝚎𝚖𝚘)", dummyCards);
    }
});