"use client";

import { useBookStore } from "@/stores/useBookStore";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BookListItem from "./BookListItem";

export default function BookList() {
  const { localBooks, removeBook, _hasHydrated } = useBookStore();

  if (!_hasHydrated) return <>loading</>;

  return (
    <div className="z-10 min-h-[300px] divide-y divide-solid rounded-t-lg md:px-10 md:py-8">
      <div className="flex flex-row items-center justify-between pb-2">
        <div className="text-xl font-bold">Local Library</div>
        <div>{localBooks.length} book(s) found</div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden whitespace-nowrap md:table-cell lg:table-cell">ID</TableHead>
            <TableHead className="min-w-[120px] md:min-w-[150px] lg:w-[200px]">Title</TableHead>
            <TableHead className="min-w-[120px] md:min-w-[150px] lg:w-[200px]">Author</TableHead>
            <TableHead className="hidden whitespace-nowrap md:table-cell lg:table-cell">Saved Date</TableHead>
            <TableHead className="hidden whitespace-nowrap md:table-cell lg:table-cell">Language</TableHead>
            <TableHead className="hidden whitespace-nowrap text-right md:table-cell lg:table-cell"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!_hasHydrated ? (
            <>loading</>
          ) : (
            localBooks.map((book) => <BookListItem key={book.id} book={book} onDelete={removeBook} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
