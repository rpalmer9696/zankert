import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

const Boards: NextPage = () => {
  return <div>Test</div>;
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
