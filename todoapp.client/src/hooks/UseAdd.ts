import type INewTodo from "../assets/models/INewTodo";

export const useAdd = async (item: INewTodo): Promise<number> => {
  const response = await fetch("/todo/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return response.status;
};

export default useAdd;