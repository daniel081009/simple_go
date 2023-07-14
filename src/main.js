import Game from "./game.js"
import { Router } from "https://unpkg.com/@vaadin/router@1.7.4/dist/vaadin-router.js";
import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

const router = new Router(document.querySelector("body"));
router.setRoutes([
  { path: "/", component: "home-page" },
  {path:"/rule", component:"help-page"},
  { path: "/game/:mode", component: "game-page" },
  { path: "(.*)", component: "page404-page" },
]);


class help extends LitElement {
    static get styles() {
      return css`
        :host {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 2rem;
        }
  
        .rules {
          font-size: 1.5rem;
          text-align: center;
          line-height: 1.5;
        }
        .rules > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        .rules > div > img {
          width: 50vw;
          max-width: 300px;
          height: auto;
        }
        .rules > div > p {
          font-size: 2rem;
        }
  
        .hidden {
          display: none;
        }
  
        /* 모바일 화면 크기에 따른 스타일 조정 */
        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .rules {
            font-size: 1rem;
          }
          .rules > div > img {
            width: 80vw;
            max-width: 200px;
          }
          .rules > div > p {
            font-size: 1.5rem;
          }
        }
      `;
    }
  
    render() {
      return html`
        <div class="rules">
          <div>
            <img src="/src/img/둘러싸면_먹힘.gif">
            <p>상대방을 가로 세로로 둘러싸면 승리에요</p>
          </div>
          <div>
            <img src="/src/img/벽_이용가능.gif">
            <p>벽을 이용할 수 있어요</p>
          </div>
          <div>
            <img src="/src/img/집이_있으면_잡을수_없다.gif">
            <p>빈 공간을 가로,세로로 둘러싸면 집이 생겨요<br>집과 연결된 돌은 잡을 수 없어요</p>
          </div>
          <div>
            <img src="/src/img/장애물을 이용 가능.gif">
            <img src="/src/img/장애물을_이용해서_잡을_수_있다.gif">
            <p>특수한 벽이 있는데 이 벽을 이용할 수 있어요</p>
          </div>
          <button @click=${() => document.location.href="/"}>다봤다!</button>
        </div>
      `;
    }
}
  
customElements.define("help-page", help);

class homepage extends LitElement {
    static get styles() {
      return css`
        /* 화면 전체를 채우도록 설정 */
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 90vh;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        label {
          margin-right: 1rem;
        }
        button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
        }
        button:hover {
          background-color: #0069d9;
        }
        .help {
          margin-top: 1rem;
          cursor: pointer;
          text-decoration: underline;
        }
        .hidden {
          display: none;
        }
        .select {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 2px solid #ccc;
            border-radius: 0.25rem;
        }
        input[type="radio"] {
        /* 라디오 버튼의 외곽선 스타일 */
            outline: none;
            border: 2px solid #ccc;
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.5rem;
            cursor: pointer;
        }

        /* 라디오 버튼이 선택되었을 때의 스타일 */
        input[type="radio"]:checked {
            border-color: #007bff;
            background-color: #007bff;
        }
  
        /* 모바일 화면 크기에 따른 스타일 조정 */
        @media (max-width: 768px) {
          h1 {
            font-size: 1.5rem;
          }
          label {
            margin-right: 0.5rem;
          }
          button {
            margin-top: 0.5rem;
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
          }
          .help {
            margin-top: 0.5rem;
          }
        }
      `;
    }
  
    constructor() {
      super();
      this.help = false;
      this.selectedMode = "normal";
    }
  
    startGame() {
      if (this.selectedMode === null) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: '게임 모드를 선택해주세요.',
          showConfirmButton: false,
          timer: 1500
        })
        return;
      }
      document.location.href = `/game/${this.selectedMode}`;
    }
  
    render() {
      return html`
        <h1>Simple Go!</h1>
        <div class="select">
          <div>
            <input type="radio" id="normal" name="mode" value="normal" checked @change=${() => this.selectedMode = "normal"}>
            <label for="normal">기본</label>
          </div>
          <div>
            <input type="radio" id="random_3" name="mode" value="random_3" @change=${() => this.selectedMode = "random_3"}>
            <label for="random_3">3개 랜덤 벽</label>
          </div>
          <div>
            <input type="radio" id="allrandom" name="mode" value="allrandom" @change=${() => this.selectedMode = "allrandom"}>
            <label for="allrandom">벽 모두 랜덤</label>
          </div>
          <div>
            <input type="radio" id="nowall" name="mode" value="nowall" @change=${() => this.selectedMode = "nowall"}>
            <label for="nowall">없음</label>
          </div>
        </div>
        <button @click=${this.startGame}>게임 시작</button>
        <div class="help" @click=${() => {
            document.location.href = "/rule";
        }}>rule</div>
      `;
    }
}
  
customElements.define("home-page", homepage);
class gamepage extends LitElement {
    static get styles() {
        return css`
  
        .hidden {
          display: none;
        }
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 90vh;
        }
    .End {
        width: 30vw;
        height: 10vh;
        font-size: 5rem;
        background-color: rgb(64, 64, 64);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .End_select {
        width: 30vw;
        height: 10vh;
        font-size: 5rem;
        background-color: white;
        color: rgb(64, 64, 64);
    }
    #map {
        background-color: black;
    }
    .null {
        background-color: #c4c4c4;
    }
    .row {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .block {
        display: inline-block;
        width: 80px;
        height: 80px;
        border: 1px solid #000;
    }
    .black {
        background-color: rgb(46, 46, 46);
        border-radius: 20%;
    }
    .white {
        background-color: white;
        border-radius: 20%;
    }
    .neutral_wall {
        background-color: #757575;
        border-radius: 20%;
    }
    .black_home{
        background-color: black;
        border-radius: 40%;
    }
    .white_home{
        background-color: white;
    }
    .flip {
        display: inline-block;
        transform: rotate(180deg);
    }
    .flipy {
        /* display: inline-block; */
        transform: rotate(180deg);
    }
    /* .flipx {
        display: inline-block;
        transform: scaleY(-1);
    } */
    @media only screen and (max-width: 480px) {
        /* 핸드폰 */
        .End {
            width: 80vw;
            height: 20vh;
            font-size: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .End_select {
            width: 80vw;
            height: 20vh;
            font-size: 2rem;
            align-items: center;
            align-items: center;
        }
    } 
    @media only screen and (max-width: 768px) {
        /* 태블릿 */
        .block{
            width: 15vw;
            height: 15vw;
        }
        .End {
            width: 50vw;
            height: 15vh;
            font-size: 3rem;

            display: flex;
            justify-content: center;
            align-items: center;
        }
        .End_select {
            width: 50vw;
            height: 15vh;
            font-size: 3rem;
            align-items: center;
            align-items: center;
        }
    }
    .tool {
        display: flex;
        background-color: rgb(243, 243, 243);
        align-items: center;
        justify-content: center;
        border-radius: 4%;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);  
    }
    .tool > img {
        width: 50px;
        height: 50px;
    }
        `
    }
    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    constructor() {
        super();
        /** @type{Game} */
        this.game = null;
            
        this.pl1_back=false;
        this.pl2_back=false;
        (async () => {
            await this.updateComplete;

            const path = window.location.pathname;
            const match = path.match(/^\/game\/(.*)$/);
            let mode ="normal"
            if (match) {
                mode = match[1];
            }
            let wall = [{x:4,y:4},]
            let sp = mode.split("_")
            if (sp[0] === "random") {
                wall = []
                let li = Number(sp[1])
                for (let i = 0; i < li; i++) {
                    wall.push({x:this.random(1,7),y:this.random(1,7)})
                }
            }else if (mode==="allrandom"){
                console.log("allrandom")
                wall = []
                let li = this.random(1,4)
                for (let i = 0; i < li; i++) {
                    wall.push({x:this.random(1,7),y:this.random(1,7)})
                }
            }else if (mode === "nowall") {
                wall = []
            }else if (mode === "normal") {
                wall = [{x:4,y:4},]
            }
            
            this.game = new Game(
                this.shadowRoot.getElementById("map"),this.shadowRoot.getElementById("player_1"),
                this.shadowRoot.getElementById("player_2"),wall,
                (turn)=>{
                    this.pl1_back=false;
                    this.pl2_back=false;
                    console.log("turn",turn)    
                });
        })()
    }
    render() {
        return html`
            <div class="tool">
                <img class="flipy" src="/src/img/back.svg" @click=${
                    ()=>{
                        this.pl1_back = !this.pl1_back
                        this.requestUpdate()
                    }
                }/>
                <div id="player_1" class="End" @click=${()=>{
                    const player1 = this.shadowRoot.getElementById("player_1")
                    this.game.Player1_End = !this.game.Player1_End
                    if (this.game.Player1_End) {
                        player1.className= "End_select"
                    }else{
                        player1.className= "End"
                    }
                    this.game.ChangeEnd()
                }}><span class="flip">End</span></div>
                <img class="flipy ${this.pl2_back ?"":"hidden"}" src="/src/img/confirm.svg" @click=${()=>{
                  if (this.pl2_back){
                    this.game.back()
                    this.pl1_back=false;
                    this.pl2_back=false;
                    this.requestUpdate()
                  }
                }}/>
            </div>
            <div id="map"></div>
            <div class="tool">
                <img src="/src/img/confirm.svg" class="${this.pl1_back ?"":"hidden"}" @click=${()=>{
                    if (this.pl1_ok){
                        this.game.back()
                        this.pl1_back=false;
                        this.pl2_back=false;
                        this.requestUpdate()
                    }
                }}/>
                <div id="player_2" class="End" @click=${()=>{
                    const player2 = this.shadowRoot.getElementById("player_2")
                    this.game.Player2_End = !this.game.Player2_End
                    if (this.game.Player2_End) {
                        player2.className= "End_select"
                    }else{
                        player2.className= "End"
                    }
                    this.game.ChangeEnd()
                }}>End</div>
                <img src="/src/img/back.svg" @click=${
                    ()=>{
                        this.pl2_back = !this.pl2_back
                        this.requestUpdate()
                    }
                }/>
            </div>
           
        `;
    }
}

class page404 extends LitElement {
  render() {
    return html` <h1>404 Page Not Found</h1> `;
  }
}

customElements.define("game-page", gamepage);
customElements.define("page404-page", page404);