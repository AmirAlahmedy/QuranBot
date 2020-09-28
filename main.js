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
const names = require('./names.json');

<<<<<<< HEAD
/*------------------------------------------------------------------------------*/
/*----------------------------logger--------------------------------------------*/
const winston = require('winston');
const error_file = path.join(__dirname, './error.log');
const info_file = path.join(__dirname, './info.log');
const DailyRotateFile = require('winston-daily-rotate-file');
let  logger = winston.createLogger({
	level: 'info',
	transports: [
		// new winston.transports.Console(),
		new winston.transports.DailyRotateFile({filename:error_file, level:'error', maxSize: '5m', maxFiles: '5d'}),
		new winston.transports.DailyRotateFile({filename:info_file,  maxSize: '5m', maxFiles: '5d'})
	]
});
/*------------------------------------------------------------------------------*/
const TOKEN = "90091903321704167:0:UH6trZhM8FbmbigaV4NraBsBTrbJEP";
=======
const TOKEN = "90091903321704167:0:zC3DA2POQma9HimpXCbKRnF8tqDQEU";
>>>>>>> 914cc27c08981bff4c17024c987e7dcc33f6aa6e
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
    logger.info("Authenticated");
    sendBotMenuWithNavigationButton(Nand.BOT_ID);
}



nCallBack.onReceive = incomingMsg => {
    console.log("Message Received");
    logger.info("Message Received");

    if (incomingMsg.isTextMsg()) {
        let chatId = incomingMsg.chat.id; // get your chat Id
        sendBotMenuWithNavigationButton(chatId);
    }

}

// implement other nandbox.Callback() as per your bot need
nCallBack.onReceiveObj = obj => {
    console.log("received object: ", obj);
    logger.info("received object: ", obj);
}
nCallBack.onClose = () => {
    console.log("ONCLOSE");
    logger.info("ONCLOSE");
}
nCallBack.onError = () => {
    console.log("ONERROR");
    logger.info("ONERROR");
}
let k = 0, m;
nCallBack.onChatMenuCallBack = chatMenuCallback => {
    let audioOutMsg = new AudioOutMessage();
    if(chatMenuCallback.button_callback == 'rndm'){ // random
        let i = Math.floor(Math.random()*N);
        let j = Math.floor(Math.random()*N);
        if(data[i].chapters[j].path){
            if(data[i].chapters[j].id == null){
                api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                MediaTransfer.uploadFile(TOKEN, data[i].chapters[j].path, config.UploadServer)
                .then(uploadedAudioId => {
                    if(uploadedAudioId){
                        audioOutMsg.chat_id = chatMenuCallback.chat.id;
                        audioOutMsg.reference = Id();
                        audioOutMsg.audio = uploadedAudioId;
                        data[i].chapters[j].id = uploadedAudioId;
                        fs.writeFile("./data.json", data); 
                        audioOutMsg.performer = data[i].ename;
                        audioOutMsg.title = data[i].chapters[j].caname;
                        audioOutMsg.caption = data[i].aname+" رواية حفص عن عاصم ";
                        api.send(JSON.stringify(audioOutMsg));
                    } else {
                        console.error("upload failed, try again"); 
                        logger.error("upload failed, try again"); 
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "فشل الإرسال", "White");
                        api.sendTextWithBackground(chatMenuCallback.chat.id, data[i].chapters[j].url, "White");
                    }
                })
                .catch(e => { 
                    console.error("Upload failed", e)
                    logger.error("Upload failed"+e)
                 });
            }else if(data[i].chapters[j].id != null){
                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                audioOutMsg.reference = Id();
                audioOutMsg.audio = data[i].chapters[j].id; 
                audioOutMsg.performer = data[i].ename;
                audioOutMsg.title =  data[i].chapters[j].caname;;
                audioOutMsg.caption =  data[i].aname+" رواية حفص عن عاصم  ";
                api.send(JSON.stringify(audioOutMsg));
            }
        }else if(data[i].chapters[j].url){
            api.sendTextWithBackground(chatMenuCallback.chat.id, data[i].chapters[j].url, "White");
        }
            
    } else { // not random
        let n = data.length, i;
        for(i = 0; i < n ; i++){
            if(chatMenuCallback.button_callback == "CB"+i){
                m = data[i].chapters.length;
                k = i;
                break;
            }
        }
        for(let j = 0; j < m; j++){
            if(chatMenuCallback.button_callback == "VCB"+j){
                if(data[k].chapters[j].path){
                    if(data[k].chapters[j].id == null){
                        api.sendTextWithBackground(chatMenuCallback.chat.id, "جاري إرسال السورة", "White");
                        console.log(k, j);
                        MediaTransfer.uploadFile(TOKEN, data[k].chapters[j].path, config.UploadServer)
                        .then(uploadedAudioId => {
                            if(uploadedAudioId){
                                audioOutMsg.chat_id = chatMenuCallback.chat.id;
                                audioOutMsg.reference = Id();
                                audioOutMsg.audio = uploadedAudioId;
                                data[k].chapters[j].id = uploadedAudioId;
                                fs.writeFile("./data.json", JSON.stringify(data));
                                audioOutMsg.performer = data[k].ename;
                                audioOutMsg.title = data[k].chapters[j].caname;
                                audioOutMsg.caption = data[k].aname+" رواية حفص عن عاصم ";
                                api.send(JSON.stringify(audioOutMsg));
                            } else{
                                console.error("upload failed, try again"); 
                                logger.error("upload failed, try again"); 
                                api.sendTextWithBackground(chatMenuCallback.chat.id, "فشل الإرسال", "White");
                                api.sendTextWithBackground(chatMenuCallback.chat.id, data[k].chapters[j].url, "White");
                            } 
                                
                        })
                        .catch(e => { 
                            console.error("Upload failed", e);
                            logger.error("Upload failed"+ e);
                        });
                    }else if(data[k].chapters[j].id != null){
                        audioOutMsg.chat_id = chatMenuCallback.chat.id;
                        audioOutMsg.reference = Id();
                        audioOutMsg.audio = data[k].chapters[j].id 
                        audioOutMsg.performer = data[k].ename;
                        audioOutMsg.title =  data[k].chapters[j].caname;
                        audioOutMsg.caption =  data[k].aname+" رواية حفص عن عاصم ";
                        api.send(JSON.stringify(audioOutMsg));
                    }
                }else if(data[k].chapters[j].url){
                    api.sendTextWithBackground(chatMenuCallback.chat.id, data[k].chapters[j].url, "White");
                }
            }
        }
    }
}
nCallBack.onInlineMessageCallback = inlineMsgCallback => { }
nCallBack.onMessagAckCallback = msgAck => { }
nCallBack.onUserJoinedBot = user => {
    api.sendTextWithBackground(user.id, "السلام عليكم,ابدأ الاستمع الآن", "White");
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
    api.send(JSON.stringify(createMainMenu(chatId, names[0], names[1])));
}

let createMainMenu = (chatId, first_array, second_array) => {
        
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
    mainMenu.push(createSingleBtnRows(first_array, 'CB', 'SecondMenu', '#2ED473', 'Black', 'ThirdMenu', 'MainMenu'));
    mainMenu.push(createSingleBtnRows(second_array, 'VCB', 'ThirdMenu', '#2ED473', 'Black', null, 'SecondMenu'));

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