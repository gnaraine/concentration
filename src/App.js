import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const cardImages = [
  { src: "/img/card-1.png", matched: false },
  { src: "/img/card-2.png", matched: false },
  { src: "/img/card-3.png", matched: false },
  { src: "/img/card-4.png", matched: false },
  { src: "/img/card-5.png", matched: false },
  { src: "/img/card-6.png", matched: false },
  { src: "/img/card-7.png", matched: false },
  { src: "/img/card-8.png", matched: false },
  { src: "/img/card-9.png", matched: false },
  { src: "/img/card-10.png", matched: false },
  { src: "/img/card-11.png", matched: false },
  { src: "/img/card-12.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [numMatched, setNumMatched] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [currentdifficulty, setCurrentDifficulty] = useState("");
  const [hint, setHint] = useState(true);
  const [hiScore, setHiScore] = useState(0);

  const { width, height } = useWindowSize();
  const difficultyLevels = [
    { label: "easy", value: "Easy" },
    { label: "medium", value: "Medium" },
    { label: "hard", value: "Hard" },
    { label: "expert", value: "Expert" },
  ];

  const startGame = () => {
    setCurrentDifficulty(difficulty);
    let numCards = 12;
    if (difficulty === "easy") {
      numCards = 4;
    } else if (difficulty === "medium") {
      numCards = 6;
    } else if (difficulty === "hard") {
      numCards = 8;
    }

    const shuffleCards = [
      ...cardImages.slice(0, numCards),
      ...cardImages.slice(0, numCards),
    ]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffleCards);
    setTurns(0);
    setNumMatched(0);

    setHint(false);
  };

  const handeChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const showHint = () => {
    console.log("show hint");
    setCards((prevCards) => {
      var numHints = cards.length / 4;
      return prevCards.map((card) => {
        var match = Math.random() < 0.5;
        if (numHints > 0 && match) {
          numHints--;
          return { ...card, flipped: true };
        } else {
          return { ...card, flipped: false };
        }
      });
    });
    setDisabled(true);
    setTimeout(() => unFlipHint(), 3000);
  };

  const unFlipHint = () => {
    setCards((prevCards) => {
      return prevCards.map((card) => {
        return { ...card, flipped: false };
      });
    });
    setDisabled(false);
  };

  const handeDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleshowHint = (e) => {
    setHint(true);
    setTurns(turns + 5);
    showHint();
  };

  //compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setNumMatched((prevNumMatched) => prevNumMatched + 1);
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    //setHiScore((hiScore) => [turns, ...hiScore]);
    console.log("turns" + turns);

    if (numMatched === cards.length / 2 && cards.length > 0) {
      let score = turns;

      if (currentdifficulty === "easy") {
        score = (4 / score) * 25;
      } else if (currentdifficulty === "medium") {
        score = (6 / score) * 50;
      } else if (currentdifficulty === "hard") {
        score = (8 / score) * 75;
      } else {
        score = (12 / score) * 100;
      }
      score = Math.floor(score);
      if (score > hiScore) {
        setHiScore(score);
      }
    }
  }, [turns, numMatched, cards, hiScore, currentdifficulty]);

  return (
    <div className="App">
      <h1>Match the Cards</h1>
      <div className="grid-container">
        <button onClick={startGame}>New Game</button>
        <div className="difficultySelector">
          <select onChange={(e) => handeDifficultyChange(e)}>
            {difficultyLevels.map((dif) => (
              <option key={dif.label} value={dif.label}>
                {dif.value}
              </option>
            ))}
          </select>
        </div>

        <div className={hint === true ? "congrats-hidden" : "hint"}>
          <button onClick={handleshowHint}>Hint (+5 turns)</button>
        </div>
        <div className="hiScore">
          <p> Top Score: {hiScore}</p>
        </div>
        <div className="turns">
          <p> Turns: {turns}</p>
        </div>
      </div>

      <div
        className={currentdifficulty === "" ? "startGame" : "congrats-hidden"}
      >
        <button className="startGame" onClick={startGame}>
          Start Game
        </button>
      </div>

      <div
        className={
          numMatched === cards.length / 2 && cards.length > 0
            ? "congrats"
            : "congrats-hidden"
        }
      >
        <Confetti width={width} height={height} />
        <p>Congratulations</p>
      </div>

      <div
        className={
          currentdifficulty === "expert" ? "card-grid-expert" : "card-grid"
        }
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handeChoice={handeChoice}
            flipped={
              card === choiceOne ||
              card === choiceTwo ||
              card.matched ||
              card.flipped
            }
            solved={card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
