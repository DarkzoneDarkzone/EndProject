import { food } from "./food";

export interface order {
    order_id: string
    table_NO: string
    typeOrder: string
    number: number
    priceTotal: number
    foodList: food[]
    status: string
    creationDatetime: Date
    promotion: string

    emp_Name: string
    paytime: Date
    netPrice: number
    valuePromotion: number
}