import { VscTrash } from "react-icons/vsc";
import { LiaEdit } from "react-icons/lia";
import Pagination from "../Pagination";
import Image from "../../Image";
import Loading from "../../Loading";
import InputSearch from "../InputSearch";
import { Link } from "react-router-dom";
import FilterDropDownMenu from "../FilterDropDownMenu";
import { FaRegEyeSlash } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ListBody from "../list/ListBody";
import ListHeader from "../list/ListHeader";
import useGetCategories from "../../../hooks/admin/category/useGetCategories";
import useDeleteCategory from "../../../hooks/admin/category/useDeleteCategory";
import useUpdateStatusCategory from "../../../hooks/admin/category/useUpdateStatusCategory";
import toast from "react-hot-toast";
function CategoryList() {
  const {
    categories,
    isLoading,
    totalItems,
    totalPages,
    currentPage,
    limit,
    mutate,
  } = useGetCategories();
  const { deleteCategory, isLoading: isLoadingDelete } = useDeleteCategory();
  const { updateStatusCategory, isLoading: isLoadingUpdate } =
    useUpdateStatusCategory();

  const array = [
    {
      name: "Tất cả",
      value: null,
    },
    {
      name: "Hiện",
      value: 1,
    },
    {
      name: "Ẩn",
      value: 0,
    },
  ];

  const handleDelete = async (id: string) => {
    if (!id) {
      return;
    }

    try {
      await deleteCategory(id);
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

    try {
      await updateStatusCategory(id, status);
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      mutate();
    }
  };
  return (
    <>
      <ListHeader
        title="Danh mục"
        totalItems={totalItems}
        addLink="/admin/add-category"
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="bg-[#E9EDF2] text-left">
              <th className="p-[1rem]">Hình ảnh</th>
              <th className="p-[1rem]">Tên</th>
              <th className="p-[1rem] relative">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={array}
                  paramName="status"
                />
              </th>
              <th className="p-[1rem]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="w-full">
                  <Loading height={60} size={50} color="black" thickness={2} />
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem]">
                    <div className="relative group w-[80px] h-[80px] overflow-hidden">
                      <Image
                        source={`${category.image}`}
                        alt={category.name}
                        className={"w-full h-full object-contain z-1 relative"}
                        loading="lazy"
                      />
                    </div>
                  </td>
                  <td className="p-[1rem] font-semibold">{category.name}</td>

                  <td className="p-[1rem]  ">
                    {category.status === 1
                      ? "Hiện"
                      : category.status === 0
                        ? "Ẩn"
                        : ""}
                  </td>

                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      <button
                        disabled={isLoadingUpdate}
                        onClick={() =>
                          handleUpdateStatus(
                            category.id || "",
                            category.status === 1 ? 0 : 1,
                          )
                        }
                      >
                        {category.status === 1 ? (
                          <FaRegEyeSlash size={22} className="text-[#74767d]" />
                        ) : (
                          <MdOutlineRemoveRedEye
                            size={22}
                            className="text-[#74767d]"
                          />
                        )}
                      </button>

                      <Link to={`/admin/edit-category/${category.id}`}>
                        <LiaEdit size={22} className="text-[#076ffe]" />
                      </Link>

                      <button
                        disabled={isLoadingDelete}
                        onClick={() => handleDelete(category.id || "")}
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

export default CategoryList;
