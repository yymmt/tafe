// ==UserScript==
// @name         テキスト結合
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://techacademy.jp/mentor/courses/*/curriculums/*/lessons
// @icon         https://www.google.com/s2/favicons?sz=64&domain=techacademy.jp
// @updateURL    https://raw.githubusercontent.com/yymmt/tafe/main/text-concat.user.js
// @downloadURL  https://raw.githubusercontent.com/yymmt/tafe/main/text-concat.user.js
// @supportURL   https://qiita.com/yymmt/private/eaaf002118c93c75b620
// @grant        none
// ==/UserScript==

(function () {
    $(".table").parent().append("<button class='ketugou'>全結合</button>");
    $(".ketugou").on("click", () => {
        let urls = Array.from($(".table a")).map((e) => e.href);
        let win = window.open(urls[1]);
        $(win).on("load", () => {
            let con = win.document.querySelector(".curriculum-container");
            con.innerHTML = "";
            con.innerHTML += `
<style>
.billy_lesson h2.index,
.billy_lesson h3.index {
    position: sticky;
    top: 0;
    background-color: white;
    padding-bottom: 10px;
    margin-left: -50px;
    border-bottom: 1px solid #eeeeee;
}
.billy_lesson h3.index {
    z-index: 9;
    padding-top: 40px;
    box-shadow: 0 10px 10px white;
}
.billy_lesson h2.index {
    z-index: 10;
    padding-top: 10px;
}
.note.curriculum-container h2 {
    font-size: 12px;
}
.note.curriculum-container h3 {
    font-size: 12px;
}

.billy_lesson h2.index .chapter-left>div,
.billy_lesson h3.index .chapter-left>div {
    display: inline-block;
    margin-right: 10px;
}

.billy_lesson h2.index .chapter-left>div.border-top,
.billy_lesson h3.index .chapter-left>div.border-top {
    border-top: none !important;
}

.note.curriculum-container h2 .chapter-left {
    border-left: none;
    padding-left: 0px;
}


.subsection img {
    max-width: 20vw;
  max-height: 9192px;
}
.subsection img:hover {
    max-width: 60vw;
}

.billy_lesson .index .btn-clipboard {
    display: none;
}

.note.curriculum-container .__jsbin_tmp_text {
}

.note.curriculum-container .__jsbin_tmp_text pre{
  font-size: 12px;
  line-height: 1;
}

.indexAll {
    position: fixed;
    right: 10px;
    top: 10px;
    min-width: 100px;
    max-width: 400px;
    z-index: 999;
}

.indexAll>*>* {
    display: none;
}
.indexAll.__open .__open {
    display: block;
}
.indexAll.__close .__close {
    display: block;
}
.button__open,
.button__close {
    position: absolute;
    right: -4px;
    top: 7px;
    width: 32px;
    height: 32px;
    cursor: pointer;
}
.indexInner {}
.index__open {
    max-height: 80vh;
    overflow-y: scroll;
}
.indexAll a {
    display: inline-block;
    padding: 5px 0px;
}
</style>
            `;
            $(win.document).find(".note-index").remove();
            $(win.document).find(".col-md-3, .col-md-push-9, .col-md-9, .col-md-pull-3").removeClass("col-md-3 col-md-push-9 col-md-9 col-md-pull-3");
            (async () => {
                let indexAll=win.document.createElement("div");
                indexAll.classList.add("indexAll");
                indexAll.classList.add("__close");
                indexAll.innerHTML=`
                    <div class="indexInner">
                        <pre class="index__open __open"></pre>
                        <span class="button__close __open __toggle">✖️</span>
                        <pre class="index__close __close">目次</pre>
                        <span class="button__open __close __toggle">▼</span>
                    </div>
                `;
                let indexMain=indexAll.querySelector(".index__open");
                let addIndex = html => {
                    let line=win.document.createElement("div");
                    line.innerHTML=html;
                    indexMain.appendChild(line);
                };
                let indexTextNodes = e => Array.from(e.childNodes).filter(n=>n.nodeType==1 || n.nodeType==3).map(n=> n.nodeType==1?indexTextNodes(n) : n.textContent).flat();
                $(indexAll).find(".__toggle").on("click", e=> $(indexAll).toggleClass("__open").toggleClass("__close") );
                win.document.body.appendChild(indexAll);

                for(let i=0;i<urls.length;i++) {
                    let url = urls[i];
                    await fetch(url)
                        .then((response) => response.text())
                        .then((html) => {
                            let doc = new DOMParser().parseFromString(html, "text/html");
                            doc.querySelectorAll("img").forEach((elm) => {
                                elm.setAttribute("loading", "lazy");
                            });
                            doc.querySelectorAll("video").forEach((elm) => {
                                elm.remove();
                            });
                            let con2=win.document.createElement("div");
                            con2.id=`lesson${i}`;
                            addIndex(`Lesson ${i}`);
                            doc.querySelectorAll(".curriculum-container>section").forEach((chapterElm) => {
                                chapterElm.querySelectorAll("h2.index, h3.index").forEach(indexElm=>{
                                    if(indexElm.tagName.toLowerCase()=="h2"){
                                        chapterElm.id=`lesson${i}_${chapterElm.id.replace("-","")}`;
                                        let tx=indexTextNodes(indexElm);
                                        if(tx[0].includes("Lesson")){
                                            // Lesson 0/Chapter 1/はじめに
                                            addIndex(`  <a href="#${tx[0].toLowerCase().replace(/ /,"")}_${tx[1].toLowerCase().replace(/ /,"")}">${tx[1].replace(/[^0-9]/g,"")} ${tx[2]}</a>`);
                                        }
                                    }
                                    else {
                                        indexElm.parentElement.id=`lesson${i}_${indexElm.id.replace(/-/,"").replace(/-/,".")}`;
                                        let tx=indexTextNodes(indexElm);
                                        if(tx[0].includes("Lesson")){
                                            // Lesson 0/Chapter 2/.1/本コースの概要
                                            addIndex(`    <a href="#${tx[0].toLowerCase().replace(/ /,"")}_${tx[1].toLowerCase().replace(/ /,"")}${tx[2]}">${tx[1].replace(/[^0-9]/g,"")}${tx[2]} ${tx[3]}</a>`);
                                        }
                                        if(tx[0].includes("課題")){
                                            // 課題/HTMLで文書を書いてみよう
                                            addIndex(`    <a href="#${indexElm.parentElement.id}">${tx[0]} ${tx[1]}</a>`);
                                        }
                                    }
                                });
                                con2.appendChild(chapterElm);
                            });
                            con.appendChild(con2);
                        });
                    win.document.title = `${i+1} / ${urls.length}`;
                }
                win.document.title = location.href.match(/curriculums\/([^\/]+)/)[1];

                let url="https://raw.githubusercontent.com/yymmt/tafe/main/jsbin.json";
                await fetch(url).then((response) => response.text()).then((json) => {
                    eval("jsbin="+json);
                });
                let bins = Array.from($(win.document).find("[href*='jsbin.com']")).filter(e=>!e.getAttribute("href").replace(/.*\.com\/([^\/]+)\/.*/,"$1").includes("http"));
                for(let i=0;i<bins.length;i++){
                    let id=bins[i].getAttribute("href").replace(/.*\.com\/([^\/]+)\/.*/,"$1");
                    if(jsbin[id]){
                        let san = s=>s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        let app = s => {
                            if(s) {
                                s = san(s);
                                let elm = win.document.createElement("div");
                                elm.classList.add("__jsbin_tmp_text");
                                elm.innerHTML = `<pre>${s}</pre>`;
                                bins[i].parentElement.appendChild(elm);
                            }
                        }
                        app(jsbin[id].html);
                        app(jsbin[id].css);
                        app(jsbin[id].javascript);
                    }
                }
            })();
        });
    });
})();

