const NandBox = require('nandbox-bot-api/src/NandBox');
const Nand = require('nandbox-bot-api/src/NandBoxClient');
const Utils = require('nandbox-bot-api/src/util/Utility');
const NandBoxClient = Nand.NandBoxClient;
const Utility = Utils.Utility;
const Id = Utils.Id;
const SetChatMenuOutMessage = require('./node_modules/nandbox-bot-api/src/outmessages/setChatMenuOutMessage');
const Menu = require('./node_modules/nandbox-bot-api/src/data/Menu');
const Button = require('./node_modules/nandbox-bot-api/src/data/Button');
const Row = require('./node_modules/nandbox-bot-api/src/data/Row');
const AudioOutMessage = require('nandbox-bot-api/src/outmessages/AudioOutMessage');
const MediaTransfer = require('./node_modules/nandbox-bot-api/src/util/MediaTransfer');

const TOKEN = "90092049883065839:0:2Y7AO8KLnpmdCWWKeilM3nn9NVOJL3";
const config = {
    URI: "wss://w1.nandbox.net:5020/nandbox/api/",
    DownloadServer: "https://w1.nandbox.net:5020/nandbox/download/",
    UploadServer: "https://w1.nandbox.net:5020/nandbox/upload/"
}


var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;

// reciters in arabic
const reciters = [
    'المنشاوي',
    'عبد الباسط',
    'الحصري'
];

// suwar in arabic 
const verses = [
    'الفاتحة',
    'البقرة',
    'الرحمن'
]

const files_urls = [
    [
        './suwar/minshawi_fatiha.mp3',
        'https://server10.mp3quran.net/minsh/002.mp3',
        './suwar/minshawi_rahman.mp3'
    ],
    [
        './suwar/baset_fatiha.mp3',
        'https://server7.mp3quran.net/basit/002.mp3',
        './suwar/baset_rahman.mp3'
    ],
    [
        './suwar/hosary_fatiha.mp3',
        'https://server13.mp3quran.net/husr/002.mp3',
        './suwar/hosary_rahman.mp3'
    ]
]
// 2d array storing the audio files ids
let shyokh = [
    [ // minshawi
        null, //fatiha
        null, //baqqara
        null  //rahman
    ],
    [ // baset
        null,
        null,
        null
    ],
    [ // hosary
        null,
        null,
        null
    ]
]

nCallBack.onConnect = (_api) => {
    // it will go here if the bot connected to the server successfully 
    api = _api;
    console.log("Authenticated");
}



nCallBack.onReceive = incomingMsg => {
    console.log("Message Received");

    if (incomingMsg.isTextMsg()) {
        let chatId = incomingMsg.chat.id; // get your chat Id
        sendBotMenuWithNavigationButton(chatId);
    }

}

// implement other nandbox.Callback() as per your bot need
nCallBack.onReceiveObj = obj => console.log("received object: ", obj);
nCallBack.onClose = () => console.log("ONCLOSE");
nCallBack.onError = () => console.log("ONERROR");


let sheikh = null;
nCallBack.onChatMenuCallBack = chatMenuCallback => {
    let audioOutMsg = new AudioOutMessage();
    switch(chatMenuCallback.button_callback){
        case 'rndm' :
            let i = Math.floor(Math.random()*2.9);
            let j = Math.floor(Math.random()*2.9);
            if(i != 1){ // not baqara
                if(!shyokh[j][i]){
                api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        MediaTransfer.uploadFile(TOKEN, files_urls[j][i], config.UploadServer)
                            .then(uploadedAudioId => {
                                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                                audioOutMsg.reference = Id();
                                audioOutMsg.audio = uploadedAudioId;
                                shyokh[j][i] = uploadedAudioId; 
                                audioOutMsg.performer = sheikh;
                                audioOutMsg.title = verses[i];
                                audioOutMsg.caption = reciters[j]+" رواية حفص عن عاصم بصوت الشيخ ";
                                api.send(JSON.stringify(audioOutMsg));
                                // api.sendAudio(chatMenuCallback.chat.id, uploadedAudioId,  audioOutMsg.reference, null, null, null, null, caption, null, null, null);

                            })
                            .catch(e => console.error("Upload failed", e));
                }else{
                    audioOutMsg.chat_id = chatMenuCallback.chat.id;
                    audioOutMsg.reference = Id();
                    audioOutMsg.audio = shyokh[j][i]; 
                    audioOutMsg.performer = sheikh;
                    audioOutMsg.title =  verses[i];
                    audioOutMsg.caption =  reciters[j]+" رواية حفص عن عاصم بصوت الشيخ ";
                    api.send(JSON.stringify(audioOutMsg));
                }
            } else {
                    let i = Math.floor(Math.random()*2.9);
                    switch(sheikh){
                        case reciters[i]:
                            api.sendTextWithBackground(chatMenuCallback.chat.id, files_urls[i][1], "White");
                            break;
                    }
                
            }
            break;
        case 'CB0' :
            sheikh = reciters[0];
            break;
        case 'CB1' :
            sheikh = reciters[1];
            break;
        case 'CB2' :
            sheikh = reciters[2];
            break;
        case 'VCB0': // fateha
            switch(sheikh){
                case reciters[0]: // minshawi
                    if(!shyokh[0][0]) {
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        MediaTransfer.uploadFile(TOKEN, './suwar/minshawi_fatiha.mp3', config.UploadServer)
                            .then(uploadedAudioId => {
                                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                                audioOutMsg.reference = Id();
                                audioOutMsg.audio = uploadedAudioId;
                                shyokh[0][0] = uploadedAudioId; 
                                audioOutMsg.performer = sheikh;
                                audioOutMsg.title = "الفاتحة";
                                audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ المنشاوي";
                                api.send(JSON.stringify(audioOutMsg));
                                // api.sendAudio(chatMenuCallback.chat.id, uploadedAudioId,  audioOutMsg.reference, null, null, null, null, caption, null, null, null);

                            })
                            .catch(e => console.error("Upload failed", e));
                    } else {
                                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                                audioOutMsg.reference = Id();
                                audioOutMsg.audio = shyokh[0][0]; 
                                audioOutMsg.performer = sheikh;
                                audioOutMsg.title = "الفاتحة";
                                audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ المنشاوي";
                                api.send(JSON.stringify(audioOutMsg));
                    }
                    break;
                case reciters[1]: // baset
                    if(!shyokh[1][0]){
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        MediaTransfer.uploadFile(TOKEN, './suwar/baset_fatiha.mp3', config.UploadServer)
                            .then(uploadedAudioId => {
                                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                                audioOutMsg.reference = Id();
                                audioOutMsg.audio = uploadedAudioId; 
                                shyokh[1][0] = uploadedAudioId; 
                                audioOutMsg.performer = sheikh;
                                audioOutMsg.title = "الفاتحة";
                                audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ عبدالباسط";
                                api.send(JSON.stringify(audioOutMsg));

                            })
                            .catch(e => console.error("Upload failed", e));
                     } else {
                        audioOutMsg.chat_id = chatMenuCallback.chat.id;
                        audioOutMsg.reference = Id();
                        audioOutMsg.audio = shyokh[1][0]; 
                        audioOutMsg.performer = sheikh;
                        audioOutMsg.title = "الفاتحة";
                        audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ عبدالباسط";
                        api.send(JSON.stringify(audioOutMsg));
                    }
                    break;
                case reciters[2]: // Hosary
                    if(!shyokh[2][0]){
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        MediaTransfer.uploadFile(TOKEN, './suwar/hosary_fatiha.mp3', config.UploadServer)
                        .then(uploadedAudioId => {
                            audioOutMsg.chat_id = chatMenuCallback.chat.id;
                            audioOutMsg.reference = Id();
                            audioOutMsg.audio = uploadedAudioId; 
                            shyokh[2][0] = uploadedAudioId; 
                            audioOutMsg.performer = sheikh;
                            audioOutMsg.title = "الفاتحة";
                            audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ الحصري";
                            api.send(JSON.stringify(audioOutMsg));
                        })
                        .catch(e => console.error("Upload failed", e));
                    } else {
                        audioOutMsg.chat_id = chatMenuCallback.chat.id;
                        audioOutMsg.reference = Id();
                        audioOutMsg.audio = shyokh[2][0]; 
                        audioOutMsg.performer = sheikh;
                        audioOutMsg.title = "الفاتحة";
                        audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ الحصري";
                        api.send(JSON.stringify(audioOutMsg));
                    }
                    break;
                default:
                    break;
            }
            break;
        case 'VCB1':
            switch(sheikh){
                case reciters[0]:
                    api.sendTextWithBackground(chatMenuCallback.chat.id, "https://server10.mp3quran.net/minsh/002.mp3", "White");
                    break;
                case reciters[1]:
                    api.sendTextWithBackground(chatMenuCallback.chat.id, "https://server7.mp3quran.net/basit/002.mp3", "White"); 
                    break;
                case reciters[2]:
                    api.sendTextWithBackground(chatMenuCallback.chat.id, "https://server13.mp3quran.net/husr/002.mp3", "White"); 
                    break;
                default:
                    break;
            }
            break;
        case 'VCB2':
            switch(sheikh){
                case reciters[0]: // minshawi
                    if(!shyokh[0][2]){
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        MediaTransfer.uploadFile(TOKEN, './suwar/minshawi_rahman.mp3', config.UploadServer)
                        .then(uploadedAudioId => {
                            audioOutMsg.chat_id = chatMenuCallback.chat.id;
                            audioOutMsg.reference = Id();
                            audioOutMsg.audio = uploadedAudioId; 
                            shyokh[0][2] = uploadedAudioId; 
                            audioOutMsg.performer = sheikh;
                            audioOutMsg.title = "الرحمن";
                            audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ المنشاوي";
                            api.send(JSON.stringify(audioOutMsg));

                        })
                        .catch(e => console.error("Upload failed", e));
                    } else {
                        audioOutMsg.chat_id = chatMenuCallback.chat.id;
                        audioOutMsg.reference = Id();
                        audioOutMsg.audio = shyokh[0][2]; 
                        audioOutMsg.performer = sheikh;
                        audioOutMsg.title = "الرحمن";
                        audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ المنشاوي";
                        api.send(JSON.stringify(audioOutMsg));

                    }
                    break;
                case reciters[1]: // baset
                    if(!shyokh[1][2]){
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        MediaTransfer.uploadFile(TOKEN, './suwar/baset_rahman.mp3', config.UploadServer)
                        .then(uploadedAudioId => {
                            audioOutMsg.chat_id = chatMenuCallback.chat.id;
                            audioOutMsg.reference = Id();
                            audioOutMsg.audio = uploadedAudioId; 
                            shyokh[1][2] = uploadedAudioId; 
                            audioOutMsg.performer = sheikh;
                            audioOutMsg.title = "الرحمن";
                            audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ عبدالباسط";
                            api.send(JSON.stringify(audioOutMsg));
                        })
                        .catch(e => console.error("Upload failed", e));
                    } else {
                        audioOutMsg.chat_id = chatMenuCallback.chat.id;
                        audioOutMsg.reference = Id();
                        audioOutMsg.audio = shyokh[1][2]; 
                        audioOutMsg.performer = sheikh;
                        audioOutMsg.title = "الرحمن";
                        audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ عبدالباسط";
                        api.send(JSON.stringify(audioOutMsg));

                    }
                    break;
                case reciters[2]: // Hosary
                    if(!shyokh[2][2]){
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        MediaTransfer.uploadFile(TOKEN, './suwar/baset_rahman.mp3', config.UploadServer)
                        .then(uploadedAudioId => {
                            audioOutMsg.chat_id = chatMenuCallback.chat.id;
                            audioOutMsg.reference = Id();
                            audioOutMsg.audio = uploadedAudioId; 
                            shyokh[2][2] = uploadedAudioId; 
                            audioOutMsg.performer = sheikh;
                            audioOutMsg.title = "الرحمن";
                            audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ الحصري";
                            api.send(JSON.stringify(audioOutMsg));
                        })
                        .catch(e => console.error("Upload failed", e));
                    } else {
                        audioOutMsg.chat_id = chatMenuCallback.chat.id;
                        audioOutMsg.reference = Id();
                        audioOutMsg.audio = shyokh[2][2]; 
                        audioOutMsg.performer = sheikh;
                        audioOutMsg.title = "الرحمن";
                        audioOutMsg.caption = "رواية حفص عن عاصم بصوت الشيخ الحصري";
                        api.send(JSON.stringify(audioOutMsg));
                    }
                    break;
                default:
                    break;
            }
                break;
        default:
            break;
    }
 }
nCallBack.onInlineMessageCallback = inlineMsgCallback => { }
nCallBack.onMessagAckCallback = msgAck => { }
nCallBack.onUserJoinedBot = user => { 
    sendBotMenuWithNavigationButton(user.id);
}
nCallBack.onChatMember = chatMember => { }
nCallBack.onChatAdministrators = chatAdministrators => { }
nCallBack.userStartedBot = user => {
    sendBotMenuWithNavigationButton(user.id);
 }
nCallBack.onMyProfile = user => { }
nCallBack.onUserDetails = user => { }
nCallBack.userStoppedBot = user => { }
nCallBack.userLeftBot = user => { }
nCallBack.permanentUrl = permenantUrl => { }
nCallBack.onChatDetails = chat => { }
nCallBack.onInlineSearh = inlineSearch => { }

client.connect(TOKEN, nCallBack);

let sendBotMenuWithNavigationButton = (chatId) => {
    Utility.setNavigationButton(chatId, 'MainMenu', api);
    api.send(JSON.stringify(createMainMenu(chatId)));
}

let createMainMenu = chatId => {
        
    let setChatMainMenu = new SetChatMenuOutMessage();
    let btns = [];
    let rows = []   // a button per row
    
    let rndmBtn = createButton('عشوائي', 'rndm', 1, '#2ED473', 'Black', null, null, null);
    let chsBtn = createButton('أنا سأختار', 'chs', 2, '#2ED473', 'Black', null, 'SecondMenu', null);

    btns.push(rndmBtn);
    rows.push(new Row(btns, 1))

    btns = [];
    btns.push(chsBtn);
    rows.push(new Row(btns, 2));

    let chatMainMenu = new Menu(rows, 'MainMenu')
    
    let mainMenu = [];
    mainMenu.push(chatMainMenu)
    mainMenu.push(createSingleBtnRows(reciters, 'CB', 'SecondMenu', '#2ED473', 'Black', 'ThirdMenu', 'MainMenu'));
    mainMenu.push(createSingleBtnRows(verses, 'VCB', 'ThirdMenu', '#2ED473', 'Black', null, 'SecondMenu'));

    setChatMainMenu.menus = mainMenu;
    setChatMainMenu.chat_id = chatId;
    return setChatMainMenu;
}

let createSingleBtnRows = (array, cb, ref, color, fontColor, nextMenu, prevMenu) => {
    const n = array.length;
    let [rows, btns] = [[], []];
    for(let i = 0; i < n; ++i){
        // a single button per row
        btns.push(createButton(array[i],  cb+i, i+1, color, fontColor, null, nextMenu, null));
        rows.push(new Row(btns, i+1));
        btns = [];
    }
    
    let bckBtn = createButton('عودة', 'bck', n+1, color, fontColor, null, prevMenu, null);
    btns.push(bckBtn)
    rows.push(new Row(btns, n+1));

    return new Menu(rows, ref);
}

let createButton = (label, callback, order, bgColor, txtColor, buttonQuery, nextMenuRef, buttonURL) => {
    let btn = new Button();

    btn.button_label = label;
    btn.button_order = order;
    btn.button_callback = callback;
    btn.button_bgcolor = bgColor;
    btn.button_textcolor = txtColor;
    btn.button_query = buttonQuery;
    btn.next_menu = nextMenuRef;
    btn.button_url = buttonURL;

    return btn;
 }