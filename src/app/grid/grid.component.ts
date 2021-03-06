import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {WindowService} from '../Services/window.service';
import {GameStateService} from '../Services/game-state.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnDestroy {
  Tiles!: number[]
  $resizeSubscription!: Subscription;
  $gameStateSubscription!: Subscription;
  chosenTiles: number[] = [];
  resetTiles = false;
  score = 0;
  gameDifficulty = 9;

  constructor(
    private windowResize: WindowService,
    private gameState: GameStateService
  ) {
  }

  ngOnInit() {
    this.Tiles = this.gameState.seedTiles();

    this.$gameStateSubscription = this.gameState.reset.subscribe(
      (resetVal) => {
        if (resetVal) {
          this.resetGame(true)
        }
      }
    );

    this.randomNumber();
  }

  randomNumber() {
    [...Array(this.gameDifficulty)].map((_, i) => {
      let x = Math.floor(Math.random() * this.Tiles.length);
      this.chosenTiles.push(this.calculateRemainingIndex(x, this.chosenTiles));
    });
    console.log(this.chosenTiles);
  }

  muteTiles(input: boolean) {
    this.resetTiles = input;
  }

  incrementScore(input: number) {
    this.score = input;
    console.log(this.score)
  }

  resetGame(input: boolean) {
    if (input) {
      this.chosenTiles = [];
      this.Tiles = this.gameState.seedTiles();
      this.randomNumber();
    }
  }

  ngOnDestroy() {
    this.$resizeSubscription.unsubscribe();
    this.$gameStateSubscription.unsubscribe();
  }

  private calculateRemainingIndex = (index: number, tilesArray: number[]): any => {
    if (!tilesArray.includes(index)) {
      return index;
    } else {
      const newNumber = Math.floor(Math.random() * this.Tiles.length);
      return this.calculateRemainingIndex(newNumber, tilesArray);
    }
  };
}
