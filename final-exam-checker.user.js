// ==UserScript==
// @name         最終課題チェッカー2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  最終課題チェッカー2
// @author       You
// @match        http://*/final-exam/*
// @match        http://*/*/final-exam/*
// @match        https://*/final-exam/*
// @match        https://*/*/final-exam/*
// @icon         https://demo.techacademy.jp/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/yymmt/tafe/main/final-exam-checker.user.js
// @downloadURL  https://raw.githubusercontent.com/yymmt/tafe/main/final-exam-checker.user.js
// @supportURL   https://qiita.com/yymmt/private/a33b12a442827f4c7141
// ==/UserScript==

window.onload = () => {
  let openButton = document.createElement("img");
  openButton.src = imgurl.glass;
  openButton.classList.add("__openButton");
  document.body.appendChild(openButton);
  let stlElm = document.createElement("style");
  stlElm.innerHTML=ARTICLES.ADD_STYLE;
  document.body.appendChild(stlElm);

  openButton.addEventListener("click", ()=>{
    let win = window.open("about:blank");
    let winDoc = win.document;
    winDoc.body.innerHTML=ARTICLES.BODY;
    let scaleList = Object.assign({1920:50, 1536:40, 1366:50, 768: 60, 767:70, 390:100}, JSON.parse(localStorage.getItem('scale')) || {});
    let leftFrm = winDoc.querySelector(".left iframe");
    let rightFrm = winDoc.querySelector(".right iframe");
    leftFrm.onload = ()=>{
      let leftFrmDoc = leftFrm.contentWindow.document;
      let rightFrmDoc = rightFrm.contentWindow.document;
      win.setTimeout(()=>{
        let jq = leftFrm.contentWindow.$;
        let updownButton = winDoc.querySelector(".menu .updown");
        let updownButton_onMouseMove = (event) => { rightFrm.style.top = ( parseInt(rightFrm.style.top) + event.movementY) + "px"; }
        updownButton.onmousedown = function (event) {
          winDoc.addEventListener('mousemove', updownButton_onMouseMove);
          winDoc.onmouseup = function () {
            winDoc.removeEventListener('mousemove', updownButton_onMouseMove);
            winDoc.onmouseup = null;
          };
        };
        updownButton.ondragstart = () => false;

        winDoc.querySelectorAll(".menu [data-mode]").forEach(e=>{
          e.addEventListener("click", ()=>{
            winDoc.querySelector(".iframe2-container").setAttribute("data-mode", e.getAttribute("data-mode"));
          })
        })

        let widthInput = winDoc.querySelector(".menu .iframewidth");
        let compOptInput = winDoc.querySelector(".menu .compOpt");
        let scaleInput = winDoc.querySelector(".menu .iframescale");
        let toDifffButton = winDoc.querySelector(".menu .todifff");


        let resetScale = () => {
          let width = widthInput.value;
          let height = 40000;
          let scale = scaleInput.value / 100;
          let sel = (sel, prop, val) => { winDoc.querySelectorAll(sel).forEach(e=> {e.style[prop] = val;} ); }
          winDoc.querySelector(".menu [data-mode='side']").click();
          sel(".iframe-outer iframe", "width", `${width}px`);
          sel(".iframe-outer iframe", "height", `${height}px`);
          sel(".iframe-outer iframe", "transform", `translate(-${width * (1-scale)/2}px, -${height * (1-scale)/2}px) scale(${scale})`);
          sel(".iframe-outer", "width", `${width * scale}px`);
          sel(".iframe2-container", "width", `${width * scale * 2 + 5}px`);
          sel(".iframe2-container", "height", `${height * scale}px`);
          localStorage.setItem('scale', JSON.stringify(scaleList));

          let w=width;
          winDoc.querySelector(".compOpt [value='1']").disabled = !(w==1536 || w==390);
          winDoc.querySelector(".compOpt [value='2']").disabled = !(w==1536 || w==390);
          winDoc.querySelector(".compOpt [value='3']").disabled = !(w==1536 || w==390);
          winDoc.querySelector(".compOpt [value='4']").disabled = !(w==1536 || w==390);
          winDoc.querySelector(".compOpt [value='5']").disabled = !(w==1536 || w==390);
          winDoc.querySelector(".compOpt [value='menu']").disabled = !(w==390);

          setComp();
          compair();
        }
        let setComp = () => {
          let w = widthInput.value;
          let o = compOptInput.value;
          let url = "";
          if(w==1536 || w==390) {
            if(w==1536) {
              url=(o==1)?imgurl.comp_pc :
                (o==2)?imgurl.comp_pc_cover_2 :
                (o==3)?imgurl.comp_pc_cover_3 :
                (o==4)?imgurl.comp_pc_cover_4 :
                (o==5)?imgurl.comp_pc_cover_5 : "";
            }
            if(w==390) {
              url=(o==1)?imgurl.comp_sp :
                (o==2)?imgurl.comp_sp_cover_2 :
                (o==3)?imgurl.comp_sp_cover_3 :
                (o==4)?imgurl.comp_sp_cover_4 :
                (o==5)?imgurl.comp_sp_cover_5 :
                (o=="menu")?imgurl.comp_sp_menu : "";
            }
          }
          if(url) {
            compImg.src=url;
            compImg.style.display = "";
          } else {
            compImg.src="";
            compImg.style.display = "none";
          }
        }

        let selError = winDoc.querySelector(".menu .error");
        let coverElm = winDoc.querySelector(".cover");
        let flatDemoNodeList;
        let flatRootNodeList;
        let compair = () => {
          selError.innerHTML="";
          let w = widthInput.value;
          coverElm.style.display = "";

          winDoc.querySelector("textarea[name='sequenceA']").textContent=jq("body>:not(script):not(style)").text().replace(/\s/g,"");

          // アコーディオンを自動的に開く(課題固有の対応)
          if(!jq(":contains('初めに受講者様と保護者様と面談を行い')").last().is(":visible")) jq(":contains('オンラインの英会話教室')").last().click();
          if(!jq(":contains('パソコンやスマートフォンだけでなく')").last().is(":visible")) jq(":contains('スマートフォンや外出先でも受講できますか')").last().click();
          if(!jq(":contains('授業料はコースによって異なります')").last().is(":visible")) jq(":contains('授業料はどのようになっていますか')").last().click();
          if(!jq(":contains('兄弟だけでなく家族割引プランや')").last().is(":visible")) jq(":contains('兄弟だけでの受講を検討中')").last().click();

          win.setTimeout(()=>{
            // カルーセルを一時的に非表示(課題固有の対応)
            jq(".slick-slide").parent().css("opacity","0");

            let root = parseElement(leftFrmDoc.body);
            win.console.log(`\n\ndemoNodeListList[${w}] = ${JSON.stringify(root)}\n\n`);

            let addProp = (e) => {
              e.child.forEach((c) => {
                  c.parent = e;
                  if (c.type == "text") {
                  } else {
                      addProp(c);
                  }
              });
            };
            addProp(root);
            root.parent = root;

            // カルーセルを一時的に非表示(課題固有の対応)
            jq(".slick-slide").parent().css("opacity","1");

            let peak = (n, th, bonus)=> n>th ? n+bonus : n;
            let dif = (a,b,v) => (1-Math.abs(a-b)/a)*v;
            let score = (tn, dn) => {
              if(dif(dn.y,tn.y, 1)<0.9){
                return -255;
              }
              return (dn.text==tn.text?200:0) + relevance(dn.text, tn.text) * 100 + // テキストの一致度
                relevance(textContent(dn.parent), tn.text) * 50 + // 親のテキストの一致度
                relevance(textContent(dn.parent.parent), tn.text) * 30 +
                relevance(textContent(dn.parent.parent.parent), tn.text) * 10 +
                peak(dif(dn.fontSize,tn.fontSize, 30) , 25, 100) +
                peak(dif(dn.y,tn.y, 100), 80, 100) +
                peak((dn.color == tn.color)? 10 : 0, 9, 100) ;
            }

            let textContent = n => (n.type=="text") ? n.text : n.child.map(textContent).join("");
            let flatTextNode = (n) => (n.type=="text") ? n : n.child.map(flatTextNode).flat();
            let ngram2 = s=> {
              if(s.length==1) s=s+" ";
              if(s.length==0) s="  ";
              return [...Array(s.length-1)].map((_, i) => `${s[i]}${s[i+1]}`)
            }
            let relevance = (s1,s2) => {
              if(s1.length<s2.length){
                [s1,s2] = [s2,s1];
              }
              let n1=ngram2(s1);
              let n2=new Set(ngram2(s2));
              return n1.filter(n=>n2.has(n)).length / n1.length;
            }

            flatRootNodeList = flatTextNode(root);

            let addOptElm = (e,i) => {
              let opt = winDoc.createElement("option");
              opt.value=i;
              opt.innerHTML = e;
              selError.appendChild(opt);
            };
            let addError = (ettl,fncIsError,fncGetError) => {
              addOptElm(ettl, -1);
              let elist = flatRootNodeList.filter(fncIsError);
              if(elist.length) {
                elist.forEach(n=>addOptElm(fncGetError(n), n.i));
              } else {
                addOptElm("(なし)", -1);
              }
            }
            let addFreq = (text, error) => {
              let i = flatRootNodeList.findIndex(n=>n.text.includes(text));
              if(i!=-1) addOptElm(error, i);
            }

            if(w==1536 || w==390) {
              let demoNodeList = demoNodeListList[w];
              addProp(demoNodeList);
              demoNodeList.parent = demoNodeList;
              flatDemoNodeList = flatTextNode(demoNodeList);
              flatRootNodeList.forEach((tn,i)=>{
                flatDemoNodeList.sort((a,b) => score(tn, b) - score(tn, a));
                tn.opp=flatDemoNodeList[0];
                tn.i=i;
              });
              win.console.log(flatRootNodeList);
              addError("■ フォントサイズが10%以上異なる", n=>(dif(n.fontSize,n.opp.fontSize, 1) < 0.9), n=>(`${n.fontSize}px -> ${n.opp.fontSize}px : ${n.text}`) );
              addError("■ 文字色が異なる", n=>(n.color!=n.opp.color), n=>(`${n.color} -> ${n.opp.color} : ${n.text}`));
              addError("■ absoluteの使い所を確認", n=>n.opp && n.position=="absolute", n=>`${n.text}`);
              addError("■ transformの使い所を確認", n=>n.opp && !(n.transform=="none" || !n.transform), n=>`${n.text}`);
            }
            if(w==1536) {
              addOptElm("■ 特にチェックする項目(目視で確認)", -1);
              addOptElm("ファーストビューはカルーセルになってる？文字を画像にしてない？", -1);
              addFreq("無料で体験する", "マウスホバーで色変化？リンクになっている？フチまで判定ある？");
              addFreq("円キャンペーン", "マウスホバーで色変化？リンクになっている？フチまで判定ある？");
              addFreq("歳まで", "タブになっている？枠はマル角？画像はマル角？");
              addFreq("夢中になっている", "画像はマル角？");
              addFreq("ケント", "枠はマル角？");
              addFreq("オンラインの英会話教室は", "アコーディオン？矢印の向きかわる？");
              addFreq("copyright", "SNSアイコンはリンクになっている？マウスホバーで色変化？");
              addOptElm("■■■■ 以下は元の画面で確認すること(チェッカーがfixedに対応していないため)", -1);
              addOptElm("ヘッダーがfixedになっているか？", -1);
              addOptElm("無駄に横スクロールしないか", -1);
              addOptElm("アコーディオンは初期状態で閉じている？", -1);
              addOptElm("アコーディオンの開閉で余白が不自然にならない？", -1);
              addOptElm("ヘッダーのリンクがページ内リンクになっているか？", -1);
            }
            if(w==390) {
              addOptElm("■ 特にチェックする項目(目視で確認)", -1);
              addFreq("歳まで", "タブが横並びになっている？");
              addFreq("オンラインの英会話教室は", "三角マークの位置は？'Q','A'と本文のbaseline揃っている？");
              addOptElm("■■■■ 以下は元の画面で確認すること(チェッカーがvhに対応していないため)", -1);
              addOptElm("ハンバーガーをクリックでメニューがフェードインするか？", -1);
              addOptElm("メニュー内のリンクがページ内リンクになっているか？", -1);
              addOptElm("メニューはリンク押下時に自動で閉じるか？", -1);
              addOptElm("メニューを出した状態でPC表示に戻った時にメニューが残っていないか", -1);
              addOptElm("メニューを閉じた後、メニューと重なる位置にあったリンクはクリックできるか？", -1);
            }
            if(w==1920) {
              addOptElm("■ 特にチェックする項目(目視で確認)", -1);
              addOptElm("全体的に不自然な箇所がないか", -1);
              addOptElm("PC版レイアウトになっているか", -1);
              addOptElm("vwの使い方によっては大きく見えすぎるところがないか", -1);
            }
            if(w==1366) {
              addOptElm("■ 特にチェックする項目(目視で確認)", -1);
              addOptElm("全体的に不自然な箇所がないか", -1);
              addOptElm("PC版レイアウトになっているか", -1);
              addOptElm("vwの使い方によっては小さく見えすぎるところがないか", -1);
              addOptElm("画面右側に見切れるコンテンツがないか", -1);
            }
            if(w==768) {
              addOptElm("■ 特にチェックする項目(目視で確認)", -1);
              addOptElm("全体的に不自然な箇所がないか", -1);
              addOptElm("PC版レイアウトになっているか", -1);
              addOptElm("vwの使い方によっては小さく見えすぎるところがないか", -1);
              addOptElm("画面右側に見切れるコンテンツがないか", -1);
            }
            if(w==767) {
              addOptElm("■ 特にチェックする項目(目視で確認)", -1);
              addOptElm("全体的に不自然な箇所がないか", -1);
              addOptElm("SP版レイアウトになっているか", -1);
              addOptElm("pxの使い方によっては小さく見えすぎるところがないか", -1);
            }
            coverElm.style.display = "none";
          },500);
        }
        selError.addEventListener("change",()=>{
          if(selError.value!=-1){
            let addFlash = (n,isLeft)=>{
              let leftDiv = winDoc.querySelector(".iframe-outer.left");
              let rightDiv = winDoc.querySelector(".iframe-outer.right");
              let scale = scaleInput.value / 100;
              let rect = {
                x : n.x * scale,
                y : n.y * scale,
                width : n.width * scale,
                height : n.height * scale,
              };

              let flashElm = winDoc.createElement("div");
              flashElm.classList.add("flash");
              flashElm.style.left = `${rect.x - 4}px`;
              flashElm.style.top = `${rect.y - 4}px`;
              flashElm.style.width = `${rect.width + 8}px`;
              flashElm.style.height = `${rect.height + 8}px`;
              if(isLeft){
                leftDiv.appendChild(flashElm);
                win.scrollTo({
                  top: rect.y - 300,
                  left: 0,
                  behavior: 'smooth'
                });
              } else {
                rightDiv.appendChild(flashElm);
              }
              win.setTimeout(() => { flashElm.remove(); }, 3000);
            };
            addFlash(flatRootNodeList[selError.value],true);
            if(flatRootNodeList[selError.value].opp){
              addFlash(flatRootNodeList[selError.value].opp,false);
            }
          }
        });

        scaleInput.value = scaleList[1536];
        widthInput.onchange = () => {
          scaleInput.value = scaleList[widthInput.value];
          compOptInput.value = 1;
          win.scrollTo({top: 0, left: 0, behavior: 'smooth' });
          resetScale();
        }
        compOptInput.onchange = () => {
          setComp();
        }
        scaleInput.onchange = () => {
          scaleList[widthInput.value] = parseInt(scaleInput.value);
          resetScale();
        }
        toDifffButton.onclick = () => {
          winDoc.querySelector("#difff").submit();
        }

        let div = rightFrmDoc.createElement("div");
        div.classList.add("__comp-container");
        div.innerHTML = ARTICLES.COMP_DIV;
        let compImg = div.querySelector("img");
        rightFrmDoc.body.appendChild(div);

        leftFrmDoc.documentElement.scrollTop = 9999; // 最初に一番下までスクロールしてアニメーションを起動しておく。
        resetScale();
      },500);
    }
    leftFrm.src=location.href;
  });

};

let imgurl = {
blink: "https://i.gyazo.com/dcc45b52a2b6c6a614ac8da61b12d916.png",
glass: "https://i.gyazo.com/1003c1d6b5c8e3d5121ded43ea9d7bdd.png",
side: "https://i.gyazo.com/3f561bd1f08dbcac0e4cb3e438b35b79.png",
translate: "https://i.gyazo.com/0d333b9f1feb9c9e771e70388b2f8314.png",
updown: "https://i.gyazo.com/5838b5112113c5e21762a241cd8eca67.png",
comp_pc: "https://i.gyazo.com/d690c907feb4bb5d97cf0ec946dc55b0.png",
comp_pc_cover_2: "https://i.gyazo.com/762e0a4a18db9b9a982194c4c034f8e3.png",
comp_pc_cover_3: "https://i.gyazo.com/7ae00431e6f4c2b7bdda68e701ca3ed4.png",
comp_pc_cover_4: "https://i.gyazo.com/729c3d7853f5743fd4f26363ee11abd9.png",
comp_pc_cover_5: "https://i.gyazo.com/ced43d9eb7b685e7c5bb57203c30d330.png",
comp_sp: "https://i.gyazo.com/50dc1093d73dc69f19296a67e122c93b.png",
comp_sp_cover_2: "https://i.gyazo.com/74006a53d98b30db1374761fe7e817e7.png",
comp_sp_cover_3: "https://i.gyazo.com/10991105afdf00b754ede7bc16adc2a5.png",
comp_sp_cover_4: "https://i.gyazo.com/ecf0967aaca835cc5f7ef0a208afa019.png",
comp_sp_cover_5: "https://i.gyazo.com/1e39fc2f69adca6cf50ce0112653d1eb.png",
comp_sp_menu: "https://i.gyazo.com/813be2bb0ffc4491897b3543a4d6410c.png",
};

let ARTICLES = {
ADD_STYLE : `
.__openButton {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 64px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 1s ease 1s;
  z-index:9999;
}
.__openButton:hover {
  opacity: 1;
  transition: opacity 0.2s ease;
}
`,
BODY: `
<div class="container">
  <div class="menu">
    <div class="menuleft">
      <img src="${imgurl.side}" alt="左右" class="showMode" data-mode="side">
      <img src="${imgurl.translate}" alt="半透明" class="showMode" data-mode="translate">
      <img src="${imgurl.blink}" alt="明滅" class="showMode" data-mode="blink">
      <img src="${imgurl.updown}" alt="上下" class="updown">
    </div>
    <div class="menuright">
      横幅
      <select class="iframewidth">
          <option value="1536">1536px</option>
          <option value="390">390px</option>
          <option value="1920">1920px</option>
          <option value="1366">1366px</option>
          <option value="768">768px</option>
          <option value="767">767px</option>
      </select>
      <select class="compOpt">
          <option value="1">base</option>
          <option value="2">カルーセル2</option>
          <option value="3">カルーセル3</option>
          <option value="4">カルーセル4</option>
          <option value="5">カルーセル5</option>
          <option value="menu">ハンバーガー(SPのみ)</option>
      </select>
      倍率
      <input class="iframescale" type="number" value=50>
      %
      <button class="todifff">textContent difff</button>
      <a href="https://qiita.com/yymmt/private/a33b12a442827f4c7141" target="_blank">ご注意</a>
      <div>
        確認項目
        <select class="error">
        </select>
      </div>
    </div>
  </div>
  <div class="iframe2-container" data-mode="side">
    <div class="iframe-outer left">
        <iframe src="about:blank" scrolling="no"></iframe>
    </div>
    <div class="iframe-outer right">
        <iframe src="about:blank" scrolling="no" style="top: 0px;"></iframe>
    </div>
  </div>
</div>
<div class="cover">
  解析中
</div>
<form method="POST" id="difff" name="difff" action="https://difff.jp/" class="difffForm" target="_blank">
  <textarea name="sequenceA"></textarea>
  <textarea name="sequenceB">Kira-KiraEnglishキッズオンライン英会話コース案内特色講師紹介料金プランよくあるご質問コース案内特色講師紹介料金プランよくあるご質問無料で体験する話せる！楽しい！Kira-KiraEnglish3日で完結！英検集中プログラム家族みんなで！楽しくレッスン♪夏休み限定！無料体験プログラム7月31日まで！初月0円キャンペーン12345楽しく学べて“使える英語力”が身に付く！幅広いレッスンが受講できる！無料で体験する2021年度オンライン教室ランキングNo.1※12021年度オンライン習い事ランキングNo.1※1※12021年度15歳以上を対象としたインターネット調査期間限定初月0円キャンペーンコース案内6歳まで小学生中学生ベビーコース0歳～2歳年少コース3歳～4歳年長コース5歳～6歳低学年コース小1～小3高学年コース小4～小6英検受験基礎コース基礎～3級受験中学基礎コース中1～中3中学応用コース高校受験対策重点英検受験上級コース準2級～1級挑戦オンラインだから好きな時間に受講できるネイティブ講師の指導で英語力が身に付く無料で体験するKira-KiraEnglish3つの特色01.「聞く・話す・読む・書く」夢中になっている間に「わかる」から「できる」に！02.たくさんの英文を読み、聞き、話すことで自然と語順も身につき英語耳を作ります！03.写真や動画、イラストも活用し分かりやすく文法を学び無理なく書く力も身につく！お子様だけでなく家族での受講も可能です家族みんなで英語を学びましょう！無料で体験する講師紹介Kento（ケント）先生講師歴10年「学びを通じて共に成長したい」と思っています。一緒に学び、英語でのコミュニケーションを楽しみましょう。Nancy（ナンシー）先生講師歴8年アメリカで小学生の先生をしていました。受験のための英語だけでなく私とともに学ぶ楽しさを実感しましょう。英語教育と児童教育のプロによるお子様に合わせた丁寧な指導が好評です！無料で体験する料金プラン6歳まで/小学校向けコース共通プラン月額費用（税込）週1回コースまずは慣れる所から始めたい方に1,890円週2回コース無理がないペースで人気No.13,780円週3回コース早く上達したい方におすすめ5,670円※各コースの料金は全て月額料金です。中学生向けコースプラン月額費用（税込）中学基礎コース週2回で部活動とも両立して基礎固め5,670円中学応用コース週3回で高校受験対策もバッチリ7,560円英検上級コース英検上級挑戦！内申書対策にもおすすめ9,450円※各コースの料金は全て月額料金です。学校の授業で導入する際も専門のスタッフが準備から運用までトータルサポート！無料で体験するよくあるご質問オンラインの英会話教室は初めてで続けられるか心配です。受講までの流れを教えてください。初めに受講者様と保護者様と面談を行い、ご希望と状況に合わせて目標設定をした後に短時間のレッスンからスタートいたします。豊富なカリキュラムから選択し、受講可能です。楽しく無理なく学ぶことができ、気がついたら英語が好きになっていたと受講生様から好評を得ています。スマートフォンや外出先でも受講できますか？パソコンやスマートフォンだけでなく、タブレットでも受講できます。専用サイトにログインして頂ければ外出先のデバイスからも受講可能です。授業料はどのようになっていますか？授業料はコースによって異なります。詳細はコース紹介のページをご確認ください。またコース外の授業でもご希望頂ければレッスン単体での受講も可能ですのでお問い合わせください。兄弟だけでの受講を検討中です。料金の割引や受講特典はありますか？兄弟だけでなく家族割引プランや限定カリキュラムをカスタマイズで受講できるウケ放題プラン等がございます。詳しくはお問い合わせください。英語の勉強が楽しい！一緒に頑張る仲間と励まし合ってどんどんできるようになる！無料で体験するKira-KiraEnglishキッズオンライン英会話copyright©2022Kira-KiraEnglishAllRightsReserved.</textarea>
</form>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
body {
    margin: 0px;
    font-size: 16px;
    font-family: "Noto Sans JP";
}
.menu {
    position: sticky;
    top: 0px;
    background: white;
    z-index: 1;
    display: flex;
    align-items: center;
    min-width: 1000px;
}
.menu .showMode {
  width: 48px;
  cursor: pointer;
}
.menu .updown {
    position: fixed;
    right: 10px;
    top: 50vh;
    width: 32px;
    cursor: pointer;
}
.menu .iframewidth {
    width: 80px;
}
.menu .iframescale {
    width: 50px;
}
.menu .error {
    width: 500px;
}
.menuleft {
    display: flex;
}
.menuright {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    width: 800px;
    flex-shrink: 0;
    font-size: 12px;
}
.cover {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: #FFFFFF80;
}
.iframe2-container {
    display: flex;
    gap: 5px;
    position: relative;
    background: gray;
}
.iframe2-container[data-mode='side'] {
}
.iframe2-container[data-mode='side'] .iframe-outer.right{
    position: relative;
}
.iframe2-container[data-mode='translate'] {
}
.iframe2-container[data-mode='translate'] .iframe-outer.right {
    opacity: 0.3;
}
.iframe2-container[data-mode='blink'] {
}
.iframe2-container[data-mode='blink'] .iframe-outer.right {
    animation: 0.5s linear infinite;
    animation-name: blink;
}

.iframe-outer iframe {
  position: absolute;
  left: 0px;
  top: 0px;
  border: none;
  background: white;
}
.iframe-outer.right iframe {
  pointer-events: none;
}

.flash {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    background-color: red;
    opacity: 0;
    margin: 0;
    padding: 0;
    font-size: 16px;
    white-space: nowrap;
    animation: 3s linear flash;
}
@keyframes flash {
    0% { opacity: 0; }
    1% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { opacity: 0; }
}
@keyframes blink {
    0% { opacity: 0; }
    50% { opacity: 0; }
    100% { opacity: 1; }
}

.difffForm {
  display: none;
}
</style>
`,
COMP_DIV: `
<img class="__comp">
<style>
.__comp-container {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
.__comp {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
</style>
`
};

let getRect = elm =>{
  let rect = elm.getBoundingClientRect();
  // rect.x += window.scrollX;
  // rect.y += window.scrollY;
  return rect;
}
let c2h = (c) => ("0" + parseInt(c).toString(16)).slice(-2);
let rgb2h = (rgb) => "#" + rgb.match(/\d+/g).map(c2h).join("");
let san = s=>s.replace(/\s/g, "");
let parseElement = (elm) => {
  let node = {type: "element", child: []};
  let stl = getComputedStyle(elm);
  let rect = getRect(elm);
  let num = n=>Math.round(n,0);
  if(stl.display == "none" || stl.visibility == "hidden" || stl.opacity == "0") {
    return node;
  }
  Array.from(elm.childNodes).forEach(n=>{
    if (rect.width > 0 && rect.height > 0){
      if( n.nodeType == Node.TEXT_NODE) {
        let text = san(n.nodeValue);
        if(text){
          if(parseFloat(stl.fontSize)>0){
            node.child.push({ type: "text", text, fontSize: parseFloat(stl.fontSize), color: rgb2h(stl.color),
              position: (stl.position=="absolute"), transform: !(stl.transform=="none" || !stl.transform),
              x: num(rect.x), y: num(rect.y), width: num(rect.width), height: num(rect.height) });
          }
        }
      }
      if(n.nodeType == Node.ELEMENT_NODE) {
        let newNode = parseElement(n, node);
        if(newNode.child.length){
          node.child.push(parseElement(n, node));
        }
      }
    }
  });
  let psudo = ba => {
    let stl = getComputedStyle(elm, ba);
    if(stl.content && stl.content!="none"){
      let text = stl.content.replace(/[\W]/g,'');
      if(text) {
        if(parseFloat(stl.fontSize)>0){
          node.child.push({ type: "text", text, fontSize: parseFloat(stl.fontSize), color: rgb2h(stl.color),
            position: (stl.position=="absolute"), transform: !(stl.transform=="none" || !stl.transform),
            x: num(rect.x), y: num(rect.y), width: num(rect.width), height: num(rect.height), psudo: ba });
        }
      }
    }
  }
  psudo('::before');
  psudo('::after');
  return node;
}

let demoNodeListList = {};
demoNodeListList[1536] = {"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kira-KiraEnglish","fontSize":22,"color":"#ffffff","position":false,"transform":false,"x":46,"y":33,"width":222,"height":29}]},{"type":"element","child":[{"type":"text","text":"キッズオンライン英会話","fontSize":12,"color":"#ffffff","position":false,"transform":false,"x":46,"y":63,"width":222,"height":16}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"コース案内","fontSize":15,"color":"#ffffff","position":false,"transform":false,"x":994,"y":45,"width":74,"height":22}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"特色","fontSize":15,"color":"#ffffff","position":false,"transform":false,"x":1106,"y":45,"width":30,"height":22}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"講師紹介","fontSize":15,"color":"#ffffff","position":false,"transform":false,"x":1173,"y":45,"width":60,"height":22}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"料金プラン","fontSize":15,"color":"#ffffff","position":false,"transform":false,"x":1271,"y":45,"width":75,"height":22}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"よくあるご質問","fontSize":15,"color":"#ffffff","position":false,"transform":false,"x":1383,"y":45,"width":105,"height":22}]}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"楽しく学べて“使える英語力”が身に付く！","fontSize":30,"color":"#333333","position":false,"transform":false,"x":0,"y":809,"width":1536,"height":102},{"type":"text","text":"幅広いレッスンが受講できる！","fontSize":30,"color":"#333333","position":false,"transform":false,"x":0,"y":809,"width":1536,"height":102}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":609,"y":937,"width":318,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"2021年度","fontSize":16,"color":"#555555","position":false,"transform":false,"x":310,"y":1121,"width":236,"height":34}]},{"type":"element","child":[{"type":"text","text":"オンライン","fontSize":20,"color":"#333333","position":false,"transform":false,"x":310,"y":1155,"width":236,"height":72},{"type":"text","text":"教室ランキング","fontSize":20,"color":"#333333","position":false,"transform":false,"x":310,"y":1155,"width":236,"height":72}]},{"type":"element","child":[{"type":"text","text":"No.","fontSize":40,"color":"#f26618","position":false,"transform":false,"x":310,"y":1227,"width":236,"height":60},{"type":"element","child":[{"type":"text","text":"1","fontSize":60,"color":"#f26618","position":false,"transform":false,"x":441,"y":1215,"width":23,"height":84}]},{"type":"element","child":[{"type":"text","text":"※1","fontSize":12,"color":"#666666","position":false,"transform":false,"x":464,"y":1264,"width":19,"height":18}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"2021年度","fontSize":16,"color":"#555555","position":false,"transform":false,"x":563,"y":1121,"width":251,"height":34}]},{"type":"element","child":[{"type":"text","text":"オンライン","fontSize":20,"color":"#333333","position":false,"transform":false,"x":563,"y":1155,"width":251,"height":72},{"type":"text","text":"習い事ランキング","fontSize":20,"color":"#333333","position":false,"transform":false,"x":563,"y":1155,"width":251,"height":72}]},{"type":"element","child":[{"type":"text","text":"No.","fontSize":40,"color":"#f2a118","position":false,"transform":false,"x":563,"y":1227,"width":251,"height":60},{"type":"element","child":[{"type":"text","text":"1","fontSize":60,"color":"#f2a118","position":false,"transform":false,"x":701,"y":1215,"width":23,"height":84}]},{"type":"element","child":[{"type":"text","text":"※1","fontSize":12,"color":"#666666","position":false,"transform":false,"x":724,"y":1264,"width":19,"height":18}]}]}]}]},{"type":"element","child":[{"type":"text","text":"※12021年度15歳以上を対象としたインターネット調査","fontSize":12,"color":"#666666","position":false,"transform":false,"x":310,"y":1306,"width":504,"height":22}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"期間限定","fontSize":24,"color":"#f11f8d","position":false,"transform":false,"x":976,"y":1139,"width":150,"height":29}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"初月0円キャンペーン","fontSize":22.72,"color":"#f11f8d","position":false,"transform":false,"x":876,"y":1183,"width":350,"height":74}]}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"コース案内","fontSize":36,"color":"#000000","position":false,"transform":false,"x":228,"y":1489,"width":1080,"height":66}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"6歳まで","fontSize":26,"color":"#ffffff","position":false,"transform":false,"x":228,"y":1595,"width":345,"height":80}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"小学生","fontSize":26,"color":"#333333","position":false,"transform":false,"x":595,"y":1595,"width":345,"height":80}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"中学生","fontSize":26,"color":"#333333","position":false,"transform":false,"x":963,"y":1595,"width":345,"height":80}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"ベビーコース","fontSize":24,"color":"#333333","position":false,"transform":false,"x":276,"y":1957,"width":312,"height":35}]},{"type":"element","child":[{"type":"text","text":"0歳～2歳","fontSize":18,"color":"#333333","position":false,"transform":false,"x":276,"y":1991,"width":312,"height":24}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"年少コース","fontSize":24,"color":"#333333","position":false,"transform":false,"x":612,"y":1957,"width":312,"height":35}]},{"type":"element","child":[{"type":"text","text":"3歳～4歳","fontSize":18,"color":"#333333","position":false,"transform":false,"x":612,"y":1991,"width":312,"height":24}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"年長コース","fontSize":24,"color":"#333333","position":false,"transform":false,"x":948,"y":1957,"width":312,"height":35}]},{"type":"element","child":[{"type":"text","text":"5歳～6歳","fontSize":18,"color":"#333333","position":false,"transform":false,"x":948,"y":1991,"width":312,"height":24}]}]}]}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"オンラインだから好きな時間に受講できる","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":2187,"width":1536,"height":68},{"type":"text","text":"ネイティブ講師の指導で英語力が身に付く","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":2187,"width":1536,"height":68}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":609,"y":2281,"width":318,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kira-KiraEnglish","fontSize":36,"color":"#000000","position":false,"transform":false,"x":253,"y":2484,"width":1031,"height":64}]},{"type":"element","child":[{"type":"text","text":"3つの特色","fontSize":36,"color":"#000000","position":false,"transform":false,"x":253,"y":2548,"width":1031,"height":66}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"01.","fontSize":80,"color":"#46c017","position":false,"transform":true,"x":245,"y":2751,"width":492,"height":88}]},{"type":"element","child":[{"type":"text","text":"「聞く・話す・読む・書く」夢中になっている間に「わかる」から「できる」に！","fontSize":23.4,"color":"#333333","position":false,"transform":false,"x":253,"y":2839,"width":492,"height":95}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"02.","fontSize":80,"color":"#46c017","position":false,"transform":true,"x":783,"y":3164,"width":492,"height":88}]},{"type":"element","child":[{"type":"text","text":"たくさんの英文を読み、聞き、話すことで自然と語順も身につき英語耳を作ります！","fontSize":23.4,"color":"#333333","position":false,"transform":false,"x":791,"y":3252,"width":492,"height":95}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"03.","fontSize":80,"color":"#46c017","position":false,"transform":true,"x":245,"y":3577,"width":492,"height":88}]},{"type":"element","child":[{"type":"text","text":"写真や動画、イラストも活用し分かりやすく文法を学び無理なく書く力も身につく！","fontSize":23.4,"color":"#333333","position":false,"transform":false,"x":253,"y":3665,"width":492,"height":95}]}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"お子様だけでなく家族での受講も可能です","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":3970,"width":1536,"height":68},{"type":"text","text":"家族みんなで英語を学びましょう！","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":3970,"width":1536,"height":68}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":609,"y":4064,"width":318,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"講師紹介","fontSize":36,"color":"#000000","position":false,"transform":false,"x":392,"y":4267,"width":752,"height":66}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kento（ケント）先生","fontSize":18,"color":"#333333","position":false,"transform":false,"x":416,"y":4525,"width":312,"height":40}]},{"type":"element","child":[{"type":"text","text":"講師歴10年","fontSize":14,"color":"#333333","position":false,"transform":false,"x":416,"y":4565,"width":312,"height":26}]},{"type":"element","child":[{"type":"text","text":"「学びを通じて共に成長したい」と思っています。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":416,"y":4610,"width":312,"height":131},{"type":"text","text":"一緒に学び、英語でのコミュニケーションを楽しみましょう。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":416,"y":4610,"width":312,"height":131}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Nancy（ナンシー）先生","fontSize":18,"color":"#333333","position":false,"transform":false,"x":808,"y":4525,"width":312,"height":40}]},{"type":"element","child":[{"type":"text","text":"講師歴8年","fontSize":14,"color":"#333333","position":false,"transform":false,"x":808,"y":4565,"width":312,"height":26}]},{"type":"element","child":[{"type":"text","text":"アメリカで小学生の先生をしていました。受験のための英語だけでなく私とともに学ぶ楽しさを実感しましょう。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":808,"y":4610,"width":312,"height":102}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英語教育と児童教育のプロによるお子様に","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":4890,"width":1536,"height":68},{"type":"text","text":"合わせた丁寧な指導が好評です！","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":4890,"width":1536,"height":68}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":609,"y":4984,"width":318,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"料金プラン","fontSize":36,"color":"#000000","position":false,"transform":false,"x":392,"y":5188,"width":752,"height":66}]},{"type":"element","child":[{"type":"text","text":"6歳まで/小学校向けコース共通","fontSize":25,"color":"#333333","position":false,"transform":false,"x":392,"y":5254,"width":752,"height":64}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"プラン","fontSize":18,"color":"#333333","position":false,"transform":false,"x":393,"y":5337,"width":237,"height":50}]},{"type":"element","child":[{"type":"text","text":"月額費用（税込）","fontSize":18,"color":"#333333","position":false,"transform":false,"x":630,"y":5337,"width":513,"height":50}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週1回コース","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":393,"y":5387,"width":237,"height":95}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"まずは慣れる所から始めたい方に","fontSize":16,"color":"#333333","position":false,"transform":false,"x":631,"y":5387,"width":512,"height":33}]},{"type":"element","child":[{"type":"text","text":"1,890","fontSize":36.35,"color":"#46c017","position":false,"transform":false,"x":631,"y":5420,"width":512,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":16.16,"color":"#46c017","position":false,"transform":false,"x":926,"y":5444,"width":16,"height":23}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週2回コース","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":393,"y":5482,"width":237,"height":95}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"無理がないペースで人気No.1","fontSize":16,"color":"#333333","position":false,"transform":false,"x":631,"y":5482,"width":512,"height":33}]},{"type":"element","child":[{"type":"text","text":"3,780","fontSize":36.35,"color":"#46c017","position":false,"transform":false,"x":631,"y":5515,"width":512,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":16.16,"color":"#46c017","position":false,"transform":false,"x":928,"y":5539,"width":16,"height":23}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週3回コース","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":393,"y":5576,"width":237,"height":95}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"早く上達したい方におすすめ","fontSize":16,"color":"#333333","position":false,"transform":false,"x":631,"y":5577,"width":512,"height":33}]},{"type":"element","child":[{"type":"text","text":"5,670","fontSize":36.35,"color":"#46c017","position":false,"transform":false,"x":631,"y":5610,"width":512,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":16.16,"color":"#46c017","position":false,"transform":false,"x":929,"y":5634,"width":16,"height":23}]}]}]}]}]}]},{"type":"element","child":[{"type":"text","text":"※各コースの料金は全て月額料金です。","fontSize":12,"color":"#666666","position":false,"transform":false,"x":392,"y":5673,"width":752,"height":22}]},{"type":"element","child":[{"type":"text","text":"中学生向けコース","fontSize":25,"color":"#333333","position":false,"transform":false,"x":392,"y":5695,"width":752,"height":69}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"プラン","fontSize":18,"color":"#333333","position":false,"transform":false,"x":393,"y":5783,"width":237,"height":50}]},{"type":"element","child":[{"type":"text","text":"月額費用（税込）","fontSize":18,"color":"#333333","position":false,"transform":false,"x":630,"y":5783,"width":513,"height":50}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"中学基礎コース","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":393,"y":5833,"width":237,"height":95}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週2回で部活動とも両立して基礎固め","fontSize":16,"color":"#333333","position":false,"transform":false,"x":631,"y":5833,"width":512,"height":33}]},{"type":"element","child":[{"type":"text","text":"5,670","fontSize":36.35,"color":"#46c017","position":false,"transform":false,"x":631,"y":5866,"width":512,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":16.16,"color":"#46c017","position":false,"transform":false,"x":929,"y":5890,"width":16,"height":23}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"中学応用コース","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":393,"y":5927,"width":237,"height":95}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週3回で高校受験対策もバッチリ","fontSize":16,"color":"#333333","position":false,"transform":false,"x":631,"y":5928,"width":512,"height":33}]},{"type":"element","child":[{"type":"text","text":"7,560","fontSize":36.35,"color":"#46c017","position":false,"transform":false,"x":631,"y":5961,"width":512,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":16.16,"color":"#46c017","position":false,"transform":false,"x":929,"y":5985,"width":16,"height":23}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英検上級コース","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":393,"y":6022,"width":237,"height":95}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英検上級挑戦！内申書対策にもおすすめ","fontSize":16,"color":"#333333","position":false,"transform":false,"x":631,"y":6023,"width":512,"height":33}]},{"type":"element","child":[{"type":"text","text":"9,450","fontSize":36.35,"color":"#46c017","position":false,"transform":false,"x":631,"y":6056,"width":512,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":16.16,"color":"#46c017","position":false,"transform":false,"x":931,"y":6079,"width":16,"height":23}]}]}]}]}]}]},{"type":"element","child":[{"type":"text","text":"※各コースの料金は全て月額料金です。","fontSize":12,"color":"#666666","position":false,"transform":false,"x":392,"y":6119,"width":752,"height":22}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"学校の授業で導入する際も専門のスタッフが","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":6296,"width":1536,"height":68},{"type":"text","text":"準備から運用までトータルサポート！","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":6296,"width":1536,"height":68}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":609,"y":6390,"width":318,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"よくあるご質問","fontSize":36,"color":"#000000","position":false,"transform":false,"x":318,"y":6596,"width":900,"height":66}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"オンラインの英会話教室は初めてで続けられるか心配です。受講までの流れを教えてください。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":6700,"width":898,"height":87},{"type":"text","text":"Q","fontSize":24,"color":"#f26618","position":false,"transform":false,"x":319,"y":6700,"width":898,"height":87,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"初めに受講者様と保護者様と面談を行い、ご希望と状況に合わせて目標設定をした後に短時間のレッスンからスタートいたします。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":6787,"width":898,"height":170},{"type":"text","text":"豊富なカリキュラムから選択し、受講可能です。楽しく無理なく学ぶことができ、気がついたら英語が好きになっていたと受講生様から好評を得ています。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":6787,"width":898,"height":170},{"type":"text","text":"A","fontSize":24,"color":"#ffffff","position":false,"transform":false,"x":319,"y":6787,"width":898,"height":170,"psudo":"::before"}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"スマートフォンや外出先でも受講できますか？","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":6979,"width":898,"height":87},{"type":"text","text":"Q","fontSize":24,"color":"#f26618","position":false,"transform":false,"x":319,"y":6979,"width":898,"height":87,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"パソコンやスマートフォンだけでなく、タブレットでも受講できます。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":7066,"width":898,"height":116},{"type":"text","text":"専用サイトにログインして頂ければ外出先のデバイスからも受講可能です。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":7066,"width":898,"height":116},{"type":"text","text":"A","fontSize":24,"color":"#ffffff","position":false,"transform":false,"x":319,"y":7066,"width":898,"height":116,"psudo":"::before"}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"授業料はどのようになっていますか？","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":7204,"width":898,"height":87},{"type":"text","text":"Q","fontSize":24,"color":"#f26618","position":false,"transform":false,"x":319,"y":7204,"width":898,"height":87,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"授業料はコースによって異なります。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":7291,"width":898,"height":143},{"type":"text","text":"詳細はコース紹介のページをご確認ください。またコース外の授業でもご希望頂ければレッスン単体での受講も可能ですのでお問い合わせください。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":7291,"width":898,"height":143},{"type":"text","text":"A","fontSize":24,"color":"#ffffff","position":false,"transform":false,"x":319,"y":7291,"width":898,"height":143,"psudo":"::before"}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"兄弟だけでの受講を検討中です。料金の割引や受講特典はありますか？","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":7456,"width":898,"height":87},{"type":"text","text":"Q","fontSize":24,"color":"#f26618","position":false,"transform":false,"x":319,"y":7456,"width":898,"height":87,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"兄弟だけでなく家族割引プランや限定カリキュラムをカスタマイズで受講できるウケ放題プラン等がございます。詳しくはお問い合わせください。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":319,"y":7543,"width":898,"height":116},{"type":"text","text":"A","fontSize":24,"color":"#ffffff","position":false,"transform":false,"x":319,"y":7543,"width":898,"height":116,"psudo":"::before"}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英語の勉強が楽しい！一緒に頑張る仲間と","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":7784,"width":1536,"height":68},{"type":"text","text":"励まし合ってどんどんできるようになる！","fontSize":20,"color":"#333333","position":false,"transform":false,"x":0,"y":7784,"width":1536,"height":68}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":609,"y":7878,"width":318,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kira-KiraEnglish","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":0,"y":8107,"width":1536,"height":51}]},{"type":"element","child":[{"type":"text","text":"キッズオンライン英会話","fontSize":12,"color":"#0079f2","position":false,"transform":false,"x":0,"y":8157,"width":1536,"height":14}]},{"type":"element","child":[{"type":"text","text":"copyright©2022Kira-KiraEnglishAllRightsReserved.","fontSize":10,"color":"#999999","position":false,"transform":false,"x":0,"y":8172,"width":1536,"height":76}]}]}]}]}]}
demoNodeListList[390] = {"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kira-KiraEnglish","fontSize":18,"color":"#ffffff","position":false,"transform":false,"x":39,"y":25,"width":160,"height":20}]},{"type":"element","child":[{"type":"text","text":"キッズオンライン英会話","fontSize":10,"color":"#ffffff","position":false,"transform":false,"x":39,"y":45,"width":160,"height":12}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"楽しく学べて“使える英語力”が身に付く！","fontSize":18,"color":"#333333","position":false,"transform":false,"x":0,"y":505,"width":390,"height":65},{"type":"text","text":"幅広いレッスンが受講できる！","fontSize":18,"color":"#333333","position":false,"transform":false,"x":0,"y":505,"width":390,"height":65}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":55,"y":586,"width":280,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"2021年度","fontSize":12,"color":"#555555","position":false,"transform":false,"x":25,"y":706,"width":156,"height":29}]},{"type":"element","child":[{"type":"text","text":"オンライン","fontSize":13,"color":"#333333","position":false,"transform":false,"x":25,"y":735,"width":156,"height":48},{"type":"text","text":"教室ランキング","fontSize":13,"color":"#333333","position":false,"transform":false,"x":25,"y":735,"width":156,"height":48}]},{"type":"element","child":[{"type":"text","text":"No.","fontSize":32,"color":"#f26618","position":false,"transform":false,"x":25,"y":783,"width":156,"height":40},{"type":"element","child":[{"type":"text","text":"1","fontSize":40,"color":"#f26618","position":false,"transform":false,"x":114,"y":775,"width":15,"height":56}]},{"type":"element","child":[{"type":"text","text":"※1","fontSize":10,"color":"#666666","position":false,"transform":false,"x":130,"y":806,"width":16,"height":15}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"2021年度","fontSize":12,"color":"#555555","position":false,"transform":false,"x":197,"y":706,"width":168,"height":29}]},{"type":"element","child":[{"type":"text","text":"オンライン","fontSize":13,"color":"#333333","position":false,"transform":false,"x":197,"y":735,"width":168,"height":48},{"type":"text","text":"習い事ランキング","fontSize":13,"color":"#333333","position":false,"transform":false,"x":197,"y":735,"width":168,"height":48}]},{"type":"element","child":[{"type":"text","text":"No.","fontSize":32,"color":"#f2a118","position":false,"transform":false,"x":197,"y":783,"width":168,"height":40},{"type":"element","child":[{"type":"text","text":"1","fontSize":40,"color":"#f2a118","position":false,"transform":false,"x":293,"y":775,"width":15,"height":56}]},{"type":"element","child":[{"type":"text","text":"※1","fontSize":10,"color":"#666666","position":false,"transform":false,"x":308,"y":806,"width":16,"height":15}]}]}]}]},{"type":"element","child":[{"type":"text","text":"※12021年度15歳以上を対象としたインターネット調査","fontSize":12,"color":"#666666","position":false,"transform":false,"x":25,"y":842,"width":340,"height":15}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"期間限定","fontSize":20,"color":"#f11f8d","position":false,"transform":false,"x":138,"y":882,"width":114,"height":24}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"初月0円キャンペーン","fontSize":19.75,"color":"#f11f8d","position":false,"transform":false,"x":38,"y":916,"width":314,"height":60}]}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"コース案内","fontSize":24,"color":"#000000","position":false,"transform":false,"x":16,"y":1085,"width":359,"height":45}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"6歳まで","fontSize":18,"color":"#ffffff","position":false,"transform":false,"x":16,"y":1162,"width":114,"height":65}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"小学生","fontSize":18,"color":"#333333","position":false,"transform":false,"x":138,"y":1162,"width":114,"height":65}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"中学生","fontSize":18,"color":"#333333","position":false,"transform":false,"x":260,"y":1162,"width":114,"height":65}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"ベビーコース","fontSize":20,"color":"#333333","position":false,"transform":false,"x":56,"y":1476,"width":279,"height":27}]},{"type":"element","child":[{"type":"text","text":"0歳～2歳","fontSize":16,"color":"#333333","position":false,"transform":false,"x":56,"y":1503,"width":279,"height":24}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"年少コース","fontSize":20,"color":"#333333","position":false,"transform":false,"x":56,"y":1772,"width":279,"height":27}]},{"type":"element","child":[{"type":"text","text":"3歳～4歳","fontSize":16,"color":"#333333","position":false,"transform":false,"x":56,"y":1799,"width":279,"height":24}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"年長コース","fontSize":20,"color":"#333333","position":false,"transform":false,"x":56,"y":2067,"width":279,"height":27}]},{"type":"element","child":[{"type":"text","text":"5歳～6歳","fontSize":16,"color":"#333333","position":false,"transform":false,"x":56,"y":2094,"width":279,"height":24}]}]}]}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"オンラインだから好きな時間に受講できる","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":2252,"width":390,"height":58},{"type":"text","text":"ネイティブ講師の指導で英語力が身に付く","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":2252,"width":390,"height":58}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":55,"y":2326,"width":280,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kira-KiraEnglish","fontSize":24,"color":"#000000","position":false,"transform":false,"x":16,"y":2497,"width":358,"height":42}]},{"type":"element","child":[{"type":"text","text":"3つの特色","fontSize":24,"color":"#000000","position":false,"transform":false,"x":16,"y":2539,"width":358,"height":45}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"01.","fontSize":60,"color":"#46c017","position":false,"transform":true,"x":11,"y":2884,"width":358,"height":69}]},{"type":"element","child":[{"type":"text","text":"「聞く・話す・読む・書く」夢中になっている間に「わかる」から「できる」に！","fontSize":17.6,"color":"#333333","position":false,"transform":false,"x":16,"y":2953,"width":358,"height":63}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"02.","fontSize":60,"color":"#46c017","position":false,"transform":true,"x":11,"y":3319,"width":358,"height":69}]},{"type":"element","child":[{"type":"text","text":"たくさんの英文を読み、聞き、話すことで自然と語順も身につき英語耳を作ります！","fontSize":17.6,"color":"#333333","position":false,"transform":false,"x":16,"y":3388,"width":358,"height":63}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"03.","fontSize":60,"color":"#46c017","position":false,"transform":true,"x":11,"y":3754,"width":358,"height":69}]},{"type":"element","child":[{"type":"text","text":"写真や動画、イラストも活用し分かりやすく文法を学び無理なく書く力も身につく！","fontSize":17.6,"color":"#333333","position":false,"transform":false,"x":16,"y":3823,"width":358,"height":63}]}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"お子様だけでなく家族での受講も可能です","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":3981,"width":390,"height":58},{"type":"text","text":"家族みんなで英語を学びましょう！","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":3981,"width":390,"height":58}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":55,"y":4055,"width":280,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"講師紹介","fontSize":24,"color":"#000000","position":false,"transform":false,"x":40,"y":4224,"width":311,"height":45}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kento（ケント）先生","fontSize":18,"color":"#333333","position":false,"transform":false,"x":56,"y":4445,"width":279,"height":36}]},{"type":"element","child":[{"type":"text","text":"講師歴10年","fontSize":14,"color":"#333333","position":false,"transform":false,"x":56,"y":4481,"width":279,"height":27}]},{"type":"element","child":[{"type":"text","text":"「学びを通じて共に成長したい」と思っています。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":56,"y":4527,"width":279,"height":129},{"type":"text","text":"一緒に学び、英語でのコミュニケーションを楽しみましょう。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":56,"y":4527,"width":279,"height":129}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Nancy（ナンシー）先生","fontSize":18,"color":"#333333","position":false,"transform":false,"x":56,"y":4843,"width":279,"height":36}]},{"type":"element","child":[{"type":"text","text":"講師歴8年","fontSize":14,"color":"#333333","position":false,"transform":false,"x":56,"y":4878,"width":279,"height":27}]},{"type":"element","child":[{"type":"text","text":"アメリカで小学生の先生をしていました。受験のための英語だけでなく私とともに学ぶ楽しさを実感しましょう。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":56,"y":4924,"width":279,"height":129}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英語教育と児童教育のプロによるお子様に","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":5189,"width":390,"height":58},{"type":"text","text":"合わせた丁寧な指導が好評です！","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":5189,"width":390,"height":58}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":55,"y":5262,"width":280,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"料金プラン","fontSize":24,"color":"#000000","position":false,"transform":false,"x":17,"y":5434,"width":357,"height":45}]},{"type":"element","child":[{"type":"text","text":"6歳まで/小学校向けコース共通","fontSize":20,"color":"#333333","position":false,"transform":false,"x":17,"y":5479,"width":357,"height":50}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"プラン","fontSize":16,"color":"#333333","position":false,"transform":false,"x":18,"y":5548,"width":116,"height":50}]},{"type":"element","child":[{"type":"text","text":"月額費用（税込）","fontSize":16,"color":"#333333","position":false,"transform":false,"x":134,"y":5548,"width":239,"height":50}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週1回コース","fontSize":16,"color":"#0079f2","position":false,"transform":false,"x":18,"y":5598,"width":116,"height":91}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"まずは慣れる所から始めたい方に","fontSize":14,"color":"#333333","position":false,"transform":false,"x":134,"y":5598,"width":237,"height":29}]},{"type":"element","child":[{"type":"text","text":"1,890","fontSize":32.31,"color":"#46c017","position":false,"transform":false,"x":134,"y":5627,"width":237,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":14.14,"color":"#46c017","position":false,"transform":false,"x":288,"y":5654,"width":14,"height":20}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週2回コース","fontSize":16,"color":"#0079f2","position":false,"transform":false,"x":18,"y":5688,"width":116,"height":91}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"無理がないペースで人気No.1","fontSize":14,"color":"#333333","position":false,"transform":false,"x":134,"y":5689,"width":237,"height":29}]},{"type":"element","child":[{"type":"text","text":"3,780","fontSize":32.31,"color":"#46c017","position":false,"transform":false,"x":134,"y":5718,"width":237,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":14.14,"color":"#46c017","position":false,"transform":false,"x":290,"y":5744,"width":14,"height":20}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週3回コース","fontSize":16,"color":"#0079f2","position":false,"transform":false,"x":18,"y":5779,"width":116,"height":91}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"早く上達したい方におすすめ","fontSize":14,"color":"#333333","position":false,"transform":false,"x":134,"y":5779,"width":237,"height":29}]},{"type":"element","child":[{"type":"text","text":"5,670","fontSize":32.31,"color":"#46c017","position":false,"transform":false,"x":134,"y":5808,"width":237,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":14.14,"color":"#46c017","position":false,"transform":false,"x":291,"y":5835,"width":14,"height":20}]}]}]}]}]}]},{"type":"element","child":[{"type":"text","text":"※各コースの料金は全て月額料金です。","fontSize":12,"color":"#666666","position":false,"transform":false,"x":17,"y":5871,"width":357,"height":22}]},{"type":"element","child":[{"type":"text","text":"中学生向けコース","fontSize":20,"color":"#333333","position":false,"transform":false,"x":17,"y":5893,"width":357,"height":69}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"プラン","fontSize":16,"color":"#333333","position":false,"transform":false,"x":18,"y":5981,"width":133,"height":50}]},{"type":"element","child":[{"type":"text","text":"月額費用（税込）","fontSize":16,"color":"#333333","position":false,"transform":false,"x":151,"y":5981,"width":222,"height":50}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"中学基礎コース","fontSize":16,"color":"#0079f2","position":false,"transform":false,"x":18,"y":6031,"width":133,"height":115}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週2回で部活動とも両立して基礎固め","fontSize":14,"color":"#333333","position":false,"transform":false,"x":151,"y":6031,"width":220,"height":54}]},{"type":"element","child":[{"type":"text","text":"5,670","fontSize":32.31,"color":"#46c017","position":false,"transform":false,"x":151,"y":6085,"width":220,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":14.14,"color":"#46c017","position":false,"transform":false,"x":299,"y":6111,"width":14,"height":20}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"中学応用コース","fontSize":16,"color":"#0079f2","position":false,"transform":false,"x":18,"y":6146,"width":133,"height":91}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"週3回で高校受験対策もバッチリ","fontSize":14,"color":"#333333","position":false,"transform":false,"x":151,"y":6147,"width":220,"height":29}]},{"type":"element","child":[{"type":"text","text":"7,560","fontSize":32.31,"color":"#46c017","position":false,"transform":false,"x":151,"y":6175,"width":220,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":14.14,"color":"#46c017","position":false,"transform":false,"x":299,"y":6202,"width":14,"height":20}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英検上級コース","fontSize":16,"color":"#0079f2","position":false,"transform":false,"x":18,"y":6237,"width":133,"height":116}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英検上級挑戦！内申書対策にもおすすめ","fontSize":14,"color":"#333333","position":false,"transform":false,"x":151,"y":6237,"width":220,"height":54}]},{"type":"element","child":[{"type":"text","text":"9,450","fontSize":32.31,"color":"#46c017","position":false,"transform":false,"x":151,"y":6291,"width":220,"height":61},{"type":"element","child":[{"type":"text","text":"円","fontSize":14.14,"color":"#46c017","position":false,"transform":false,"x":301,"y":6317,"width":14,"height":20}]}]}]}]}]}]},{"type":"element","child":[{"type":"text","text":"※各コースの料金は全て月額料金です。","fontSize":12,"color":"#666666","position":false,"transform":false,"x":17,"y":6354,"width":357,"height":22}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"学校の授業で導入する際も専門のスタッフが","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":6508,"width":390,"height":58},{"type":"text","text":"準備から運用までトータルサポート！","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":6508,"width":390,"height":58}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":55,"y":6582,"width":280,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"よくあるご質問","fontSize":24,"color":"#000000","position":false,"transform":false,"x":16,"y":6756,"width":359,"height":45}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"オンラインの英会話教室は初めてで続けられるか心配です。受講までの流れを教えてください。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":6829,"width":357,"height":121},{"type":"text","text":"Q","fontSize":16,"color":"#f26618","position":false,"transform":false,"x":17,"y":6829,"width":357,"height":121,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"初めに受講者様と保護者様と面談を行い、ご希望と状況に合わせて目標設定をした後に短時間のレッスンからスタートいたします。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":6950,"width":357,"height":285},{"type":"text","text":"豊富なカリキュラムから選択し、受講可能です。楽しく無理なく学ぶことができ、気がついたら英語が好きになっていたと受講生様から好評を得ています。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":6950,"width":357,"height":285},{"type":"text","text":"A","fontSize":16,"color":"#ffffff","position":false,"transform":false,"x":17,"y":6950,"width":357,"height":285,"psudo":"::before"}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"スマートフォンや外出先でも受講できますか？","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7256,"width":357,"height":93},{"type":"text","text":"Q","fontSize":16,"color":"#f26618","position":false,"transform":false,"x":17,"y":7256,"width":357,"height":93,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"パソコンやスマートフォンだけでなく、タブレットでも受講できます。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7349,"width":357,"height":173},{"type":"text","text":"専用サイトにログインして頂ければ外出先のデバイスからも受講可能です。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7349,"width":357,"height":173},{"type":"text","text":"A","fontSize":16,"color":"#ffffff","position":false,"transform":false,"x":17,"y":7349,"width":357,"height":173,"psudo":"::before"}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"授業料はどのようになっていますか？","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7543,"width":357,"height":93},{"type":"text","text":"Q","fontSize":16,"color":"#f26618","position":false,"transform":false,"x":17,"y":7543,"width":357,"height":93,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"授業料はコースによって異なります。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7636,"width":357,"height":229},{"type":"text","text":"詳細はコース紹介のページをご確認ください。またコース外の授業でもご希望頂ければレッスン単体での受講も可能ですのでお問い合わせください。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7636,"width":357,"height":229},{"type":"text","text":"A","fontSize":16,"color":"#ffffff","position":false,"transform":false,"x":17,"y":7636,"width":357,"height":229,"psudo":"::before"}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"兄弟だけでの受講を検討中です。料金の割引や受講特典はありますか？","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7886,"width":357,"height":93},{"type":"text","text":"Q","fontSize":16,"color":"#f26618","position":false,"transform":false,"x":17,"y":7886,"width":357,"height":93,"psudo":"::before"}]},{"type":"element","child":[{"type":"text","text":"兄弟だけでなく家族割引プランや限定カリキュラムをカスタマイズで受講できるウケ放題プラン等がございます。詳しくはお問い合わせください。","fontSize":16,"color":"#333333","position":false,"transform":false,"x":17,"y":7979,"width":357,"height":173},{"type":"text","text":"A","fontSize":16,"color":"#ffffff","position":false,"transform":false,"x":17,"y":7979,"width":357,"height":173,"psudo":"::before"}]}]}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"英語の勉強が楽しい！一緒に頑張る仲間と","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":8241,"width":390,"height":58},{"type":"text","text":"励まし合ってどんどんできるようになる！","fontSize":16,"color":"#333333","position":false,"transform":false,"x":0,"y":8241,"width":390,"height":58}]},{"type":"element","child":[{"type":"text","text":"無料で体験する","fontSize":20,"color":"#ffffff","position":false,"transform":false,"x":55,"y":8315,"width":280,"height":60}]}]}]},{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"element","child":[{"type":"text","text":"Kira-KiraEnglish","fontSize":18,"color":"#0079f2","position":false,"transform":false,"x":0,"y":8537,"width":390,"height":47}]},{"type":"element","child":[{"type":"text","text":"キッズオンライン英会話","fontSize":12,"color":"#0079f2","position":false,"transform":false,"x":0,"y":8584,"width":390,"height":18}]},{"type":"element","child":[{"type":"text","text":"copyright©2022Kira-KiraEnglishAllRightsReserved.","fontSize":10,"color":"#999999","position":false,"transform":false,"x":0,"y":8602,"width":390,"height":70}]}]}]}]}]}
