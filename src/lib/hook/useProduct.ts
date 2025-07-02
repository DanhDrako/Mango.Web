import { useFetchFiltersQuery } from "../../features/catalog/catalogApi"

export const useProduct= ()=>{
	const {data} = useFetchFiltersQuery();

	if(!data || !data.isSuccess || !data.result) {
		return {
			filters: null,
		}
	}

	const { result } = data;

	return {
		filters: result,
	}
}