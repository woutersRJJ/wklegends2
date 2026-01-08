import "./App.css";
import PlayerGrid from "./components/PlayerGrid";
import "./services/firestore"
import {ToastContainer} from "react-toastify";

export default function App() {

    return (
        <div className="app">
            <ToastContainer/>
            <h1>FIFA legendes</h1>
            <PlayerGrid />
        </div>
    );
}
