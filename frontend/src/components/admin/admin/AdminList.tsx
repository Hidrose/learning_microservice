import { VscTrash } from "react-icons/vsc";
import { LiaEdit } from "react-icons/lia";
import { TbLock, TbLockOpen } from "react-icons/tb";
import Pagination from "../ui/Pagination";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import Image from "../../ui/Image";
import Loading from "../../ui/Loading";
import InputSearch from "../ui/InputSearch";
import { Link } from "react-router-dom";
import ListHeader from "../list/ListHeader";
import ListBody from "../list/ListBody";
import useGetAdmins from "../../../hooks/admin/user/useGetAdmins";
import useDeleteAdmin from "../../../hooks/admin/user/useDeleteAdmin";
import toast from "react-hot-toast";
import useGetAccount from "../../../hooks/auth/useGetAccount";
import useUpdateStatusUser from "../../../hooks/admin/user/useUpdateStatusUser";

function AdminList() {
  const array = [
    { name: "Tất cả", value: null },
    { name: "Bình thường", value: 1 },
    { name: "Bị khóa", value: 0 },
  ];

  const { account } = useGetAccount("admin");
  const {
    admins,
    isLoading,
    totalItems,
    totalPages,
    limit,
    currentPage,
    mutate,
  } = useGetAdmins();
  const { deleteAdmin, isLoading: isLoadingDelete } = useDeleteAdmin();
  const { updateStatusUser, isLoading: isLoadingUpdate } =
    useUpdateStatusUser();

  const handleDelete = async (id: string) => {
    if (!id) {
      return;
    }

    if (id === account?.id) {
      toast.error("Bạn không thể xóa chính tài khoản của mình");
      return;
    }

    try {
      await deleteAdmin(id);
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      mutate();
    }
  };

  const handleUpdateStatus = async (id: string, status: number) => {
    if (!id && !status) {
      return;
    }

    if (Number(status) === 0 && id === account?.id) {
      toast.error("Bạn không thể khóa chính tài khoản của mình");
      return;
    }

    try {
      await updateStatusUser(id, status);
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      mutate();
    }
  };

  console.log(admins);

  return (
    <>
      <ListHeader
        title="Quản trị viên"
        totalItems={totalItems}
        addLink="/admin/add-admin"
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="bg-[#E9EDF2] text-left">
              <th className="p-[1rem]">Họ tên</th>

              <th className="p-[1rem]">Email</th>

              <th className="p-[1rem]  ">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={array}
                  paramName="status"
                />
              </th>
              <th className="p-[1rem]  ">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="w-full">
                  <Loading height={60} size={50} color="black" thickness={2} />
                </td>
              </tr>
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem] text-[0.9rem] font-semibold">
                    {admin.fullname}
                  </td>
                  <td className="p-[1rem]  ">{admin.email}</td>

                  <td className="p-[1rem]  ">
                    {admin.status === 1 ? "Bình thường" : "Bị khóa"}
                  </td>
                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      <button
                        disabled={isLoadingUpdate}
                        onClick={() =>
                          handleUpdateStatus(
                            admin.id || "",
                            admin.status === 1 ? 0 : 1,
                          )
                        }
                      >
                        {admin.status === 1 ? (
                          <TbLock size={22} className="text-[#74767d]" />
                        ) : (
                          <TbLockOpen size={22} className="text-[#74767d]" />
                        )}
                      </button>

                      <Link to={`/admin/edit-admin/${admin.id}`}>
                        <LiaEdit size={22} className="text-[#076ffe]" />
                      </Link>

                      <button
                        disabled={isLoadingDelete}
                        onClick={() => handleDelete(admin.id || "")}
                      >
                        <VscTrash size={22} className="text-[#d9534f]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="w-full h-[70vh]">
                  <div className="flex justify-center items-center">
                    <Image
                      source={"/assets/notfound1.png"}
                      alt={""}
                      className={"w-[135px]"}
                      loading="lazy"
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ListBody>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        limit={limit}
        totalItems={totalItems}
      />
    </>
  );
}

export default AdminList;
