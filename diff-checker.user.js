/* globals $ */

// ==UserScript==
// @name         模写チェッカー
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://techacademy.jp/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/yymmt/tafe/main/diff-checker.user.js
// @downloadURL  https://raw.githubusercontent.com/yymmt/tafe/main/diff-checker.user.js
// @supportURL   https://qiita.com/yymmt/private/a33b12a442827f4c7141
// ==/UserScript==

(function () {
    let ism = (pat) => location.href.match(pat);
    if (ism(/mentor\/users\/\d+(#.*)?$/) || ism(/mentor(.training)?.reports/)) {
        (async ()=>{
            let g=$("a[href*='drive.google.com']").attr("href").match(/folders.([a-zA-Z0-9_-]+)/)[1];
            if(g){
                let kadaiToFolder = {
                    'kadai-html-1':'kadai-html',
                    'kadai-html-2':'kadai-html',
                    'kadai-css':'kadai-css',
                    'kadai-portfolio-1':'portfolio',
                    'kadai-portfolio-2':'portfolio',
                    'kadai-portfolio-3':'kadai-portfolio',
                    'kadai-jquery1':'kadai-jquery1',
                    'kadai-jquery2':'kadai-jquery2',
                    'kadai-jquery3':'kadai-jquery3',
                    'kadai-smartphone-1':'smartphone',
                    'kadai-smartphone-2':'smartphone',
                    'kadai-recipe-1':'recipe',
                    'kadai-recipe-2':'recipe',
                    'kadai-recipe-3':'recipe',
                    'kadai-corporate-site-1':'corporate-site',
                    'kadai-corporate-site-2':'corporate-site',
                    'kadai-corporate-site-3':'corporate-site',
                    'kadai-corporate-site-4':'corporate-site',
                    'kadai-final-exam':'final-exam',
                };
                let url;
                let doc;
                url="https://raw.githubusercontent.com/yymmt/tafe/main/jsbin.json";
                await fetch(url).then((response) => response.text()).then((json) => {
                    eval("jsbin="+json);
                });
                url="https://techacademy.jp/mentor/courses/first-sidejob/review_guide";
                await fetch(url).then((response) => response.text()).then((html) => {
                    doc = new DOMParser().parseFromString(html, "text/html");
                });
                let docNthAns = n => doc.querySelectorAll(".highlighter-coderay")[n].textContent.trim()
                let combHtml = (code) => code
                    .replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '');
                let combCss = (code) => code
                    .replace(/ *\( */g, '(')
                    .replace(/ *{ */g, '{')
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/@media */g, '@media ');
                let combJs = (code) => code
                    .replace(/ *, */g, ', ')
                    .replace(/ *: */g, ':')
                    .replace(/ *; */g, ';')
                    .replace(/ *\( */g, '(')
                    .replace(/ *{ */g, '{')
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/\/\/.*$/mg, '');
                let combCom = (code) => code
                    .replace(/\r/g, '')
                    .replace(/[ \t]+$/mg, '')
                    .replace(/\n+/g, '\n')
                    .trim();
                let noans = "模範解答なし";
                let ansList = {
                    "kadai-html-1": [
                        ["index.html", jsbin.kizexod.html],
                    ],
                    "kadai-html-2": [
                        ["index.html", noans],
                    ],
                    "kadai-css": [
                        ["index.html", noans],
                    ],
                    "kadai-portfolio-1": [
                        ["index.html", docNthAns(2)],
                        ["css/style.css", docNthAns(3)],
                    ],
                    "kadai-portfolio-2": [
                        ["index.html", docNthAns(4)],
                        ["css/style.css", docNthAns(5)],
                    ],
                    "kadai-portfolio-3": [
                        ["career.html", noans],
                    ],
                    "kadai-jquery1": [
                        ["index.html", jsbin.nudawem.html],
                        ["main.js", jsbin.nudawem.javascript],
                    ],
                    "kadai-jquery2": [
                        ["index.html", jsbin.kawidob.html],
                        ["main.js", jsbin.kawidob.javascript],
                    ],
                    "kadai-jquery3": [
                        ["index.html", jsbin.fenesir.html],
                        ["style.css", jsbin.fenesir.css],
                        ["main.js", jsbin.fenesir.javascript],
                    ],
                    "kadai-smartphone-1": [
                        ["index.html", docNthAns(6)],
                        ["css/style.css", docNthAns(7)],
                        ["js/hamburger.js", docNthAns(8)],
                        ["js/carousel.js", docNthAns(9)],
                    ],
                    "kadai-smartphone-2": [
                        ["index.html", docNthAns(6)],
                        ["css/style.css", docNthAns(10)],
                    ],
                    "kadai-recipe-1": [
                        ["index.html", docNthAns(11)],
                        ["css/style.css", docNthAns(12)],
                        ["js/main.js", docNthAns(13)],
                    ],
                    "kadai-recipe-2": [
                        ["index.html", docNthAns(14)],
                        ["css/style.css", docNthAns(15)],
                        ["js/main.js", docNthAns(16)],
                    ],
                    "kadai-recipe-3": [
                        ["index.html", noans],
                    ],
                    "kadai-corporate-site-1": [
                        ["index.html", docNthAns(17)],
                        ["assets/css/style.css", docNthAns(18)],
                        ["assets/js/main.js", docNthAns(19)],
                    ],
                    "kadai-corporate-site-2": [
                        ["index.html", docNthAns(20)],
                        ["assets/css/style.css", docNthAns(21)],
                        ["assets/js/main.js", docNthAns(22)],
                    ],
                    "kadai-corporate-site-3": [
                        ["access/index.html", noans],
                    ],
                    "kadai-corporate-site-4": [
                        ["index.html", noans],
                    ],
                    "kadai-final-exam": [
                        ["index.html", noans],
                    ],
                };
                let combAns = k => {
                    if(!ansList[k]) return "";
                    let ans=[];
                    ansList[k].forEach(f => {
                        let [fn,code] = f;
                        ans.push(`#### ${fn}`);
                        if(fn.match(/html$/)) {
                            ans.push(combCom(combHtml(code)));
                        } else if(fn.match(/css$/)) {
                            ans.push(combCom(combCss(code)));
                        } else if(fn.match(/js$/)) {
                            ans.push(combCom(combJs(code)));
                        }
                    })
                    return ans.join("\n");
                }
                let ks=[];
                let un;
                let ki;
                if (ism(/mentor\/users\/\d+(#.*)?$/)) {
                    ks=Object.keys(kadaiToFolder);
                    un=$(".heading-users").text();
                    ki=$("th:contains('はじめての副業コース')").closest("table").find("td:contains('期')")[0].textContent.match(/(\d+)期/)[1];
                }
                if (ism(/mentor(.training)?.reports/)) {
                    ks=[Array.from(document.querySelectorAll("a[href]"))
                        .filter((e) => e.getAttribute("href").includes("first-sidejob-2"))
                        .filter((e) => e.getAttribute("href").includes("/lessons/"))
                        .filter((e) => e.getAttribute("href").includes("#kadai"))[0]
                        .getAttribute("href").replace(/.*#/,"")];
                    un=$(".list-inline>li:first-child a").text();
                    ki=$("li:contains('はじめての副業コース')")[0].textContent.match(/(\d+)期/)[1];
                }
                un=`${ki}_${un.replace(/\s+/,"_")}`;
                $(".breadcrumb")[0].insertAdjacentHTML("afterend", `<div class="__openTarev"></div>`);
                let elm = $("div.__openTarev")[0];
                let exist = false;
                ks.forEach(k=>{
                    let fd=kadaiToFolder[k];
                    if(fd) {
                        exist = true;
                        let btn = document.createElement("button");
                        btn.textContent=k;
                        elm.appendChild(btn);
                        btn.addEventListener("click", ()=>{
                            let frm=document.createElement("form");
                            frm.method="post";
                            frm.action="https://yymmt.sakura.ne.jp/tarev/rclone.php";
                            frm.target="_blank";
                            frm.innerHTML=`
                            <input name="id" value="">
                            <input name="fd" value="">
                            <input name="un" value="">
                            <input name="fl" value="">
                            <input name="k" value="">
                            <textarea name="ans"></textarea>
                            `;

                            frm.id.value=g;
                            frm.fd.value=fd;
                            frm.un.value=un;
                            frm.fl.value=ansList[k].map(a=>a[0]).join(",");
                            frm.k.value=k;
                            frm.ans.value=combAns(k);
                            document.body.appendChild(frm);
                            frm.submit();
                            frm.remove();
                        });
                    }
                });
                if(exist) {
                    elm.insertAdjacentHTML("afterbegin", `<span>写経チェッカー</span>`);
                    elm.insertAdjacentHTML("beforeend", `<style>
                    .__openTarev{
                        font-size: 12px;
                        font-weight: 700;
                    }
                    .__openTarev button{
                        margin-left: 2px;
                    }
                    </style>`);
                }
            }
        })();
    }
})();
