import {useState, useEffect, useRef} from "react";
import '../App.css';
import {update} from "../services/firestore";
import Icon from 'react-crud-icons';
import "react-crud-icons/dist/css/react-crud-icons.css";
import {toast} from "react-toastify";

export default function TeamDropdownManager({player}) {
    const [teams, setTeams] = useState(player.teams);
    const [selectedTeam, setSelectedTeam] = useState(0);

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
    /*useEffect(() => {
        if (teams.length > 0) {
            setSelectedTeam(teams[setSelectedTeam]);
        } else {
            setSelectedTeam(0);
        }
    }, [teams]);*/

    // CREATE
    const handleAdd = () => {
        if (!tempValue.trim()) return;

        player.teams = [...player.teams, tempValue].sort((a,b)=>a.localeCompare(b))
        setTeams(player.teams)
        setSelectedTeam(player.teams.findIndex(t=>t === tempValue)); // select new team in dropdown
        updatePlayer(player, 'create');

        setTempValue("");
        setIsAddOpen(false);
    };

    // UPDATE
    const handleUpdate = () => {
        if (!tempValue.trim()) return;

        player.teams = player.teams.map((t, index) =>
            index === selectedTeam ? tempValue : t
        )

        setTeams(player.teams);
        updatePlayer(player, 'update')

        setSelectedTeam(selectedTeam); // keep selection on updated item
        setTempValue("");
        setIsEditOpen(false);
    };

    // DELETE (after confirmation)
    const confirmDelete = () => {
        //if list becomes empty, no selection
        //if not item at end of list, select next
        //if item at end of list, select previous

        //j is index of item that should be selected after deletion
        let j=0
        if (teams.length>1){
            let i=teams.findIndex(t=>t === selectedTeam)
            if (teams.length-i===1){
                j=i-1
            }
            else{
                j=i+1
            }
        }
        setSelectedTeam(j)
        
        player.teams = player.teams.filter(t => t !== teams[selectedTeam])
        setTeams(player.teams);
        updatePlayer(player, 'delete')

        setIsDeleteOpen(false);
    };

    return (
        <div className="team-manager">
            <p className="player-teams">Clubs</p>

            {/* READ */}
            <select className="team-select"
                    value={teams[selectedTeam]}
                    onChange={(e) => {
                        setSelectedTeam(e.target.selectedIndex);
                    }}
                    size={1}
            >
                {teams.sort((a, b) => a.localeCompare(b)).map((team, index) => (
                    <option key={index} value={team}>
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
                        setTempValue(teams[selectedTeam]);
                        setIsEditOpen(true);
                    }}
                    disabled={!teams.length>0}
                />
                <Icon
                    name="delete"
                    tooltip="Verwijderen"
                    theme="light"
                    size="medium"
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={!teams.length>0}
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
                        <strong>{teams[selectedTeam]} </strong>verwijderen?
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
