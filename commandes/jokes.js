const { silamd } = require("../silamd/sila");

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

// ==================== JOKES COMMANDS ====================

// 1. JOKE - Short Jokes
sila({ 
    nomCom: 'joke',
    alias: ['joke', 'shortjoke'],
    desc: 'Get a short funny joke',
    Categorie: 'Jokes',
    reaction: '😄',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "What do you call a fake noodle? An impasta!",
        "Why don't eggs tell jokes? They'd crack each other up!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why did the math book look sad? Because it had too many problems!",
        "What do you call a sleeping bull? A bulldozer!",
        "Why can't you give Elsa a balloon? Because she will let it go!",
        "What do you call a fish wearing a bowtie? Sofishticated!",
        "Why did the cookie go to the doctor? Because it felt crumbly!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await zk.sendMessage(dest, {
        text: `┏━❑ 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 😄 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
        contextInfo: { mentionedJid: [] }
    }, { quoted: fkontak });
});

// 2. JOKE - Dad Jokes
sila({ 
    nomCom: 'dadjoke',
    alias: ['dadjoke', 'dad'],
    desc: 'Get a classic dad joke',
    Categorie: 'Jokes',
    reaction: '👨',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "What do you call a factory that sells generally okay products? A satis-factory!",
        "I used to hate facial hair, but then it grew on me.",
        "Why don't skeletons fight each other? They don't have the guts.",
        "What do you call a man with a rubber toe? Roberto!",
        "I told my wife she should embrace her mistakes. She gave me a hug.",
        "I'm on a seafood diet. I see food and I eat it.",
        "Why did the coffee file a police report? It got mugged!",
        "What do you call a fake noodle? An impasta!",
        "How do you make holy water? You boil the hell out of it."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙳𝙰𝙳 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 👨 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 3. JOKE - Programming Jokes
sila({ 
    nomCom: 'programming',
    alias: ['prog', 'codingjoke', 'programmingjoke'],
    desc: 'Jokes for programmers',
    Categorie: 'Jokes',
    reaction: '💻',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "Why do Java developers wear glasses? Because they can't C#!",
        "What's a programmer's favorite hangout place? Foo Bar!",
        "Why did the programmer quit his job? Because he didn't get arrays!",
        "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
        "There are only 10 types of people in the world: those who understand binary and those who don't.",
        "Why was the JavaScript developer sad? Because he didn't Node how to Express himself!",
        "What do you call a programmer from Finland? Nerdic!",
        "I would tell you a UDP joke, but you might not get it."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙿𝚁𝙾𝙶𝚁𝙰𝙼𝙼𝙸𝙽𝙶 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 💻 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 4. JOKE - Animal Jokes
sila({ 
    nomCom: 'animaljoke',
    alias: ['animal', 'animaljokes'],
    desc: 'Funny jokes about animals',
    Categorie: 'Jokes',
    reaction: '🐾',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Why don't cats play poker in the jungle? Too many cheetahs!",
        "What do you call a dog that can do magic? A Labracadabrador!",
        "Why did the cow go to space? To see the Milky Way!",
        "What do you call a sleeping dinosaur? A dino-snore!",
        "Why don't penguins fly? Because they're not tall enough to be pilots!",
        "What do you call a pig that does karate? A pork chop!",
        "Why did the frog take the bus to work? His car got toad away!",
        "What do you call a bear caught in the rain? A drizzly bear!",
        "Why do seagulls fly over the sea? Because if they flew over the bay, they'd be bagels!",
        "What's a cat's favorite color? Purr-ple!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙰𝙽𝙸𝙼𝙰𝙻 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 🐾 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 5. JOKE - Knock Knock Jokes
sila({ 
    nomCom: 'knockknock',
    alias: ['knock', 'knockjoke'],
    desc: 'Classic knock knock jokes',
    Categorie: 'Jokes',
    reaction: '🚪',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Knock knock.\nWho's there?\nLettuce.\nLettuce who?\nLettuce in, it's cold out here!",
        "Knock knock.\nWho's there?\nAnee.\nAnee who?\nAnee one you like!",
        "Knock knock.\nWho's there?\nTank.\nTank who?\nYou're welcome!",
        "Knock knock.\nWho's there?\nOrange.\nOrange who?\nOrange you glad I didn't say banana?",
        "Knock knock.\nWho's there?\nAtch.\nAtch who?\nBless you!",
        "Knock knock.\nWho's there?\nBoo.\nBoo who?\nDon't cry, it's just a joke!",
        "Knock knock.\nWho's there?\nCow says.\nCow says who?\nNo silly, cow says moo!",
        "Knock knock.\nWho's there?\nHatch.\nHatch who?\nBless you, you must be sick!",
        "Knock knock.\nWho's there?\nLuke.\nLuke who?\nLuke through the peephole and find out!",
        "Knock knock.\nWho's there?\nWooden shoe.\nWooden shoe who?\nWooden shoe like to know!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙺𝙽𝙾𝙲𝙺 𝙺𝙽𝙾𝙲𝙺 ━━━━━━━━━
┃ 🚪 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 6. JOKE - Dark Humor
sila({ 
    nomCom: 'darkjoke',
    alias: ['dark', 'darkhumor'],
    desc: 'Dark humor jokes (18+)',
    Categorie: 'Jokes',
    reaction: '💀',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "My grief counselor died. He was so good, I don't even care.",
        "I was digging in the garden and found a chest full of gold coins. I was about to run and tell my wife, but then I remembered why I was digging in the garden.",
        "The last thing my grandfather said before he kicked the bucket was 'How far do you think I can kick this bucket?'",
        "My wife is so negative, I remember the day she took a pregnancy test and the result was positive. She returned it and asked for her money back.",
        "I have my grandfather's eyes. And he has my PlayStation. We traded.",
        "What's the difference between a pizza and an orphan? A pizza can feed a family of four.",
        "My grandpa's last words were 'Are you still holding the ladder?'",
        "I visited my new friend in his apartment. He told me 'Make yourself at home.' So I threw him out. I hate having visitors.",
        "What's red and bad for your teeth? A brick.",
        "I'll never forget my grandfather's last words: 'Stop shaking the ladder, you little...'"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙳𝙰𝚁𝙺 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 💀 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 7. JOKE - Blonde Jokes
sila({ 
    nomCom: 'blondejoke',
    alias: ['blonde', 'blondejokes'],
    desc: 'Funny blonde jokes',
    Categorie: 'Jokes',
    reaction: '👱',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "A blonde is driving down the road when she sees a sign that says 'Look out for falling rocks.' She looks up and says, 'Okay, I see them!'",
        "Why do blondes smile during lightning storms? They think their picture is being taken!",
        "A blonde was filling out a job application. When she got to 'SEX:' she wrote 'Occasionally.'",
        "Why did the blonde stare at the orange juice carton? Because it said 'Concentrate'!",
        "How do you sink a submarine full of blondes? Knock on the hatch!",
        "Why do blondes have TGIF on their shoes? Toes Go In First!",
        "What does a blonde say when you ask her if she wants pizza? 'No, I don't want a pizza that's cut into squares, I want it cut into triangles!'",
        "Why can't blondes be detectives? They always lose their train of thought at the station!",
        "A blonde, a brunette, and a redhead are in a car. Who's driving? The police officer who pulled them over!",
        "Why did the blonde put lipstick on her forehead? She wanted to make up her mind!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙱𝙻𝙾𝙽𝙳𝙴 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 👱 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 8. JOKE - Medical Jokes
sila({ 
    nomCom: 'medicaljoke',
    alias: ['medical', 'doctorjoke'],
    desc: 'Jokes about doctors and medicine',
    Categorie: 'Jokes',
    reaction: '💊',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Doctor: 'I have bad news and worse news.' Patient: 'What's the bad news?' Doctor: 'You only have 24 hours to live.' Patient: 'That's terrible! What could be worse?' Doctor: 'I've been trying to reach you since yesterday.'",
        "A man goes to the doctor and says, 'Doctor, I think I'm a dog.' Doctor says, 'Lie down on the couch.' Man says, 'I can't, I'm not allowed on the furniture!'",
        "Doctor: 'You need glasses.' Patient: 'How can you tell?' Doctor: 'I could tell from the moment you walked through the window.'",
        "Patient: 'Doctor, I feel like a pair of curtains.' Doctor: 'Pull yourself together!'",
        "Doctor: 'Your husband needs rest and peace. Here are some sleeping pills.' Woman: 'When should I give them to him?' Doctor: 'They're for you!'",
        "A man tells his doctor, 'My wife thinks I take too much coffee.' Doctor: 'How much do you drink?' Man: 'About 15 cups a day.' Doctor: 'That's too much.' Man: 'See? I told you, but she thinks I drink 20!'",
        "Patient: 'Doctor, I think I'm a bell.' Doctor: 'Take these pills and if that doesn't help, give me a ring.'",
        "Doctor: 'You're overweight. You need to exercise more.' Patient: 'But I already exercise every day!' Doctor: 'Doing what?' Patient: 'Running late!'",
        "Patient: 'Doctor, I keep thinking I'm a mosquito.' Doctor: 'Get out of my office!' Patient: 'Why?' Doctor: 'There's the door!'",
        "Doctor: 'You have a cold.' Patient: 'That's impossible! I'm married!'"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙼𝙴𝙳𝙸𝙲𝙰𝙻 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 💊 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 9. JOKE - School Jokes
sila({ 
    nomCom: 'schooljoke',
    alias: ['school', 'teacherjoke'],
    desc: 'Funny jokes about school',
    Categorie: 'Jokes',
    reaction: '📚',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Teacher: 'I hope I didn't see you looking at someone else's paper.' Student: 'I hope you didn't either!'",
        "Why did the student eat his homework? Because the teacher said it was a piece of cake!",
        "Teacher: 'Why are you late?' Student: 'Because of the sign on the road.' Teacher: 'What sign?' Student: 'The one that said \"School Ahead, Go Slow\"!'",
        "Why were the teacher's eyes crossed? She couldn't control her pupils!",
        "Teacher: 'If you had $10 and asked your dad for $10, how much would you have?' Student: '$10.' Teacher: 'You don't know your math!' Student: 'You don't know my dad!'",
        "Why did the teacher wear sunglasses? Because her students were so bright!",
        "Student: 'I don't think I deserved a zero on this test!' Teacher: 'I agree, but it's the lowest grade I could give you.'",
        "Teacher: 'What is the capital of France?' Student: 'F?'",
        "Why did the student bring a ladder to school? Because she wanted to go to high school!",
        "Teacher: 'Name two pronouns.' Student: 'Who, me?' Teacher: 'Correct!'"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝚂𝙲𝙷𝙾𝙾𝙻 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 📚 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 10. JOKE - Relationship Jokes
sila({ 
    nomCom: 'relationshipjoke',
    alias: ['lovejoke', 'relations', 'relationship'],
    desc: 'Jokes about relationships',
    Categorie: 'Jokes',
    reaction: '💕',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "My girlfriend told me I should be more affectionate. So I got another girlfriend.",
        "What's the difference between a boyfriend and a husband? About 30 pounds!",
        "I asked my wife, 'Where do you want to go for our anniversary?' She said, 'Somewhere I've never been!' I said, 'How about the kitchen?'",
        "My wife and I were happy for 20 years. Then we met.",
        "What do you call a woman who knows where her husband is 24/7? A widow!",
        "A man says to his friend, 'My wife is an angel.' Friend replies, 'You're lucky. Mine is still alive.'",
        "Marriage is when a man loses his bachelor's degree and a woman gains her master's.",
        "My wife told me to stop impersonating a flamingo. I had to put my foot down.",
        "What's the quickest way to a man's heart? Through his chest with a sharp knife!",
        "My girlfriend said she needed more space. So I locked her outside."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝚁𝙴𝙻𝙰𝚃𝙸𝙾𝙽𝚂𝙷𝙸𝙿 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 💕 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 11. JOKE - Food Jokes
sila({ 
    nomCom: 'foodjoke',
    alias: ['food', 'foodjokes'],
    desc: 'Yummy food jokes',
    Categorie: 'Jokes',
    reaction: '🍔',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Why did the tomato turn red? Because it saw the salad dressing!",
        "What do you call a sad strawberry? A blueberry!",
        "Why don't eggs tell jokes? They'd crack each other up!",
        "What's a potato's favorite music? Spice Girls!",
        "Why did the banana go to the doctor? Because it wasn't peeling well!",
        "What do you call cheese that isn't yours? Nacho cheese!",
        "Why did the cookie go to the hospital? Because it felt crumbly!",
        "What do you call a fake noodle? An impasta!",
        "Why did the coffee file a police report? It got mugged!",
        "What do you call a sleeping pizza? A pizzaZZZ!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙵𝙾𝙾𝙳 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 🍔 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 12. JOKE - Technology Jokes
sila({ 
    nomCom: 'techjoke',
    alias: ['tech', 'technology'],
    desc: 'Jokes about technology',
    Categorie: 'Jokes',
    reaction: '📱',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Why was the computer cold? It left its Windows open!",
        "Why did the smartphone go to school? To get smarter!",
        "What do you call a computer that sings? A Dell!",
        "Why did the computer keep freezing? It left its Windows open in winter!",
        "What's a computer's favorite beat? An an-nyan-nyan-nyan-nian beat!",
        "Why did the Wi-Fi get a ticket? For not following the speed limit!",
        "What do you call a laptop that sings? A Dell-ightful!",
        "Why was the internet cold? Because it had too many cookies!",
        "What's a robot's favorite music? Heavy metal!",
        "Why did the smartphone go to the doctor? It had a virus!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝚃𝙴𝙲𝙷 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 📱 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 13. JOKE - Sport Jokes
sila({ 
    nomCom: 'sportjoke',
    alias: ['sport', 'sports'],
    desc: 'Funny sports jokes',
    Categorie: 'Jokes',
    reaction: '⚽',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Why do soccer players do so well in school? They know how to use their heads!",
        "What's a golfer's favorite letter? Tee!",
        "Why did the basketball player go to jail? Because he shot the ball!",
        "What do you call a football player who eats too much? A linebacker with a line-backache!",
        "Why don't scientists play tennis? Because they might get ion the court!",
        "What's a tennis player's favorite day? Serve-ivor!",
        "Why did the golfer wear two pairs of pants? In case he got a hole in one!",
        "What do you call a swimmer who sings? A sink-ger!",
        "Why did the baseball player break up with the cheerleader? He couldn't catch her feelings!",
        "What's a boxer's favorite drink? Punch!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝚂𝙿𝙾𝚁𝚃 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ ⚽ ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 14. JOKE - Music Jokes
sila({ 
    nomCom: 'musicjoke',
    alias: ['music', 'songjoke'],
    desc: 'Jokes about music',
    Categorie: 'Jokes',
    reaction: '🎵',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Why did the musician get arrested? Because he got into treble!",
        "What do you call a singing computer? A Dell!",
        "Why don't scientists trust atoms? They make up everything, even music!",
        "What's a pianist's favorite food? A grand piano-pple!",
        "Why did the guitar go to the doctor? It had fretboard!",
        "What do you call a sad musician? A minor!",
        "Why did the singer go to jail? For singing the blues!",
        "What's a drummer's favorite type of shoe? Loafers!",
        "Why did the music teacher go to jail? Because she got caught conducting!",
        "What do you call a musical fish? A tuna-ist!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙼𝚄𝚂𝙸𝙲 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 🎵 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 15. JOKE - Work Jokes
sila({ 
    nomCom: 'workjoke',
    alias: ['work', 'officejoke'],
    desc: 'Jokes about work and office',
    Categorie: 'Jokes',
    reaction: '💼',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "I'm not saying I hate my job, but if Monday were a person, I'd punch it in the face.",
        "My boss told me to have a good day. So I went home.",
        "I told my boss I needed a raise because three companies were after me. He asked, 'Which ones?' I said, 'The gas company, the electric company, and the water company.'",
        "I love being a cashier. Every day, I get to help people. Actually, I help them take their money and put it in the drawer.",
        "Why do we tell actors to 'break a leg'? Because every play has a cast!",
        "I used to work at a pizza place. I quit because I couldn't make enough dough.",
        "My job is secure. No one else wants it.",
        "I'm on a new diet plan. It's called 'work.' I eat lunch at my desk and lose my appetite.",
        "The early bird might get the worm, but the second mouse gets the cheese.",
        "I finally got a job. They said I start at the bottom. I didn't know I was working for a cruise line."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝚆𝙾𝚁𝙺 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 💼 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 16. JOKE - Travel Jokes
sila({ 
    nomCom: 'traveljoke',
    alias: ['travel', 'vacationjoke'],
    desc: 'Jokes about traveling',
    Categorie: 'Jokes',
    reaction: '✈️',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "I'm on a whiskey diet. I've lost three days already.",
        "I asked my dad if he'd ever been to the Grand Canyon. He said, 'No, but I've been to the gift shop.'",
        "I love traveling. My luggage doesn't. It always gets lost.",
        "Why do we park on driveways and drive on parkways?",
        "I just got back from a vacation in Florida. I needed a vacation to recover from my vacation.",
        "My favorite thing to do when I travel is eat local food. My least favorite thing is to pay for it.",
        "I'm not a tourist. I'm a temporary local.",
        "Why don't scientists travel to the sun? Because it's too far and they'd get ion-ized!",
        "I went to a street where the houses were numbered 1820, 1822, 1824... Must be a long street!",
        "I asked my GPS, 'Are we there yet?' It said, 'No, but your battery is almost there.'"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝚃𝚁𝙰𝚅𝙴𝙻 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ ✈️ ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 17. JOKE - Money Jokes
sila({ 
    nomCom: 'moneyjoke',
    alias: ['money', 'richjoke'],
    desc: 'Jokes about money',
    Categorie: 'Jokes',
    reaction: '💰',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Money talks. Mine always says goodbye.",
        "I'm not saying I'm poor, but my credit card has a lower limit than my patience.",
        "My bank account is like my phone battery. Always running low.",
        "I used to think I was poor. Then they told me I'm 'financially challenged.' Sounds more expensive.",
        "Money can't buy happiness, but it can buy ice cream, which is kind of the same thing.",
        "I'm so broke, I can't even pay attention.",
        "The only thing I'm rich in is poor decisions.",
        "My wallet is like an onion. Opening it makes me cry.",
        "I told my money to grow on trees. Now I have a money tree in my backyard. It only grows leaves though.",
        "I'm in a committed relationship with my bank account. We're always separated."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙼𝙾𝙽𝙴𝚈 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 💰 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 18. JOKE - Halloween Jokes
sila({ 
    nomCom: 'halloweenjoke',
    alias: ['halloween', 'spooky'],
    desc: 'Spooky Halloween jokes',
    Categorie: 'Jokes',
    reaction: '🎃',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "Why don't mummies take vacations? They're afraid they'll relax and unwind!",
        "What do you call a haunted chicken? A poultry-geist!",
        "Why don't skeletons fight each other? They don't have the guts!",
        "What's a ghost's favorite dessert? I-scream!",
        "Why do witches fly on brooms? Because vacuum cleaners are too heavy!",
        "What do you call a fat pumpkin? A plumpkin!",
        "Why did the vampire have to go to the doctor? Because he was coffin!",
        "What do you get when you cross a witch with a snowman? Frostbite!",
        "Why don't zombies eat clowns? Because they taste funny!",
        "What's a monster's favorite play? Dracula!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙷𝙰𝙻𝙻𝙾𝚆𝙴𝙴𝙽 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 🎃 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 19. JOKE - Christmas Jokes
sila({ 
    nomCom: 'christmasjoke',
    alias: ['christmas', 'xmas'],
    desc: 'Funny Christmas jokes',
    Categorie: 'Jokes',
    reaction: '🎄',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "What do you get if you eat Christmas decorations? Tinsel-itis!",
        "Why is it so cold at Christmas? Because it's Decembrrr!",
        "What do snowmen eat for breakfast? Frosted Flakes!",
        "Why did Santa get a ticket? Because he ran a red nose!",
        "What do you call a scared snowman? A melt-down!",
        "Why don't penguins fly? Because they're not tall enough to be reindeer!",
        "What do you call Santa when he stops moving? Santa Pause!",
        "What's a Christmas tree's favorite candy? Orna-mints!",
        "Why did the elf go to school? To learn elf-abet!",
        "What do you call a cat on the beach at Christmas? Sandy Claws!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝙲𝙷𝚁𝙸𝚂𝚃𝙼𝙰𝚂 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 🎄 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});

// 20. JOKE - Random Mixed Jokes
sila({ 
    nomCom: 'randomjoke',
    alias: ['randjoke', 'random'],
    desc: 'Completely random jokes',
    Categorie: 'Jokes',
    reaction: '🎲',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    
    const jokes = [
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "What do you call a fish with no eyes? A fsh!",
        "I'm reading a book about mazes. I got lost in it.",
        "Why don't scientists trust stairs? Because they're always up to something!",
        "What do you call a bear with no ears? B!",
        "I used to play piano by ear. Now I use my hands.",
        "Why did the bicycle fall over? Because it was two-tired!",
        "What do you call a factory that sells generally okay products? A satis-factory!",
        "I told my computer I needed a break. Now it won't stop sending me vacation ads.",
        "Why don't eggs tell jokes? They'd crack each other up!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    repondre(`┏━❑ 𝚁𝙰𝙽𝙳𝙾𝙼 𝙹𝙾𝙺𝙴 ━━━━━━━━━
┃ 🎲 ${randomJoke}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
});