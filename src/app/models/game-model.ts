
export class GameModel {
    constructor(
      public id: number,
      public name: string,
      public like: number = 0,
      public dislike: number = 0
    ) {}
  }
  