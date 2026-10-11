import { createFileRoute } from "@tanstack/react-router";
import { CreateProduct } from "./products/-create";
export const Route = createFileRoute("/ecommerce/add-product")({ component: CreateProduct });
