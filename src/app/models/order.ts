import { food } from "./food";

export interface order {
    order_id: string
    table_NO: string
    cus_Name: string
    foodList: food[]
    status: string
    creationDatetime: Date
}