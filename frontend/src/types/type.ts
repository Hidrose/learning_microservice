// Request
export interface OrderRequest {
  fullname: string;
  phone: string;
  speaddress: string;
  city: string;
  ward: string;
  paymethod: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface UserRequest {
  email?: string;
  fullname: string;
  phone: string;
  birthDate?: string;
  gender?: number | null;
  password?: string;
  role?: "customer" | "admin";
  status?: number;
  googleId?: string;
}

export interface BrandRequest {
  name: string;
  status: number;
}

export interface CategoryRequest {
  name: string;
  image: File;
  status: number;
}

export interface SpecificationRequest {
  id?: string;
  specKey: string;
  specValue: string;
  displayOrder: number;
}

export interface ProductRequest {
  name: string;
  price: number;
  discount: number;
  description: string;
  status: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images: File[];
  specifications: SpecificationRequest[];
}

export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface MessageRequest {
  chatId: string;
  content: string;
}

// Response
export interface UserResponse {
  id?: string;
  email: string;
  fullname: string;
  phone?: string;
  birthDate?: string;
  gender?: number | null;
  role: "customer" | "admin";
  status: number;
}

export interface BrandResponse {
  id?: string;
  name: string;
  slug: string;
  status: number;
}

export interface CategoryResponse {
  id?: string;
  name: string;
  slug: string;
  image?: string;
  status: number;
}

export interface ImageProductResponse {
  id: string;
  image: string;
}

export interface SpecificationResponse {
  id: string;
  specKey: string;
  specValue: string;
  displayOrder: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  finalPrice: number;
  description: string;
  status: number;
  stock: number;
  totalSold: number;
  category: CategoryResponse;
  brand: BrandResponse;
  images: ImageProductResponse[];
  specifications: SpecificationResponse[];
}

export interface CartItemResponse {
  id: string;
  productId: string;
  name: string;
  images: string[];
  price: number;
  discount: number;
  slug: string;
  quantity: number;
  stock: number;
  status: number;
}

export interface CartResponse {
  id?: string;
  userId?: string;
  items: CartItemResponse[];
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  name: string;
  images: string[];
  quantity: number;
  price: number;
  discount: number;
}

export interface OrderResponse {
  id: string;
  orderCode: string;
  userId: string;
  email: string;
  fullname: string;
  phone: string;
  speaddress: string;
  city: string;
  ward: string;
  paymethod: string;
  status: number;
  total: number;
  items: OrderItemResponse[];
  createdAt: string;
}

export interface PaymentResponse {
  id?: string;
  orderId: string;
  orderCode: string;
  paymethod: string;
  amount: number;
  transactionId?: string;
  status: number; // 1 success, 0 refund
  createdAt: string;
}

export interface ChatResponse {
  id: string;
  userId: string;
  sessionData: Record<string, any>;
  messages: MessageResponse[];
  createdAt: string;
}

export interface MessageResponse {
  id: string;
  chatId: string;
  isBot: boolean;
  content: string;
  products: string[];
  extraData: Record<string, any>;
  createdAt: string;
}

export type Ward = {
  name: string;
  mergedFrom: string[];
};

export type Province = {
  id: string;
  province: string;
  wards: Ward[];
};
