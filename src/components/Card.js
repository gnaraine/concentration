import "./Card.css";

export default function SingeCard({
  card,
  handeChoice,
  flipped,
  solved,
  disabled,
}) {
  const handleClick = () => {
    console.log(card);
    if (!disabled) handeChoice(card);
  };

  return (
    <div className="card">
      <div className={solved ? "solved" : ""}>
        <div className={flipped ? "flipped" : ""}>
          <img className="front" src={card.src} alt="card front" />
          <img
            onClick={handleClick}
            className="back"
            src="/img/cover.png"
            alt="card back"
          />
        </div>
      </div>
    </div>
  );
}
