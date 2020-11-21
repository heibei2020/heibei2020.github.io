var target_pos = {"名詞":1,"動詞":1};

$(function(){

    $('#k-btn').on('click',function(){
        $('#display').text('');
    });

//    $('#k-area').on('change',function(){
    $('#k-area').on('input',function(){
        var token_result = kuromojiObj.tokenize($('#k-area').val()); 
        var token_result2string = '';
        token_result2string = '<table border=\"1\"><tr>';
        for (var i = 0; i < token_result.length; i++) {
            token_result2string += '<td valign=\"top\">';
            token_result2string += token_result[i].surface_form;
            token_result2string += '<br><hr>';
            token_result2string += token_result[i].pos;
            token_result2string += '<br>';
            token_result2string += token_result[i].pos_detail_1;
            token_result2string += '<br>';
            if(!token_result[i].reading){
                continue; //読みが分からない場合は読み飛ばす
            }
            var reading = kana2Hira(token_result[i].reading);
            if(homonym[reading]){
                if(target_pos[token_result[i].pos]){
                    var homonym_result = homonym[reading].split(',');
                    homonym_result.forEach(function(item) {
                        token_result2string += item;
                        token_result2string += '<br>';
                    });
                }
            }
            token_result2string += '</td>';
        }
        token_result2string += '</tr></table>';

        $('#display').html(token_result2string);
    });


});

let kuromojiObj;
var homonym = {};
var kurobuilder = kuromoji.builder({ dicPath: "dict/" });

kurobuilder.build(function(err,tokenizer){
    // tokenizer is ready
    kuromojiObj = tokenizer;
});

// 同音異義語の辞書を読み込むための処理 =====================================================

function readFile(file) {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", file, true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行

    req.onload = function(){
        var lines = req.responseText.split("\n");
        for(var i=0;i<lines.length;++i){
            var result = lines[i].split(',');
            homonym[result[0]] = lines[i];
        }
    }
}

var file = 'homonym2.txt'
readFile(file);
// ======================================================================================

function hira2Kana(str) {
    return str.replace(/[\u3041-\u3096]/g, function(match) {
        var chr = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(chr);
    });
}

function kana2Hira(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}