import { useQueryClient,  useMutation } from "@tanstack/react-query"
import { logout } from "../lib/api"

const useLogOut = () => {
    const queryClient = useQueryClient();
    const {mutate , error} = useMutation({
        mutationFn:logout,
        onSuccess: ()=>queryClient.invalidateQueries({queryKey: ["authUser"]})
    })

    return {logoutMutation: mutate , error}
}

export default useLogOut;