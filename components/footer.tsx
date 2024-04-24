import Link from 'next/link';
import CustomLink from './custom-link';
import packageJSON from 'next-auth/package.json';

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 px-4 my-4 mx-0 w-full text-sm sm:flex-row sm:justify-between sm:items-center sm:px-6 sm:my-12 sm:mx-auto sm:max-w-3xl sm:h-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/">Valentine</Link>
        <Link href="/">Dissertation</Link>
        <CustomLink href="/">Work</CustomLink>
      </div>
    </footer>
  );
}
