import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocalhostApi } from "../../API/const";
import { Container, ListSearch, CardSearch, Img, Title } from "./Search";
import { Link } from "react-router-dom";

export default function Index() {
  const [moive, setMovie] = useState([]);
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    let isActive = false;
    if (!isActive) {
      axios.get(LocalhostApi + "search").then((data) => {
        setMovie(data.data.results);
      });
    }
    return () => {
      (isActive = true), setMovie();
    };
  }, []);
  const [name, setName] = useState("");
  const [searchMovieFound, setsearchMovieFound] = useState();

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = moive.filter((element) => {
        return element.title.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setsearchMovieFound(results);
    } else {
      setsearchMovieFound();
    }
    setName(keyword);
  };
  const reload = () => {
    window.location.reload();
  };
  return (
    <Container>
      <input
        type="search"
        value={name}
        onChange={filter}
        className="input"
        placeholder="Tìm kiếm"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      {focus ?
        <ListSearch>
          {searchMovieFound && searchMovieFound.length > 0
            ? searchMovieFound.slice(0, 20).map((element) => (
              <CardSearch key={element._id} onClick={reload}>
                <Img alt="no img" src={element.poster_path} />
                <Link
                  to={{
                    pathname: `/detail/${element.id}`,
                    state: element.id,
                  }}
                >
                  <Title>{element.title}</Title>
                </Link>
              </CardSearch>
            ))
            : <p>Không tìm thấy phim  </p>}
        </ListSearch>
        : null}
    </Container>
  );
}
