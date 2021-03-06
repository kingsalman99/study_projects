import React, { Component } from 'react';

// Import Data
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';

// Import functions
import { paginate } from '../utils/paginate';
import { sorted } from '../utils/sorted';

// Import Components
import Pagination from './common/pagination';
import ListGenres from './common/listGenres';
import MoviesTable from './moviesTable';
import SearchBox from './common/searchBox';

export default class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortedColumn: { col: 'title', order: 'asc' },
    selectedGenre: { _id: '', name: 'All Movies' },
    searchQuery: '',
  };

  componentDidMount() {
    const genres = [{ _id: '', name: 'All Movies' }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  genresSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: '', currentPage: 1 });
  };

  changePage = (page) => {
    this.setState({ currentPage: page });
  };

  deleteItem = (movie) => {
    let movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
  };

  likedItem = (movie) => {
    let movies = [...this.state.movies];
    let index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  sortedItems = (sortedColumn) => {
    this.setState({ sortedColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedGenre: null,
      currentPage: 1,
    });
  };

  getPagedData = () => {
    let {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      searchQuery,
      sortedColumn,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery) {
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedGenre && selectedGenre._id) {
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);
    }

    let sortedMovies = sorted(filtered, sortedColumn.col, sortedColumn.order);
    let movies = paginate(sortedMovies, currentPage, pageSize);

    return { totalCount: filtered.length, movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      genres,
      sortedColumn,
      searchQuery,
    } = this.state;

    if (count === 0) return <p>There are no movies in the database.</p>;
    const { totalCount, movies } = this.getPagedData();

    return (
      <>
        <div className="row m-4">
          <div className="col-3">
            <ListGenres
              items={genres}
              selectedItem={this.state.selectedGenre}
              onItemSelect={this.genresSelect}
            />
          </div>
          <div className="col">
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <MoviesTable
              itemsCount={totalCount}
              movies={movies}
              sortedColumn={sortedColumn}
              onLiked={this.likedItem}
              onDelete={this.deleteItem}
              onSort={this.sortedItems}
            />
            <Pagination
              itemsCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onChangePage={this.changePage}
            />
          </div>
        </div>
      </>
    );
  }
}
