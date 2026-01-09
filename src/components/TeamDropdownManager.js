import {useState, useEffect, useRef} from "react";
import '../App.css';
import {update} from "../services/firestore";
import Icon from 'react-crud-icons';
import "react-crud-icons/dist/css/react-crud-icons.css";
import {toast} from "react-toastify";

export default function TeamDropdownManager({player}) {
    const [teams, setTeams] = useState(player.teams);
    const [selectedTeam, setSelectedTeam] = useState("");

    // Modal state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [tempValue, setTempValue] = useState("");

    const updatePlayer = (player, action) => {
        update(player)
            .then(() => {
                switch (action) {
                    case 'create' :
                        toast.success('Club werd toegevoegd');
                        break;
                    case 'update' :
                        toast.success('Club werd gewijzigd');
                        break;
                    case 'delete' :
                        toast.success('Club werd verwijderd');
                        break;
                    default:
                        break;
                }
            })
    }

    // Keep selection synced when teams change
    useEffect(() => {
        if (teams.length > 0) {
            setSelectedTeam(teams[0]);
        } else {
            setSelectedTeam("");
        }
    }, [teams]);

    // CREATE
    const handleAdd = () => {
        if (!tempValue.trim()) return;

        player.teams=[...player.teams, tempValue]
        setTeams(player.teams)
        updatePlayer(player, 'create');

        setTempValue("");
        setIsAddOpen(false);
    };

    // UPDATE
    const handleUpdate = () => {
        if (!tempValue.trim()) return;

        player.teams=player.teams.map(t =>
            t === selectedTeam ? tempValue : t
        )

       /* const updatedTeams = player.teams.map(t =>
            t === selectedTeam ? tempValue : t
        );*/

        setTeams(player.teams);
        updatePlayer(player, 'update')

        setSelectedTeam(tempValue); // keep selection on updated item
        setTempValue("");
        setIsEditOpen(false);
    };

    // DELETE (after confirmation)
    const confirmDelete = () => {
        player.teams=player.teams.filter(t => t !== selectedTeam)
        setTeams(player.teams);
        updatePlayer(player, 'delete')

        setIsDeleteOpen(false);
    };

    return (
        <div className="team-manager">
            <p className="player-teams">Clubs</p>

            {/* READ */}
            <select className="team-select"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    style={{width: "100%", padding: 8}}
                    size={1}
            >
                {teams.map(team => (
                    <option key={team} value={team}>
                        {team}
                    </option>
                ))}
            </select>

            {/* ACTION BUTTONS */}
            <div className="action-buttons">
                <Icon
                    name="add"
                    tooltip="Toevoegen"
                    theme="light"
                    size="medium"
                    onClick={() => {
                        setTempValue("");
                        setIsAddOpen(true);
                    }}
                />
                <Icon
                    name="edit"
                    tooltip="Wijzigen"
                    theme="light"
                    size="medium"
                    onClick={() => {
                        setTempValue(selectedTeam);
                        setIsEditOpen(true);
                    }}
                    disabled={!selectedTeam}
                />
                <Icon
                    name="delete"
                    tooltip="Verwijderen"
                    theme="light"
                    size="medium"
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={!selectedTeam}
                />
            </div>

            {/* ADD TEAM MODAL */}
            {isAddOpen && (
                <Modal onClose={() => setIsAddOpen(false)}>
                    <h3>Club toevoegen</h3>
                    <AutoFocusInput
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder="naam club"
                    />
                    {<button onClick={handleAdd}>Save</button>}
                </Modal>
            )}

            {/* EDIT TEAM MODAL */}
            {isEditOpen && (
                <Modal onClose={() => setIsEditOpen(false)}>
                    <h3>Club wijzigen</h3>
                    <AutoFocusInput
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                    />
                    <button onClick={handleUpdate}>Save</button>
                </Modal>
            )}

            {/* DELETE TEAM CONFIRMATION */}
            {isDeleteOpen && (
                <Modal onClose={() => setIsDeleteOpen(false)}>
                    <h3>Club verwijderen</h3>
                    <p>
                        <strong>{selectedTeam} </strong>verwijderen?
                    </p>
                    <button className="modal-delete" onClick={confirmDelete}>
                        Ja, verwijder
                    </button>
                </Modal>
            )}
        </div>
    );
}

/* Reusable modal */
function Modal({children, onClose}) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                {children}
                <button className="modal-close" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

/* Input that autofocuses when mounted */
function AutoFocusInput(props) {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return <input ref={inputRef} {...props} />;
}
