import axios from "axios";
import useSWR from "swr";
import type { Province } from "../../types/type";

type ResponseType = {
  data: Province[];
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetProvinces() {
  const url = `https://vietnamlabs.com/api/vietnamprovince`;
  const { data, error, isLoading, mutate } = useSWR<ResponseType>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    provinces: data?.data,
    error,
    isLoading,
    mutate,
  };
}
