import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Header from "../components/Header";

const Boards: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-800 to-pink-300 p-4">
      <Header />
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
