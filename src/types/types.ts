import { Option } from "fp-ts/Option";

type Player = 'X' | 'O';

type Coordinate = 1 | 2 | 3;

type Coordinates = { row: Coordinate, col: Coordinate };

type CellState = { kind: 'Playable' } | { kind: 'Played', player: Player };

type Cell = Coordinates & { state: CellState };

type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]

type ResultType = 
  | 'Draw'
  | 'Row1'
  | 'Row2'
  | 'Row3'
  | 'Column1'
  | 'Column2'
  | 'Column3'
  | 'Diagonal1'
  | 'Diagonal2';

type Result = { type: Extract<ResultType, 'Draw'> } | { type: Exclude<ResultType, 'Draw'>, player: Player};

export type GameEvent =
  | PlayedEvent
  | RestartedEvent;

export type RestartedEvent = { type: 'Restarted' };
export type PlayedEvent = { type: 'Played', payload: Coordinates };

export type Context =
    {
        matchScore: MatchScore,
        board: Board,
        result: Option<Result>
    };

export type MatchScore = Record<ResultType, Option<{ player: Player, count: number }>>

export type Scheme = {
    states: {
        x: {},
        o: {},
        DONE: {},
    };
};
