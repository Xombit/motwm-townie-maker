/**
 * Character Name Generation System
 * 
 * Generates D&D-style fantasy names based on race, class, and gender.
 * Uses culturally appropriate name pools with selective title/epithet usage.
 */

export interface NamePool {
  male: string[];
  female: string[];
  surnames: string[];
  useTitles?: 'always' | 'sometimes' | 'rarely' | 'never';
  titleWeight?: number; // 0-1, used when useTitles is 'sometimes'
}

/**
 * Race-based name pools with cultural naming conventions
 */
export const RACE_NAMES: Record<string, NamePool> = {
  human: {
    male: [
      "Aldric", "Brandon", "Cedric", "Darius", "Edric", "Gareth", "Hadrian", "Ivon",
      "Jorath", "Kael", "Lorian", "Marcus", "Nathan", "Orin", "Perrin", "Quinlan",
      "Roland", "Soren", "Theron", "Ulrich", "Victor", "Warren", "Xavier", "Yorick",
      "Zander", "Alain", "Bertram", "Corwin", "Dorian", "Eamon", "Falken", "Gideon",
      "Henrik", "Jareth", "Kendrick", "Liam", "Matthias", "Nolan", "Orson", "Preston",
      "Rowan", "Sterling", "Tristan", "Vaughn", "Wesley", "Zachary", "Alaric", "Benedict"
    ],
    female: [
      "Aelwyn", "Brenna", "Cassandra", "Diana", "Elena", "Fiona", "Gwen", "Helena",
      "Iris", "Jenna", "Katrina", "Lyra", "Mara", "Nina", "Olivia", "Petra",
      "Quinn", "Roslyn", "Sarah", "Talia", "Uma", "Vera", "Willa", "Ysara",
      "Zara", "Astrid", "Beatrice", "Claire", "Delilah", "Evelyn", "Felicity", "Grace",
      "Harper", "Isabelle", "Julia", "Keira", "Lillian", "Miranda", "Natasha", "Ophelia",
      "Penelope", "Regina", "Sophia", "Thalia", "Valeria", "Willow", "Xylia", "Yseult"
    ],
    surnames: [
      "Blackwood", "Stormwind", "Ironheart", "Ashford", "Brightblade", "Coldwater",
      "Darkstone", "Emberforge", "Frostborn", "Goldmane", "Hawthorne", "Ironwood",
      "Kingsley", "Lightbringer", "Moonbrook", "Nightshade", "Oakenshield", "Ravencrest",
      "Silverhand", "Thornfield", "Underhill", "Valorian", "Wintermere", "Wyrmwood",
      "Ashborne", "Blackthorn", "Crimson", "Dawnstar", "Evergreen", "Fairwind",
      "Grayhaven", "Highmore", "Ironforge", "Jadestone", "Kingsford", "Lockwood",
      "Morningstar", "Northwind", "Oakheart", "Pendragon", "Quicksilver", "Redstone",
      "Shadowend", "Trueblade", "Valiant", "Westmarch", "Youngblood", "Zenith"
    ],
    useTitles: 'sometimes',
    titleWeight: 0.5
  },

  dwarf: {
    male: [
      "Adrik", "Baern", "Barendd", "Brottor", "Bruenor", "Dain", "Darrak", "Delg",
      "Eberk", "Einkil", "Fargrim", "Gardain", "Gimli", "Harbek", "Kildrak", "Morgran",
      "Orsik", "Oskar", "Rangrim", "Rurik", "Taklinn", "Thoradin", "Thorin", "Tordek",
      "Traubon", "Ulfgar", "Veit", "Vondal", "Balin", "Dwalin", "Thrain", "Gloin",
      "Oin", "Bifur", "Bofur", "Bombur", "Dori", "Nori", "Ori", "Fili",
      "Kili", "Borin", "Gror", "Thror", "Nain", "Fundin", "Groin", "Frerin"
    ],
    female: [
      "Anbera", "Artin", "Audhild", "Bardryn", "Dagnal", "Diesa", "Eldeth", "Falkrunn",
      "Finellen", "Gunnloda", "Gurdis", "Helja", "Hlin", "Ilde", "Kathra", "Kristryd",
      "Liftrasa", "Mardred", "Riswynn", "Sannl", "Torbera", "Torgga", "Vistra", "Asta",
      "Disa", "Hilda", "Ingrid", "Ragna", "Sigrid", "Thora", "Brynhild", "Gerda",
      "Gudrun", "Helga", "Frida", "Astrid", "Bergthora", "Jorunn", "Rannveig", "Solveig",
      "Svanhild", "Thurid", "Unn", "Vigdis", "Yngvild", "Bothild", "Gunnvor", "Oddny"
    ],
    surnames: [
      "Battlehammer", "Brawnanvil", "Dankil", "Fireforge", "Frostbeard", "Gorunn",
      "Holderhek", "Ironfist", "Loderr", "Lutgehr", "Rumnaheim", "Strakeln", "Torunn",
      "Ungart", "Stoneshield", "Ironforge", "Deepdelver", "Goldseeker", "Orebreaker",
      "Anvilheart", "Stonehammer", "Firebeard", "Ironbrow", "Steelstrike", "Bouldershoulder",
      "Hammerfell", "Rockseeker", "Gemcutter", "Forgeheart", "Ironpeak", "Stonehelm",
      "Deepminer", "Coppervein", "Silverbeard", "Bronzefist", "Goldvein", "Platinumhand",
      "Graniteheart", "Marbleshield", "Obsidianblade", "Quartzseeker", "Rubyeye", "Sapphiredelver",
      "Emeraldforge", "Diamondfist", "Mithrilhand", "Adamantshield", "Runehammer", "Oathkeeper"
    ],
    useTitles: 'always',
    titleWeight: 0.85
  },

  elf: {
    male: [
      "Adran", "Aelar", "Aramil", "Arannis", "Aust", "Beiro", "Berrian", "Carric",
      "Enialis", "Erdan", "Erevan", "Galinndan", "Hadarai", "Heian", "Himo", "Immeral",
      "Ivellios", "Laucian", "Mindartis", "Paelias", "Peren", "Quarion", "Riardon", "Rolen",
      "Soveliss", "Thamior", "Tharivol", "Theren", "Varis", "Legolas", "Elrond", "Celeborn",
      "Glorfindel", "Haldir", "Lindir", "Rumil", "Orophin", "Gildor", "Elladan", "Elrohir",
      "Thranduil", "Oropher", "Amroth", "Celebrian", "Galadhon", "Aegnor", "Angrod", "Finrod"
    ],
    female: [
      "Adrie", "Althaea", "Anastrianna", "Andraste", "Antinua", "Bethrynna", "Birel", "Caelynn",
      "Drusilia", "Enna", "Felosial", "Ielenia", "Jelenneth", "Keyleth", "Leshanna", "Lia",
      "Meriele", "Mialee", "Naivara", "Quelenna", "Quillathe", "Sariel", "Shanairra", "Shava",
      "Silaqui", "Theirastra", "Thia", "Vadania", "Valanthe", "Xanaphia", "Arwen", "Galadriel",
      "Celebrian", "Idril", "Luthien", "Melian", "Aredhel", "Finduilas", "Morwen", "Nienor",
      "Elwing", "Nimloth", "Elbereth", "Yavanna", "Varda", "Nessa", "Vana", "Este"
    ],
    surnames: [
      "Amakiir", "Amastacia", "Galanodel", "Holimion", "Ilphelkiir", "Liadon", "Meliamne",
      "Naïlo", "Siannodel", "Xiloscient", "Moonwhisper", "Starfire", "Silverleaf", "Nightbreeze",
      "Dawnbringer", "Sunweaver", "Moonshadow", "Stormrider", "Windwhisper", "Oakenheart",
      "Forestwalker", "Leafrunner", "Thornblade", "Willowgrace", "Morningdew", "Evenstar",
      "Twilightfall", "Shadowmoon", "Brightwater", "Clearbrook", "Swiftwind", "Lightfoot",
      "Deepwood", "Greenbough", "Silvermoon", "Goldleaf", "Wintermist", "Springbloom",
      "Summersong", "Autumnwind", "Frostfire", "Snowfall", "Sunshadow", "Moonbeam",
      "Stardust", "Skyweaver", "Cloudwalker", "Rainwhisper", "Mistweaver", "Dewdancer"
    ],
    useTitles: 'rarely',
    titleWeight: 0.15
  },

  halfling: {
    male: [
      "Alton", "Ander", "Bernie", "Bobbin", "Cade", "Callus", "Corrin", "Dannad",
      "Danniel", "Eddie", "Egart", "Eldon", "Errich", "Finnan", "Garret", "Lindal",
      "Lyle", "Merric", "Milo", "Osborn", "Perrin", "Reed", "Roscoe", "Wellby",
      "Bilbo", "Frodo", "Samwise", "Pippin", "Meriadoc", "Fredegar", "Drogo", "Fosco",
      "Dudo", "Minto", "Polo", "Ponto", "Porto", "Peregrin", "Paladin", "Otho",
      "Odo", "Seredic", "Saradoc", "Merimac", "Rorimac", "Gorbadoc", "Rufus", "Reginard"
    ],
    female: [
      "Andry", "Bree", "Callie", "Cora", "Dee", "Dell", "Eida", "Eran",
      "Euphemia", "Georgina", "Gynnie", "Harriet", "Jasmine", "Jillian", "Jo", "Kithri",
      "Lavinia", "Lidda", "Merla", "Nedda", "Paela", "Portia", "Rosie", "Seraphina",
      "Shaena", "Trym", "Vani", "Verna", "Lobelia", "Primrose", "Belladonna", "Mirabella",
      "Donnamira", "Ruby", "Pearl", "Daisy", "Poppy", "Pansy", "Peony", "Lily",
      "Violet", "Rose", "Iris", "Marigold", "Hyacinth", "Heather", "Holly", "Jasmine"
    ],
    surnames: [
      "Brushgather", "Goodbarrel", "Greenbottle", "High-hill", "Hilltopple", "Leagallow",
      "Tealeaf", "Thorngage", "Tosscobble", "Underbough", "Bramblefoot", "Cherrycheeks",
      "Thistletop", "Meadowsweet", "Burrows", "Took", "Brandybuck", "Baggins", "Proudfoot",
      "Boffin", "Bolger", "Bracegirdle", "Brownlock", "Bunce", "Burrowes", "Chubb",
      "Clayhanger", "Cotton", "Fairbairn", "Gardner", "Gamgee", "Goold", "Greenhand",
      "Grubb", "Hayward", "Headstrong", "Hornblower", "Longhole", "Maggot", "Mugwort",
      "Noakes", "Overhill", "Puddifoot", "Rumble", "Sandheaver", "Smallburrow", "Tunnelly",
      "Two-foot", "Underhill", "Whitfoot"
    ],
    useTitles: 'never',
    titleWeight: 0
  },

  gnome: {
    male: [
      "Alston", "Alvyn", "Boddynock", "Brocc", "Burgell", "Dimble", "Eldon", "Erky",
      "Fonkin", "Frug", "Gerbo", "Gimble", "Glim", "Jebeddo", "Kellen", "Namfoodle",
      "Orryn", "Roondar", "Seebo", "Sindri", "Warryn", "Wrenn", "Zook", "Fizbin",
      "Glimwick", "Dimwick", "Waywocket", "Turen", "Scheppen", "Raulnor", "Murnig",
      "Garrick", "Folkor", "Daergel", "Beren", "Nimblefingers", "Sparkwhistle", "Cogsworth",
      "Gizmo", "Gadget", "Widget", "Sprocket", "Ratchet", "Tinker", "Whirligig", "Doohickey",
      "Thingamajig", "Contraption"
    ],
    female: [
      "Bimpnottin", "Breena", "Caramip", "Carlin", "Donella", "Duvamil", "Ella", "Ellyjobell",
      "Ellywick", "Lilli", "Loopmottin", "Lorilla", "Mardnab", "Nissa", "Nyx", "Oda",
      "Orla", "Roywyn", "Shamil", "Tana", "Waywocket", "Zanna", "Bipnottin", "Carlin",
      "Duvamil", "Ellyjobell", "Loopmottin", "Mardnab", "Shamil", "Waywocket", "Bimpsy",
      "Breeni", "Carami", "Donnie", "Ellie", "Lilli", "Lori", "Nissy", "Nyxie",
      "Oddie", "Orlie", "Rosy", "Shami", "Tanny", "Zanni", "Fizzlestick", "Sparklesong",
      "Glimmerglow", "Twinkletoes"
    ],
    surnames: [
      "Beren", "Daergel", "Folkor", "Garrick", "Nackle", "Murnig", "Ningel", "Raulnor",
      "Scheppen", "Timbers", "Turen", "Tinkertop", "Sparklegem", "Cogwhisker", "Geargrinder",
      "Springcoil", "Ratchetbolt", "Fizzlebang", "Wobblesprocket", "Glittergold", "Silversprocket",
      "Brassgear", "Coppercog", "Ironwrench", "Steelspring", "Bronzebolt", "Goldwheel",
      "Platinumgadget", "Mithrilmechanic", "Gemcutter", "Crystalgrinder", "Rubytwist",
      "Sapphireshine", "Emeraldpolish", "Diamondbright", "Topaztwinkle", "Amethystglow",
      "Pearlshimmer", "Onyxshadow", "Quartzflash", "Obsidiandark", "Jadegreen", "Turquoiseblue",
      "Coralcraft", "Amberforge", "Ivorycarve", "Ebonywork", "Mahoganybuild", "Teakcraft"
    ],
    useTitles: 'rarely',
    titleWeight: 0.2
  },

  "half-elf": {
    male: [
      "Aelric", "Branden", "Caelum", "Darian", "Elian", "Faelyn", "Garen", "Hadrian",
      "Kaelan", "Lorian", "Marten", "Naerion", "Orian", "Peredhil", "Raelan", "Soren",
      "Taeral", "Varian", "Xander", "Yorin", "Aldric", "Cedran", "Darien", "Erolan",
      "Faeran", "Gaelen", "Haelan", "Irian", "Jaelan", "Kaelen", "Loren", "Maeron",
      "Naeran", "Oren", "Paelon", "Qaelan", "Raelon", "Saerin", "Taeron", "Urian",
      "Vaelon", "Waeran", "Xaelan", "Yaelon", "Zaeran", "Aeron", "Caelen", "Daeron"
    ],
    female: [
      "Aelara", "Brielle", "Celene", "Dara", "Elenora", "Faelynn", "Gwyneth", "Ilyana",
      "Kaela", "Liora", "Mireille", "Naera", "Ophelia", "Paela", "Raina", "Selene",
      "Talia", "Vaela", "Xara", "Ysara", "Aelina", "Caela", "Daelia", "Elaena",
      "Faelina", "Gaela", "Haela", "Irina", "Jaela", "Kaelina", "Lorina", "Maela",
      "Naela", "Orela", "Paelina", "Qaela", "Raelina", "Saela", "Taela", "Uriana",
      "Vaelina", "Waela", "Xaela", "Yaela", "Zaela", "Aerina", "Caelina", "Daela"
    ],
    surnames: [], // Uses human or elf surnames
    useTitles: 'sometimes',
    titleWeight: 0.4
  },

  "half-orc": {
    male: [
      "Dench", "Feng", "Gell", "Henk", "Holg", "Imsh", "Keth", "Krusk",
      "Mhurren", "Ront", "Shump", "Thokk", "Grok", "Thrag", "Urgash", "Brugg",
      "Drog", "Kurz", "Narg", "Rath", "Skarr", "Thunk", "Urok", "Vorg",
      "Wurg", "Zog", "Brug", "Grag", "Krag", "Morg", "Nog", "Prog",
      "Rorg", "Sorg", "Torg", "Vrog", "Wrog", "Yorg", "Zorg", "Gruk",
      "Thruk", "Uruk", "Druk", "Kruk", "Nruk", "Pruk", "Sruk", "Truk"
    ],
    female: [
      "Baggi", "Emen", "Engong", "Kansif", "Myev", "Neega", "Ovak", "Ownka",
      "Shautha", "Sutha", "Vola", "Volen", "Yevelda", "Grisha", "Kra", "Urg",
      "Brag", "Durg", "Kurg", "Nurg", "Rurg", "Surg", "Turg", "Vurg",
      "Wurg", "Yurg", "Zurg", "Gra", "Kra", "Mra", "Nra", "Pra",
      "Sra", "Tra", "Vra", "Wra", "Yra", "Zra", "Gru", "Kru",
      "Mru", "Nru", "Pru", "Sru", "Tru", "Vru", "Wru", "Yru"
    ],
    surnames: [
      "Bloodfang", "Bonecrusher", "Ironfist", "Skullsplitter", "Gorehowl", "Blackscar",
      "Grimjaw", "Thunderfist", "Warmaker", "Axegrinder", "Fleshripper", "Doombringer",
      "Rageclaw", "Stonefist", "Hellscream", "Deathblow", "Paincaller", "Wrathbringer",
      "Fearbreaker", "Doomhammer", "Bloodaxe", "Skullbreaker", "Bonebreaker", "Necksnapper",
      "Spinecrusher", "Ribcracker", "Jawsmasher", "Toothbreaker", "Eyegouger", "Earripper",
      "Nosecrusher", "Throatripper", "Heartpiercer", "Lungcrusher", "Gutripper", "Liverbreaker",
      "Kidneybasher", "Spinebreaker", "Necktwister", "Limbripper", "Armcrusher", "Legbreaker",
      "Footstomper", "Handcrusher", "Fingersmasher", "Headbasher", "Brainbreaker", "Skullcleaver"
    ],
    useTitles: 'always',
    titleWeight: 0.9
  },

  drow: {
    male: [
      "Drizzt", "Jarlaxle", "Zakn", "Valas", "Ryld", "Pharaun", "Nimor", "Vhaeraun",
      "Kelnozz", "Dantrag", "Berg'inyon", "Uthegental", "Raiguy", "Gromph", "Triel",
      "Nalvos", "Tsabrak", "Malagdorl", "Gelroos", "Xantar", "Kalannar", "Vorn",
      "Masoj", "Alton", "Zaknafein", "Dinin", "Nalfein", "Malice", "Rizzen",
      "Bregan", "Szordrin", "Belgos", "Zek", "Urlryn", "Phaer", "Solaufein",
      "Ilivarra", "Zedar", "Xeren", "Veldrin", "Xarann", "Zilvra", "Jhulae"
    ],
    female: [
      "Qilue", "Liriel", "Yvonnel", "Malice", "Maya", "Briza", "Vierna", "Triel",
      "Quenthel", "Yasraena", "Halisstra", "Danifae", "Faeryl", "Ssipriina", "Aunrae",
      "Esvele", "Ulviirala", "Jhulae", "Shyntre", "Ilmryn", "Talice", "Zilvra",
      "Xune", "Nathrae", "Ilivarra", "Despana", "Matron", "Eclavdra", "Blaeyne",
      "Chalithra", "Elvanshalee", "Ginafae", "Laeral", "Maleficent", "Nedylene",
      "Pellanue", "Quilue", "Rilrae", "Sabal", "Talindra", "Urlvrain", "Vornyn",
      "Xullrae", "Zauvirr", "Felyndiira", "Iymrith", "Qilynrae", "Vlondril"
    ],
    surnames: [
      "Baenre", "Do'Urden", "Armgo", "Barrison", "DeVir", "Hun'ett", "Oblodra",
      "Mizzrym", "Fey-Branche", "T'orgh", "Kenafin", "Zauvirr", "Teken'duis",
      "Despana", "Dhuurniv", "Melarn", "Xorlarrin", "Symryvvin", "Druu'giir",
      "Aleanrahel", "Hune", "Tr'arach", "Zaphresz", "Maeviir", "Nasadra",
      "Kilsek", "Horlbar", "Zaphrae", "Helviiryn", "Mylyl", "Yril",
      "Zlind", "Vae", "Dyrr", "Auz'kovyn", "Vandree", "Shobalar", "Rilynt",
      "Srune'lett", "Sorcere", "Melee-Magthere", "Arach-Tinilith", "Tlabbar",
      "Druu'giir", "Y'rn", "Tlin'orzza", "Duskryn", "Zolond"
    ],
    useTitles: 'sometimes',
    titleWeight: 0.3
  },

  aasimar: {
    male: [
      "Arael", "Azar", "Beltin", "Caspian", "Darien", "Elias", "Flavius", "Galad",
      "Harmakhis", "Ilmater", "Jurian", "Karael", "Lucius", "Michael", "Nathaniel",
      "Oberyn", "Pelor", "Quintus", "Raphael", "Seraph", "Tiberius", "Uriel",
      "Valerian", "Zariel", "Arminas", "Balthazar", "Castiel", "Daevar", "Emmanuel",
      "Forthael", "Gabriel", "Helios", "Isachar", "Justinian", "Kyriel", "Lucian",
      "Mordecai", "Nomaris", "Orion", "Priam", "Quorin", "Raziel", "Samael",
      "Tamiel", "Ulvaan", "Vasari", "Zaelar", "Aurelius", "Caelum"
    ],
    female: [
      "Ariel", "Aurora", "Brielle", "Cassia", "Davina", "Elara", "Freya", "Grace",
      "Haven", "Iridiel", "Juliana", "Kira", "Lumina", "Mercy", "Neria", "Ophelia",
      "Paloma", "Seraphina", "Talia", "Urielle", "Valeria", "Zara", "Amara",
      "Bright", "Celestia", "Dawn", "Elysia", "Faith", "Gloria", "Hope",
      "Illumina", "Joy", "Kariel", "Lux", "Mira", "Nova", "Octavia",
      "Peace", "Radiance", "Serene", "Trinity", "Una", "Verity", "Zenith",
      "Angelica", "Beatrix", "Charis", "Dulcia", "Evangeline", "Felicity"
    ],
    surnames: [
      "Brightborn", "Dawnbringer", "Faithkeeper", "Gracewind", "Hopestrider", "Lightbearer",
      "Morningstar", "Radiantsoar", "Soulkeeper", "Truthseeker", "Valorheart", "Virtuewing",
      "Dawnfire", "Everbright", "Goldenlight", "Hallowedwing", "Ivorygrace", "Justwing",
      "Kindlingstar", "Luminarch", "Mercysong", "Nobleheart", "Oathsworn", "Peacewing",
      "Quicksilver", "Righteye", "Sacredheart", "Truelight", "Unbowed", "Vigilstar",
      "Wingedvirtue", "Zealguard", "Blessedstep", "Divinehand", "Everglow", "Faithwing",
      "Gentleheart", "Heavenborn", "Incorrupt", "Joyous", "Kindflame", "Lovelight",
      "Mercy's-touch", "Neverfall", "Oathbound", "Pureheart", "Quickbright", "Radiantshield"
    ],
    useTitles: 'sometimes',
    titleWeight: 0.7
  },

  tiefling: {
    male: [
      "Amon", "Barakas", "Damakos", "Ekemon", "Iados", "Kairon", "Leucis", "Melech",
      "Mordai", "Morthos", "Pelaios", "Skamos", "Therai", "Zagan", "Akmenos", "Baalzebul",
      "Carnifex", "Dispater", "Errtu", "Forneus", "Glasya", "Hutijin", "Azazel",
      "Bael", "Carrion", "Duskryn", "Eblis", "Fierabras", "Grazzt", "Haborym",
      "Incendius", "Jezebeth", "Korvus", "Lorcan", "Mammon", "Nergal", "Oriax",
      "Paymon", "Rimmon", "Scourge", "Tannin", "Umbral", "Vassago", "Xariel",
      "Zaleos", "Abraxas", "Beleth", "Caine", "Dagon"
    ],
    female: [
      "Akta", "Anakis", "Bryseis", "Criella", "Damaia", "Ea", "Kallista", "Lerissa",
      "Makaria", "Nemeia", "Orianna", "Phelaia", "Rieta", "Akara", "Bryseis", "Criella",
      "Damaia", "Kallista", "Lerissa", "Makaria", "Nemeia", "Orianna", "Phelaia", "Rieta",
      "Belladonna", "Carmilla", "Desdemona", "Eris", "Fury", "Grimora", "Hex",
      "Inferna", "Jezebel", "Karma", "Lilith", "Malice", "Nyx", "Obsidian",
      "Perdita", "Raven", "Sorrow", "Tempest", "Umbra", "Vex", "Wrath",
      "Zara", "Agony", "Blight", "Crimson", "Dread", "Ember"
    ],
    surnames: [
      // Virtue names (common tiefling tradition)
      "Art", "Carrion", "Chant", "Creed", "Despair", "Excellence", "Fear", "Glory",
      "Hope", "Ideal", "Music", "Nowhere", "Open", "Poetry", "Quest", "Random",
      "Reverence", "Sorrow", "Temerity", "Torment", "Weary", "Nowhere", "Random",
      // Infernal surnames
      "Ashborn", "Blackflame", "Crimsonscale", "Darkember", "Fellfire", "Grimclaw",
      "Hellspark", "Inferna", "Nightbane", "Painseeker", "Ravenscar", "Shadowhorn",
      "Thornheart", "Venomtongue", "Wickedsoul", "Bloodmoon", "Cinderfall", "Doomsayer",
      "Emberstorm", "Fiendborn", "Gravewalker", "Hellforge", "Ironheart", "Netherbane",
      "Scorchwing", "Sinborn", "Soulreaver", "Vileblood", "Wraithcaller", "Ashenmane",
      "Blackthorn", "Crimsonfury", "Darkwhisper", "Fellshadow", "Grimtalon", "Hellfrost"
    ],
    useTitles: 'rarely',
    titleWeight: 0.2
  }
};

/**
 * Class-based epithets and titles
 */
export const CLASS_EPITHETS: Record<string, string[]> = {
  fighter: [
    "the Bold", "the Brave", "Ironhand", "the Valiant", "Swordmaster",
    "the Champion", "Steelblade", "the Defender", "Bladedancer", "the Victor",
    "the Mighty", "the Strong", "Shieldbearer", "the Guardian", "the Protector",
    "the Warrior", "Battleborn", "the Fearless", "the Unyielding", "the Stalwart"
  ],
  barbarian: [
    "the Fierce", "Skullcrusher", "Ironhide", "Ragecaller", "the Berserker",
    "Bonegnawer", "the Wild", "Stormbringer", "the Savage", "Earthshaker",
    "the Untamed", "Bloodrage", "the Furious", "Thunderer", "the Primal",
    "the Relentless", "Warborn", "the Unstoppable", "the Brutal", "Doombringer"
  ],
  paladin: [
    "the Righteous", "Lightbringer", "the Pure", "Oathkeeper", "the Just",
    "Dawnblade", "the Holy", "Faithkeeper", "the Blessed", "Truthseeker",
    "the Divine", "Holyshield", "the Devoted", "Smitefist", "the Radiant",
    "the Honorable", "Holyheart", "the Virtuous", "the Sacred", "Godsworn"
  ],
  ranger: [
    "the Tracker", "Swiftarrow", "the Hunter", "Beastfriend", "the Warden",
    "Forestwalker", "the Scout", "Pathfinder", "the Stalker", "Wildborne",
    "the Wanderer", "Eagleeye", "the Silent", "Swiftfoot", "the Keen",
    "the Vigilant", "Trueshot", "the Strider", "the Ranger", "Wildrunner"
  ],
  rogue: [
    "the Shadow", "Quickblade", "the Silent", "Nightstalker", "the Phantom",
    "Shadowstep", "the Swift", "Nightblade", "the Unseen", "Quickfingers",
    "the Sly", "Darkcloak", "the Cunning", "Lightfoot", "the Elusive",
    "the Nimble", "Shadowdancer", "the Stealthy", "the Subtle", "Whisper"
  ],
  monk: [
    "the Serene", "the Centered", "the Tranquil", "Ironwill", "the Disciplined",
    "the Enlightened", "Swiftfist", "the Balanced", "the Focused", "the Patient",
    "the Mindful", "the Harmonious", "Strikefist", "the Ascetic", "the Peaceful",
    "the Meditative", "the Composed", "Flurryhand", "the Controlled", "the Zen"
  ],
  wizard: [
    "the Wise", "Spellweaver", "the Learned", "Arcanist", "the Sage",
    "Runemaster", "the Arcane", "Lorekeeper", "Spellbinder", "the Scholar",
    "the Studious", "Scrollmaster", "the Erudite", "the Knowledgeable", "Magister",
    "the Intellectual", "Bookworm", "the Academic", "the Researcher", "Spellscribe"
  ],
  sorcerer: [
    "the Gifted", "Stormcaller", "the Arcane", "Spellborn", "the Empowered",
    "Magicborn", "the Untaught", "Wildmage", "the Innate", "Spellsurge",
    "the Awakened", "the Bloodborn", "Powerborne", "the Natural", "the Instinctive",
    "the Spontaneous", "Manaborn", "the Raw", "the Unleashed", "Forcewielder"
  ],
  cleric: [
    "the Faithful", "Lightbringer", "the Blessed", "Truthseeker", "the Devout",
    "Holyhand", "the Pious", "Faithkeeper", "the Chosen", "Godsworn",
    "the Reverent", "Prayermaster", "the Hallowed", "the Sanctified", "Divinefist",
    "the Worshipful", "the Religious", "Templefriend", "the Consecrated", "Holysoul"
  ],
  druid: [
    "the Green", "Earthfriend", "the Wild", "Naturekeeper", "the Verdant",
    "Moonwhisper", "the Untamed", "Beastcaller", "the Ancient", "Forestwarden",
    "the Natural", "Leafwalker", "the Primal", "Shapeshifter", "the Woodland",
    "the Elemental", "Stoneborn", "the Cyclical", "Wildshape", "Natureheart"
  ],
  bard: [
    "the Eloquent", "Songweaver", "the Silver-Tongued", "the Minstrel", "Lyremaster",
    "the Charming", "Storyteller", "the Melodious", "Versebringer", "the Performer",
    "the Charismatic", "Tunesmith", "the Inspiring", "the Entertaining", "Rhymester",
    "the Poetic", "Balladeerlord", "the Musical", "the Artistic", "Legendkeeper"
  ]
};

/**
 * Title usage frequency by class
 */
export const CLASS_TITLE_USAGE: Record<string, 'always' | 'often' | 'sometimes' | 'rarely' | 'never'> = {
  fighter: 'often',
  barbarian: 'often',
  paladin: 'often',
  ranger: 'rarely',
  rogue: 'never',
  monk: 'sometimes',
  wizard: 'sometimes',
  sorcerer: 'rarely',
  cleric: 'often',
  druid: 'sometimes',
  bard: 'never'
};

/**
 * Helper function to normalize race names
 */
function normalizeRaceName(race: string): string {
  let raceLower = race.toLowerCase().trim();
  
  // Handle D3.5E subrace formats: "Elf, High" -> "elf", "Dwarf, Mountain" -> "dwarf"
  if (raceLower.includes(',')) {
    const baseRace = raceLower.split(',')[0].trim();
    
    // Special cases for subraces with their own pools
    if (baseRace === 'elf' && raceLower.includes('drow')) {
      raceLower = 'drow';
    } else {
      // All other subraces use their base race
      raceLower = baseRace;
    }
  }
  
  // Handle various naming conventions
  if (raceLower === 'half orc' || raceLower === 'halforc') {
    raceLower = 'half-orc';
  } else if (raceLower === 'half elf' || raceLower === 'halfelf') {
    raceLower = 'half-elf';
  }
  
  return raceLower;
}

/**
 * Generate a first name for the given race and gender
 */
export function generateFirstName(race: string, gender: 'male' | 'female'): string {
  const raceLower = normalizeRaceName(race);
  const racePool = RACE_NAMES[raceLower];
  
  if (!racePool) {
    console.warn(`Unknown race for name generation: ${race} (normalized to: ${raceLower})`);
    return "Unknown";
  }
  
  const firstNamePool = racePool[gender];
  if (!firstNamePool || firstNamePool.length === 0) {
    console.warn(`No ${gender} names for race: ${race}`);
    return "Unknown";
  }
  
  return firstNamePool[Math.floor(Math.random() * firstNamePool.length)];
}

/**
 * Generate a surname for the given race
 */
export function generateSurname(race: string): string {
  const raceLower = normalizeRaceName(race);
  const racePool = RACE_NAMES[raceLower];
  
  if (!racePool) {
    return "Adventurer";
  }
  
  if (raceLower === 'half-elf') {
    // Half-elves use either human or elf surnames randomly
    const useElf = Math.random() < 0.5;
    const surnamePool = useElf ? RACE_NAMES.elf.surnames : RACE_NAMES.human.surnames;
    return surnamePool[Math.floor(Math.random() * surnamePool.length)];
  }
  
  const surnamePool = racePool.surnames;
  if (surnamePool && surnamePool.length > 0) {
    return surnamePool[Math.floor(Math.random() * surnamePool.length)];
  }
  
  return "";
}

/**
 * Generate a class epithet/title based on race and class
 */
export function generateClassTitle(race: string, characterClass: string): string {
  const raceLower = normalizeRaceName(race);
  const classLower = characterClass.toLowerCase();
  
  const racePool = RACE_NAMES[raceLower];
  if (!racePool) {
    return "";
  }
  
  // Determine if we should add title/epithet
  const raceTitleUsage = racePool.useTitles || 'sometimes';
  const classTitleUsage = CLASS_TITLE_USAGE[classLower] || 'sometimes';
  
  let shouldUseTitle = false;
  
  // Combine race and class preferences to determine title probability
  if (raceTitleUsage === 'never' || classTitleUsage === 'never') {
    shouldUseTitle = false;
  } else if (raceTitleUsage === 'always' && classTitleUsage === 'often') {
    shouldUseTitle = Math.random() < 0.9;
  } else if (raceTitleUsage === 'always' && classTitleUsage === 'sometimes') {
    shouldUseTitle = Math.random() < 0.85;
  } else if (raceTitleUsage === 'always') {
    shouldUseTitle = Math.random() < 0.8;
  } else if (classTitleUsage === 'often' && raceTitleUsage === 'sometimes') {
    shouldUseTitle = Math.random() < 0.6;
  } else if (classTitleUsage === 'often') {
    shouldUseTitle = Math.random() < 0.5;
  } else if (raceTitleUsage === 'sometimes' && classTitleUsage === 'sometimes') {
    shouldUseTitle = Math.random() < 0.4;
  } else if (raceTitleUsage === 'rarely' || classTitleUsage === 'rarely') {
    shouldUseTitle = Math.random() < 0.15;
  }
  
  // Add epithet if appropriate
  if (shouldUseTitle) {
    const classEpithets = CLASS_EPITHETS[classLower];
    if (classEpithets && classEpithets.length > 0) {
      return classEpithets[Math.floor(Math.random() * classEpithets.length)];
    }
  }
  
  return "";
}

/**
 * Generate a character name based on race, class, and gender
 */
export function generateCharacterName(
  race: string,
  characterClass: string,
  gender: 'male' | 'female'
): string {
  const firstName = generateFirstName(race, gender);
  const surname = generateSurname(race);
  const title = generateClassTitle(race, characterClass);
  
  if (title) {
    return `${firstName} ${surname} ${title}`;
  }
  return `${firstName} ${surname}`;
}
