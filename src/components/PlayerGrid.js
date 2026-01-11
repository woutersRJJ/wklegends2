import {useEffect, useState} from "react";
import PlayerCard from "./PlayerCard";
import {getCollection} from "../services/firestore";
import {ToastContainer} from "react-toastify";

export default function PlayerGrid() {

    const [players,setPlayers]=useState([])

    useEffect(() => {
        loadPlayers()
       /* loadPlayers().then(()=>
            console.log('players read'));*/
    }, []);

    async function loadPlayers() {
        const players = await getCollection('legends');
        setPlayers(players);
    }

    return (
        <div className="player-grid">
            <ToastContainer/>
            {players.map((p) => (
                <PlayerCard key={p.id} player={p} />
            ))}
        </div>
    );
}
