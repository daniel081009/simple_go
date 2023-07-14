
//ts-check


/*   번호 
    1: 흑돌
    2: 백돌
    3: 흑집
    4: 백집
    5: 벽 
*/
/**
 * @typedef {Object} point 위치 
 * @property {string} x x좌표 
 * @property {number} y y좌표 
 */
export default class Game {
    constructor(targetdom,pl1,pl2,wall,trunrunfunc) {
        this.map = []
        /** @type {Array<point> } */
        this.wall = wall
        this.init_map()
        this.targetdom = targetdom
        this.PrintMap()
        this.blackTurn = true
        this.Player1_End = false
        this.Player2_End = false
        this.gameEnd = false
        /** @type {Array<point> } */
        this.log = []
        this.trun =0
        this.pl1 = pl1
        this.pl2 = pl2
        this.trunrunfunc = trunrunfunc
    }
    /**
     * map을 초기화한다.
     * TODO: 나중에 벽을 추가할 수 있도록 해야한다.
     */
    init_map(){
        for (let i = 0; i < 9; i++) {
            this.map[i] = []
            for (let j = 0; j < 9; j++) {
                let isWall = false
                for (let k = 0; k < this.wall.length; k++) {
                    if (this.wall[k].x == j && this.wall[k].y == i) {
                        this.map[i][j] = 5
                        isWall = true
                    }
                }
                if (isWall) {
                    continue
                }
                this.map[i][j] = 0
            }
        }
    }
    
    /**
     * 특정 좌표에 돌을 놓는다.
     * @param {number} x x좌표
     * @param {number} y y좌표
     */
    click(x,y) {
        console.log(x,y,this.trun,this.blackTurn,this.gameEnd)
        if (this.gameEnd) { // 게임이 끝났으면
            return
        }
        if (!this.check(x,y)){
            return
        }
        if (this.blackTurn) { // 흑돌 턴이면
            this.map[y][x] = 1
        }else{
            this.map[y][x] = 2
        }
        
        let map = this.find_stone(x,y,true,true,false)
        for (let j =0;j<map.length;j++){
            if (this.catch(map[j].x,map[j].y,false)) {
                let ma ="흑"
                if (!this.blackTurn) {
                    ma = "백"
                }
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: ma + " 승리",
                    showConfirmButton: false,
                    timer: 4000
                })
                this.Restart()
                return
            }
        }

        //집 만들기
        let house = this.find_stone(x,y,false,true,true)
        for (let iq = 0; iq < house.length; iq++) {
            if (this.trun == 0) {
                continue 
            }
            /**
             * @type {Array<point>}
             */
            let group = [{x:house[iq].x,y:house[iq].y}]
            let change = true
            while(change){
                change=false
                for (let i=0;i<group.length;i++){
                    let map = this.find_stone(group[i].x,group[i].y,false,true,true)
                    for (let j=0;j<map.length;j++){
                        if (!group.find((e)=>{return e.x == map[j].x&& e.y == map[j].y})) {
                            group.push(map[j])
                            change = true
                        }
                    }
                }
            }

            let home =true
            // 빈 공간을 수색 후 다른 색깔이 발견되면 집이 아니다.
            for (let i=0;i<group.length;i++){
                let tempmap = this.find_stone(group[i].x,group[i].y,true,true,false)
                if (tempmap.length == 0) {
                    continue
                }else {
                    home = false
                }
            }
            if (home){
                for (let i=0;i<group.length;i++){
                    this.map[group[i].y][group[i].x] = this.blackTurn ? 3 : 4
                }
            }
        }


        this.blackTurn = !this.blackTurn
        if (this.blackTurn) {
            document.getElementsByTagName("body")[0].style.backgroundColor = "#1f1f1f"
        }else {
            document.getElementsByTagName("body")[0].style.backgroundColor = "rgb(243 243 243)"
        }
        
        this.PrintMap()

        this.trunrunfunc(this.trun)
        this.log.push({x:x,y:y})
        this.trun++
    }
    /**
     * 1턴을 되돌린다.
     * @returns {boolean} 성공여부
     */
    back() {
        if (this.trun == 0 || this.gameEnd) {  // 0턴이거나 게임이 끝났으면
            return false
        }
        console.log(this.log[this.trun-1] , this.trun-1, this.map[this.log[this.trun-1].y][this.log[this.trun-1].x])
        this.map[this.log[this.trun-1].y][this.log[this.trun-1].x] = 0
        this.log.pop()
        this.blackTurn = !this.blackTurn
        this.trun--
        if (this.blackTurn) {
            document.getElementsByTagName("body")[0].style.backgroundColor = "#1f1f1f"
        }else {
            document.getElementsByTagName("body")[0].style.backgroundColor = "rgb(243 243 243)"
        }
        this.PrintMap()
        return true
    }
    /*
        좌표에 돌을 놓는다.(조건: 돌이 없어야함, 연결된 내 돌들이 잡히면 못둠, 집이 있으면 못둠)
    */
    check(x,y){
        if (!(this.map[y][x] == 0)) { // 돌이 없어야하고 집이 있으면 안됨 벽도 안됨
            return false
        }
        // catch 함수를 사용해서 상대방 돌이 똑같은 곳에 두었을때 잡히는지 확인한다
        this.map[y][x] = (this.blackTurn ? 1 : 2)
        if (this.catch(x,y,true)) {
            this.map[y][x] = 0
            return false
        }
        this.map[y][x] = 0
        return true
    }
    
    /**
     * 특정 좌표랑 연결된 돌이 살아나갈 수 있는지 확인한다.
     * @param {number} x x좌표
     * @param {number} y y좌표
     * @param {boolean} enemy 현재 좌표가 적인지 아닌지 기본은 false
     * @returns {boolean} 잡히는지 여부 true면 잡힘 false면 안잡힘
     */
    catch(x, y, enemy = false)    {
        if (this.find_stone(x, y, false, true, true).length >0){ // 빈 공간이 있는지 확인
            return false
        }
        let team = this.getgroup(x, y,!enemy)
        if (team.length == 0) { // 빈공간이 0인데 숨구멍이 없으니 사망
            return true
        }
        for (let i = 0; i < team.length; i++) {
            if (this.find_stone(team[i].x, team[i].y, enemy, true, true).length != 0) {// 숨구멍이 어딘가는 있다는 뜻이니 살아남을 수 있음
                return false 
            }
        }
        return true // 숨구멍이 없으니 사망
    }

    /**
    @param {number} x x좌표
    @param {number} y y좌표
    @param {boolean} enemy 적 돌을 찾을지 여부(기본값 false로 자신의 돌을 찾는다.)
    @param {boolean} horizon 대각선을 제외할지 여부(기본값 false로 대각선을 포함한다.)
    @param {boolean} space 돌이 없는 공간을 찾을지 여부(기본값 false로 돌이 있는 공간을 찾는다.)
    @returns {Array<point>} 좌표 리스트
    */
    find_stone(x, y, enemy = false, horizon = false, space = false) {
        /**
         * @type {Array<point>}
         */
        let map = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (x + i < 0 || x + i > this.map[0].length-1 || y + j < 0 || y + j > this.map.length-1) { // 범위를 벗어나면 제외
                    continue;
                }
                if (i == 0 && j == 0 || this.map[y + j][x + i] == 5) { // 자기 자신과 벽은 제외
                    continue
                }
                if (horizon) { // 대각선을 제외할지 여부
                    if (i == -1 && j == -1 || 
                        i == -1 && j == 1 || 
                        i == 1 && j == -1 || 
                        i == 1 && j == 1) {
                        continue;
                    }
                }
                if (space) { // 돌이 없는 공간을 찾을지 여부
                    if (this.map[y + j][x + i] === 0 || this.map[y + j][x + i] === 3 || this.map[y + j][x + i] === 4) {
                        map.push({y:y + j,x: x + i});
                    }
                    continue;
                }else if (this.map[y + j][x + i] == 0) {
                    continue;
                }
                if (enemy) {
                    if (this.map[y + j][x + i] != (!this.blackTurn ? 2 : 1)) {
                        map.push({y:y + j,x: x + i});
                    }
                } else {
                    if (this.map[y + j][x + i] == (!this.blackTurn ? 2 : 1)) {
                        map.push({y:y + j,x: x + i});
                    }
                }
            }
        }
        return map;
    }

    /**
     * 특정 좌표에 가로,세로로 연결된 돌 리스트를 반환한다.
     * @param {number} x x좌표
     * @param {number} y y좌표
     * @param {boolean} enemy 적 그룹을 찾을지 여부
     * @returns {Array<point>} 좌표 리스트
     */
    getgroup(x,y,enemy=false){
        /**
         * @type {Array<point>}
         */
        let group = [{x:x,y:y}]
        let change = true
        while(change){
            change=false
            for (let i=0;i<group.length;i++){
                let map = this.find_stone(group[i].x,group[i].y,enemy,true,false)
                for (let j=0;j<map.length;j++){
                    if (!group.find((e)=>{return e.x == map[j].x&& e.y == map[j].y})) {
                        group.push(map[j])
                        change = true
                    }
                }
            }
        }
        return group
    }
    
    /**
     * map을 출력한다.
     */
    PrintMap(){
        let main = this.targetdom
        main.innerHTML = ""
        for (let i = 0; i < 9; i++) {
            let d = document.createElement("div")
            d.className = "row"
            for (let j = 0; j < 9; j++) {
                let classd = "null"
                if (this.map[i][j] == 1) {
                    classd = "black"
                } else if (this.map[i][j] == 2) {
                    classd = "white"
                } else if (this.map[i][j] == 3) {
                    classd = "black_home"
                } else if (this.map[i][j] == 4) {
                    classd = "white_home"
                }else if (this.map[i][j] == 5) {
                    classd = "neutral_wall"
                }
                let dd = document.createElement("div")
                dd.classList.add(classd)
                dd.classList.add("block")
                dd.addEventListener("click",(e)=>{
                    e.preventDefault();
                    this.click(j,i)
                })
                d.appendChild(dd)
            }
            main.appendChild(d)
        }
    }
    
    /**
     * 땅이 몇개인지 센다.
     */
    countTerritory(){
        let blackTerritory = 0
        let whiteTerritory = 0
        for (let i=0;i<this.map.length;i++){
            for (let j=0;j<this.map[i].length;j++){
                if (this.map[i][j] == 3) {
                    blackTerritory++
                }else if (this.map[i][j] == 4) {
                    whiteTerritory++
                }
            }
        }
        return {blackTerritory,whiteTerritory}
    }

    /**
     * 외부에서 게임이 끝날 것 같을때 호출한다.
     */
    ChangeEnd(){
        if (this.Player1_End && this.Player2_End) {
            let {blackTerritory,whiteTerritory} = this.countTerritory()
            this.Restart()
            if (blackTerritory > whiteTerritory) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: blackTerritory-whiteTerritory +'집 차이로 흑 승리',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else if (blackTerritory < whiteTerritory) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: whiteTerritory-blackTerritory+ '집 차이로 백 승리',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '무승부',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

    /**
     * 게임을 초기화한다.
     */
    Restart(){
        this.map = []
        this.init_map()
        this.PrintMap()
        this.blackTurn = true
        this.trun =0
        document.getElementsByTagName("body")[0].style.backgroundColor = "#1f1f1f"
        this.Player1_End = false
        this.Player2_End = false
        this.gameEnd = false
        this.log = []
        this.pl1.className= "End"
        this.pl2.className= "End"
        console.log("게임을 초기화합니다.",this.trun)
    }
}
