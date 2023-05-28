import type { APIRoute } from 'astro';

export const get: APIRoute = async ()=>{

    return {
        body: JSON.stringify({
            data: [{"key":2,"value":"3T"},{"key":3,"value":"Airborne"},{"key":4,"value":"Allied Cycle Works"},{"key":5,"value":"Alchemy"},{"key":6,"value":"Argon 18"},{"key":7,"value":"Assos"},{"key":8,"value":"Atala"},{"key":9,"value":"BH Bikes"},{"key":10,"value":"Basso"},{"key":11,"value":"BeOne"},{"key":12,"value":"Bergamont"},{"key":13,"value":"Breezer"},{"key":14,"value":"Brodie"},{"key":15,"value":"Bulls"},{"key":16,"value":"Cane Creek"},{"key":17,"value":"Canyon"},{"key":18,"value":"Carrera"},{"key":19,"value":"Cervélo"},{"key":20,"value":"Cinelli"},{"key":21,"value":"Commencal"},{"key":22,"value":"Corratec"},{"key":23,"value":"Co-Motion"},{"key":24,"value":"Colnago"},{"key":25,"value":"Conway"},{"key":26,"value":"Cube"},{"key":27,"value":"Da Bomb"},{"key":28,"value":"Dahon"},{"key":29,"value":"DeVinci"},{"key":30,"value":"Diamondback"},{"key":31,"value":"Eddy Merckx"},{"key":32,"value":"Electra"},{"key":33,"value":"Ellsworth"},{"key":34,"value":"Felt"},{"key":35,"value":"Focus"},{"key":36,"value":"Fondriest"},{"key":37,"value":"Fuji"},{"key":38,"value":"Ghost"},{"key":39,"value":"Giant"},{"key":40,"value":"GT"},{"key":41,"value":"Gazelle"},{"key":42,"value":"Haibike"},{"key":43,"value":"Haro"},{"key":44,"value":"Ibis"},{"key":45,"value":"Intense"},{"key":46,"value":"Jamis"},{"key":47,"value":"Juliana"},{"key":48,"value":"Kalkhoff"},{"key":49,"value":"Kestrel"},{"key":50,"value":"KHS"},{"key":51,"value":"Kinesis"},{"key":52,"value":"Kona"},{"key":53,"value":"Lapierre"},{"key":54,"value":"Litespeed"},{"key":55,"value":"Liv"},{"key":56,"value":"Look"},{"key":57,"value":"Lynskey"},{"key":58,"value":"Marin"},{"key":59,"value":"Masi"},{"key":60,"value":"Merida"},{"key":61,"value":"Mondraker"},{"key":62,"value":"Mongoose"},{"key":63,"value":"Niner"},{"key":64,"value":"Norco"},{"key":65,"value":"Nukeproof"},{"key":66,"value":"Orbea"},{"key":67,"value":"Orro"},{"key":68,"value":"Parlee"},{"key":69,"value":"Peugeot"},{"key":70,"value":"Pivot"},{"key":71,"value":"Polygon"},{"key":72,"value":"Pinnacle"},{"key":73,"value":"Pinarello"},{"key":74,"value":"Quintana Roo"},{"key":75,"value":"Radon"},{"key":76,"value":"Raleigh"},{"key":77,"value":"Rocky Mountain"},{"key":78,"value":"Rose"},{"key":79,"value":"Salsa"},{"key":80,"value":"Santa Cruz"},{"key":81,"value":"Saracen"},{"key":82,"value":"Scott"},{"key":83,"value":"Soma"},{"key":84,"value":"Specialized"},{"key":85,"value":"Storck"},{"key":86,"value":"Surly"},{"key":87,"value":"SwiftCarbon"},{"key":88,"value":"Tern"},{"key":89,"value":"Time"},{"key":90,"value":"Tommaso"},{"key":91,"value":"Transition"},{"key":92,"value":"Trek"},{"key":93,"value":"Turner"},{"key":94,"value":"Univega"},{"key":95,"value":"Van Nicholas"},{"key":96,"value":"Velo Vie"},{"key":97,"value":"Ventum"},{"key":98,"value":"Vitus"},{"key":99,"value":"Wilier Triestina"},{"key":100,"value":"Yeti"},{"key":101,"value":"YT Industries"},{"key":1,"value":"MATE"},{"key":644,"value":"bb"},{"key":103,"value":"Alan"},{"key":104,"value":"Albott"},{"key":105,"value":"Ambrosio"},{"key":108,"value":"Battaglin"},{"key":109,"value":"Bellesi"},{"key":110,"value":"Bianchi"},{"key":111,"value":"Bottecchia"},{"key":669,"value":"Boardman"},{"key":113,"value":"Casati"},{"key":670,"value":"The cruiser"},{"key":678,"value":"Scott P2"},{"key":116,"value":"Daccordi"},{"key":117,"value":"De Rosa"},{"key":118,"value":"Dino"},{"key":119,"value":"Dynatek"},{"key":120,"value":"Eddy Merckx (Italian brand with Belgian heritage)"},{"key":679,"value":"Leader"},{"key":122,"value":"Frera"},{"key":123,"value":"Gios"},{"key":124,"value":"Guerciotti"},{"key":125,"value":"Legnano"},{"key":126,"value":"Lombardo"},{"key":127,"value":"Marnati"},{"key":128,"value":"Masciarelli"},{"key":680,"value":"Trax"},{"key":130,"value":"Merida Italia"},{"key":131,"value":"Nevi"},{"key":132,"value":"Olympia"},{"key":133,"value":"Passoni"},{"key":682,"value":"Dahon Folding Bike"},{"key":135,"value":"Rossin"},{"key":136,"value":"Scapin"},{"key":137,"value":"Selle Italia (Saddle manufacturer)"},{"key":138,"value":"Sintesi"},{"key":139,"value":"Somec"},{"key":140,"value":"Tommasini"},{"key":141,"value":"Torelli"},{"key":142,"value":"Viner"},{"key":683,"value":"Muddy Fox"},{"key":684,"value":"Orange"},{"key":671,"value":"Charge"},{"key":673,"value":"Carerra"},{"key":676,"value":"Ridgeback"},{"key":677,"value":"Fas The Factory"},{"key":681,"value":"Blanchi"},{"key":179,"value":"Selle Italia"},{"key":186,"value":"8bar"},{"key":187,"value":"AGang"},{"key":188,"value":"Airstreeem"},{"key":189,"value":"Alan Carbon"},{"key":190,"value":"Alessio"},{"key":191,"value":"Alfina"},{"key":192,"value":"All-City"},{"key":193,"value":"Allure"},{"key":194,"value":"Alpine Bikes"},{"key":195,"value":"Altinsoy"},{"key":197,"value":"Armstrong"},{"key":198,"value":"Aventón"},{"key":199,"value":"Avenue"},{"key":200,"value":"Aviator"},{"key":201,"value":"Avanti"},{"key":202,"value":"BTwin"},{"key":203,"value":"Babel Bike"},{"key":204,"value":"Baden"},{"key":205,"value":"Balfa"},{"key":206,"value":"Bamboo Bike Studio"},{"key":207,"value":"Banshee"},{"key":208,"value":"Batavus"},{"key":209,"value":"Baum"},{"key":210,"value":"BBF"},{"key":211,"value":"BeastyBike"},{"key":212,"value":"Beaver"},{"key":213,"value":"Beixo"},{"key":214,"value":"Bella Bicycles"},{"key":215,"value":"Bellati Sport"},{"key":216,"value":"Belter"},{"key":218,"value":"Bernard Carre"},{"key":220,"value":"Berrux"},{"key":222,"value":"Biomega"},{"key":223,"value":"Birdy"},{"key":224,"value":"Blacksheep"},{"key":225,"value":"Blast"},{"key":226,"value":"Boardman Bikes"},{"key":227,"value":"Bobbin Bikes"},{"key":228,"value":"Böttcher Fahrräder"},{"key":229,"value":"Boulder Bicycles"},{"key":231,"value":"Bridgestone"},{"key":232,"value":"Brooklyn Machine Works"},{"key":233,"value":"Bronto"},{"key":234,"value":"Brose"},{"key":235,"value":"Brubaker"},{"key":236,"value":"Brunelle"},{"key":238,"value":"Bullit"},{"key":239,"value":"Bullitt"},{"key":241,"value":"Burgers ENR"},{"key":242,"value":"Burley"},{"key":243,"value":"Busyman Bicycles"},{"key":244,"value":"Butchers & Bicycles"},{"key":245,"value":"Buzzrack"},{"key":246,"value":"Bygen"},{"key":247,"value":"Caletti Cycles"},{"key":248,"value":"Calfee Design"},{"key":249,"value":"Calima"},{"key":251,"value":"Capable Machines"},{"key":252,"value":"Cargo Bike"},{"key":253,"value":"CargoNode"},{"key":254,"value":"Carnielli"},{"key":256,"value":"Casco"},{"key":257,"value":"Catbike"},{"key":258,"value":"Catrike"},{"key":259,"value":"Chater-Lea"},{"key":260,"value":"Cherubim"},{"key":261,"value":"Chicago Bicycle Company"},{"key":262,"value":"Chris Boardman Bikes"},{"key":263,"value":"Christini"},{"key":264,"value":"Cicli Barco"},{"key":265,"value":"Cicli Corsa"},{"key":266,"value":"Cicli Esperia"},{"key":267,"value":"Cicli Fassi"},{"key":268,"value":"Cicli Gios"},{"key":270,"value":"Cicli Pinarello"},{"key":271,"value":"Cicli Serotta"},{"key":272,"value":"Cicli Speciali"},{"key":273,"value":"Cicli Tigra"},{"key":274,"value":"Cicli Vittoria"},{"key":275,"value":"Ciclos Noviciado"},{"key":276,"value":"Cielo"},{"key":277,"value":"Ciocc"},{"key":278,"value":"Citroën"},{"key":279,"value":"City Bicycles"},{"key":280,"value":"CityCruiser"},{"key":281,"value":"Civelo"},{"key":282,"value":"Classic Bike Frames"},{"key":283,"value":"Claud Butler"},{"key":284,"value":"Clean Mobile"},{"key":285,"value":"Clix"},{"key":286,"value":"Clunker Cycles"},{"key":287,"value":"Coast Cycles"},{"key":288,"value":"Cobi"},{"key":289,"value":"Colmar"},{"key":290,"value":"Colossi"},{"key":292,"value":"Colt"},{"key":293,"value":"Coluer"},{"key":294,"value":"Comanche"},{"key":297,"value":"Comtat"},{"key":298,"value":"Condor Cycles"},{"key":299,"value":"Conqueror"},{"key":300,"value":"Conspiracy"},{"key":301,"value":"Corima"},{"key":303,"value":"Cortina"},{"key":304,"value":"Cosmos"},{"key":305,"value":"Cosmos Works"},{"key":306,"value":"Cosmotec"},{"key":307,"value":"Costelo"},{"key":308,"value":"Cotton Bike"},{"key":309,"value":"Coven"},{"key":310,"value":"Coventry-Eagle"},{"key":311,"value":"Cozytrike"},{"key":312,"value":"Craftworks"},{"key":313,"value":"Crank"},{"key":314,"value":"Cratoni"},{"key":315,"value":"Creme Cycles"},{"key":316,"value":"Crescent"},{"key":317,"value":"Cresta"},{"key":318,"value":"Crestline"},{"key":319,"value":"Cristal Bike"},{"key":320,"value":"CruiserWorks"},{"key":322,"value":"Currie"},{"key":323,"value":"Curve"},{"key":324,"value":"Cycle Force Group"},{"key":325,"value":"CycleOps"},{"key":326,"value":"Cycleurope"},{"key":327,"value":"Cycloving"},{"key":328,"value":"Cyfac"},{"key":329,"value":"Cygnus Bicycles"},{"key":330,"value":"Cycles Fanatic"},{"key":331,"value":"Cycles Lapierre"},{"key":332,"value":"Cycles Mercier"},{"key":333,"value":"Cycles Morini"},{"key":334,"value":"Cycles Nencini"},{"key":335,"value":"Cycles Peugeot"},{"key":336,"value":"Cycles Poncet"},{"key":337,"value":"Cycles Reding"},{"key":338,"value":"Cycles Tout Terrain"},{"key":339,"value":"Cycles Tual"},{"key":340,"value":"Cycles Urago"},{"key":341,"value":"Cycles Wolf"},{"key":342,"value":"Cycles Zéphir"},{"key":343,"value":"Cyclone"},{"key":344,"value":"Cycoo"},{"key":348,"value":"Dakota Bicycles"},{"key":349,"value":"Dancelli"},{"key":350,"value":"Daniel Boone"},{"key":351,"value":"Dario Pegoretti"},{"key":352,"value":"Dassi"},{"key":353,"value":"Dawes"},{"key":354,"value":"Daytona"},{"key":355,"value":"DBC City Bike"},{"key":356,"value":"DeKerf Cycle Innovations"},{"key":357,"value":"DeRosa"},{"key":359,"value":"Dick Power"},{"key":360,"value":"Dicta"},{"key":362,"value":"Dino Bikes"},{"key":363,"value":"Dior"},{"key":364,"value":"Divo Bikes"},{"key":365,"value":"DK Bicycles"},{"key":366,"value":"Dolan"},{"key":367,"value":"Domane"},{"key":368,"value":"Don Walker Cycles"},{"key":369,"value":"Dornbierer"},{"key":370,"value":"Draisin"},{"key":371,"value":"Ducati"},{"key":372,"value":"Dudek"},{"key":373,"value":"Duerkopp"},{"key":374,"value":"Dugast"},{"key":375,"value":"Dura-Ace"},{"key":376,"value":"Düsenspeed"},{"key":377,"value":"Dux Helm"},{"key":378,"value":"Dynacraft"},{"key":379,"value":"Dynamo Cover"},{"key":380,"value":"Dyno"},{"key":382,"value":"E-Bikeboard"},{"key":383,"value":"Eagle Bicycle Manufacturing Company"},{"key":384,"value":"Eagle Bicycles"},{"key":385,"value":"Earth"},{"key":386,"value":"Eastern Bikes"},{"key":387,"value":"Easton"},{"key":388,"value":"EBIQ"},{"key":389,"value":"EBS"},{"key":672,"value":"Voodoo"},{"key":391,"value":"Effetto Mariposa"},{"key":392,"value":"Egli"},{"key":393,"value":"EGO Movement"},{"key":394,"value":"Eighteen Bikes"},{"key":395,"value":"Ekano"},{"key":396,"value":"Elby"},{"key":397,"value":"Elda"},{"key":399,"value":"Eleven81"},{"key":400,"value":"Elite Bicycles"},{"key":401,"value":"Elmoto"},{"key":402,"value":"Emotion Bikes"},{"key":403,"value":"Endura"},{"key":404,"value":"Enigma"},{"key":405,"value":"Enve"},{"key":406,"value":"Epoch"},{"key":407,"value":"Equinox"},{"key":408,"value":"Ergon"},{"key":409,"value":"Ericksen"},{"key":410,"value":"Eriksen Cycles"},{"key":411,"value":"Erox"},{"key":413,"value":"ESB"},{"key":414,"value":"Esperia"},{"key":415,"value":"Eureka"},{"key":416,"value":"Eurobike"},{"key":417,"value":"Eurosport"},{"key":418,"value":"Euskaltel-Euskadi"},{"key":419,"value":"Evans Cycles"},{"key":420,"value":"Everest"},{"key":421,"value":"EVG"},{"key":422,"value":"Evobike"},{"key":423,"value":"Evolve"},{"key":424,"value":"Exteondo"},{"key":425,"value":"F2R"},{"key":426,"value":"Fabric"},{"key":427,"value":"Factory"},{"key":428,"value":"Factor"},{"key":429,"value":"Faggin"},{"key":430,"value":"Fahrradmanufaktur"},{"key":431,"value":"Fairdale"},{"key":432,"value":"Falcon"},{"key":433,"value":"Faraday"},{"key":434,"value":"Fat City Cycles"},{"key":436,"value":"Festka"},{"key":437,"value":"FFWD"},{"key":438,"value":"Fiend BMX"},{"key":439,"value":"Fiorelli"},{"key":440,"value":"Firemans Texas Cruiser"},{"key":441,"value":"Fischer"},{"key":442,"value":"Fisher"},{"key":443,"value":"Fixie Inc."},{"key":446,"value":"Foolproof"},{"key":447,"value":"Formigli"},{"key":448,"value":"Formula"},{"key":449,"value":"Forte"},{"key":450,"value":"Fortified Bicycle"},{"key":451,"value":"Fortyone Bikes"},{"key":452,"value":"Foster and Thomson"},{"key":453,"value":"Foundry Cycles"},{"key":454,"value":"Frappé"},{"key":455,"value":"Freak Bikes"},{"key":456,"value":"Freego"},{"key":457,"value":"French ID"},{"key":458,"value":"Frenzy"},{"key":460,"value":"Fulton"},{"key":461,"value":"Funked Up"},{"key":462,"value":"Gabbani"},{"key":463,"value":"Ganna"},{"key":464,"value":"Gary Fisher"},{"key":466,"value":"GB Cycles"},{"key":467,"value":"GCI"},{"key":468,"value":"Genesis"},{"key":469,"value":"German:A"},{"key":674,"value":"Brompton"},{"key":473,"value":"Gippiemme"},{"key":474,"value":"Girsberger"},{"key":475,"value":"Giro"},{"key":476,"value":"Gitane"},{"key":477,"value":"Gleam Bike"},{"key":478,"value":"Globe"},{"key":479,"value":"Gocycle"},{"key":480,"value":"Goetze"},{"key":481,"value":"Gokiso"},{"key":482,"value":"Golden Bear"},{"key":483,"value":"Golden Lion"},{"key":484,"value":"Golden Wings"},{"key":485,"value":"Goldfish"},{"key":486,"value":"Gomez"},{"key":487,"value":"Go-One"},{"key":488,"value":"Göricke"},{"key":489,"value":"Gorilla Bicycles"},{"key":490,"value":"Gotham"},{"key":491,"value":"Graecross"},{"key":492,"value":"Gran Royale"},{"key":493,"value":"GreenMachine"},{"key":494,"value":"GreenSpeed"},{"key":495,"value":"Greyp"},{"key":496,"value":"Grimaldi"},{"key":497,"value":"GT Bicycles"},{"key":498,"value":"Gudereit"},{"key":500,"value":"Guinness World Records"},{"key":501,"value":"Gustavsberg"},{"key":502,"value":"Guyot"},{"key":503,"value":"Haco"},{"key":505,"value":"Halfords"},{"key":506,"value":"Halo"},{"key":507,"value":"Hama"},{"key":508,"value":"Hamax"},{"key":509,"value":"Hampsten Cycles"},{"key":510,"value":"Handlebar Bags"},{"key":511,"value":"Hanes"},{"key":512,"value":"Hanford Cycles"},{"key":513,"value":"Hanway"},{"key":514,"value":"Haole"},{"key":515,"value":"Hargroves Cycles"},{"key":517,"value":"Hartje"},{"key":518,"value":"Harvester Bikes"},{"key":519,"value":"Hasa"},{"key":520,"value":"Haskell"},{"key":521,"value":"Hawk"},{"key":522,"value":"Hawk Classic Cycles"},{"key":523,"value":"Hayes Bicycle Group"},{"key":524,"value":"Healy"},{"key":525,"value":"Heisenberg"},{"key":526,"value":"Helkama"},{"key":527,"value":"Helkama Velox"},{"key":529,"value":"Helkama-Auto"},{"key":530,"value":"Helliot Bikes"},{"key":531,"value":"Herkelmann"},{"key":532,"value":"Hermes"},{"key":533,"value":"Hero Cycles"},{"key":534,"value":"Hetchins"},{"key":535,"value":"Hewitt"},{"key":536,"value":"Hi-Bike"},{"key":538,"value":"Hiker"},{"key":539,"value":"Hilite"},{"key":540,"value":"Hoffman Bikes"},{"key":541,"value":"Holdsworth"},{"key":542,"value":"Hollands"},{"key":543,"value":"Holymoses"},{"key":544,"value":"Honda"},{"key":545,"value":"Hooligan Bikes"},{"key":546,"value":"Hopper"},{"key":547,"value":"Horacek"},{"key":548,"value":"Horizons Unlimited"},{"key":549,"value":"Horton Collection"},{"key":550,"value":"Houffalize"},{"key":551,"value":"House Industries"},{"key":552,"value":"HP Velotechnik"},{"key":553,"value":"HPS"},{"key":554,"value":"HT Components"},{"key":555,"value":"Hujsak"},{"key":556,"value":"Humber"},{"key":557,"value":"Hummingbird"},{"key":558,"value":"Husqvarna"},{"key":559,"value":"Hutchinson"},{"key":560,"value":"Hybrid Cycling Technology"},{"key":561,"value":"Hydrogen Bicycles"},{"key":562,"value":"Hyper"},{"key":564,"value":"Icarus"},{"key":565,"value":"ICE Trikes"},{"key":566,"value":"Icone"},{"key":567,"value":"Ideal"},{"key":568,"value":"Idaho Flyer"},{"key":569,"value":"iGo"},{"key":570,"value":"Illinois Bike Attorneys"},{"key":571,"value":"Impala Bicycles"},{"key":572,"value":"Independent Fabrication"},{"key":573,"value":"Inferno"},{"key":574,"value":"Infinity"},{"key":575,"value":"Inmotion"},{"key":577,"value":"Intercycle"},{"key":578,"value":"Iron Horse Bicycles"},{"key":579,"value":"Isaac"},{"key":580,"value":"Islabikes"},{"key":581,"value":"Italjet"},{"key":582,"value":"Izalco"},{"key":583,"value":"J. Guo"},{"key":584,"value":"Jack Taylor Cycles"},{"key":585,"value":"Jango"},{"key":586,"value":"Janus"},{"key":587,"value":"Japanese Bicycle Brands"},{"key":588,"value":"Java"},{"key":589,"value":"Jaybird"},{"key":590,"value":"JDBug"},{"key":591,"value":"Jeantex"},{"key":592,"value":"Jetset"},{"key":593,"value":"Jobike"},{"key":594,"value":"Jopo"},{"key":595,"value":"Jordan"},{"key":596,"value":"Jota"},{"key":598,"value":"Juncker"},{"key":599,"value":"Just Long"},{"key":600,"value":"Kansi"},{"key":601,"value":"Karbon Kinetics"},{"key":602,"value":"Karmic"},{"key":603,"value":"Katarga"},{"key":604,"value":"Kawasaki"},{"key":605,"value":"Kettler"},{"key":606,"value":"KHE"},{"key":607,"value":"KHS Bicycles"},{"key":609,"value":"Kink BMX"},{"key":610,"value":"Kinn Bikes"},{"key":611,"value":"Kinoko Cycles"},{"key":612,"value":"Kirschi"},{"key":613,"value":"Kissena"},{"key":614,"value":"Kit Bike"},{"key":615,"value":"KJ Works"},{"key":616,"value":"Klasa"},{"key":617,"value":"Klemm"},{"key":618,"value":"Knolly"},{"key":619,"value":"Kocmo"},{"key":620,"value":"Koga"},{"key":621,"value":"Kogel Bearings"},{"key":622,"value":"Kokua"},{"key":624,"value":"Krasnopolski"},{"key":625,"value":"Kreitler"},{"key":626,"value":"Krestel"},{"key":627,"value":"Kronan"},{"key":628,"value":"Krups"},{"key":629,"value":"Kruzer"},{"key":630,"value":"KTM"},{"key":631,"value":"Kuba"},{"key":632,"value":"Kuota"},{"key":633,"value":"Kuruma"},{"key":634,"value":"Kustom Kruisers"},{"key":635,"value":"Küschall"},{"key":636,"value":"Kuwahara"},{"key":637,"value":"Kymco"},{"key":638,"value":"La Pierre"},{"key":639,"value":"Labek Bike"},{"key":641,"value":"Lark"},{"key":642,"value":"Laser"},{"key":643,"value":"Last Bikes"},{"key":668,"value":"Pearson"},{"key":675,"value":"Cannondale"}]
        }),
    }
}