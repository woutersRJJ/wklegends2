import TeamDropdownManager from "./TeamDropdownManager";

export default function PlayerCard({player}) {

    return (
        <div className="player-card">
            <h2 className="player-name">{player.name}</h2>
            <p className="player-country">{player.country}</p>
            <p className="player-bio">{player.bio ?  player.bio : 'Nog geen bio'}</p>
            <TeamDropdownManager player={player}/>
        </div>
    );
}
