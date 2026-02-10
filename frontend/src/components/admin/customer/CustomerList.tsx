import { TbLock, TbLockOpen } from "react-icons/tb";
import Pagination from "../Pagination";
import FilterDropDownMenu from "../FilterDropDownMenu";
import Image from "../../Image";
import Loading from "../../Loading";
import InputSearch from "../InputSearch";
import ListHeader from "../list/ListHeader";
import ListBody from "../list/ListBody";
import useGetCustomers from "../../../hooks/admin/user/useGetCustomers";
import toast from "react-hot-toast";
import useUpdateStatusUser from "../../../hooks/admin/user/useUpdateStatusUser";

function CustomerList() {
  const {
    customers,
    isLoading,
    totalItems,
    totalPages,
    currentPage,
    limit,
    mutate,
  } = useGetCustomers();
  const { updateStatusUser, isLoading: isLoadingUpdate } =
    useUpdateStatusUser();

  const array = [
    { name: "Tất cả", value: null },
    { name: "Bình thường", value: 1 },
    { name: "Bị khóa", value: 0 },
  ];

  const handleUpdateStatus = async (id: string, status: number) => {
    if (!id && !status) {
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

  return (
    <>
      <ListHeader title="Khách hàng" totalItems={totalItems} />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] bcustomer.address-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="bg-[#E9EDF2] text-left">
              <th className="p-[1rem]">Họ tên</th>
              <th className="p-[1rem]">Email</th>
              <th className="p-[1rem]">Số điện thoại</th>
              <th className="p-[1rem]">Sinh nhật</th>
              <th className="p-[1rem]">Giới tính</th>

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
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem] text-[0.9rem] font-semibold">
                    {customer?.fullname}
                  </td>
                  <td className="p-[1rem]">{customer?.email}</td>
                  <td className="p-[1rem]">{customer?.phone}</td>
                  <td className="p-[1rem]">
                    {customer.birthDate &&
                      new Date(customer.birthDate).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                  </td>
                  <td className="p-[1rem]">
                    {customer.gender === 1
                      ? "Nam"
                      : customer.gender === 0
                        ? "Nữ"
                        : ""}
                  </td>

                  <td className="p-[1rem]  ">
                    {customer.status === 1 ? "Bình thường" : "Bị khóa"}
                  </td>

                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      <button
                        disabled={isLoadingUpdate}
                        onClick={() =>
                          handleUpdateStatus(
                            customer.id || "",
                            customer.status === 1 ? 0 : 1,
                          )
                        }
                      >
                        {customer.status === 1 ? (
                          <TbLock size={22} className="text-[#74767d]" />
                        ) : (
                          <TbLockOpen size={22} className="text-[#74767d]" />
                        )}
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

export default CustomerList;
