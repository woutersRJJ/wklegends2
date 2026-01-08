import {useEffect, useState} from "react";
import PlayerCard from "./PlayerCard";
import {getCollection} from "../services/firestore";

export default function PlayerGrid() {

    const [players,setPlayers]=useState([])

    useEffect(() => {
        loadPlayers().then(()=>console.log('players ingelezen'));
    }, []);

    async function loadPlayers() {
        const players = await getCollection('legends');
        setPlayers(players);
    }

    return (
        <div className="player-grid">
            {players.map((p) => (
                <PlayerCard key={p.id} player={p} />
            ))}
        </div>
    );
}
