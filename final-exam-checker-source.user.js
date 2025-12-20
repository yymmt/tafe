// ==UserScript==
// @name         最終課題チェッカー2 - ソースコード部分
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  最終課題チェッカー2 - ソースコード部分
// @author       You
// @match        http://*/final-exam/*
// @match        http://*/*/final-exam/*
// @match        https://*/final-exam/*
// @match        https://*/*/final-exam/*
// @icon         https://demo.techacademy.jp/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/yymmt/tafe/main/final-exam-checker-source.user.js
// @downloadURL  https://raw.githubusercontent.com/yymmt/tafe/main/final-exam-checker-source.user.js
// ==/UserScript==

window.onload = async () => {
  const indexHtmlSource = document.documentElement.outerHTML;

  const linkElement = document.querySelector('link[href*="style.css"]');
  const styleCssPath = linkElement.href;
  let styleCssSource = await (await fetch(styleCssPath)).text();

  const scriptElement = document.querySelector('script[src*="main.js"]');
  const mainJsPath = scriptElement.src;
  let mainJsSource = await (await fetch(mainJsPath)).text();

  let analyzeHtmlElm = (title, pattern, outFns) => {
    console.log(`◆ ${title}`);
    const matches = indexHtmlSource.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        console.log(match);
        const div = document.createElement('div');
        div.innerHTML = match;
        const e = div.firstElementChild;
        if (e) {
          outFns.forEach(f => console.log("  "+ f(e).replace(/\s/g, '') ));
        }
      });
    }
  };

  console.log("■ index.html");
  analyzeHtmlElm('Headings', /<h[1-6].*?>[\s\S]*?<\.*?>/gi, [
    e => e.tagName,
    e => `text: ${e.textContent}`,
  ]);
  analyzeHtmlElm('Anchors', /<a\s.*?>[\s\S]*?<\/a>/gi, [
    e => `text: ${e.textContent}`,
    e => `href: ${e.getAttribute('href')}`,
  ]);
  analyzeHtmlElm('Images', /<img\s[^>]*>/gi, [
    e => `src: ${e.getAttribute('src')}`,
    e => `alt: ${e.getAttribute('alt')}`,
  ]);
  analyzeHtmlElm('Breaks', /<.*?>.*?<br.*?>.*?<\/.*?>/gi, []);
  analyzeHtmlElm('Comments', /<!--[\s\S]*?-->/g, []);
  analyzeHtmlElm('Title', /<title.*?>.*?<\/title>/gi, [
    e => e.textContent == 'Kira-Kira English｜キラキライングリッシュ キッズオンライン英会話教室' ? 'OK': 'NG',
  ]);
  analyzeHtmlElm('Description', /<meta.*?name=.*?description.*?>/gi, [
    e => e.getAttribute('content') == 'Kira-Kira English(キラキライングリッシュ)は、お子様向けのオンライン英会話教室です。0歳から15歳までのお子様向けに楽しく学べて“使える英語力”が身につき幅広いレッスンが受講でき、家族割やきょうだい割も大好評！ご希望に合わせて英語検定受験コース、高校受験向けコースも開講しています。' ? 'OK': 'NG',
  ]);
  analyzeHtmlElm('header, nav, main, section, footer', /<(header|nav|main|section|footer).*?>/gi, [
  ]);

  let analyzeCssRule = (title, pattern) => {
    console.log(`◆ ${title}`);
    const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
    const regex = new RegExp(pattern, flags);
    let match;
    while ((match = regex.exec(styleCssSource)) !== null) {
      const matchIndex = match.index;
      const matchStr = match[0];
      const openBraceIndex = styleCssSource.lastIndexOf('{', matchIndex);
      const closeBraceIndex = styleCssSource.lastIndexOf('}', matchIndex);
      if (openBraceIndex === -1 || closeBraceIndex > openBraceIndex) {
        console.log(`  ${matchStr.trim()}`);
        continue;
      }
      let selectorStartIndex = 0;
      const stopChars = ['}', ';', '{'];
      let maxIndex = -1;
      for (const char of stopChars) {
        const idx = styleCssSource.lastIndexOf(char, openBraceIndex - 1);
        if (idx > maxIndex) maxIndex = idx;
      }
      if (maxIndex !== -1) selectorStartIndex = maxIndex + 1;
      let selector = styleCssSource.substring(selectorStartIndex, openBraceIndex).trim();
      selector = selector.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\r?\n/g, ' ').trim();
      console.log(`  ${selector} { ... ${matchStr.trim()} ... }`);
    }
  };

  console.log("■ style.css");
  analyzeCssRule('Negative Margins', /margin(-[a-z]+)?\s*:.*?-[0-9\.].*?;/gi);
  analyzeCssRule('Position', /position\s*:.*?;/gi);
  analyzeCssRule('Transform', /transform\s*:.*?;/gi);
  analyzeCssRule('Media Queries', /@media.*?\)/gi);
  analyzeCssRule('Comments', /\/\*[\s\S]*?\*\//g);

  console.log("■ main.js");
  console.log('Comments (Single):', mainJsSource.match(/\/\/.*/g));
  console.log('Comments (Multi):', mainJsSource.match(/\/\*[\s\S]*?\*\//g));
}
