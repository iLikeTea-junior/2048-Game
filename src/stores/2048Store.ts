import { defineStore } from 'pinia'
import { type Game } from '../../2048'

export const useGameStore = defineStore("GameStore", {
    state: () => ({
      games: [] as {player: string, game: Game | null}[],
    }),

    getters: {
      getPlayers: (state) => {
        const players: {name: string, score: number}[] = []

        state.games.forEach((p) => {
          players.push({name: p.player, score: p.game?.score ?? 0})
        })
        return players;
      },

      getPlayer: (state) => {
        return (player: string) => state.games.find(game => game.player === player);
      },

      getGame: (state) => {
        return (playerName: string) => state.games.find(game => game.player === playerName)?.game
      }
    },

    actions: {
      initStorage() {
        const saved = localStorage.getItem("games")
        this.games = saved ? JSON.parse(saved) : []
      },

      addNewGame(playerName: string, newGame: Game) {
        const player = this.games.find((game) => game.player === playerName)
        if (player) player.game = newGame;
      },

      addNewPlayer(playerName: string) {
        this.games.push({player: playerName, game: null})
        this.updateLocalStorage()
      },

      saveGame(playerName: string, newGame: Game) {
        // first game save
        const gameIdx = this.games.findIndex((game) => game.player === playerName)
        if (gameIdx >= 0) {
          this.games[gameIdx] = {player: playerName, game: newGame};
          this.updateLocalStorage();
        }
      },

      updateLocalStorage() {
        localStorage.setItem("games", JSON.stringify(this.games))
      }
    }
  });
  