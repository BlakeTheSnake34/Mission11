import { useEffect, useState } from "react";

type Book = {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  pageCount: number;
  price: number;
};

type ApiResponse = {
  books: Book[];
  totalNumBooks: number;
};

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalNumBooks, setTotalNumBooks] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5002/api/books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`)
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        setBooks(data.books);
        setTotalNumBooks(data.totalNumBooks);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [page, pageSize, sortOrder]);

  const totalPages = Math.ceil(totalNumBooks / pageSize);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Online Bookstore</h1>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Results per page</label>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Sort by title</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </select>
        </div>
      </div>

      <div className="row">
        {books.map((book) => (
          <div className="col-md-6 mb-4" key={book.bookId}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                <p className="card-text"><strong>Publisher:</strong> {book.publisher}</p>
                <p className="card-text"><strong>ISBN:</strong> {book.isbn}</p>
                <p className="card-text"><strong>Category:</strong> {book.classification}</p>
                <p className="card-text"><strong>Pages:</strong> {book.pageCount}</p>
                <p className="card-text"><strong>Price:</strong> ${book.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          className="btn btn-primary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          className="btn btn-primary"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookList;