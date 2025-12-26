import Spinner from './Spinner';

type LoaderProps = {
  text: string;
};

export default function Loader({ text }: LoaderProps) {
  return (
    <>
      <Spinner />
      {text}
    </>
  );
}
