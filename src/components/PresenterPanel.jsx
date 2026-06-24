import Scoreboard from "./Scoreboard";
import ScoreHistory from "./ScoreHistory";

export default function OperatorPanel({ room, averageScore }) {
  return (
    <>
      <Scoreboard room={room} averageScore={averageScore} />
      <ScoreHistory room={room} />
    </>
  );
}
