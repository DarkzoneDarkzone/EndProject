import { food } from "./food";

export interface bill {
    bill_id: string
    priceTotal: number
    table_NO: string
    cus_number: number
    emp_Name: string
    foodList: food[]
    creationDatetime: Date
}