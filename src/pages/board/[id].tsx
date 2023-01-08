import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Header from "@/components/Header";
import { useState } from "react";
import ListCard from "@/components/ListCard";
import Link from "next/link";

type List = {
  name: string;
  id: string;
  board_id: string;
};

const Board = () => {
  const router = useRouter();
  const { id } = router.query;
  const [boardName, setBoardName] = useState("");
  api.board.getBoard.useQuery(
    { id: id as string },
    {
      onSuccess: (data) => {
        if (data && data.name) {
          setBoardName(data.name);
        }
      },
    }
  );
  const addList = api.list.addList.useMutation();

  const [lists, setLists] = useState<List[]>([]);

  const updateBoard = api.board.updateBoard.useMutation();

  api.list.getLists.useQuery(
    { board_id: id as string },
    {
      onSuccess: (data) => {
        setLists(data);
      },
    }
  );

  return (
    <div className="flex flex-col p-4">
      <Header />
      <div className="p-2"></div>
      <Link
        href="/boards"
        className="w-min whitespace-nowrap rounded bg-white/20 p-2 text-xl text-white hover:bg-white/30"
      >
        {"< Back to Boards"}
      </Link>
      <div className="p-2"></div>
      <input
        className="w-full text-ellipsis whitespace-nowrap rounded bg-transparent p-2 text-3xl text-white hover:bg-white/30"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        onKeyDown={(e) => {
          if (e.code !== "Enter") return;
          (e.target as HTMLInputElement).blur();
          updateBoard.mutate({
            id: id as string,
            name: boardName,
          });
        }}
      />
      <div className="p-2"></div>
      <div className="flex flex-row overflow-x-auto pb-4">
        {lists.map((item, id) => {
          return <ListCard key={id} name={item.name} id={item.id} />;
        })}
        <button
          className="h-24 min-w-[20rem] cursor-pointer rounded bg-white/20 py-8 text-2xl text-white hover:bg-white/40"
          onClick={() => {
            addList.mutate(
              {
                name: "New List",
                board_id: id as string,
              },
              {
                onSuccess: (data) => {
                  setLists([...lists, data]);
                },
              }
            );
          }}
        >
          + Create New List
        </button>
      </div>
    </div>
  );
};

export default Board;

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
