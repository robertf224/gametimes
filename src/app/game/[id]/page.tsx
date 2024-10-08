import { foundryClient } from "@/logic/foundryClient";
import { CollegeFootballGame, gamePredictionsForDemo } from "@gametimes/sdk";

export default async function GamePage({ params }: { params: { id: string } }) {
    const game = await foundryClient(CollegeFootballGame).fetchOne(params.id);
    const predictions = await foundryClient(gamePredictionsForDemo).executeFunction({
        collegeFootballGame: game,
    });
    return (
        <div>
            <h1>{game.title}</h1>
            <h6>Predictions</h6>
            <div>{predictions}</div>
        </div>
    );
}
