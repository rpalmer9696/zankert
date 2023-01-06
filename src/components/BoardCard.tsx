type Props = {
  name: string;
};

const BoardCard = ({ name }: Props) => {
  return (
    <div className="cursor-pointer rounded bg-white/20 pt-6 pb-10 text-center text-2xl text-white hover:bg-white/40">
      {name}
    </div>
  );
};

export default BoardCard;
