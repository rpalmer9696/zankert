import type { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Header from "../components/Header";
import BoardCard from "../components/BoardCard";
import { useState } from "react";
import { api } from "@/utils/api";

type Board = {
  name: string;
  id: string;
  user_id: string;
};

const Boards: NextPage = () => {
  const { data: sessionData } = useSession();
  const [boards, setBoards] = useState<Board[]>([]);

  api.board.getBoards.useQuery(
    {
      email: sessionData?.user?.email as string,
    },
    {
      onSuccess: (data) => {
        setBoards(data);
      },
    }
  );

  const addBoard = api.board.addBoard.useMutation();

  return (
    <div className="flex min-h-screen flex-col gap-16 bg-gradient-to-b from-rose-800 to-pink-300 p-4">
      <Header />
      <div className="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {boards.map((item, id) => {
          return <BoardCard key={id} name={item.name} />;
        })}
        <button
          className="cursor-pointer rounded bg-white/20 py-16 text-2xl text-white hover:bg-white/40"
          onClick={() => {
            addBoard.mutate(
              {
                name: "New Board",
                email: sessionData?.user?.email as string,
              },
              {
                onSuccess: (data) => {
                  setBoards([...boards, data]);
                },
              }
            );
          }}
        >
          + Create New Board
        </button>
      </div>
    </div>
  );
};

export default Boards;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
