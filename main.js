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
let fs = require("file-system");
let path = require("path");
let data = require("./data.json");


const TOKEN = "90092049883065839:0:rGQoaMdy4MwFuXW9KCmFt2ZvLv0uOS";
const config = {
    URI: "wss://w1.nandbox.net:5020/nandbox/api/",
    DownloadServer: "https://w1.nandbox.net:5020/nandbox/download/",
    UploadServer: "https://w1.nandbox.net:5020/nandbox/upload/"
}


var client = NandBoxClient.get(config);
var nandbox = new NandBox();
var nCallBack = nandbox.Callback;
var api = null;



// increment when adding a new sheikh
const N = data.length - .1;


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
    if(chatMenuCallback.button_callback == 'rndm'){
        let i = Math.floor(Math.random()*N);
        let j = Math.floor(Math.random()*N);
        if(!data[i].chapters[j].url && data[i].chapters[j].path){
            if(!data[i].chapters[j].id){
                api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                MediaTransfer.uploadFile(TOKEN, data[i].chapters[j].path, config.UploadServer)
                .then(uploadedAudioId => {
                    audioOutMsg.chat_id = chatMenuCallback.chat.id;
                    audioOutMsg.reference = Id();
                    audioOutMsg.audio = uploadedAudioId;
                    shyokh[j][i] = uploadedAudioId; 
                    audioOutMsg.performer = data[i].ename;
                    audioOutMsg.title = data[i].chapters[j].caname;
                    audioOutMsg.caption = data[i].aname+" رواية حفص عن عاصم بصوت الشيخ ";
                    api.send(JSON.stringify(audioOutMsg));
                })
                .catch(e => console.error("Upload failed", e));
            }else{
                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                audioOutMsg.reference = Id();
                audioOutMsg.audio = data[i].chapters[j].id; 
                audioOutMsg.performer = data[i].ename;
                audioOutMsg.title =  data[i].chapters[j].caname;;
                audioOutMsg.caption =  data[i].aname+" رواية حفص عن عاصم بصوت الشيخ ";
                api.send(JSON.stringify(audioOutMsg));
            }
        }else if(data[i].chapters[j].url){
            api.sendTextWithBackground(chatMenuCallback.chat.id, data[i].chapters[j].url);
        }
            
    } else { // not random
        let n = data.length;
        for(let i = 0; i < n; ++i){
            if(chatMenuCallback.button_callback == data[i].cb){

                let m = data[i].chapters.length;
                for(let j = 0; j < m; ++j){
                    if(!data[i].chapters[j].url && data[i].chapters[j].path){
                        if(!data[i].chapters[j].id){
                            api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة");
                            MediaTransfer.uploadFile(TOKEN, data[i].chapters[j].path, config.UploadServer)
                            .then(uploadedAudioId => {
                                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                                audioOutMsg.reference = Id();
                                audioOutMsg.audio = uploadedAudioId;
                                data[i].chapters[j].id = uploadedAudioId; 
                                audioOutMsg.performer = data[i].ename;
                                audioOutMsg.title = data[i].chapters[j].caname;
                                audioOutMsg.caption = data[i].aname+" رواية حفص عن عاصم بصوت الشيخ ";
                                api.send(JSON.stringify(audioOutMsg));
                            })
                            .catch(e => console.error("Upload failed", e));
                        }else{
                            audioOutMsg.chat_id = chatMenuCallback.chat.id;
                            audioOutMsg.reference = Id();
                            audioOutMsg.audio = data[i].chapters[j].id 
                            audioOutMsg.performer = data[i].ename;
                            audioOutMsg.title =  data[i].chapters[j].caname;
                            audioOutMsg.caption =  data[i].aname+" رواية حفص عن عاصم بصوت الشيخ ";
                            api.send(JSON.stringify(audioOutMsg));
                        }
                    }else if(data[i].chapters[j].url){
                        api.sendTextWithBackground(chatMenuCallback.chat.id, data[i].chapters[j].url);
                    }
                }
            }
        }
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