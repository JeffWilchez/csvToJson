import React, { useEffect, useState } from "react";
import { searchData } from "../services/search";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";

const DEBOUNCE_TIME = 500;

export const Search = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") ?? "";
  });

  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const newPathname =
      debouncedSearch === "" ? window.location.pathname : `?q=${search}`;

    window.history.pushState({}, "", newPathname);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!debouncedSearch) {
      return;
    }
    searchData(debouncedSearch).then((response) => {
      const [err, newData] = response;
      if (err) {
        toast.error(err.message);
        return;
      }

      if (newData) setData(newData);
    });
  }, [debouncedSearch, initialData]);

  return (
    <div>
      <h1>Buscar</h1>
      <form action="">
        <input
          onChange={handleSearch}
          type="search"
          placeholder="Buscar datos"
          defaultValue={search}
        />
      </form>
      <ul>
        {data.map((row) => (
          <li key={row.id}>
            <article>
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>
                  {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};
