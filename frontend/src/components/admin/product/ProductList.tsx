import { VscTrash } from "react-icons/vsc";
import { LiaEdit } from "react-icons/lia";
import { FaRegEyeSlash } from "react-icons/fa";
import Image from "../../ui/Image";
import Pagination from "../ui/Pagination";
import FilterDropDownMenu from "../ui/FilterDropDownMenu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Loading from "../../ui/Loading";
import InputSearch from "../ui/InputSearch";
import { Link } from "react-router-dom";
import ListHeader from "../list/ListHeader";
import ListBody from "../list/ListBody";
import useGetProducts from "../../../hooks/admin/product/useGetProducts";
import useDeleteProduct from "../../../hooks/admin/product/useDeleteProduct";
import useUpdateStatusProduct from "../../../hooks/admin/product/useUpdateStatusProduct";
import toast from "react-hot-toast";

function ProductList() {
  const {
    products,
    isLoading,
    totalItems,
    totalPages,
    currentPage,
    limit,
    mutate,
  } = useGetProducts();
  const { deleteProduct, isLoading: isLoadingDelete } = useDeleteProduct();
  const { updateStatusProduct, isLoading: isLoadingUpdate } =
    useUpdateStatusProduct();

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
      await deleteProduct(id);
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
      await updateStatusProduct(id, status);
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      mutate();
    }
  };

  return (
    <>
      <ListHeader
        title="Sản phẩm"
        totalItems={totalItems}
        addLink="/admin/add-product"
      />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="bg-[#E9EDF2] text-left">
              <th className="p-[1rem]  ">Sản phẩm</th>
              <th className="p-[1rem]  ">Giá bán</th>
              <th className="p-[1rem]  ">Số lượng</th>
              <th className="p-[1rem]  ">Danh mục</th>
              <th className="p-[1rem]  ">Thương hiệu</th>
              <th className="p-[1rem]   relative">
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
            ) : products.length > 0 ? (
              products.map((product) => {
                return (
                  <tr key={product.id} className="hover:bg-[#f2f3f8]">
                    <td className="p-[1rem] font-semibold">
                      <div className="flex gap-[10px] items-center">
                        <div className="relative group w-[80px] h-[80px] overflow-hidden">
                          {product.images?.[0]?.image && (
                            <Image
                              source={`${product.images[0].image}`}
                              alt={product.name}
                              className={
                                "w-full h-full object-contain z-1 relative"
                              }
                              loading="lazy"
                            />
                          )}
                        </div>

                        <p>{product.name}</p>
                      </div>
                    </td>

                    <td className="p-[1rem]  ">
                      {product.discount > 0 ? (
                        <div className="flex gap-[12px]  ">
                          <del className="text-[#707072] text-[1rem]">
                            {product.price.toLocaleString("vi-VN")}₫
                          </del>

                          <p className="font-medium text-accent">
                            {(product.price - product.discount).toLocaleString(
                              "vi-VN",
                            )}
                            ₫
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium text-accent">
                          {product.price.toLocaleString("vi-VN")}₫
                        </p>
                      )}
                    </td>

                    <td className="p-[1rem]  ">
                      <div className="flex flex-col gap-1.5">
                        <p>Hiện có: {product.stock}</p>

                        <p>Đã bán: {product.totalSold}</p>
                      </div>
                    </td>

                    <td className="p-[1rem]  ">{product.category.name}</td>
                    <td className="p-[1rem]  ">{product.brand.name}</td>

                    <td className="p-[1rem]  ">
                      {product.status === 1
                        ? "Hiện"
                        : product.status === 0
                          ? "Ẩn"
                          : ""}
                    </td>

                    <td className="p-[1rem]  ">
                      <div className="flex items-center gap-[15px]">
                        <button
                          disabled={isLoadingUpdate}
                          onClick={() =>
                            handleUpdateStatus(
                              product.id || "",
                              product.status === 1 ? 0 : 1,
                            )
                          }
                        >
                          {product.status === 1 ? (
                            <FaRegEyeSlash
                              size={22}
                              className="text-[#74767d]"
                            />
                          ) : (
                            <MdOutlineRemoveRedEye
                              size={22}
                              className="text-[#74767d]"
                            />
                          )}
                        </button>
                        <Link to={`/admin/edit-product/${product.id}`}>
                          <LiaEdit size={22} className="text-[#076ffe]" />
                        </Link>
                        <button
                          disabled={isLoadingDelete}
                          onClick={() => handleDelete(product.id || "")}
                        >
                          <VscTrash size={22} className="text-[#d9534f]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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

export default ProductList;
