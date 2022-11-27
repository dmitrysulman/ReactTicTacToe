import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {    
    return (
        <button className={'square' + (props.winner ? ' winner' : '')} onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
  class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                winner={this.props.winner && this.props.winner.indexOf(i) != -1 ? true : false}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        const squares = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(j + 3 * i));
            }
            squares.push(<div key={i} className="board-row">{row}</div>)
        }
        return (
            <div>
                {squares}
            </div>
        );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                currentStep: null,
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                currentStep: i,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) == 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to start';
            const pos = move ? 
                '(' + (step.currentStep % 3 + 1) + ', ' + (Math.floor(step.currentStep / 3) + 1) + ')' + step.currentStep + ' ' + move: 
                null;
            const selected = move == this.state.stepNumber ? 'selected' : null;
            return (
                <li key={move} className={selected}>
                    <button onClick={() => this.jumpTo(move)}>{desc} {pos}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner ' + this.state.history[this.state.stepNumber].squares[winner[0]]; 
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                winner={winner}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
  }