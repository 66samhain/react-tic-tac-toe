import { useState } from "react";

function Square({ value, onSquareClick, winner = false }) {
    return (
        <button className={ winner ? 'square winner' : 'square' } onClick={onSquareClick}>
            {value}
        </button>
    );
}
function Board({ xIsNext, squares, onPlay }) {

    const winner = calculateWinner(squares)?.winner;
    const winningLine = calculateWinner(squares)?.line;

    let status;

    if (winner) {
        status = `Winner ${winner}`;
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)?.winner) {
            return;
        }

        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }

        onPlay(nextSquares);
    }

    function renderSquares() {
        let board = [];

        for (let i = 0; i < 3; i++) {
            let row = [];

            for (let j = 0; j < 3; j++) {
                let square = <Square value={squares[i * 3 + j]} winner={ winningLine?.includes(i * 3 + j) } onSquareClick={() => handleClick(i * 3 + j)} />;

                row.push(square);
            }

            board.push(<div className="board-row">{row}</div>);
        }

        return board;
    }

    return (
        <>
            <div className="status">{status}</div>

            {renderSquares()}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);

    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let moves = [];

        if (move === currentMove) {
            moves.push(<li key={move}>You are at move #{currentMove}</li>);
        } else if (move === 0) {
            moves.push(<li key={move}><button onClick={() => jumpTo(move)}>Go to game start</button></li>);
        } else {
            moves.push(<li key={move}>
                <button onClick={() => jumpTo(move)}>Go to move #{move}</button>
            </li>);
        }

        if (!isAscending) {
            moves.reverse();
        }

        return moves;
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>

            <div className="game-info">
                <ol>{isAscending ? moves : moves.reverse()}</ol>

                <div className="change-order">
                    <button onClick={ () => { setIsAscending(!isAscending) } }>Change order</button>
                </div>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i]
            }
        }
    }

    return null;
}
