
export const useDelete = async (id:number): Promise<number> => {
  const response = await fetch("/todo/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `${id}`
  });
  
  return response.status;
};

export default useDelete;