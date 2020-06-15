import React, { Component } from "react";
import { Link } from "react-router-dom";

// Import Components
import Table from "./common/table";
import Like from "./common/like";

export default class moviesTable extends Component {
  headers = [
    {
      name: "title",
      label: "Title",
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { name: "genre.name", label: "Genre" },
    { name: "numberInStock", label: "Stock" },
    { name: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (movie) => (
        <Like liked={movie.liked} onClick={() => this.props.onLiked(movie)} />
      ),
    },
    {
      key: "delete",
      content: (movie) => (
        <button
          type="submit"
          className="btn btn-danger"
          onClick={() => this.props.onDelete(movie)}
        >
          <i className="fas fa-trash pr-2"></i>
          Delete
        </button>
      ),
    },
  ];

  render() {
    const { itemsCount, movies, sortedColumn, onSort } = this.props;

    return (
      <>
        <Link className="btn btn-primary" to="/movies/new">
          <i className="fas fa-plus pr-2"></i>New
        </Link>
        <p className="text-center">
          Showing {itemsCount} movies in the database.
        </p>
        <Table
          movies={movies}
          headers={this.headers}
          sortedColumn={sortedColumn}
          onSort={onSort}
        />
      </>
    );
  }
}
