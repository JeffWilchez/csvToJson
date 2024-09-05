export const searchData = async (search) => {
    const API_HOST = import.meta.env.VITE_API_HOST;
    try {
      const res = await fetch(`${API_HOST}/api/users?q=${search}`);
  
      if (!res.ok) return [new Error(`Error searching data: ${res.statusText}`)];
  
      const json = await res.json();
      
      return [null, json.data];
    } catch (error) {
      if (error instanceof Error) return [error];
    }
  
    return [new Error("Unknown error")];
  };
  