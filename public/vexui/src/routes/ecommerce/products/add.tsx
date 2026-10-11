import { createFileRoute } from "@tanstack/react-router";
import { CreateProduct } from "./-create";
export const Route = createFileRoute("/ecommerce/products/add")({ component: CreateProduct });
