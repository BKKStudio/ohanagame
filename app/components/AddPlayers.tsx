import React from "react";

interface ManageModalType {
  event:string;
  status: boolean;
  namePlayer: string;
  handleModal: () => void;
  handleNameChange: (value: string) => void;
  addPlayer: (name: string) => void;
}

export default function AddPlayers({
  manageModalprops,
}: {
  manageModalprops: ManageModalType;
}) {
  if (!manageModalprops.status) return null;
  const { namePlayer, handleModal, handleNameChange, addPlayer } =
    manageModalprops;

  const handleAddPlayer = () => {
      if(namePlayer){
        addPlayer(namePlayer);
        alert(`${namePlayer} ได้เข้าร่วมเกมส์แล้ว`)
        handleModal();
        
      }else{
        alert(`กรุณากรอกชื่อผู้เล่น`)

      }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
        <button
          onClick={handleModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>
        <div className="flex flex-col gap-3">
          <p className="text-center text-3xl text-white">เพิ่มผู้เล่น</p>
          <input
            type="text"
            className="bg-gray-950 rounded-lg p-2 text-white"
            value={manageModalprops.namePlayer}
            onChange={(ev) =>
             handleNameChange(ev.target.value)
            }
          />
          <button
            className="bg-green-500 rounded-lg text-xl p-1"
            onClick={handleAddPlayer}
          >
            เพิ่มผู้เล่น
          </button>
        </div>
      </div>
    </div>
  );
}
