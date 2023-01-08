import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Header from "@/components/Header";
import { useState } from "react";
import ListCard from "@/components/ListCard";

type List = {
  name: string;
  id: string;
  board_id: string;
};

const Board = () => {
  const router = useRouter();
  const { id } = router.query;
  const currentBoard = api.board.getBoard.useQuery({ id: id as string });
  const addList = api.list.addList.useMutation();

  const [lists, setLists] = useState<List[]>([]);

  api.list.getLists.useQuery(
    { board_id: id as string },
    {
      onSuccess: (data) => {
        setLists(data);
      },
    }
  );

  return (
    <div className="flex flex-col gap-8 p-4">
      <Header />
      <div className="text-3xl text-white">{currentBoard?.data?.name}</div>
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
