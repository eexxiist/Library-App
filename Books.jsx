import React, { useEffect, useState } from "react";
import Styles from "./style.module.css";

const Books = () => {
    const [valueInput, setValueInput] = useState("");
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const getSearchBook = async () => {
        try {
            const searchBook = await fetch(
                `https://openlibrary.org/search.json?q=${valueInput}`
            );
            let book = await searchBook.json();
            setBooks(book.docs);
        } catch (error) {
            console.log("Ошибка");
        }
    };

    const openModal = (book) => {
        setIsOpenModal(true);
        setSelectedBook(book);
    };

    const handleOverlayClick = (e) => {
        console.log(e.currentTarget);
        if (e.target === e.currentTarget) {
            setIsOpenModal(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setIsOpenModal(false);
        }
    };

    const handleEnter = (event) => {
        if (event.key === "Enter") {
            getSearchBook();
        }
    };

    useEffect(() => {
        if (isOpenModal) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpenModal]);

    return (
        <div className={Styles.container}>
            <div className={Styles.search_container}>
                <input
                    className={Styles.input_search}
                    placeholder="Поиск"
                    type="text"
                    onChange={(e) => setValueInput(e.target.value)}
                    value={valueInput}
                    onKeyDown={handleEnter}
                />
                <button
                    className={Styles.button_search}
                    onClick={getSearchBook}
                >
                    Найти
                </button>
            </div>
            {books && (
                <div className={Styles.books_content}>
                    {books.map((book) => (
                        <div
                            className={Styles.book_content_item}
                            onClick={() => openModal(book)}
                        >
                            <div className={Styles.book_img_contain}>
                                <img
                                    className={Styles.book_img}
                                    src={`https://covers.openlibrary.org/b/id/${
                                        book.cover_i ? book.cover_i : 14625765
                                    }-L.jpg`}
                                    alt=""
                                />
                            </div>
                            <span className={Styles.book_title}>
                                Название: {book.title}
                            </span>
                            <span className={Styles.book_author}>
                                Автор: {book.author_name}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {isOpenModal && selectedBook && (
                <div
                    onClick={handleOverlayClick}
                    className={`${Styles.modal_window} ${
                        isOpenModal ? Styles.modal_window_active : ""
                    }`}
                >
                    <div id="modal_window" className={Styles.modal_content}>
                        <button
                            className={Styles.close_modal}
                            onClick={() => setIsOpenModal(false)}
                        >
                            ✖
                        </button>
                        <img
                            src={`https://covers.openlibrary.org/b/id/${
                                selectedBook.cover_i
                                    ? selectedBook.cover_i
                                    : 14625765
                            }-L.jpg`}
                            alt={selectedBook.title}
                            className={Styles.modal_img}
                        />
                        <div className={Styles.modal_text}>
                            <h2>{selectedBook.title}</h2>
                            <p>{selectedBook.author_name}</p>
                            <p>{selectedBook.first_publish_year}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;
