import InputImage from "../ui/InputImage";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import TextBoxEditor from "../textboxeditor/TextBoxEditor";
import { Link } from "react-router-dom";
import { useInputImage } from "../../../hooks/admin/useInputImage";
import { useSpecification } from "../../../hooks/admin/useSpecification";
import SpecificationEditor from "./SpecificationEditor";
import useAddProduct from "../../../hooks/admin/product/useAddProduct";
import useGetAllCategories from "../../../hooks/admin/category/useGetAllCategories";
import useGetAllBrands from "../../../hooks/admin/brand/useGetAllBrands";
import SearchableSelect from "../ui/SearchableSelect";

function AddProduct() {
  const [data, setData] = useState({
    name: "",
    price: 1,
    discount: 0,
    description: "",
    stock: 1,
    category: "",
    brand: "",
    status: "",
  });

  const { addProduct, isLoading } = useAddProduct();
  const { categories } = useGetAllCategories();
  const { brands } = useGetAllBrands();

  const categoryOptions = categories
    .filter((c) => c.id)
    .map((c) => ({
      value: c.id!,
      label: c.name,
    }));

  const brandOptions = brands
    .filter((b) => b.id)
    .map((b) => ({
      value: b.id!,
      label: b.name,
    }));

  const max = 10;

  const {
    specifications,
    setSpecifications,
    addSpecification,
    removeSpecification,
    updateSpecification,
    clearSpecifications,
  } = useSpecification({
    autoCreateEmpty: true,
  });

  const {
    previewImages,
    handlePreviewImage,
    handleRemovePreviewImage,
    handleReorder,
    getOrderedFiles,
    clearImages,
  } = useInputImage(max);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleDescriptionChange = useCallback((val: string) => {
    setData((prev) => ({ ...prev, description: val }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(data.price) < Number(data.discount)) {
      toast.error("Số tiền giảm không được lớn hơn giá bán");
      return;
    }

    if (Number(data.discount) < 0) {
      toast.error("Số tiền giảm phải lớn hơn hoặc bằng 0");
      return;
    }

    if (Number(data.price) <= 0) {
      toast.error("Giá bán phải lớn hơn 0");
      return;
    }

    if (data.discount > 0) {
      if (Math.floor((data.discount / data.price) * 100) < 1) {
        toast.error("Phần trăm giảm giá phải lớn hơn hoặc bằng 1%");
        return;
      }
    }

    if (Number(data.stock) < 0) {
      toast.error("Số lượng hiện có phải lớn hơn hoặc bằng 0");
      return;
    }

    if (!data.category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (!data.brand) {
      toast.error("Vui lòng chọn thương hiệu");
      return;
    }

    if (!specifications.length) {
      toast.error("Vui lòng thêm ít nhất một thông tin chi tiết");
      return;
    }

    const orderedFiles = getOrderedFiles();

    if (!orderedFiles.length) {
      toast.error("Vui lòng thêm ít nhất một hình sản phẩm");
      return;
    }

    const normalizedSpecifications = specifications.map((s) => ({
      ...s,
      specKey: s.specKey.trim(),
      specValue: s.specValue.trim(),
    }));


      await addProduct(
        {
          name: data.name,
          price: data.price,
          discount: data.discount,
          description: data.description,
          status: Number(data.status),
          stock: data.stock,
          categoryId: data.category,
          brandId: data.brand,
          specifications: normalizedSpecifications,
        },
        orderedFiles,
      );

      clearSpecifications();
      clearImages();
      setData({
        name: "",
        price: 1,
        discount: 0,
        description: "",
        stock: 1,
        category: "",
        brand: "",
        status: "",
      });
  
  };

  return (
    <>
      <div className="py-[30px] sm:px-[25px] px-[15px] bg-[#F1F4F9] h-auto">
        <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit}>
          <h2 className="text-[#74767d]">Thêm sản phẩm</h2>

          <div className="flex gap-[25px] w-full flex-col">
            <div className="md:p-[25px] p-[15px] bg-white rounded-md w-full">
              <InputImage
                InputId="images-product"
                previewImages={previewImages}
                onPreviewImage={handlePreviewImage}
                onRemovePreviewImage={handleRemovePreviewImage}
                onReorderImages={handleReorder}
                blockIndex={0}
              />
            </div>

            <div className="sm:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
              <h5 className="font-bold text-[#74767d]">Thông tin chung</h5>

              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Tên
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={handleChange}
                  name="name"
                  required
                  className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                />
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="" className="text-[0.9rem] font-medium">
                    Danh mục
                  </label>
                  <SearchableSelect
                    options={categoryOptions}
                    value={data.category}
                    onChange={(val) =>
                      setData((prev) => ({
                        ...prev,
                        category: val,
                      }))
                    }
                    placeholder="Chọn danh mục"
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="" className="text-[0.9rem] font-medium">
                    Thương hiệu
                  </label>
                  <SearchableSelect
                    options={brandOptions}
                    value={data.brand}
                    onChange={(val) =>
                      setData((prev) => ({
                        ...prev,
                        brand: val,
                      }))
                    }
                    placeholder="Chọn thương hiệu"
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="" className="text-[0.9rem] font-medium">
                    Tình trạng
                  </label>
                  <select
                    name="status"
                    required
                    onChange={handleChange}
                    value={data.status}
                    className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                  >
                    <option value="">Chọn tình trạng</option>
                    <option value="0">Ẩn</option>
                    <option value="1">Hiện</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-[0.9rem] font-medium">
                  Mô tả
                </label>
                <TextBoxEditor
                  content={data.description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>

            <div className="sm:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
              <h5 className="font-bold text-[#74767d]">Giá cả</h5>

              <div className="flex flex-wrap md:flex-nowrap gap-[15px]">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="" className="text-[0.9rem] font-medium">
                    Giá bán
                  </label>
                  <input
                    type="number"
                    name="price"
                    inputMode="numeric"
                    value={data.price}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="" className="text-[0.9rem] font-medium">
                    Số tiền giảm (Giảm giá{" "}
                    {Math.floor((data.discount / data.price) * 100)}%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    inputMode="numeric"
                    value={data.discount}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="" className="text-[0.9rem] font-medium">
                    Số lượng hiện có
                  </label>
                  <input
                    type="number"
                    name="stock"
                    inputMode="numeric"
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
                  />
                </div>
              </div>
            </div>

            <div className="sm:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
              <h5 className="font-bold text-[#74767d]">Thông tin chi tiết</h5>

              <SpecificationEditor
                specifications={specifications}
                setSpecifications={setSpecifications}
                addSpecification={addSpecification}
                clearSpecifications={clearSpecifications}
                removeSpecification={removeSpecification}
                updateSpecification={updateSpecification}
              />
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <button
              disabled={isLoading}
              type="submit"
              className="p-[6px_10px] bg-teal-500 text-white text-[0.9rem] font-medium text-center hover:bg-teal-600 rounded-sm"
            >
              {isLoading ? "Đang thêm..." : "Thêm"}
            </button>
            <Link
              to="/admin/products"
              className="p-[6px_10px] bg-red-500 text-white text-[0.9rem] text-center hover:bg-red-600 rounded-sm"
            >
              Trở vể
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProduct;
