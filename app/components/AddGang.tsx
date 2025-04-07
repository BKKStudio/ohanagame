import React from "react";
interface PlayerType {
  id: number;
  name: string;
}
interface ManageGangModalType {
  status: boolean;
  allPlayers:PlayerType[];
  selectedPlayed: string;
  handleGangModal: () => void;
  addGang: (name: string) => void;
}

export default function AddGang({
  manageGangModalprops,
}: {
  manageGangModalprops: ManageGangModalType;
}) {
  if (!manageGangModalprops.status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm animate-fadeIn ">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn max-sm:mx-4">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={manageGangModalprops.handleGangModal}
        >
          ✕
        </button>
        <div className="flex flex-col gap-3">
          <p className="text-center text-3xl text-white">เพิ่มแกงค์นักดื่ม</p>
          <ul className="flex flex-wrap gap-3 ml-4">
            {manageGangModalprops.allPlayers.length !== 0 ? (
              manageGangModalprops.allPlayers.map(
                (player: any, idx: number) => (
                  <li
                    key={idx}
                    className="py-2 px-4 rounded-lg bg-red-700 cursor-pointer"
                    onClick={() => manageGangModalprops.addGang(player.name)}
                  >
                    {player.name}
                  </li>
                )
              )
            ) : (
              <li
                className="py-2 px-4 rounded-lg bg-red-700 cursor-pointer w-full text-center"
                onClick={() => manageGangModalprops.handleGangModal()}
              >
                ผู้เล่นทุกคนอยู่ในแกงค์แล้ว
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
