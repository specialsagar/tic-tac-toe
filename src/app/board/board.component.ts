import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {

  grid = [];
  boardDimension:number = 3;
  player:string= "Player";
  bot:string = "Bot";
  gamePlayers = [this.player, this.bot];
  currentPlayer:string;
  moves:number;
  msg1:string; 
  msg2:string;
  isOver:boolean;
  isBotThinking:boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {}

  initGame() {

    this.grid=[];
    this.currentPlayer = this.gamePlayers[0];
    this.moves=0;
    this.isOver=false;

    for(let i=0;i<this.boardDimension;i++){
      this.grid[i]=[];
      for(let j=0;j<this.boardDimension;j++){
        this.grid[i][j]= {player: '', isTileFree: true};
      }
    }

  }

  updateCell(row:number,col:number, inturruptUpdate) {
    if (inturruptUpdate) {
      this.snackBar.open("Bot is playing", "ok");
      return;
    }
    if(!this.isOver){
      if(this.grid[row][col].isTileFree){
        this.moves++;
        this.grid[row][col]={player: this.currentPlayer, isTileFree: false};

        this.checkRow(row); 
        this.checkColumn(col);
        this.checkDiagonals();
        this.changePlayer(); 


        if(this.moves == (this.boardDimension*this.boardDimension) && !this.isOver){
          this.snackBar.open('Draw','Ok');
          this.isOver = true;
        } else if (this.currentPlayer == this.bot) {
          this.isBotThinking = true;
          setTimeout(() => {
            this.playComputer();
            this.isBotThinking = false;
          }, 1500);
        }
      }
    } else {
      this.snackBar.open('Game ended. Please restart','Ok');
    }

  }

  checkRow(row:number) {
    this.checkWin(this.grid[row]);
  }

  checkColumn(column:number) {
    const col=[];
    for(let i=0;i<this.boardDimension;i++){
      col.push(this.grid[i][column]);
    }
    this.checkWin(col);
  }

  checkDiagonals (){
    const diagonal1 = [];
    const diagonal2 = [];

    for(let i=0;i<this.boardDimension;i++){
      diagonal1.push(this.grid[i][i]); // from top left to bottom right
      diagonal2.push(this.grid[i][this.boardDimension-1-i]); // top right to bottom left
    }
    this.checkWin(diagonal1);
    this.checkWin(diagonal2);
  }

  checkWin(obj) {
    const result = this.checkAllEquals(obj);
    if(result){
      this.endGame();
    }
  }

  // check if array contains same data all around
  checkAllEquals(array) {
    return array.reduce ( (a,b) => (a.player === b.player) && (a.player != "" ? a : false));
  }

  changePlayer() {
    if(this.currentPlayer == this.gamePlayers[0]) this.currentPlayer=this.gamePlayers[1];
    else this.currentPlayer=this.gamePlayers[0];

    if(!this.isOver) {
      this.msg2="Tocca al Giocatore: "+this.currentPlayer;
      this.msg1=undefined;
    }
  }

  endGame() {
    this.isOver=true;
    this.snackBar.open(`Winner ${this.currentPlayer}`, 'Ok');
  }

  playComputer() {
    let possibleMoves = [];
    for(let i=0;i<this.boardDimension;i++){
      for(let j=0;j<this.boardDimension;j++){
        if (this.grid[i][j].isTileFree) {
          possibleMoves.push([i,j]);
        }
      }
    }
    
    const selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    this.updateCell(selectedMove[0], selectedMove[1], false);
  }
}
