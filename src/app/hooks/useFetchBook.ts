"use client";
import { axiosClient } from "@/lib/axios-client";
import { Book, useBookStore } from "@/stores/useBookStore";
import { useBookUIStore } from "@/stores/useBookUIStore";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { FetchedBook } from "../../stores/useBookStore";

export default function useFetchBook() {
    const [bookId, setBookId] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingBookContent, setLoadingBookContent] = useState(false);

    const { setOpenedBook } = useBookUIStore();

    const { localBooks, addBook, getBook, isLoadedBook, loadBookContent } =
        useBookStore();

    const openBook = async (bookId: string) => {
        setLoadingBookContent(true);
        const book = getBook(bookId);

        if (isLoadedBook(book)) {
            setOpenedBook(book);
        } else {
            const bookContent = await fetchBookContent(bookId);
            const loadedBook = loadBookContent(bookId, bookContent);
            setOpenedBook(loadedBook);
        }
        setLoadingBookContent(false);
    };

    const fetchBookMetadata = async () => {
        setLoading(true);

        try {
            let book: Book | FetchedBook | undefined = localBooks.find(
                (book) => book.id === bookId
            );

            if (book) {
                toast.info("Book already in library");
                // let loadedBook: LoadedBook = await fetchBookContent(bookId);
                await openBook(bookId);
                return;
            }

            const response = await fetch(`/api/book/${bookId}/metadata`);

            if (response.status === 404) {
                toast.error("Book could not be found");
                return;
            }

            book = (await response.json()) as FetchedBook;

            if (book) {
                toast.success("Book successfully fetched");

                addBook(book);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchBookContent = async (bookId: string): Promise<string> => {
        try {
            const bookContent = await axiosClient
                .get("/api/book/" + bookId)
                .then((response) => response.data);
            return bookContent;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log({
                    error: {
                        cause: error.cause,
                        code: error.code,
                    },
                });
            }

            throw new Error("Error: could not load book");
        }
    };

    const onBookIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookId(e.target.value);
    };

    return {
        bookId,
        loading,
        loadingBookContent,
        openBook,
        onBookIdChange,
        fetchBookMetadata,
        fetchBookContent,
    };
}