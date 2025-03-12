const NothingFoundDesktop = () => {
  return <article className="hidden sm:flex">Nothing Found Desktop</article>;
};

const NothingFoundMobile = () => {
  return (
    <article className="w-full flex sm:hidden">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus,
      recusandae?
    </article>
  );
};

export default function NothingFound() {
  return (
    <>
      <NothingFoundMobile />
      <NothingFoundDesktop />
    </>
  );
}
