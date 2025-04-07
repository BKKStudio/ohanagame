"use client";
import Image from "next/image";
import AddPlayers from "./components/AddPlayers";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddGang from "./components/AddGang";

interface ManageModalType {
  event: string;
  status: boolean;
  namePlayer: string;
  handleModal: () => void;
  handleNameChange: (value: string) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: number) => void;
}

interface ManageGangModalType {
  status: boolean;
  allPlayers: any;
  selectedPlayed: string;
  handleGangModal: () => void;
  addGang: (name: string) => void;
}

interface PlayerType {
  id: number;
  name: string;
}

type CardType = {
  id: number;
  name: string;
  line: string;
};

export default function Home() {
  let count = 0;
  const [manageModal, setManageModal] = useState<ManageModalType>({
    event: "",
    status: false,
    namePlayer: "",
    handleModal: () =>
      setManageModal((prev) => ({ ...prev, status: !prev.status })),
    handleNameChange: (name: string) =>
      setManageModal((prev) => ({ ...prev, namePlayer: name })),
    addPlayer: (name: string) => {
      const newPlayer: PlayerType = {
        id: allPlayers.length != 0 ? count++ : 0,
        name,
      };
      setAllPlayers((prev) => [...prev, newPlayer]);
      setManageModal((prev) => ({ ...prev, namePlayer: "" }));
    },
    removePlayer: (id: number) => {
      console.log(id);

      setAllPlayers((prev) => prev.filter((player) => player.id !== id));
    },
  });
  const deckTemplate: CardType[] = [];

  let id = 1;

  // เพิ่มไพ่พิเศษ: King, Queen, Jack (4 ใบต่อชื่อ)
  ["King", "Queen", "Jack"].forEach((face) => {
    for (let i = 0; i < 4; i++) {
      deckTemplate.push({ id: id++, name: face, line: `${face}${i + 1}.png` });
    }
  });

  // เพิ่มไพ่ A ถึง 3 (4 ใบต่อชื่อ)
  ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"].forEach((num) => {
    for (let i = 0; i < 4; i++) {
      deckTemplate.push({ id: id++, name: num, line: `${num}${i + 1}.png` });
    }
  });

  const [allPlayers, setAllPlayers] = useState<PlayerType[]>([ ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  // ฟังก์ชันเปลี่ยนผู้เล่น (วนรอบ)
  const goToNextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % allPlayers.length);
  };

  // หาค่า index ของผู้เล่นก่อนหน้า และผู้เล่นถัดไป
  const prevPlayerIndex =
    (currentPlayerIndex - 1 + allPlayers.length) % allPlayers.length;
  const nextPlayerIndex = (currentPlayerIndex + 1) % allPlayers.length;

  const [startGame, setStartGame] = useState<Boolean>(false);

  //Start Card
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playedCards, setPlayedCards] = useState<
    { player: string; card: CardType }[]
  >([]);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [kingHolder, setKingHolder] = useState<string | null>(null);
  const [queenHolder, setQueenHolder] = useState<string | null>(null);
  const [jackHolder, setJackHolder] = useState<string | null>(null);
  const [gangOfDrinkers, setGangOfDrinkers] = useState<string[]>([]);
  const [allPlayersForModal , setAllPlayersForModel] = useState<PlayerType[]>(allPlayers)
  const [manageGangModal, setManageGangModal] = useState<ManageGangModalType>({
    status: false,
    allPlayers: allPlayersForModal.filter((player) => player.name != allPlayers[currentPlayerIndex].name),
    selectedPlayed: "",
    handleGangModal: () =>{
      setManageGangModal((prev) => ({ ...prev, status: !prev.status }))
      let filterdPlayer = allPlayers.filter((player) => player.name !=  allPlayers[currentPlayerIndex].name)
      setAllPlayersForModel(filterdPlayer)
      console.log(allPlayersForModal);
      
    },
    addGang: (name) => {
      if (gangOfDrinkers.length === 0) {
        gangOfDrinkers.push(allPlayers[currentPlayerIndex].name);
        gangOfDrinkers.push(name);
      } else {
        gangOfDrinkers.push(name);
      }

      // อัพเดต allPlayers หลังจากการเพิ่มสมาชิก
      setManageGangModal((prev) => ({
        ...prev,
        allPlayers: allPlayers.filter(
          (player) =>
            !gangOfDrinkers.some((gangPlayer) => gangPlayer === player.name)
        ),
      }));

      // ปิด modal หลังจากเพิ่มสมาชิก
      setManageGangModal((prev) => ({ ...prev, status: false }));
    }
  });

  useEffect(() => {
    if (startGame) {
      const shuffled = [...deckTemplate].sort(() => 0.5 - Math.random());
      setDeck(shuffled);
    }
  }, [startGame]);

  useEffect(() => {
    if (!currentCard) return;

    const currentPlayer = allPlayers[prevPlayerIndex];

    switch (currentCard.name) {
      case "Queen":
        setQueenHolder(currentPlayer.name);
        Swal.fire({
          title: `Queen หรือ แหม่ม เพื่อนไม่ครบ`,
          text: `ห้ามพูดกับ! ${currentPlayer.name} 😶`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "King":
        setKingHolder(currentPlayer.name);
        Swal.fire({
          title: `King ยืนทำท่าต่างๆ`,
          text: `${currentPlayer.name} ต้องเต้นจนกว่าจะมีคนได้ King อีกครั้ง! 💃`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "Jack":
        setJackHolder(currentPlayer.name);
        Swal.fire({
          title: `Jack จับหน้า`,
          text: `${currentPlayer.name} ต้องจับหน้า! ใครช้าโดนลงโทษ! 😆`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "A":
        Swal.fire({
          title: `A ดื่มคนเดียว 🥴`,
          text: `ดื่มเหล้าคนเดียว เฮ้อไม่สนุกเลย 😑`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "2":
        Swal.fire({
          title: `Duo หาเพื่อนดื่มด้วย`,
          text: `หาเพื่อนดื่มด้วย 1 คน ใครก็ได้ในวง`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "3":
        Swal.fire({
          title: `Triple หาเพื่อนดื่มด้วย 2 คน`,
          text: `หาเพื่อนดื่มด้วย 2 คน ใครก็ได้ในวง`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "4":
        Swal.fire({
          title: `4 เพื่อนฝั่งซ้ายโดน`,
          text: `เพื่อนฝั่งซ้ายดื่มเหล้าหมดแก้ว`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "5":
        Swal.fire({
          title: `5 เฮฮา`,
          text: `หมดแก้วรอบวง`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "6":
        Swal.fire({
          title: `6 เพื่อนฝั่งขวาโดน`,
          text: `เพื่อนฝั่งขวาดื่มเหล้าหมดแก้`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "7":
        let filterdPlayer = allPlayers.filter((player) => player.name != currentPlayer.name )
        setAllPlayersForModel(filterdPlayer)
        manageGangModal.handleGangModal();
        break;
      case "8":
        Swal.fire({
          title: `8 พักผ่อนตามอัธยาศัย`,
          text: `ผู้เล่นพักผ่อนได้`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "9":
        Swal.fire({
          title: `9 มินิเกมส์`,
          text: `สุ่มเกมส์ให้เล่น`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      case "10":
        Swal.fire({
          title: `10 ทาแป้ง`,
          text: `ผู้เล่นที่จับได้จะต้องทาแป้งง`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        break;
      default:
        break;
    }
  }, [currentCard]);

  const handleNextCard = () => {
    if (deck.length === 0) {
      alert("ไพ่หมดแล้ว!");
      return;
    }
    const nextCard = deck[0];
    const newDeck = deck.slice(1);
    const player = allPlayers[currentPlayerIndex].name;

    setPlayedCards([...playedCards, { player, card: nextCard }]);
    setCurrentCard(nextCard);
    setDeck(newDeck);
    goToNextPlayer();
  };

  const restartGame = () => {
    setCurrentCard(null);
    setKingHolder(null);
    setJackHolder(null);
    setQueenHolder(null);
    setDeck([]);
    setPlayedCards([]);
    const shuffled = [...deckTemplate].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    alert("Restart เกมส์เรียบร้อย");
  };

  if (startGame) {
    return (
      <div>
        <AddGang manageGangModalprops={{ ...manageGangModal }} />
        <div className="w-full h-screen flex justify-center items-center ">
          <main className="w-full h-screen flex justify-center items-center ">
            <div className="w-full max-w-6xl px-2 h-full  flex flex-col items-center gap-4 max-sm:gap-2">
              <div className="max-w-3xl w-full  bg-gray-800 h-24 items-center rounded-lg mt-4 grid grid-rows-2">
                <div className="grid grid-cols-3 text-center text-3xl">
                  <span className="font-bold">King</span>
                  <span className=" font-bold">Queen</span>
                  <span className=" font-bold">Jack</span>
                </div>
                <div className="grid grid-cols-3 text-center font-light text-3xl">
                  <span className="text-xl font-bold">
                    {!kingHolder ? "-" : kingHolder}
                  </span>
                  <span className="text-xl font-bold">
                    {!queenHolder ? "-" : queenHolder}
                  </span>
                  <span className="text-xl font-bold">
                    {!jackHolder ? "-" : jackHolder}
                  </span>
                </div>
              </div>
              <div className="max-w-3xl w-full bg-gray-800 p-4 h-max rounded-lg ">
                <div className="grid grid-cols-3  text-center text-3xl max-lg:text-base">
                  <span className="">ผู้เล่นก่อนหน้า</span>
                  <span className="text-green-400 font-bold">
                    ผู้เล่นปัจจุบัน
                  </span>
                  <span>ผู้เล่นต่อไป</span>
                </div>
                <div className="grid grid-cols-3 justify-center items-center w-full  text-center text-3xl">
                  <span className=" font-light">
                    {allPlayers[prevPlayerIndex].name}
                  </span>
                  <span className="text-green-400 font-bold">
                    {allPlayers[currentPlayerIndex].name}
                  </span>
                  <span className=" font-light">
                    {allPlayers[nextPlayerIndex].name}
                  </span>
                </div>
              </div>
              <div className="max-w-3xl w-full bg-gray-800 grid grid-cols-2 max-sm:grid-cols-1  gap-4 p-4 rounded-lg  ">
                <div className="grid gap-3 ">
                  <div className="w-full bg-gray-600 h-[250px] p-3">
                    <p className="text-xl font-bold text-center">
                      แกงค์นักดื่ม
                    </p>
                    <ul className="list-disc ml-4">
                      {gangOfDrinkers.map((player, idx) => (
                        <li key={idx}>{player}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-white  bg-gray-600 w-full h-[250px] max-sm:h-36 overflow-y-auto  p-3 ">
                    <p className="text-xl font-bold text-center">ประวัติไพ่</p>
                    <ul className="list-disc ml-4">
                      {playedCards.map((entry, idx) => (
                        <li key={idx}>
                          {entry.player} ได้ไพ่ {entry.card.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-center items-center">
                  <div className="w-full grid  gap-4">
                    <button
                      onClick={handleNextCard}
                      className="cursor-pointer text-white text-xl bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"
                    >
                      Next Card
                    </button>
                  </div>
                  <div className="bg-white w-72 max-sm:w-2/4 h-full rounded-lg flex flex-col items-center justify-center text-black text-2xl font-bold">
                    {currentCard ? (
                      <Image
                        src={`/Cards/${currentCard.line}`}
                        alt=""
                        className="rounded-lg "
                        width={285}
                        height={285}
                      ></Image>
                    ) : (
                      <img
                        src="/None/None.png"
                        alt=""
                        className="rounded-lg"
                      ></img>
                    )}
                  </div>
                  <div className="text-white text-xl mt-4">
                    ไพ่ที่เหลือ: {deck.length} ใบ
                  </div>
                </div>
              </div>
              <div className="max-w-3xl w-full bg-gray-800   gap-4 p-4 rounded-lg  ">
                <button
                  className="w-full text-center bg-green-500 p-2 rounded-lg font-bold cursor-pointer"
                  onClick={restartGame}
                >
                  Restart Game
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AddPlayers manageModalprops={{ ...manageModal }} />
      <main className="w-full h-screen flex justify-center items-center ">
        <div className="w-full max-w-6xl  flex flex-col gap-4">
          <p className="text-center text-6xl">สมาชิกในเกมส์</p>
          <div className="w-full flex justify-center">
            <div className="w-96 h-96 bg-gray-900 rounded-2xl">
              <ul className="flex flex-col p-3 gap-2 overflow-y-auto">
                {allPlayers.map((player) => (
                  <li
                    key={player.id}
                    className="w-full bg-gray-500 flex justify-between p-2 rounded-lg "
                  >
                    {player.name}
                    <div className="grid gap-2 cursor-pointer">
                      <button
                        className="bg-red-500 rounded-lg p-1 cursor-pointer"
                        onClick={() => manageModal.removePlayer(player.id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="w-96 h-12 gap-2  grid grid-cols-2 ">
              <button
                className="bg-amber-400 rounded-2xl font-bold"
                onClick={manageModal.handleModal}
              >
                เพิ่มสมาชิก
              </button>
              <button
                className={`${
                  allPlayers.length !== 0 ? "bg-green-500" : "bg-gray-500"
                }  rounded-2xl font-bold cursor-pointer`}
                onClick={() => setStartGame(true)}
                disabled={allPlayers.length === 0 ? true : false}
              >
                เริ่มเกม
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
