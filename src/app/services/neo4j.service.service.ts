import { Injectable } from '@angular/core';
import neo4j from 'neo4j-driver';
import { BehaviorSubject } from 'rxjs';
import { Neo4jModel } from '../models/neo4j-models';

@Injectable({
  providedIn: 'root',
})
export class Neo4jServiceService {
  private NEO4J_URI: string = 'neo4j+s://55354b5d.databases.neo4j.io';
  private NEO4J_USERNAME = 'neo4j';
  private NEO4J_PASSWORD = 'So38f1CMcyWRKqYR8bP4KR6QkohPRHXa9pINY78uCFI';
  private gamesSource = new BehaviorSubject<any[]>([]);
  currentGames = this.gamesSource.asObservable();

  constructor() {}

  async getCommonNodes(userLikedGames: string[], userDislikedGames: string[]) {
    var gameList: Neo4jModel[] = new Array();
    // var likedGames = [43050, 542349, 25023]
    // var avoidGames = [43050, 542349, 25023]
    var likedGames = userLikedGames;
    var avoidGames = likedGames.concat(userDislikedGames);

    // Create a Driver Instance
    const driver = neo4j.driver(
      this.NEO4J_URI,
      neo4j.auth.basic(this.NEO4J_USERNAME, this.NEO4J_PASSWORD)
    );

    // Open a new Session
    const session = driver.session();

    try {
      // Run this Cypher statement using session.run()
      const cypher =
        `WITH [` +
        likedGames.toString() +
        `] AS LikedGames, ` +
        ` [` +
        avoidGames.toString() +
        `] AS avoidGames ` +
        `MATCH (n1:Game)-[r1]->(b)<-[r2]-(n2:Game)` +
        `WHERE n1.gameId IN LikedGames AND n2.gameId IN LikedGames ` +
        `WITH DISTINCT collect(b) AS commonNodes, avoidGames ` +
        `MATCH (n:Game)-[r]->(m) ` +
        `WHERE m IN commonNodes AND NOT n.gameId IN avoidGames ` +
        `RETURN n AS GAME LIMIT 100 `;

      const res = await session.run(cypher);

      for (const record of res.records) {
        const gameNode = record.get('GAME');
        if (gameNode) {
          const elementId = String(gameNode.elementId).split(':')[2];
          const label = gameNode.labels[0];
          var currentNode = new Neo4jModel(elementId, label);
          gameList.push(currentNode);
        }
      }
    } finally {
      // Close the session
      await session.close();
    }

    return gameList;
  }
}
