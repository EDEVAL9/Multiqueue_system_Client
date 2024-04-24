import { useQuery } from "@tanstack/react-query";

export const useSearchInstructor = async (name: string) => {
  return useQuery({
    queryKey: ["search-instructor", name],
    queryFn: searchHander,
  });
};

const searchHander = ({ queryKey }: any) => {};
