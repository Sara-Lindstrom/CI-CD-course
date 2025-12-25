import type ITodo from "../assets/models/ITodo";

export const useUpdate = async (item: ITodo): Promise<number> => {
  const response = await fetch("/todo/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return response.status;
};

export default useUpdate;