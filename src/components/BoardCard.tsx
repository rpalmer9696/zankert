import Link from "next/link";

type Props = {
  name: string;
  board_id: string;
};

const BoardCard = ({ name, board_id }: Props) => {
  return (
    <Link
      className="min-w-[16rem] cursor-pointer rounded bg-white/20 pt-6 pb-10 text-center text-2xl text-white hover:bg-white/40"
      href={`/board/${board_id}`}
    >
      {name}
    </Link>
  );
};

export default BoardCard;
