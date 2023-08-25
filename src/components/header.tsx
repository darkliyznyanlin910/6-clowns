import Head from "next/head";

type Props = {
  title?: string;
  description?: string;
};
export const Header = ({ title, description }: Props) => {
  return (
    <Head>
      <title>{title ?? "Jiak!"}</title>
      <meta name="description" content={description ?? ""} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
