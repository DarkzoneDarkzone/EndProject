import { food } from "./food"

export interface cartOrder {
    cart_id: string
    table_NO: string
    foodList: food[]
}
