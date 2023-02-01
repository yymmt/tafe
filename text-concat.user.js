// ==UserScript==
// @name         テキスト結合
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://techacademy.jp/mentor/courses/*/curriculums/*/lessons
// @icon         https://www.google.com/s2/favicons?sz=64&domain=techacademy.jp
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
</style>
            `;
            $(win.document).find(".note-index").remove();
            $(win.document).find(".col-md-3, .col-md-push-9, .col-md-9, .col-md-pull-3").removeClass("col-md-3 col-md-push-9 col-md-9 col-md-pull-3");
            (async () => {
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
                            doc.querySelectorAll(".curriculum-container>section").forEach((elm) => {
                                con.appendChild(elm);
                            });
                        });
                    win.document.title = `${i} / ${urls.length}`;
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

