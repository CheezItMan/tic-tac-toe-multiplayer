
import { assign, Machine } from "xstate";
import { Context, GameEvent, PlayedEvent, Scheme, RestartedEvent } from '../types/types';
import { none, isSome, some } from "fp-ts/Option";
import { deepCopy } from "../utils/util";
import { Board, Player, Result } from '../types/types';

const ACTIONS = {
  PLAY_SQUARE: (player: Player) => assign<Context, PlayedEvent>({
    board: (ctx, e) => ctx.board.map(
      cell => (
        cell.column === e.payload.column && cell.row === e.payload.row
      ) ?
      ({
        ...cell,
        state: {
          kind: 'Played',
          player: player,
        }
      })
      : cell
    ) as Board,
  }),
  ASSIGN_DEFAULT_CONTEXT: () => assign<Context, RestartedEvent>(() => DEFAULT_CONTEXT),
  ASSIGN_MATCH_SCORE: (player: Player) => assign<Context, PlayedEvent>(
    (context: Context, e: PlayedEvent) => {
      // Mark the cell
      for (let cell of context.board) {
        if (cell.row === e.payload.row && cell.column === e.payload.column &&
          cell.state.kind === 'Playable') {
            cell.state = {
              kind: 'Played',
              player: player,
            }
          }
      }
      
      return context;
    }
  )
};

const CONDITIONS = {
  IS_DONE: (ctx: Context) => isSome(ctx.result),
  IS_VALID_PLAY: (ctx: Context, e: PlayedEvent) => !!ctx.board.find(
    cell =>
      cell.column === e.payload.column
      && cell.row === e.payload.row 
      && cell.state.kind === 'Playable'
  ),
}

const DEFAULT_CONTEXT: Context = {
  result: none,
  matchScore: {
    'Draw': none,
    'Row1': none,
    'Row2': none,
    'Row3': none,
    'Column1': none,
    'Column2': none,
    'Column3': none,
    'Diagonal1': none,
    'Diagonal2': none,
  },
  board: [
    {
      row: 1,
      column: 1,
      state: { kind: 'Playable' },
    },
    {
      row: 2,
      column: 1,
      state: { kind: 'Playable' },
    },
    {
      row: 3,
      column: 1,
      state: { kind: 'Playable' },
    },
    {
      row: 1,
      column: 2,
      state: { kind: 'Playable' },
    },
    {
      row: 2,
      column: 2,
      state: { kind: 'Playable' },
    },
    {
      row: 3,
      column: 2,
      state: { kind: 'Playable' },
    },
    {
      row: 1,
      column: 3,
      state: { kind: 'Playable' },
    },
    {
      row: 2,
      column: 3,
      state: { kind: 'Playable' },
    },
    {
      row: 3,
      column: 3,
      state: { kind: 'Playable' },
    },
  ]
};

export const ticTacToeMachine = Machine<Context, Scheme, GameEvent>({
  id: 'tic-tac-toe',
  initial: 'PLAYER_SETUP',
  context: deepCopy(DEFAULT_CONTEXT),
  states: {
    PLAYER_SETUP: {
      on: {
        SETUP_DONE: {
          target: 'X',
        },
      },
    },
    X: {
      always: {
        cond: CONDITIONS.IS_DONE,
        target: 'DONE',
      },
      on: {
        PLAYED: {
          cond: CONDITIONS.IS_VALID_PLAY,
          target: 'O',
          actions: [
            ACTIONS.PLAY_SQUARE('X'),
          ]
        },
      },
    },
    O: {
      always: {
        cond: CONDITIONS.IS_DONE,
        target: 'DONE',
      },
      on: {
        PLAYED: {
          cond: CONDITIONS.IS_VALID_PLAY,
          target: 'X',
          actions: [
            ACTIONS.PLAY_SQUARE('O'),
          ],
        },
      },
    },
    DONE: {
      on: {
        RESTARTED: {
          target: 'X',
          actions: [
            ACTIONS.ASSIGN_DEFAULT_CONTEXT,
          ],
        }
      }
    }
  },
},
{
},);