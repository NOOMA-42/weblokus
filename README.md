[107-2] Web Programming Final
(Group 15) 題目名稱：Weblokus -- weblokus is a double players, with ranking and several features, extended version of board game - blokus

Repo Link: https://github.com/NOOMA-42/weblokus
Weblokus
Built on Colyseus server, extended from a board game, Weblokus is a double players game. Players has to start from their corner and take up the squares as much as possible. 

DEMO Video:  https://www.youtube.com/watch?v=CIULJDkUqIQ 
INSTALLATION:
Install packages 
1.First clone the repo: 
git clone https://github.com/NOOMA-42/weblokus

2. Then build it:
cd weblokus
npm run allinstall

3. Install MongoDB and create a db called ranking including a collection called ranks

RUN:
Run both backend and frontend via concurrently:
npm run dev
Now use `localhost:8080` to access Weblokus. 
(localhost:2567/colyseus to access backend monitor)

PACKAGES USED
-Frontend
@colyseus/schema"
"axios"
"bootstrap"
"classnames"
"colyseus.js"
"react"
"react-awesome-button"
"react-block-ui"
"react-bootstrap"
"react-copy-to-clipboard"
"react-dnd" 
"react-dnd-html5-backend"
"react-dom"
"react-flip-move"
"react-router-dom"
"reactjs-popup"
"reactstrap": "^8.0.0"
-Backend
"@colyseus/monitor"
"@colyseus/social"
"babel-loader"
"colyseus"
"core-util-is"
"body-parser"
"cors"
"mongoose"
"express"
"express-jwt"
"express-session"
"mongoose"

CODE:
https://github.com/endel/colyseus-react-example
https://github.com/irori/blokus
https://github.com/colyseus/colyseus-examples/tree/master/static
特別感謝: colyseus official forum
TEAMMATE CONTRIBUTION

* Backend:
游祖鈞: colyseus api使用，後端架構，前後連接
* Frontend :
葉彥東: 前端邏輯設計，前後連接

心得
葉彥東:
這學期是我第一次接觸所有跟網站有關的東東，js的各種神奇黑魔法，一大堆套件，搞得我一團亂，不過經過這次期末的體驗，讓我對於前段有更多的了解，也了解到很多以前說的開發習慣真的都超重要........ 修完這門課會發現真的只是網站的開始而已
游祖鈞:
做網頁之後發現永遠都有改善的空間，尤其是在截止期限前出現卡了兩天的大bug導致進度大停擺…最後發現是react setState 對object有很細緻的處理方式.. 中途學到很多新技術，像是實際操作webpack 嘗試使用vscode可以同時暫停前後端的超狂debugger還有發現colyseus有些功能根本沒寫在doc必須要去src code裡面找結果src code都是typescript、實際分配給大家各自的branch 大家協同合作…種種經驗，最重要是從無到有想像一個遊戲到找library到寫的過程，雖然到後面來不及只好放棄之前寫優雅程式碼的堅持開始只要跑得動就可以接受、亂設全域變數等等事情，但這門課最後的project真的藉由我們為了完成一個起碼堪用的作品而讓我們學到很多。
